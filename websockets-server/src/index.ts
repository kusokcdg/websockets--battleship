import { WebSocketServer } from "ws";
import { parseWebSocketRequest, stringifyWebSocketResponse } from "./utils";
import { randomUUID } from "node:crypto";

const PORT: number = parseInt(process.env.PORT!) || 3000;

const ex: MessageApp<ResponseSession, DataResponsesSession> = {
  type: "reg",
  data: {
    name: "test-name",
    index: randomUUID(),
    error: false,
    errorText: ""
  },
  id: 0
};
const winners: MessageApp<ResponseSession, DataWinners> = {
  type: "update_winners",
  data: [
    {
      name: "string",
      wins: 4
    }
  ],
  id: 0
};

const wss: WebSocketServer = new WebSocketServer({ port: PORT });

wss.on("listening", () =>
  console.log(`Start websocket server on the port: ${PORT}`)
);

wss.on("connection", (ws, req) => {
  ws.on("error", console.error);
  ws.on("message", (data) => {
    const res = parseWebSocketRequest(data);
    console.dir(res);
    ws.send(stringifyWebSocketResponse(ex), { binary: false });
    ws.send(stringifyWebSocketResponse(winners), { binary: false });
  });
  console.log(`Someone connected with ip: ${req.socket.remoteAddress}`);
});
