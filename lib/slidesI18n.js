import ja from '../data/slides.ja.json';

// Japanese text for the slides, keyed by the English string.
// Strings with no entry (example sentences, phrases being taught, names,
// numbers) are shown in English on purpose.
const FOOT = /^(Vote|Discuss|Decide)/i;

function tr(text, lang) {
  if (lang !== 'ja' || typeof text !== 'string') return text;
  return ja[text] ?? text;
}

// Returns a copy of the slide in the student's language. Structural flags
// (quick check, footnote line) are worked out from the English original so
// the layout is the same in both languages.
export function localizeSlide(slide, lang) {
  const isCheck = slide.eyebrow === 'QUICK CHECK' || slide.eyebrow === 'ANSWER';
  const body = slide.body.map((b) => {
    const out = { ...b };
    if (b.role === 'paragraph' && FOOT.test(b.text || '')) out.foot = true;
    if (lang === 'ja') {
      if (typeof b.text === 'string') out.text = tr(b.text, lang);
      if (Array.isArray(b.items)) out.items = b.items.map((x) => tr(x, lang));
      if (Array.isArray(b.header)) out.header = b.header.map((x) => tr(x, lang));
      if (Array.isArray(b.rows)) out.rows = b.rows.map((r) => r.map((x) => tr(x, lang)));
    }
    return out;
  });
  return {
    ...slide,
    isCheck,
    eyebrow: tr(slide.eyebrow, lang),
    title: tr(slide.title, lang),
    partLabel: tr(slide.partLabel, lang),
    classLabel: tr(slide.classLabel, lang),
    body,
  };
}
