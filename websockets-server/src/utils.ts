import type { RawData } from "ws";
import type {
  DataRequestActionGame,
  DataRequestSession,
  DataResponseActionGame,
  DataResponsesSession,
  MessageApp,
  RequestActionGame,
  RequestSession,
  ResponseActionGame,
  ResponseSession
} from "./types/types";

export const parseWebSocketRequest = (
  raw: RawData
): MessageApp<
  RequestSession | RequestActionGame,
  DataRequestSession | DataRequestActionGame
> => {
  const request = JSON.parse(raw.toString("utf8"));
  if (request.data) request.data = JSON.parse(request.data);
  return request;
};

export const stringifyWebSocketResponse = (
  res: MessageApp<
    ResponseSession | ResponseActionGame,
    DataResponseActionGame | DataResponsesSession
  >
): string => {
  interface UpdateMessageApp
    extends Omit<MessageApp<unknown, unknown>, "data"> {
    data: string;
  }
  const updateResponse: UpdateMessageApp = {
    ...res,
    data: JSON.stringify(res.data)
  };
  return JSON.stringify(updateResponse);
};
