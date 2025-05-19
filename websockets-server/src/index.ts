import { WebSocketServer } from "ws";
import { parseWebSocketRequest } from "./utils";
import "./env";

import { handleRegister } from "./controllers/user";
import { isRegisterType } from "./guards";

import {
  DataRequestActionGame,
  DataRequestSession,
  MessageApp,
  RequestActionGame,
  RequestSession
} from "./types/types";

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

    if (isRegisterType(res)) {
      handleRegister(ws, res);
    }
  });
  console.log(`Someone connected with ip: ${req.socket.remoteAddress}`);
});
