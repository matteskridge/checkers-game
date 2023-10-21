import * as React from 'react';
import './gameover-screen.css';
import { useContext } from 'react';
import { BoardContext } from '../board-context';
import { initializeGameState } from '../../model/game-state';
import { initializeBoardState } from '../../model/board-state';

export interface GameOverScreenProps {
  text: string;
}

export const GameOverScreen = ({ text }: GameOverScreenProps) => {
  const { rules, updateState, updateBoardState } = useContext(BoardContext);

  if (!rules) {
    return null;
  }

  const resetGame = () => {
    updateState(initializeGameState(rules));
    updateBoardState(initializeBoardState());
  };

  return (
    <div className='checkers-gameover-wrap'>
      <div className='checkers-gameover'>
        <div className='checkers-gameover-text'>
          {text}
        </div>
        <div className='checkers-gameover-actions'>
          <div className='checkers-gameover-action checkers-gameover-action-reset' onClick={resetGame}>
            Start Over
          </div>
        </div>
      </div>
    </div>
  );
}
