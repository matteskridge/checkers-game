import * as _ from 'lodash';
import { GameEntity } from "../model/game-state";
import { Entity } from './entity/entity';
import classNames from 'classnames';
import './board-cell.css';
import { getLegalPossibleMoves } from '../model/utils/possible-moves';
import { getPlayer, isKing, isPieceOrKing, isPlayerA } from '../model/utils/entity-utils';
import { useContext } from 'react';
import { BoardContext } from './board-context';
import { finishDrag, highlightSquares, isCellHighlighted, isDragElement, selectPiece, startDragging } from '../model/board-state';
import { executeTurnCycle } from '../model/game-move';

export interface BoardCellProps {
  entity: GameEntity;
  x: number;
  y: number;
  isShaded: boolean;
}

export const BoardCell = ({ entity, isShaded, x, y }: BoardCellProps) => {
  const { rules, state, boardState, updateBoardState, updateState } = useContext(BoardContext);
  const isHighlighted = boardState && isCellHighlighted(boardState, x, y);
  const isDrag = boardState && isDragElement(boardState, x, y);

  const classes = classNames('checkers-board-cell', {
    'checkers-board-cell-shaded': isShaded,
    'checkers-board-cell-highlighted': isHighlighted,
    'checkers-board-cell-dragging': isDrag,
  });

  const innerClasses = classNames('checkers-board-cell-inner', {
    'checkers-board-cell-inner-highlighted': isHighlighted,
  });

  const onMouseOver = () => {
    const movable = isPieceOrKing(entity);
    if (movable && rules && state && boardState) {
      const player = getPlayer(entity);
      if (player) {
        const possibleMoves = getLegalPossibleMoves(rules, state, x, y);
        updateBoardState(highlightSquares(boardState, possibleMoves));
      }
    }
  };

  const startDrag = (ev: any = null) => {
    ev.preventDefault();
    if (boardState && isPlayerA(entity)) {
      const clientX = _.get(ev, ['clientX'], null);
      const clientY = _.get(ev, ['clientY'], null);
      updateBoardState(startDragging(boardState, [x, y], [clientX, clientY], isKing(entity)));
    }
  };

  const stopDrag = () => {
    if (boardState && rules && state && boardState.isDragging && boardState.dragElement) {
      updateBoardState(finishDrag(boardState));
      const move = {
        pieceX: boardState.dragElement[0],
        pieceY: boardState.dragElement[1],
        targetX: x,
        targetY: y
      };
      updateState(executeTurnCycle(rules, state, move));
    }
  }

  const select = (ev: any) => {
    ev.preventDefault();
    if (!boardState || !rules || !state) {
      return;
    }
    if (boardState.isDragging) {
      stopDrag();
    } else {
      const possibleMoves = getLegalPossibleMoves(rules, state, x, y);
      updateBoardState(selectPiece(boardState, [x, y], isKing(entity), possibleMoves));
    }
  }

  // Helps separate mouse and touch interactions
  const noDefault = (ev: any) => {
    ev.preventDefault();
  }

  const eventBindings = {
    onTouchStart: select,
    onTouchEnd: noDefault,
    onMouseOver,
    onMouseDown: startDrag,
    onMouseUp: stopDrag,
  };

  return (
    <div className={classes} {...eventBindings}>
      <div className={innerClasses}>
        <Entity entity={entity} />
      </div>
    </div>
  );
};
