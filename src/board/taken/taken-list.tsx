import * as React from 'react';
import { useContext } from "react";
import { BoardContext } from "../board-context";
import * as _ from 'lodash';
import { Entity } from '../entity/entity';
import './taken-list.css';

export const BoardTakenList = () => {
  const { state } = useContext(BoardContext);

  if (!state) {
    return null;
  }

  return (
    <div className="checkers-board-taken-list">
      {_.map(state.taken, taken => (
        <div className="checkers-board-taken-list-entity">
          <Entity entity={taken} />
        </div>
      ))}
    </div>
  );
};
