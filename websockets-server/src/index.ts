import { WebSocketServer } from "ws";
import { parseWebSocketRequest } from "./utils";
import "./env";

import { handleRegister } from "./controllers/user";
import {
  isAddShips,
  isAddUserType,
  isAttack,
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
import { createGame, handleAddShips, handleAttack } from "./controllers/game";
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
    // console.log("Users");
    // console.table(users.map((obj) => obj.idUser));
    // console.table(users.map((obj) => obj.player.name));
    // console.log("rooms");
    // console.table(rooms.map((obj) => obj.players.map((p) => p.name)));
    // console.log("games");
    // console.table(
    //   games.map((g) => ({
    //     game_id: typeof g.id === "string" && g.id.slice(-5),
    //     p1: users.find((u) => u.idUser === g.player1.id)?.player.name,
    //     p2: users.find((u) => u.idUser === g.player2.id)?.player.name
    //   }))
    // );
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
    if (isAttack(res)) handleAttack(res);
  });
  console.log(`Someone connected with ip: ${req.socket.remoteAddress}`);
});
