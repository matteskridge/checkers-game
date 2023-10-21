import { useContext } from "react";
import { BoardContext } from "../board-context";
import * as _ from 'lodash';
import './dialogue.css';

export const Dialogue = () => {
  const { state } = useContext(BoardContext);
  const dialog = state?.dialogue;
  const reversedDialog = _.reverse(_.cloneDeep(dialog) as any);
  return (
    <div className='checkers-dialog'>
      {_.map(reversedDialog, entry => (
        <div className={`checkers-dialog-entry-wrap checkers-dialog-player${entry.player}`} key={entry.id}>
          <div className='checkers-dialog-entry-avatar'>
            {entry.player === 'a' && <img src='/images/playera.png' />}
            {entry.player === 'b' && <img src='/images/playerb.png' />}
          </div>
          <div className='checkers-dialog-entry'>
            {entry.text}
          </div>
        </div>
      ))}
    </div>
  );
};
