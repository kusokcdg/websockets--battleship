type CommonSession = "reg";

type RequestSession = CommonSession | "create_room" | "add_user_to_room";

type ResponseSession =
  | CommonSession
  | "update_winners"
  | "create_game"
  | "update_room";

type DataRequestSession = DataRegister | DataAddUser | string;

type DataResponsesSession =
  | DataResponseRegister
  | DataWinners
  | DataCreateGame
  | DataStateRoom;

type DataRegister = {
  name: string;
  password: string;
};

type DataResponseRegister = {
  name: string;
  index: number | string;
  error: boolean;
  errorText: string;
};

type DataWinners = {
  name: string;
  wins: number;
}[];

type DataAddUser = {
  indexRoom: number | string;
};

type DataCreateGame = {
  idGame: number | string;
  idPlayer: number | string;
};

type DataStateRoom = {
  roomId: number | string;
  roomUsers: {
    name: string;
    index: number | string;
  }[];
}[];
