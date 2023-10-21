import { StandardGame } from "../game-rules";
import { GameEntity, GameOutcome, initializeGameState } from "../game-state";
import * as _ from 'lodash';
import { PlayerAOpening, PlayerBOpening } from "../game-dialogue";

const MOCK_RANDOM = 0.2;
const MOCK_UUID = 'EXAMPLE-UUID';
jest.mock('../utils/random', () => ({
  randomNumber: () => MOCK_RANDOM,
  getId: () => 'EXAMPLE-UUID'
}));

test('verify correct initialization; standard game', () => {
  const rules = StandardGame;
  const state = initializeGameState(rules);

  // Generated expected piece placement
  const a = GameEntity.PlayerAPiece;
  const b = GameEntity.PlayerBPiece;
  const x = GameEntity.None;
  const firstRow = [a, x, a, x, x, x, b, x];
  const secondRow = [x, a, x, x, x, b, x, b];
  const cells = [
    firstRow,
    secondRow,
    firstRow,
    secondRow,
    firstRow,
    secondRow,
    firstRow,
    secondRow,
  ];

  // Verify correct initial state
  expect(state).toEqual({
    cells,
    taken: [],
    outcome: GameOutcome.Undecided,
    turn: 'a',
    canTakeThisTurn: false,
    dialogue: [
      {
        id: MOCK_UUID,
        text: PlayerAOpening,
        player: 'a'
      },
      {
        id: MOCK_UUID,
        text: PlayerBOpening,
        player: 'b'
      }
    ],
    requireMove: null
  });
});
