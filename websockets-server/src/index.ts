import { WebSocketServer } from "ws";
import { parseWebSocketRequest } from "./utils";
import "./env";

import { handleRegister } from "./controllers/user";
import {
  isAddShips,
  isAddUserType,
  isCreateRoomType,
  isRegisterType
} from "./guards";

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
import { createGame, handleAddShips } from "./controllers/game";
import { sockets } from "./env";

const PORT: number = parseInt(process.env.PORT!) || 3000;
const wss: WebSocketServer = new WebSocketServer({ port: PORT });

wss.on("listening", () =>
  console.log(`Start websocket server on the port: ${PORT}`)
);

wss.on("connection", (ws, req) => {
  ws.on("error", console.error);

  ws.on("close", () => {
    console.log("Client disconnected");
    const index = sockets.findIndex((s) => s.ws === ws);
    if (index !== -1) sockets.splice(index, 1);
  });

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

    if (isAddShips(res)) handleAddShips(res);
  });
  console.log(`Someone connected with ip: ${req.socket.remoteAddress}`);
});
