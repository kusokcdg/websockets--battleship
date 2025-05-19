import {
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
