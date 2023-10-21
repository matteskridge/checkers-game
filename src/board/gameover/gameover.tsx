import { useContext } from "react";
import { BoardContext } from "../board-context";
import { GameOutcome } from "../../model/game-state";
import { GameOverScreen } from "./gameover-screen";

export const GameOver = () => {
  const { state } = useContext(BoardContext);

  if (!state || !state.outcome) {
    return null;
  }

  const { outcome } = state;

  if (outcome === GameOutcome.Stalemate) {
    return (
      <GameOverScreen text='Stalemate' />
    );
  }

  if (outcome === GameOutcome.PlayerAVictory) {
    return (
      <GameOverScreen text='Victory' />
    );
  }

  if (outcome === GameOutcome.PlayerBVictory) {
    return (
      <GameOverScreen text='Defeat' />
    );
  }

  return null;
};
