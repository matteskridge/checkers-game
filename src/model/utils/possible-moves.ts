import * as _ from 'lodash';
import { CheckersGame } from '../game-rules';
import { MoveDescription, MoveType, describeMove } from './describe-move';
import { GameState } from '../game-state';
import { MoveDefinition } from '../game-move';
import { lookupEntity } from './entity-utils';

export const getPossibleMoves = (pieceX: number, pieceY: number): MoveDefinition[] => {
  // TODO support for multi-taking
  //
  // Probably just check it in a loop with the new move being used as the origin again;
  // recursive implementation
  const relativeMoves = [
    // Standard moves
    // Move up-left
    [pieceX - 1, pieceY - 1],
    // Move up-right
    [pieceX + 1, pieceY - 1],
    // Move down-left
    [pieceX - 1, pieceY + 1],
    // Move down-right
    [pieceX + 1, pieceY + 1],

    // Take-piece moves
    // Move up-left
    [pieceX - 2, pieceY - 2],
    // Move up-right
    [pieceX + 2, pieceY - 2],
    // Move down-left
    [pieceX - 2, pieceY + 2],
    // Move down-right
    [pieceX + 2, pieceY + 2],
  ];

  return _.map(relativeMoves, rel => ({
    pieceX,
    pieceY,
    targetX: rel[0],
    targetY: rel[1]
  }));
}

export const getLegalPossibleDescribedMoves = (rules: CheckersGame, state: GameState, pieceX: number, pieceY: number): { move: MoveDefinition, desc: MoveDescription }[] => {
  const { player } = lookupEntity(state, pieceX, pieceY);

  // Validation; player must be set
  if (!player) {
    return [];
  }

  // Requires that a certain piece be moved during a multi-jump
  if (state.requireMove && state.requireMove[0] !== pieceX && state.requireMove[1] !== pieceY) {
    return [];
  }

  // Get list of legal moves considering only this piece
  const moves = getPossibleMoves(pieceX, pieceY);
  const moveDescriptions = _.map(moves, move => ({ move, desc: describeMove({ rules, state, move: { pieceX, pieceY, targetX: move.targetX, targetY: move.targetY } })}));
  const filteredInIsolation = _.filter(moveDescriptions, move => move.desc.type !== MoveType.Illegal);
  
  // If captures are required this turn, then filter out non-capture moves
  if (rules.forceCaptureMove && state.canTakeThisTurn) {
    const filteredTogether = _.filter(filteredInIsolation, move => move.desc.type === MoveType.Take);
    return filteredTogether;
  }

  return filteredInIsolation;
};

export const getLegalPossibleMoves = (rules: CheckersGame, state: GameState, pieceX: number, pieceY: number): MoveDefinition[] => {
  const moves = getLegalPossibleDescribedMoves(rules, state, pieceX, pieceY);
  return _.map(moves, move => move.move);
};
