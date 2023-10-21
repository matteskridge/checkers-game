import React from "react";
import { CheckersGame } from "../model/game-rules";
import { GameState } from "../model/game-state";
import { BoardState } from "../model/board-state";

export interface BoardContext {
  rules: CheckersGame | null;
  state: GameState | null;
  boardState: BoardState | null;
  updateBoardState: (boardState: BoardState) => void;
  updateState: (state: GameState) => void;
  undo: () => void;
}

const defaultContext = {
  rules: null,
  state: null,
  boardState: null,
  updateBoardState: () => {},
  updateState: () => {},
  undo: () => {}
};

export const BoardContext = React.createContext<BoardContext>(defaultContext);
