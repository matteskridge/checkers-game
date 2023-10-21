import * as _ from 'lodash';
import { CheckersGame } from "./game-rules";

export const xor = (a: boolean, b: boolean) => a ? !b : b;

export const isPlayableCell = (rules: CheckersGame, x: number, y: number) => {
  // Out of bounds; left side
  if (x < 0 || y < 0) {
    return false;
  }
  
  // Out of bounds; right side
  if (x > rules.boardWidth || y > rules.boardWidth) {
    return false;
  }

  const isXEven = x % 2 === 0;
  const isYEven = y % 2 === 0;
  if (rules.playOn === 'startsEven') {
    return xor(isXEven, isYEven);
  }
  return !xor(isXEven, isYEven);
};

export const isShadedCell = (rules: CheckersGame, x: number, y: number) => {
  return isPlayableCell(rules, x, y) !== rules.shadePlayable;
};

export const isGoalDown = (rules: CheckersGame, player: string) => {
  if (rules.playerATop) {
    return player === 'a';
  }
  return player === 'b';
};
