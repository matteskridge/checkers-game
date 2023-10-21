import { GameEntity } from "../../model/game-state";
import './entity.css';

export const EntityClasses = {
  [GameEntity.None]: 'checkers-entity-none',
  [GameEntity.PlayerAPiece]: 'checkers-entity-piece checkers-entity-playera',
  [GameEntity.PlayerBPiece]: 'checkers-entity-piece checkers-entity-playerb',
  [GameEntity.PlayerAKing]: 'checkers-entity-king checkers-entity-playera',
  [GameEntity.PlayerBKing]: 'checkers-entity-king checkers-entity-playerb',
};

export const EntityDescriptions = {
  [GameEntity.None]: 'Empty square',
  [GameEntity.PlayerAPiece]: 'Player A piece',
  [GameEntity.PlayerBPiece]: 'Player B piece',
  [GameEntity.PlayerAKing]: 'Player A king',
  [GameEntity.PlayerBKing]: 'Player B king',
};

export interface EntityProps {
  entity: GameEntity;
}

export const Entity = ({ entity }: EntityProps) => {
  const classes = EntityClasses[entity];
  const description = EntityDescriptions[entity];
  return (
    <div className={`checkers-entity ${classes}`} aria-label={description} data-testid='checkers-entity'></div>
  );
};
