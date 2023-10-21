import * as React from 'react';
import { BoardContext } from '../board-context';
import './board-traveler.css';
import { getDragLocation } from '../../model/utils/drag-utils';
import classNames from 'classnames';

export const BoardTraveler = () => {
  const { boardState } = React.useContext(BoardContext);

  if (!boardState || !boardState.isDragging) {
    return null;
  }

  const pos = getDragLocation(boardState);
  if (!pos) {
    return null;
  }

  const offset = 16 * 2.5;

  const classes = classNames('checkers-board-traveler', {
    'checkers-board-traveler-king': boardState.isDraggingKing,
  });

  const left = pos[0] - offset;
  const top = pos[1] - offset;

  if (Number.isNaN(left) || Number.isNaN(top)) {
    return null;
  }
  
  return (
    <div className='checkers-board-traveler-wrap'>
      <div className={classes} style={{ left, top }}></div>
    </div>
  );
}
