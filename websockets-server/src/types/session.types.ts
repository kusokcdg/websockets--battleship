export type CommonSession = "reg";

export type RequestSession = CommonSession | "create_room" | "add_user_to_room";

export type ResponseSession =
  | CommonSession
  | "update_winners"
  | "create_game"
  | "update_room";

export type DataRequestSession = DataRegister | DataAddUser | string;

export type DataResponsesSession =
  | DataResponseRegister
  | DataWinners
  | DataCreateGame
  | DataStateRoom;

export type DataRegister = {
  name: string;
  password: string;
};

export type DataResponseRegister = {
  name: string;
  index: number | string;
  error: boolean;
  errorText: string;
};

export type Winner = {
  name: string;
  wins: number;
};

export type DataWinners = Winner[];

export type DataAddUser = {
  indexRoom: number | string;
};

export type DataCreateGame = {
  idGame: number | string;
  idPlayer: number | string;
};

export type DataStateRoom = {
  roomId: number | string;
  roomUsers: {
    name: string;
    index: number | string;
  }[];
}[];
