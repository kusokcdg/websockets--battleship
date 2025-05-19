type CommonActionGame = "attack";

type RequestActionGame =
  | CommonActionGame
  | "randomAttack"
  | "add_ships"
  | "start_game";

type ResponseActionGame = CommonActionGame | "turn" | "finish";

type DataRequestActionGame = DataAddShips | DataAttack;

type DataResponseActionGame =
  | DataStartGame
  | DataResponseAttack
  | DataTurn
  | DataFinish;

type PositionShip = {
  x: number;
  y: number;
};

type DataAddShips = {
  gameId: number | string;
  ships: Ship[];
  indexPlayer: number | string;
}[];

type DataStartGame = {
  ships: Ship[];
  currentPlayerIndex: number | string;
};

type Ship = {
  position: PositionShip;
  direction: boolean;
  length: number;
  type: "small" | "medium" | "large" | "huge";
};

type DataAttack = {
  gameId: number | string;
  indexPlayer: number | string;
} & (PositionShip | null);

type DataResponseAttack = {
  position: PositionShip;
  currentPlayer: number | string;
  status: "miss" | "killed" | "shot";
};

type DataTurn = {
  currentPlayer: number | string;
};

type DataFinish = {
  winPlayer: number | string;
};
