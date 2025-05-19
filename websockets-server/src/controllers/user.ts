import WebSocket from "ws";
import { randomUUID } from "node:crypto";
import { stringifyWebSocketResponse } from "../utils";

import { sockets, users } from "../env";
import { Winner, MessageApp, UserEntry } from "../types/types";

import type {
  DataRegister,
  DataResponseRegister,
  DataWinners
} from "../types/session.types";

export const handleRegister = (
  ws: WebSocket,
  res: MessageApp<"reg", DataRegister>
): void => {
  const resultRegister: DataResponseRegister = registerUser(ws, res.data);
  const responseRegister: MessageApp<"reg", DataResponseRegister> = {
    type: "reg",
    data: resultRegister,
    id: 0
  };
  ws.send(stringifyWebSocketResponse(responseRegister), { binary: false });

  if (resultRegister.error) return;

  const winners: Winner[] = users
    .filter((user) => user.wins >= 0)
    .map(({ player, wins }) => ({
      name: player.name,
      wins
    }));
  const responseWinners: MessageApp<"update_winners", DataWinners> = {
    type: "update_winners",
    data: winners,
    id: 0
  };
  ws.send(stringifyWebSocketResponse(responseWinners), { binary: false });
};

export const registerUser = (
  ws: WebSocket,
  data: DataRegister
): DataResponseRegister => {
  const existedUser: UserEntry | undefined = users.find(
    (user) =>
      user.player.name === data.name && user.player.password === data.password
  );

  if (existedUser) {
    console.log("false");
    return {
      name: data.name,
      index: "",
      error: true,
      errorText: "User already exist"
    };
  }

  const idUser = randomUUID();
  sockets.push({ idUser, ws });
  users.push({
    idUser,
    player: { name: data.name, password: data.password },
    wins: 0
  });
  return {
    name: data.name,
    index: idUser,
    error: false,
    errorText: ""
  };
};
