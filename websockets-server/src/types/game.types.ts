import { NUMBER_BOARD } from "../controllers/utils";

export type CommonActionGame = "attack";

export type RequestActionGame = CommonActionGame | "randomAttack" | "add_ships";

export type ResponseActionGame =
  | CommonActionGame
  | "turn"
  | "finish"
  | "start_game";

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
};

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

export interface RowBoard extends Array<0 | 1 | 2> {
  length: typeof NUMBER_BOARD;
}

export interface Board extends Array<RowBoard> {
  length: typeof NUMBER_BOARD;
}
