import { Game } from "../types/app.types";
import { Board, RowBoard, Ship } from "../types/game.types";

export const NUMBER_BOARD = 10 as const;

export const createBoard = () =>
  Array(NUMBER_BOARD)
    .fill(null)
    .map(() => Array(NUMBER_BOARD).fill(0) as RowBoard) as Board;

export const fillBoard = (
  ship: Ship,
  board: Game["player1" | "player2"]["board"]
) => {
  for (let i = 0; i < ship.length; i++) {
    if (ship.direction) {
      board[ship.position.y + i][ship.position.x] = 1;
    } else {
      board[ship.position.y][ship.position.x + i] = 1;
    }
  }
};

export const getRandomPosition = (board: Board) => {
  const positions: [number, number][] = [];
  board.forEach((row, i) =>
    row.forEach((cell, j) => {
      if (cell === 0) positions.push([i, j]);
    })
  );
  const [x, y] = positions[Math.floor(Math.random() * positions.length)];
  return { x, y };
};
