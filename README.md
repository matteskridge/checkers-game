# Checkers

![docs/docs1.png](Screenshot of checkers app)

This app implements a complete checkers game on desktop and mobile

## Live Demo

The app can be accessed live at: https://checkers.matteskridge.com

## Running Locally

The app can be run locally with:

```sh
npm i
npm start
```

## Feature List

* Basic game mechanics
  * Taking turns
  * Basic moves
  * Jump over enemy checkers
* Advanced game mechanics
  * Multiple jumps in one turn
  * Kings
* Drag-n-drop checkers using a mouse
  * Additional ways to control the game (on mobile): tap a checker, then the square to move to
* On mouse over checker, highlight cells where a checker can possibly move to
* If there is an opportunity to capture an enemy checker - it is the only valid move
* No-brain AI player: makes a random move to any valid cell
* App is stable across major browsers
* Undo button to revert last move
* Start over button to clear state
* Victory / defeat banner

Implementation details:

* Implemented in Typescript
* Includes some unit tests

## Unit Tests

The following tests are included in this project:

* `src/model/__tests__/game-dialogue.test.ts`
* `src/model/__tests__/game-move.test.ts`
* `src/model/__tests__/game-state.test.ts`
* `src/model/__tests__/game-util.test.ts`
* `src/model/__tests__/game-util.test.ts`
* `src/board/entity/__tests__/entity.test.ts`

These are included more as an example than to provide comprehensive coverage, due to time constraints.

Tests can be run with:

`npm run test`
