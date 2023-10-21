import * as _ from 'lodash';
import { CheckersGame } from "../game-rules";
import { GameEntity, GameState } from "../game-state";
import { isGoalDown, isPlayableCell } from "../game-util";
import { MoveDefinition } from '../game-move';
import { lookupEntity } from './entity-utils';

export enum MoveType {
  Illegal = 'Illegal',
  Move = 'Move',
  Take = 'Take',
}

export interface MoveParams {
  rules: CheckersGame;
  state: GameState;
  move: MoveDefinition;
}

export interface MoveDescription {
  type: MoveType;
  takenX?: number;
  takenY?: number;
}

export const describeMove = ({ rules, state, move }: MoveParams): MoveDescription => {
  const {
    pieceX, pieceY, targetX, targetY
  } = move;
  const { player, isKing } = lookupEntity(state, pieceX, pieceY);

  if (!player) {
    return { type: MoveType.Illegal };
  }

  // Out of bounds; left side
  if (targetX < 0 || targetY < 0) {
    return { type: MoveType.Illegal };
  }

  // Surface-level check to see if this space is allowable & in bounds
  if (!isPlayableCell(rules, targetX, targetY)) {
    return { type: MoveType.Illegal };
  }
  
  // Out of bounds; right side
  if (targetX > (rules.boardWidth - 1) || targetY > (rules.boardWidth - 1)) {
    return { type: MoveType.Illegal };
  }

  const xDistance = Math.abs(pieceX - targetX);
  const yDistance = Math.abs(pieceY - targetY);

  // Moves beyond maximum allowable distance
  if (xDistance > 2 || yDistance > 2) {
    return { type: MoveType.Illegal };
  }
  
  // Bans moves such as two down
  if ((xDistance === 2 || yDistance === 2) && yDistance !== xDistance) {
    return { type: MoveType.Illegal };
  }

  // Move constraints for non-kings
  const goalDown = isGoalDown(rules, player);
  if (goalDown && targetY < pieceY && !isKing) {
    return { type: MoveType.Illegal };
  }
  if (!goalDown && targetY > pieceY && !isKing) {
    return { type: MoveType.Illegal };
  }

  // Occupied squares
  const existingEntity = _.get(state.cells, [targetX, targetY], GameEntity.None);
  if (existingEntity !== GameEntity.None) {
    return { type: MoveType.Illegal };
  }

  // Legal move; move this piece
  if (xDistance === 1 && yDistance === 1) {
    return { type: MoveType.Move };
  }

  // At this point it has to be a take move. Find the piece being taken
  const takenX = pieceX + ((targetX - pieceX) / 2);
  const takenY = pieceY + ((targetY - pieceY) / 2);
  const pieceAt = _.get(state.cells, [takenX, takenY], null);
  if (player === 'a' && _.includes([GameEntity.PlayerBPiece, GameEntity.PlayerBKing], pieceAt)) {
    return { type: MoveType.Take, takenX, takenY };
  }
  if (player === 'b' && _.includes([GameEntity.PlayerAPiece, GameEntity.PlayerAKing], pieceAt)) {
    return { type: MoveType.Take, takenX, takenY };
  }

  // Theoretically impossible
  return { type: MoveType.Illegal };
}

export const isLeglMove = (params: MoveParams) => {
  return describeMove(params).type !== MoveType.Illegal;
}
