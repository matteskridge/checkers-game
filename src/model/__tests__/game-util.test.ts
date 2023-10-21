import { StandardGame } from "../game-rules";
import { isGoalDown, isPlayableCell, isShadedCell, xor } from "../game-util";
import * as _ from 'lodash';

test('verify xor matches truth table', () => {
  expect(xor(false, false)).toBe(false);
  expect(xor(false, true)).toBe(true);
  expect(xor(true, false)).toBe(true);
  expect(xor(true, true)).toBe(false);
});

export const makeAlternatingBoard = (firstRow: boolean[], secondRow: boolean[]): boolean[][] => {
  return [
    firstRow,
    secondRow,
    firstRow,
    secondRow,
    firstRow,
    secondRow,
    firstRow,
    secondRow,
  ];
}

const t = true;
const f = false;
const firstRow = [t, f, t, f, t, f, t, f];
const secondRow = [f, t, f, t, f, t, f, t];
export const firstAlternatingBoard = makeAlternatingBoard(firstRow, secondRow);
export const secondAlternatingBoard = makeAlternatingBoard(secondRow, firstRow);

export const verifyMatrix = (fn: (x: number, y: number) => void) => {
  _.forEach(
    _.range(0, 7),
    x => _.forEach(
      _.range(0, 7),
      y => fn(x, y)
    )
  );
}

test('verify playability for standard board', () => {
  verifyMatrix((x, y) => expect(isPlayableCell(StandardGame, x, y)).toEqual(firstAlternatingBoard[x][y]))
});

test('verify shaded states for standard board', () => {
  verifyMatrix((x, y) => expect(isShadedCell(StandardGame, x, y)).toEqual(secondAlternatingBoard[x][y]))
});

test('verify goal orientation', () => {
  expect(isGoalDown(StandardGame, 'a')).toBe(true);
  expect(isGoalDown(StandardGame, 'b')).toBe(false);
});
