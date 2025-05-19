import { randomUUID } from "node:crypto";
import { stringifyWebSocketResponse } from "../utils";
import { rooms, sockets } from "../env";
import { DataCreateGame } from "../types/session.types";
import { MessageApp } from "../types/types";

export const createGame = (idRoom: string | number | null): void => {
  if (!idRoom) return;
  const [player1, player2] =
    rooms.find((room) => room.id === idRoom)?.players ?? [];
  const idGame = randomUUID();

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
};
