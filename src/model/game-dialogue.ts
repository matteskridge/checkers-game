import { getId, randomNumber } from "./utils/random";

export interface Dialogue {
  playerA: string;
  playerB: string;
}

export interface DialogueEntry {
  id: string;
  text: string;
  player: 'a' | 'b';
}

export const PlayerAOpening = 'Tesla ALWAYS moves first';
export const PlayerBOpening = 'Our new automobile is powered by clean coal';

export const OpeningDialogue = {
  playerA: PlayerAOpening,
  playerB: PlayerBOpening
};

export const AllDialogue: Dialogue[] = [
  {
    playerA: 'Vox populi, vox dei',
    playerB: 'Vox wha?',
  },
  {
    playerA: 'I\'m taking your piece private at $420 per share',
    playerB: 'I\'m calling the SEC',
  },
  {
    playerA: 'Octagon, Vegas',
    playerB: 'It\'s time to move on',
  },
  {
    playerA: 'We\'re living in a checkers-based simulation',
    playerB: 'Are you crazy?',
  },
  {
    playerA: 'Doge',
    playerB: 'Dollar',
  },
  {
    playerA: 'I\'m live-streaming this on X',
    playerB: 'I still use MySpace',
  },
  {
    playerA: 'Who holds back the electric car? Who makes Steve Gutenberg a star?',
    playerB: 'We do! We do!',
  },
  {
    playerA: 'My IQ is 150',
    playerB: 'My IQ is ... between 1 and 50',
  },
  {
    playerA: 'Checkers is humanity\'s collective consciousness',
    playerB: 'Cadillac and chevy only play chess, Jack',
  },
  {
    playerA: 'My imperative is to spread the light of consciousness to the stars',
    playerB: 'My impera-whatsit is to sell chevies',
  },
  {
    playerA: 'I call this move \"the super-charger\"',
    playerB: 'You\'re no better than a plug-in hybrid',
  },
  {
    playerA: 'Need a bailout?',
    playerB: 'I think of GM as a value stock',
  },
  {
    playerA: 'I\'m going to colonize Mars',
    playerB: 'GM already has Saturn',
  },
];


export const appendDialogue = (source: Dialogue, dialogue: DialogueEntry[]): DialogueEntry[] => {
  return [
    ...dialogue,
    {
      id: getId(),
      text: source.playerA,
      player: 'a'
    },
    {
      id: getId(),
      text: source.playerB,
      player: 'b'
    }
  ];
}

export const stepDialogue = (dialogue: DialogueEntry[]): DialogueEntry[] => {
  const randomIndex = Math.round(randomNumber() * (AllDialogue.length - 1));
  return appendDialogue(AllDialogue[randomIndex], dialogue);
}
