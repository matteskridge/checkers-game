import React from 'react';
import './App.css';
import { Board } from './board/board';
import { StandardGame } from './model/game-rules';
import { initializeGameState } from './model/game-state';

function App() {
  const rules = StandardGame;
  const state = initializeGameState(rules);
  return (
    <div className='app-container'>
      <Board rules={rules} initialState={state} />
    </div>
  );
}

export default App;
