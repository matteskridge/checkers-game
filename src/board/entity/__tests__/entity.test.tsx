import { render, screen } from "@testing-library/react";
import { Entity } from "../entity";
import { GameEntity } from "../../../model/game-state";

test('can render player a piece', () => {
  render(<Entity entity={GameEntity.PlayerAPiece} />);
  const elem = screen.getByTestId('checkers-entity');
  expect(elem.getAttribute('aria-label')).toEqual('Player A piece');
});

test('can render player b piece', () => {
  render(<Entity entity={GameEntity.PlayerBPiece} />);
  const elem = screen.getByTestId('checkers-entity');
  expect(elem.getAttribute('aria-label')).toEqual('Player B piece');
});

test('can render player a king', () => {
  render(<Entity entity={GameEntity.PlayerAKing} />);
  const elem = screen.getByTestId('checkers-entity');
  expect(elem.getAttribute('aria-label')).toEqual('Player A king');
});

test('can render player b king', () => {
  render(<Entity entity={GameEntity.PlayerBKing} />);
  const elem = screen.getByTestId('checkers-entity');
  expect(elem.getAttribute('aria-label')).toEqual('Player B king');
});
