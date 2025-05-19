export type CommonActionGame = "attack";

export type RequestActionGame =
  | CommonActionGame
  | "randomAttack"
  | "add_ships"
  | "start_game";

export type ResponseActionGame = CommonActionGame | "turn" | "finish";

export type DataRequestActionGame = DataAddShips | DataAttack;

export type DataResponseActionGame =
  | DataStartGame
  | DataResponseAttack
  | DataTurn
  | DataFinish;

export type PositionShip = {
  x: number;
  y: number;
};

export type DataAddShips = {
  gameId: number | string;
  ships: Ship[];
  indexPlayer: number | string;
}[];

export type DataStartGame = {
  ships: Ship[];
  currentPlayerIndex: number | string;
};

export type Ship = {
  position: PositionShip;
  direction: boolean;
  length: number;
  type: "small" | "medium" | "large" | "huge";
};

export type DataAttack = {
  gameId: number | string;
  indexPlayer: number | string;
} & (PositionShip | null);

export type DataResponseAttack = {
  position: PositionShip;
  currentPlayer: number | string;
  status: "miss" | "killed" | "shot";
};

export type DataTurn = {
  currentPlayer: number | string;
};

export type DataFinish = {
  winPlayer: number | string;
};
