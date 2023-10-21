
export interface CheckersGame {
  boardWidth: number;
  boardBreadth: number;
  playOn: 'startsEven' | 'startsOdd';
  forceCaptureMove: boolean;
  armySizeInRowsPlayerA: number;
  armySizeInRowsPlayerB: number;
  playerATop: boolean;
  shadePlayable: boolean;
}

export const StandardGame: CheckersGame = {
  boardWidth: 8,
  boardBreadth: 8,
  playOn: 'startsOdd',
  forceCaptureMove: true,
  armySizeInRowsPlayerA: 3,
  armySizeInRowsPlayerB: 3,
  playerATop: true,
  shadePlayable: true
};
