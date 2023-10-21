import { MoveDefinition } from "../game-move";
import { CheckersGame } from "../game-rules";
import { GameState } from "../game-state";
import * as _ from 'lodash';
import { isKing, isPlayerB } from "./entity-utils";
import { getLegalPossibleMoves } from "./possible-moves";

export const getPieceList = (state: GameState) => {
  return _.flattenDeep(_.map(state.cells, (col, x) => _.map(col, (entity, y) => ({ entity, x, y }))));
}

export const chooseAIMove = (rules: CheckersGame, state: GameState): MoveDefinition => {
  const pieceList = getPieceList(state);
  const bEntities = _.filter(pieceList, piece => isPlayerB(piece.entity));
  const legalMoves = _.flatMap(bEntities, (piece) => {
    const moves = getLegalPossibleMoves(rules, state, piece.x, piece.y);
    return moves;
  });
  const randomIndex = Math.round(Math.random() * (legalMoves.length));
  const choice = _.get(legalMoves, [randomIndex], legalMoves[0]);
  return choice;
}
