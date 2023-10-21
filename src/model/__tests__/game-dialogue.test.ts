import * as _ from 'lodash';
import { AllDialogue, DialogueEntry, appendDialogue, stepDialogue } from "../game-dialogue";

const MOCK_UUID = 'EXAMPLE-UUID';

const STARTING_DIALOGUE: DialogueEntry[] = [
  {
    id: MOCK_UUID,
    text: 'Hello',
    player: 'a'
  },
  {
    id: MOCK_UUID,
    text: 'World',
    player: 'b'
  }
];

const MOCK_RANDOM = 0.2;

jest.mock('../utils/random', () => ({
  randomNumber: () => MOCK_RANDOM,
  getId: () => MOCK_UUID
}));

test('can append dialogue to existing list', () => {
  const toAppend = AllDialogue[0];
  expect(appendDialogue(toAppend, STARTING_DIALOGUE)).toEqual([
    ...STARTING_DIALOGUE,
    {
      id: MOCK_UUID,
      text: toAppend.playerA,
      player: 'a'
    },
    {
      id: MOCK_UUID,
      text: toAppend.playerB,
      player: 'b'
    },
  ]);
});

test('can randomly select new dialog', () => {
  // Verify
  expect(stepDialogue(STARTING_DIALOGUE)).toEqual([
    ...STARTING_DIALOGUE,
    {
      id: MOCK_UUID,
      text: AllDialogue[2].playerA,
      player: 'a'
    },
    {
      id: MOCK_UUID,
      text: AllDialogue[2].playerB,
      player: 'b'
    },
  ]);
});
