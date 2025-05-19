import WebSocket from "ws";
import { randomUUID } from "node:crypto";
import { stringifyWebSocketResponse } from "../utils";

import {
  DataAddUser,
  DataStateRoom,
  MessageApp,
  UserEntry
} from "../types/types";
import { rooms, sockets, users } from "../env";
import { isDefined } from "../guards";

export const handleCreateRoom = (ws: WebSocket): void => {
  const findedWS = sockets.find((s) => s.ws === ws);
  const findedUser = users.find((u) => u.idUser === findedWS?.idUser);

  if (!isDefined<UserEntry>(findedUser)) return;

  rooms.push({
    id: randomUUID(),
    players: [{ name: findedUser.player.name, index: findedUser.idUser }]
  });
  updateRooms(ws);
};

export const updateRooms = (ws: WebSocket): void => {
  const freeRooms = rooms.filter((r) => r.players.length === 1);
  const responseRooms: MessageApp<"update_room", DataStateRoom> = {
    type: "update_room",
    data: freeRooms.map((room) => ({
      roomId: room.id,
      roomUsers: room.players
    })),
    id: 0
  };
  ws.send(stringifyWebSocketResponse(responseRooms), { binary: false });
};

export const handleAddUser = (
  ws: WebSocket,
  res: MessageApp<"add_user_to_room", DataAddUser>
): string | number | null => {
  const findedWS = sockets.find((s) => s.ws === ws);
  const findedUser = users.find((u) => u.idUser === findedWS?.idUser);

  if (!isDefined<UserEntry>(findedUser)) return null;
  rooms
    .find((room) => room.id === res.data.indexRoom)
    ?.players.push({ name: findedUser.player.name, index: findedUser.idUser });
  return res.data.indexRoom;
};
