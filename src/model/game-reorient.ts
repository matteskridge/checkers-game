import * as _ from "lodash";
import { CheckersGame } from "./game-rules";
import { GameState, GameOutcome, GameEntity } from "./game-state";
import { describeMove, MoveType } from "./utils/describe-move";
import { getPlayer, isPlayerA, isPlayerB } from "./utils/entity-utils";
import { getPieceList } from "./utils/playerb-ai";
import { getLegalPossibleMoves } from "./utils/possible-moves";

export const describeGame = (rules: CheckersGame, state: GameState): Partial<GameState> => {
  const allPieces = getPieceList(state);

  // Use a partial state for some operations since can/can't take this turn hasn't been set yet
  const partialState = { ...state, canTakeThisTurn: false };

  // Get a list of all moves that can be made by all pieces
  const piecesWithMoves = _.map(
    allPieces,
    ({ entity, x, y }) => ({ moves: getLegalPossibleMoves(rules, partialState, x, y ), entity, x, y })
  );

  // Check for victory conditions: all pieces on the other side removed
  const armyADestroyed = !_.find(piecesWithMoves, ({ entity }) => isPlayerA(entity));
  const armyBDestroyed = !_.find(piecesWithMoves, ({ entity }) => isPlayerB(entity));

  // Stalemate condition where there are zero pieces ... should be impossible unless game was initialized with no pieces
  if (armyADestroyed && armyBDestroyed) {
    return {
      outcome: GameOutcome.Stalemate,
      canTakeThisTurn: false,
      turn: null
    }
  }

  // Player B victory condition
  if (armyADestroyed) {
    return {
      outcome: GameOutcome.PlayerBVictory,
      canTakeThisTurn: false,
      turn: null
    }
  }

  // Player A victory condition
  if (armyBDestroyed) {
    return {
      outcome: GameOutcome.PlayerAVictory,
      canTakeThisTurn: false,
      turn: null
    }
  }

  // Determine type of all possible, legal moves
  const piecesWithDescribedMoves = _.map(
    piecesWithMoves,
    ({ moves, entity, ...other }) => ({
      ...other,
      entity,
      moves: _.map(moves, move => ({
        move,
        desc: describeMove({
          rules,
          state,
          move
        })
      }))
    })
  );

  // Flatten moves to an easy to navigate structure
  const turnOnlyMoves = _.filter(piecesWithDescribedMoves, ({ entity }) => getPlayer(entity) === state.turn);
  const allTurnMoves = _.flatMap(turnOnlyMoves, piece => piece.moves);

  // Determine if there are any legal moves this turn
  const hasLegalMove = Boolean(_.find(allTurnMoves, move => move.desc.type !== MoveType.Illegal));
  if (!hasLegalMove) {
    return {
      outcome: state.turn === 'a' ? GameOutcome.PlayerBVictory : GameOutcome.PlayerAVictory,
      canTakeThisTurn: false,
      turn: null
    }
  }

  const canTakeThisTurn = Boolean(_.find(allTurnMoves, move => move.desc.type === MoveType.Take));
  return {
    outcome: GameOutcome.Undecided,
    canTakeThisTurn
  };
}

export const promoteKings = (rules: CheckersGame, state: GameState) => {
  const KingPromotions = {
    [GameEntity.PlayerAPiece]: GameEntity.PlayerAKing,
    [GameEntity.PlayerBPiece]: GameEntity.PlayerBKing,
  };
  const executePromotion = (entity: GameEntity) => _.get(KingPromotions, entity, GameEntity.None);
  const topRowPromote = rules.playerATop ? GameEntity.PlayerBPiece : GameEntity.PlayerAPiece;
  const bottomRowPromote = rules.playerATop ? GameEntity.PlayerAPiece : GameEntity.PlayerBPiece;

  // Modify state
  const newState = _.cloneDeep(state);
  for (let i = 0; i < newState.cells.length; i++) {
    _.forEach([[0, topRowPromote], [state.cells.length - 1, bottomRowPromote]], ([j, promote]: [number, GameEntity]) => {
      const entity = newState.cells[i][j];
      newState.cells[i][j] = entity === promote ? executePromotion(entity) : entity;
    })
  }
  return newState;
}

export const reorientGameState = (rules: CheckersGame, state: GameState): GameState => {
  const desc = describeGame(rules, state);
  const updatedState = {
    ...state,
    ...desc
  };

  return promoteKings(rules, updatedState);
};
