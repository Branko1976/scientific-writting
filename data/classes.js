export const CLASSES = [
  {
    id: 1,
    title: 'Foundations of Scientific Writing',
    blurb: 'Purpose, document types, IMRAD structure',
    range: [1, 56],
  },
  {
    id: 2,
    title: 'Writing Clear and Accurate Sentences',
    blurb: 'Sentence structure, voice, redundancy',
    range: [57, 108],
  },
  {
    id: 3,
    title: 'Building the Introduction and Literature Review',
    blurb: 'The funnel, synthesis, gaps, hypotheses',
    range: [109, 159],
  },
  {
    id: 4,
    title: 'Presenting Results and Discussion',
    blurb: 'Objective reporting, figures, citation',
    range: [160, 210],
  },
  {
    id: 5,
    title: 'Editing, Peer Review, and Beyond',
    blurb: 'Self-editing, feedback, science communication',
    range: [211, 263],
  },
];

export function getClass(id) {
  const numId = Number(id);
  return CLASSES.find((c) => c.id === numId) || null;
}

export function slideCount(id) {
  const c = getClass(id);
  if (!c) return 0;
  return c.range[1] - c.range[0] + 1;
}
