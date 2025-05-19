import { WebSocketServer } from "ws";
import { parseWebSocketRequest } from "./utils";
import "./env";

import { handleRegister } from "./controllers/user";
import { isAddUserType, isCreateRoomType, isRegisterType } from "./guards";

import {
  DataRequestActionGame,
  DataRequestSession,
  MessageApp,
  RequestActionGame,
  RequestSession
} from "./types/types";
import {
  handleAddUser,
  handleCreateRoom,
  updateRooms
} from "./controllers/room";
import { createGame } from "./controllers/game";

const PORT: number = parseInt(process.env.PORT!) || 3000;
const wss: WebSocketServer = new WebSocketServer({ port: PORT });

wss.on("listening", () =>
  console.log(`Start websocket server on the port: ${PORT}`)
);

wss.on("connection", (ws, req) => {
  ws.on("error", console.error);
  ws.on("message", (data) => {
    const res: MessageApp<
      RequestSession | RequestActionGame,
      DataRequestSession | DataRequestActionGame
    > = parseWebSocketRequest(data);

    if (isRegisterType(res)) handleRegister(ws, res);

    if (isCreateRoomType(res)) {
      handleCreateRoom(ws);
      wss.clients.forEach((client) => updateRooms(client));
    }

    if (isAddUserType(res)) {
      const idRoom = handleAddUser(ws, res);
      wss.clients.forEach((client) => updateRooms(client));
      createGame(idRoom);
    }
  });
  console.log(`Someone connected with ip: ${req.socket.remoteAddress}`);
});
