import * as React from 'react';
import { BoardContext } from '../board-context';
import { initializeGameState } from '../../model/game-state';
import './controls.css';
import { initializeBoardState } from '../../model/board-state';

export const Controls = () => {
  const { undo, updateState, updateBoardState, rules } = React.useContext(BoardContext);

  const reset = () => {
    if (rules) {
      updateState(initializeGameState(rules));
      updateBoardState(initializeBoardState());
    }
  };

  return (
    <div className='checkers-controls'>
      <button className='checkers-control-button' onClick={undo}>Undo</button>
      <button className='checkers-control-button' onClick={reset}>Start Over</button>
    </div>
  );
};
