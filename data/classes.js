import slideCounts from './slideCounts.json';

export const CLASSES = [
  {
    id: 1,
    title: 'Foundations of Scientific Writing',
    blurb: 'Purpose, document types, IMRAD structure',
    deckRange: [1, 56],
  },
  {
    id: 2,
    title: 'Writing Clear and Accurate Sentences',
    blurb: 'Sentence structure, voice, redundancy',
    deckRange: [57, 108],
  },
  {
    id: 3,
    title: 'Building the Introduction and Literature Review',
    blurb: 'The funnel, synthesis, gaps, hypotheses',
    deckRange: [109, 159],
  },
  {
    id: 4,
    title: 'Presenting Results and Discussion',
    blurb: 'Objective reporting, figures, citation',
    deckRange: [160, 210],
  },
  {
    id: 5,
    title: 'Editing, Peer Review, and Beyond',
    blurb: 'Self-editing, feedback, science communication',
    deckRange: [211, 263],
  },
];

export function getClass(id) {
  const numId = Number(id);
  return CLASSES.find((c) => c.id === numId) || null;
}

// Student-facing slide counts (answer slides are excluded from the student deck).
// Generated alongside data/slides.json -- regenerate both together.
export function slideCount(id) {
  return slideCounts[String(id)] || 0;
}
