import { AllDialogue, OpeningDialogue } from "../game-dialogue";
import { executeMove, executeTurnCycle } from "../game-move";
import { StandardGame } from "../game-rules";
import { GameEntity, GameState, initializeGameState } from "../game-state"

const defaultGameState = initializeGameState(StandardGame);
const a = GameEntity.PlayerAPiece;
const b = GameEntity.PlayerBPiece;
const x = GameEntity.None;

const MOCK_RANDOM = 0.2;
const MOCK_UUID = 'EXAMPLE-UUID';
jest.mock('../utils/random', () => ({
  randomNumber: () => MOCK_RANDOM,
  getId: () => 'EXAMPLE-UUID'
}));

test('attempt illegal move: not moving a piece', () => {
  const move = {
    pieceX: 0,
    pieceY: 1,
    targetX: 0,
    targetY: 2
  };
  expect(executeMove(StandardGame, defaultGameState, move)).toEqual([defaultGameState, false]);
});

test('attempt illegal move: exceeds allowable range', () => {
  const move = {
    pieceX: 0,
    pieceY: 0,
    targetX: 3,
    targetY: 3
  };
  expect(executeMove(StandardGame, defaultGameState, move)).toEqual([defaultGameState, false]);
});

test('perform a legal first move', () => {
  const move = {
    pieceX: 0,
    pieceY: 2,
    targetX: 1,
    targetY: 3
  };
  const expectedState = {
    ...defaultGameState,
    cells: [
      [a, x, x, x, x, x, b, x],
      [x, a, x, a, x, b, x, b],
      ...defaultGameState.cells.slice(2)
    ],
    turn: 'b'
  };
  expect(executeMove(StandardGame, defaultGameState, move)).toEqual([expectedState, true]);
});

test('perform a legal jump move', () => {
  const move = {
    pieceX: 0,
    pieceY: 2,
    targetX: 2,
    targetY: 4
  };
  const startingState: GameState = {
    ...defaultGameState,
    canTakeThisTurn: true,
    cells: [
      [a, x, a, x, x, x, b, x],
      [x, a, x, b, x, x, x, b],
      [a, x, a, x, x, x, b, x],
      ...defaultGameState.cells.slice(3)
    ],
    turn: 'a'
  };
  const expectedState = {
    ...defaultGameState,
    canTakeThisTurn: true, // there is a B piece in the sliced default game state that can take the newly moved A piece
    cells: [
      [a, x, x, x, x, x, b, x],
      [x, a, x, x, x, x, x, b],
      [a, x, a, x, a, x, b, x],
      ...defaultGameState.cells.slice(3)
    ],
    turn: 'b',
    taken: [b]
  };
  expect(executeMove(StandardGame, startingState, move)).toEqual([expectedState, true]);
});

test('perform a legal, chainable jump move', () => {
  const move = {
    pieceX: 0,
    pieceY: 2,
    targetX: 2,
    targetY: 4
  };
  const startingState: GameState = {
    ...defaultGameState,
    canTakeThisTurn: true,
    cells: [
      [a, x, a, x, x, x, x, x],
      [x, a, x, b, x, b, x, b],
      [a, x, a, x, x, x, b, x],
      ...defaultGameState.cells.slice(3)
    ],
    turn: 'a'
  };
  const expectedState = {
    ...defaultGameState,
    canTakeThisTurn: true,
    cells: [
      [a, x, x, x, x, x, x, x],
      [x, a, x, x, x, b, x, b],
      [a, x, a, x, a, x, b, x],
      ...defaultGameState.cells.slice(3)
    ],
    turn: 'a', // Note that the turn did not change, as this move is chainable
    taken: [b]
  };
  expect(executeMove(StandardGame, startingState, move)).toEqual([expectedState, true]);
});

test('execute turn cycle', () => {
  const move = {
    pieceX: 0,
    pieceY: 2,
    targetX: 2,
    targetY: 4
  };
  const startingState: GameState = {
    ...defaultGameState,
    canTakeThisTurn: true,
    cells: [
      [x, x, a, x, x, x, x, x],
      [x, x, x, b, x, x, x, x],
      [x, x, x, x, x, x, x, x],
      [x, a, x, x, x, b, x, x],
      [x, x, x, x, x, x, b, x],
      [x, x, x, x, x, x, x, x],
    ],
    turn: 'a'
  };
  const expectedState = {
    ...defaultGameState,
    canTakeThisTurn: false,
    cells: [
      [x, x, x, x, x, x, x, x],
      [x, x, x, b, x, x, x, x],
      [x, x, x, x, x, x, x, x],
      [x, a, x, x, x, x, x, x],
      [x, x, x, x, x, x, b, x],
      [x, x, x, x, x, x, x, x],
    ],
    turn: 'a',
    taken: [b, a],
    dialogue: [
      {
        id: MOCK_UUID,
        text: OpeningDialogue.playerA,
        player: 'a'
      },
      {
        id: MOCK_UUID,
        text: OpeningDialogue.playerB,
        player: 'b'
      },
      {
        id: MOCK_UUID,
        text: AllDialogue[2].playerA,
        player: 'a'
      },
      {
        id: MOCK_UUID,
        text: AllDialogue[2].playerB,
        player: 'b'
      },
    ]
  };
  expect(executeTurnCycle(StandardGame, startingState, move)).toEqual(expectedState);
});
