import type {
  DataAddUser,
  DataRegister,
  DataRequestActionGame,
  DataRequestSession,
  MessageApp,
  RequestActionGame,
  RequestSession
} from "./types/types";

export const isRegisterType = (
  msg: MessageApp<
    RequestSession | RequestActionGame,
    DataRequestSession | DataRequestActionGame
  >
): msg is MessageApp<"reg", DataRegister> => msg.type === "reg";

export const isCreateRoomType = (
  msg: MessageApp<
    RequestSession | RequestActionGame,
    DataRequestSession | DataRequestActionGame
  >
): msg is MessageApp<"create_room", string> => msg.type === "create_room";

export const isDefined = <T>(value: T | undefined): value is T => {
  return value !== undefined;
};

export const isAddUserType = (
  msg: MessageApp<
    RequestSession | RequestActionGame,
    DataRequestSession | DataRequestActionGame
  >
): msg is MessageApp<"add_user_to_room", DataAddUser> =>
  msg.type === "add_user_to_room";
