import { useContext, useEffect, useRef } from "react";
import { BoardContext } from "../board-context";
import * as _ from 'lodash';
import './dialogue.css';

export const Dialogue = () => {
  const { state } = useContext(BoardContext);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state]); // This effect runs every time triggerProp changes


  const dialog = state?.dialogue;
  const reversedDialog = _.reverse(_.cloneDeep(dialog) as any);
  return (
    <div className='checkers-dialog'>
      <div ref={endOfMessagesRef} />
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
