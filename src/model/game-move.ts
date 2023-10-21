import _ from "lodash";
import { stepDialogue } from "./game-dialogue";
import { reorientGameState } from "./game-reorient";
import { CheckersGame } from "./game-rules";
import { GameState, GameEntity, GameOutcome } from "./game-state";
import { describeMove, MoveType } from "./utils/describe-move";
import { getPlayer } from "./utils/entity-utils";
import { chooseAIMove } from "./utils/playerb-ai";
import { getLegalPossibleDescribedMoves } from "./utils/possible-moves";

export interface MoveDefinition {
  pieceX: number;
  pieceY: number;
  targetX: number;
  targetY: number;
}

export const moveCanChain = (rules: CheckersGame, state: GameState, move: MoveDefinition): boolean => {
  if (!state.canTakeThisTurn) {
    return false;
  }
  const { targetX, targetY } = move;
  const possibleMoves = getLegalPossibleDescribedMoves(rules, state, targetX, targetY);
  const canTake = Boolean(_.find(possibleMoves, m => m.desc.type === MoveType.Take));
  return canTake;
}

export const executeMove = (rules: CheckersGame, state: GameState, move: MoveDefinition): [GameState, boolean] => {
  if (!move) {
    return [state, false];
  }
  const {
    pieceX,
    pieceY,
    targetX,
    targetY
  } = move;
  const entity = _.get(state.cells, [pieceX, pieceY], GameEntity.None);
  const player = getPlayer(entity);

  // Ensure a piece is being moved
  if (!player) {
    return [state, false];
  }

  const desc = describeMove({ rules, state, move: { pieceX, pieceY, targetX, targetY } });

  // Don't execute illegal moves
  if (desc.type === MoveType.Illegal) {
    return [state, false];
  }

  // Ensure that the user is taking if they can take and must take
  if (rules.forceCaptureMove && state.canTakeThisTurn && desc.type !== MoveType.Take) {
    return [state, false];
  }

  const newState = _.cloneDeep(state) as GameState;
  // Remove piece being moved from previous place
  newState.cells[pieceX][pieceY] = GameEntity.None;
  // Place piece being moved in new place
  newState.cells[targetX][targetY] = entity;

  // Execute take
  if (desc.type === MoveType.Take && typeof desc.takenX !== 'undefined' && typeof desc.takenY !== 'undefined') {
    const takenType = _.get(newState.cells, [desc.takenX, desc.takenY], GameEntity.None);

    // Remove taken piece
    newState.cells[desc.takenX][desc.takenY] = GameEntity.None;
    
    // Place the taken piece at the side of the board
    newState.taken = [ ...newState.taken, takenType ];
  }

  const reoriented = reorientGameState(rules, newState);

  // If move can chain, set up next turn to multi-jump
  if (desc.type === MoveType.Take && moveCanChain(rules, reoriented, move)) {
    newState.requireMove = [
      move.targetX,
      move.targetY
    ];
    newState.turn = player;
    return [reoriented, true];
  }

  // If move can't chain, switch turn normally
  reoriented.requireMove = null;
  reoriented.turn = player === 'a' ? 'b' : 'a';
  return [reorientGameState(rules, reoriented), true];
}

export const switchTurn = (state: GameState, turn: 'a' | 'b'): GameState => {
  const newState = _.cloneDeep(state);
  newState.turn = turn;
  return newState;
}

export const executeTurnCycle = (rules: CheckersGame, state: GameState, move: MoveDefinition) => {
  // Player A move
  const [ playerAMoveState, didExecute] = executeMove(rules, state, move);
  if (!didExecute) {
    // Occurs when the user tries an invalid move
    return state;
  }

  // Skip player B turn if the game ended with player A's move
  if (playerAMoveState.outcome !== GameOutcome.Undecided) {
    return playerAMoveState;
  }

  // Player B move
  let activeState = playerAMoveState;
  while (activeState.turn === 'b') {
    const playerBMove = chooseAIMove(rules, activeState);
    const [ playerBMoveState, didExecute2 ] = executeMove(rules, activeState, playerBMove);
    if (!didExecute2) {
      // Something went wrong
      console.error('player b turn could not execute, state is', playerBMoveState, 'move is', playerBMove);
      return state;
    }
    activeState = playerBMoveState;
  }

  // Step dialog
  const finalState = {
    ...activeState,
    dialogue: stepDialogue(activeState.dialogue)
  }
  return finalState;
}
