import WebSocket from "ws";
import type { DataRegister } from "./session.types";

export type MessageApp<T, K> = {
  type: T;
  data: K;
  id: number;
};

export type UserEntry = {
  idUser: string;
  user: DataRegister;
};

export type Users = UserEntry[];

export type SocketConnection = {
  idUser: string;
  ws: WebSocket;
};

export type SocketConnections = SocketConnection[];
