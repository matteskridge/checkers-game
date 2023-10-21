import { BoardState } from "../board-state";

export const getDragLocation = (boardState: BoardState): null | [number, number] => {
  if (!boardState || !boardState.boardLocation || !boardState.dragLocation) {
    return null;
  }
  return [
    boardState.dragLocation[0] - boardState.boardLocation[0],
    boardState.dragLocation[1] - boardState.boardLocation[1],
  ];
}
