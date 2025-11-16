import WebSocket from "ws";

import { randomUUID } from "node:crypto";
import { stringifyWebSocketResponse } from "../utils";
import { games, rooms, sockets } from "../env";
import { DataCreateGame } from "../types/session.types";
import {
  Board,
  DataAddShips,
  DataAttack,
  DataResponseAttack,
  DataStartGame,
  DataTurn,
  MessageApp,
  PositionShip
} from "../types/types";
import { createBoard, fillBoard, getRandomPosition } from "./utils";

export const createGame = (idRoom: string | number | null): void => {
  if (!idRoom) return;
  const [player1, player2] =
    rooms.find((room) => room.id === idRoom)?.players ?? [];
  const idGame = randomUUID();

  games.push({
    id: idGame,
    player1: {
      data: null,
      id: player1.index,
      board: createBoard(),
      boardOpponent: createBoard()
    },
    player2: {
      data: null,
      id: player2.index,
      board: createBoard(),
      boardOpponent: createBoard()
    },
    currentPlayer: null
  });

  const socket1 = sockets.find((s) => s.idUser === player1.index);
  const resCreateGame1: MessageApp<"create_game", DataCreateGame> = {
    type: "create_game",
    data: { idGame: idGame, idPlayer: player1.index },
    id: 0
  };
  socket1?.ws.send(stringifyWebSocketResponse(resCreateGame1), {
    binary: false
  });

  const socket2 = sockets.find((s) => s.idUser === player2.index);
  const resCreateGame2: MessageApp<"create_game", DataCreateGame> = {
    type: "create_game",
    data: { idGame: idGame, idPlayer: player2.index },
    id: 0
  };
  socket2?.ws.send(stringifyWebSocketResponse(resCreateGame2), {
    binary: false
  });
  console.log("Create game.");
};

export const handleAddShips = (
  res: MessageApp<"add_ships", DataAddShips>
): void => {
  const findedGame = games.find((game) => game.id === res.data.gameId);
  if (!findedGame) return;
  if (findedGame.player1.id === res.data.indexPlayer) {
    findedGame.player1.data = res.data.ships;
    res.data.ships.forEach((ship) => {
      fillBoard(ship, findedGame.player1.board);
    });
  }
  if (findedGame.player2.id === res.data.indexPlayer) {
    findedGame.player2.data = res.data.ships;
    res.data.ships.forEach((ship) => {
      fillBoard(ship, findedGame.player2.board);
    });
  }
  console.log("Added ships.");
  if (findedGame.player1.data && findedGame.player2.data) {
    const socket1 = sockets.find((s) => s.idUser === findedGame.player1.id);
    const resStartGame1: MessageApp<"start_game", DataStartGame> = {
      type: "start_game",
      data: {
        ships: findedGame.player1.data,
        currentPlayerIndex: findedGame.player1.id
      },
      id: 0
    };
    socket1?.ws.send(stringifyWebSocketResponse(resStartGame1));

    const socket2 = sockets.find((s) => s.idUser === findedGame.player2.id);
    const resStartGame2: MessageApp<"start_game", DataStartGame> = {
      type: "start_game",
      data: {
        ships: findedGame.player2.data,
        currentPlayerIndex: findedGame.player2.id
      },
      id: 0
    };
    socket2?.ws.send(stringifyWebSocketResponse(resStartGame2));

    const defineFirstTurn =
      Math.floor(Math.random() * 2) === 0
        ? findedGame.player1.id
        : findedGame.player2.id;
    findedGame.currentPlayer = defineFirstTurn;
    socket1?.ws.send(
      stringifyWebSocketResponse(createTurn(findedGame.currentPlayer))
    );
    socket2?.ws.send(
      stringifyWebSocketResponse(createTurn(findedGame.currentPlayer))
    );
  }
};

export const handleAttack = (
  res: MessageApp<
    "attack" | "randomAttack",
    DataAttack | Omit<DataAttack, "PositionShip">
  >
): void => {
  const game = games.find((g) => g.id === res.data.gameId);
  if (!game) return;
  if (game.currentPlayer !== res.data.indexPlayer) return;
  let opponent;
  let curPlayer;
  if (game?.player1.id === res.data.indexPlayer) {
    opponent = game?.player2;
    curPlayer = game?.player1;
  } else {
    opponent = game?.player1;
    curPlayer = game?.player2;
  }

  let postion: PositionShip | null;
  if (res.type === "randomAttack") getRandomPosition(curPlayer.boardOpponent);
  switch (res.type) {
    case "attack":
      postion = {
        x: res.data.y,
        y: res.data.x
      };
      break;
    case "randomAttack":
      postion = getRandomPosition(curPlayer.boardOpponent);
      break;
  }
  const shipsBoardOpponent: Board = opponent.board;
  let hit: DataResponseAttack["status"] = "miss";
  if (shipsBoardOpponent[postion.x][postion.y] === 1) {
    hit = "shot";
  }

  const socket1 = sockets.find((s) => s.idUser === opponent.id);
  const socket2 = sockets.find((s) => s.idUser === curPlayer.id);
  if (!game.currentPlayer) return;
  const responsePosition = { x: postion.y, y: postion.x };
  const responseAttack = createResonseAttack({
    position: responsePosition,
    currentPlayer: game.currentPlayer,
    status: hit
  });
  socket1?.ws.send(stringifyWebSocketResponse(responseAttack));
  socket2?.ws.send(stringifyWebSocketResponse(responseAttack));
  game.currentPlayer = opponent.id;

  const responseTurn = createTurn(game.currentPlayer);
  socket1?.ws.send(stringifyWebSocketResponse(responseTurn));
  socket2?.ws.send(stringifyWebSocketResponse(responseTurn));
};

const createTurn = (
  idPlayer: DataTurn["currentPlayer"]
): MessageApp<"turn", DataTurn> => ({
  type: "turn",
  data: { currentPlayer: idPlayer },
  id: 0
});

const createResonseAttack = (
  obj: DataResponseAttack
): MessageApp<"attack", DataResponseAttack> => ({
  type: "attack",
  data: obj,
  id: 0
});
