import * as _ from 'lodash';
import { GameEntity, GameState } from "../game-state";

export const isKing = (entity: GameEntity) => {
  return _.includes([GameEntity.PlayerAKing, GameEntity.PlayerBKing], entity);
}

export const getPlayer = (entity: GameEntity): 'a' | 'b' | null => {
  if (_.includes([GameEntity.PlayerAPiece, GameEntity.PlayerAKing], entity)) {
    return 'a';
  }
  if (_.includes([GameEntity.PlayerBPiece, GameEntity.PlayerBKing], entity)) {
    return 'b';
  }
  return null;
}

export const isPlayerA = (entity: GameEntity) => {
  return getPlayer(entity) === 'a';
}

export const isPlayerB = (entity: GameEntity) => {
  return getPlayer(entity) === 'b';
}

export const isPieceOrKing = (entity: GameEntity): boolean => {
  return entity !== GameEntity.None;
}

export const lookupEntity = (state: GameState, pieceX: number, pieceY: number, ) => {
  const entity = _.get(state.cells, [pieceX, pieceY], GameEntity.None);
  const player = getPlayer(entity);
  return {
    entity,
    player,
    isKing: isKing(entity)
  };
};
