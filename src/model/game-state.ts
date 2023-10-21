import { CheckersGame } from "./game-rules";
import * as _ from 'lodash';
import { isPlayableCell } from "./game-util";
import { reorientGameState } from "./game-reorient";
import { DialogueEntry, OpeningDialogue, appendDialogue } from "./game-dialogue";

export enum GameEntity {
  None = 'None',
  PlayerAPiece = 'PlayerAPiece',
  PlayerBPiece = 'PlayerBPiece',
  PlayerAKing = 'PlayerAKing',
  PlayerBKing = 'PlayerBKing'
}

export enum GameOutcome {
  Undecided = 'Undecided',
  PlayerAVictory = 'PlayerAVictory',
  PlayerBVictory = 'PlayerBVictory',
  Stalemate = 'Stalemate'
}

export interface GameState {
  cells: GameEntity[][];
  taken: GameEntity[];
  canTakeThisTurn: boolean;
  outcome: GameOutcome;
  turn: 'a' | 'b' | null;
  dialogue: DialogueEntry[];

  // If set, only the piece at this square is allowed to move; used for multi-jumps
  requireMove: [number, number] | null;
}

export type InitializationConditions = [
  (rules: CheckersGame, x: number, y: number) => boolean,
  GameEntity
][];

const cellInitializationConditions: InitializationConditions = [
  // Player A's pieces if they're at the top of the board
  [
    (rules, x, y) => rules.playerATop && y < rules.armySizeInRowsPlayerA,
    GameEntity.PlayerAPiece
  ],
  // Player B's pieces if they're at the bottom of the board
  [
    (rules, x, y) => rules.playerATop && y > rules.boardBreadth - rules.armySizeInRowsPlayerB - 1,
    GameEntity.PlayerBPiece
  ],
  // Player A's pieces if they're at the bottom of the board
  [
    (rules, x, y) => !rules.playerATop && y > rules.boardBreadth - rules.armySizeInRowsPlayerA - 1,
    GameEntity.PlayerAPiece
  ],
  // Player B's pieces if they're at the top of the board
  [
    (rules, x, y) => !rules.playerATop && y < rules.armySizeInRowsPlayerB,
    GameEntity.PlayerBPiece
  ],
];

export const initializeGameState = (rules: CheckersGame): GameState => {
  const cells = _.map(_.range(0, rules.boardWidth), x => {
    return _.map(_.range(0, rules.boardBreadth), y => {
      // Only initialize pieces on the playable side of the game board
      const isPlayable = isPlayableCell(rules, x, y);
      if (!isPlayable) {
        return GameEntity.None;
      }

      // Initialize all pieces
      return _.get(_.find(cellInitializationConditions, condition => condition[0](rules, x, y)), [1], GameEntity.None);
    });
  });
  const protoState: GameState = {
    cells,
    taken: [],
    outcome: GameOutcome.Undecided,
    turn: 'a',
    canTakeThisTurn: false,
    dialogue: appendDialogue(OpeningDialogue, []),
    requireMove: null
  };
  return reorientGameState(rules, protoState);
};
