import * as _ from 'lodash';
import { MoveDefinition } from './game-move';

export interface BoardState {
  possibleMoveHighlight: Set<string>;
  isDragging: boolean;
  dragElement: [number, number] | null;
  dragLocation: [number, number] | null;
  boardLocation: [number, number] | null;
  dragType: 'drag' | 'select' | null;
  isDraggingKing: boolean;
}

export const makeCellKey = (x: number, y: number) => `${x}-${y}`;

const getHighlight = (coords: MoveDefinition[]) => {
  return _.reduce(
    coords,
    (set, { targetX, targetY }) => {
      set.add(makeCellKey(targetX, targetY));
      return set;
    },
    new Set<string>()
  );
}

export const highlightSquares = (board: BoardState, coords: MoveDefinition[]) => {
  // Don't highlight while dragging
  if (board.isDragging) {
    return board;
  }
  return {
    ...board,
    possibleMoveHighlight: getHighlight(coords)
  }
}

export const startDragging = (board: BoardState, dragStartBoardCoord: [number, number], dragLocation: [number, number], isDraggingKing: boolean): BoardState => {
  return {
    ...board,
    dragElement: dragStartBoardCoord,
    isDragging: true,
    dragLocation,
    dragType: 'drag',
    isDraggingKing
  }
}

export const selectPiece = (board: BoardState, selectLocation: [number, number], isDraggingKing: boolean, coords: MoveDefinition[]): BoardState => {
  return {
    ...board,
    dragElement: selectLocation,
    isDragging: true,
    dragLocation: null,
    isDraggingKing,
    dragType: 'select',
    possibleMoveHighlight: getHighlight(coords)
  }
}

export const cancelDrag = (board: BoardState): BoardState => {
  return {
    ...board,
    dragElement: null,
    isDragging: false,
    dragType: null,
    dragLocation: null
  }
}

export const finishDrag = (board: BoardState): BoardState => {
  return {
    ...board,
    dragElement: null,
    isDragging: false,
    dragLocation: null,
    isDraggingKing: false,
    dragType: null,
    possibleMoveHighlight: new Set<string>()
  }
}

export const isCellHighlighted = (board: BoardState, x: number, y: number) => {
  return board.possibleMoveHighlight.has(makeCellKey(x, y));
}

export const isDragElement = (board: BoardState, x: number, y: number) => {
  if (!board.dragElement) {
    return false;
  }
  return board.dragElement[0] === x && board.dragElement[1] === y && board.dragType === 'drag';
}

export const initializeBoardState = (): BoardState => {
  return {
    possibleMoveHighlight: new Set<string>(),
    isDragging: false,
    dragLocation: null,
    boardLocation: null,
    dragElement: null,
    dragType: null,
    isDraggingKing: false
  };
}
