import WebSocket from "ws";

import { randomUUID } from "node:crypto";
import { stringifyWebSocketResponse } from "../utils";
import { games, rooms, sockets } from "../env";
import { DataCreateGame } from "../types/session.types";
import { DataAddShips, DataStartGame, Game, MessageApp } from "../types/types";
import { isDefined } from "../guards";

export const createGame = (idRoom: string | number | null): void => {
  if (!idRoom) return;
  const [player1, player2] =
    rooms.find((room) => room.id === idRoom)?.players ?? [];
  const idGame = randomUUID();

  games.push({
    id: idGame,
    player1: {
      data: null,
      id: player1.index
    },
    player2: {
      data: null,
      id: player2.index
    }
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
  if (findedGame.player1.id === res.data.indexPlayer)
    findedGame.player1.data = res.data.ships;

  if (findedGame.player2.id === res.data.indexPlayer)
    findedGame.player2.data = res.data.ships;
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
    console.log("Added ships.");
  }
};
