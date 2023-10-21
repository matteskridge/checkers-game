import { BoardCell } from "./board-cell";
import { CheckersGame } from "../model/game-rules";
import * as _ from 'lodash';
import { GameState } from "../model/game-state";
import { isShadedCell } from "../model/game-util";
import './board.css';
import { BoardContext } from "./board-context";
import { BoardState, highlightSquares, cancelDrag, initializeBoardState } from "../model/board-state";
import { useRef, useState } from "react";
import { BoardTraveler } from "./traveler/board-traveler";
import { BoardTakenList } from "./taken/taken-list";
import { Dialogue } from "./dialogue/dialogue";
import { GameOver } from "./gameover/gameover";
import { Controls } from "./controls/controls";

export interface BoardProps {
  rules: CheckersGame;
  initialState: GameState;
}

const getRowKey = (state: GameState, y: number): string => {
  return `${y}`;
};

const getCellKey = (state: GameState, x: number, y: number): string => {
  return `${x},${y},${state.cells[x][y]}`
};

export const Board = ({ rules, initialState }: BoardProps) => {
  const [ boardState, setBoardState ] = useState<BoardState>(initializeBoardState());
  const [ state, setState ] = useState<GameState>(initialState);
  const [ stateHistory, setStateHistory ] = useState<GameState[]>([initialState]);
  const boardRef = useRef<HTMLDivElement>(null);

  const updateBoardState = (newBoardState: BoardState) => {
    let boardLocation: null | [number, number] = null;
    if (boardRef.current) {
      const boundingRect = boardRef.current.getBoundingClientRect();
      boardLocation = [ boundingRect.x, boundingRect.y ];
    }
    setBoardState({
      ...newBoardState,
      boardLocation
    });
  };

  const updateState = (newState: GameState) => {
    setStateHistory([ ...stateHistory, state ]);
    setState(newState);
  }

  const undo = () => {
    const latest = stateHistory.pop();
    if (latest) {
      setStateHistory(stateHistory);
      setState(latest);
      setBoardState(initializeBoardState());
    }
  }

  const updateDragMove = (ev: any) => {
    if (!boardState.isDragging || boardState.dragType === 'select') {
      return;
    }

    const pageX = _.get(ev, ['changedTouches', 0, 'pageX'], ev.pageX);
    const pageY = _.get(ev, ['changedTouches', 0, 'pageY'], ev.pageY);

    updateBoardState({
      ...boardState,
      dragLocation: [pageX, pageY]
    });
  };

  const resetMouseStates = () => {
    updateBoardState(
      cancelDrag(
        highlightSquares(boardState, [])
      )
    );
  };

  const eventBindings = {
    onMouseOut: resetMouseStates,
    onMouseMove: updateDragMove,
    onTouchMove: updateDragMove
  };

  return (
    <BoardContext.Provider value={{ rules, state, updateState, boardState, updateBoardState, undo }}>
      <Dialogue />
      <div className='checkers-app-wrap'>
        <div className='checkers-board-wrap' ref={boardRef}>
          <GameOver />
          <BoardTraveler />
          <div className='checkers-board-border' {...eventBindings}>
            <div className='checkers-board'>
              {_.map(_.range(0, rules.boardBreadth), y => (
                <div className='checkers-board-row' key={getRowKey(state, y)}>
                  {_.map(_.range(0, rules.boardWidth), x => (
                    <div className='checkers-board-cell-wrap' key={getCellKey(state, x, y)}>
                      <BoardCell entity={state.cells[x][y]} isShaded={isShadedCell(rules, x, y)} x={x} y={y} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <Controls />
        </div>
        <BoardTakenList />
      </div>
    </BoardContext.Provider>
  );
};
