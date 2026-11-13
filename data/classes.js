import slideCounts from './slideCounts.json';

export const CLASSES = [
  {
    id: 1,
    title: 'Foundations of Scientific Writing',
    titleJa: '科学論文の基礎',
    blurb: 'Purpose, document types, IMRAD structure',
    blurbJa: '目的、文書の種類、IMRAD 構成',
    deckRange: [1, 56],
  },
  {
    id: 2,
    title: 'Writing Clear and Accurate Sentences',
    titleJa: '明快で正確な文を書く',
    blurb: 'Sentence structure, voice, redundancy',
    blurbJa: '文の構造、態、冗長さ',
    deckRange: [57, 108],
  },
  {
    id: 3,
    title: 'Building the Introduction and Literature Review',
    titleJa: '序論と文献レビューを組み立てる',
    blurb: 'The funnel, synthesis, gaps, hypotheses',
    blurbJa: '漏斗構造、統合、ギャップ、仮説',
    deckRange: [109, 159],
  },
  {
    id: 4,
    title: 'Presenting Results and Discussion',
    titleJa: '結果と考察を示す',
    blurb: 'Objective reporting, figures, citation',
    blurbJa: '客観的な報告、図表、引用',
    deckRange: [160, 210],
  },
  {
    id: 5,
    title: 'Editing, Peer Review, and Beyond',
    titleJa: '推敲、査読、そしてその先へ',
    blurb: 'Self-editing, feedback, science communication',
    blurbJa: '自己推敲、フィードバック、科学コミュニケーション',
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

// Class title / blurb in the student's interface language.
export function classTitle(c, lang) {
  return lang === 'ja' && c.titleJa ? c.titleJa : c.title;
}
export function classBlurb(c, lang) {
  return lang === 'ja' && c.blurbJa ? c.blurbJa : c.blurb;
}
