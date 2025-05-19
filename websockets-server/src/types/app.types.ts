import WebSocket from "ws";
import type { DataRegister } from "./session.types";

export type MessageApp<T, K> = {
  type: T;
  data: K;
  id: number;
};

export type Room = {
  id: number | string;
  players: {
    name: string;
    index: number | string;
  }[];
};

export type Rooms = Room[];

export type UserEntry = {
  idUser: string;
  player: DataRegister;
  wins: number;
};

export type Users = UserEntry[];

export type SocketConnection = {
  idUser: string;
  ws: WebSocket;
};

export type SocketConnections = SocketConnection[];
