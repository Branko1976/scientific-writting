import { hasJapanese } from '../lib/i18n';

// Small language chip shown next to a student's name on the tutor dashboard.
export function LangBadge({ lang }) {
  const ja = lang === 'ja';
  return (
    <span
      title={ja ? 'Using the Japanese interface' : 'Using the English interface'}
      data-testid="lang-badge"
      className={`ml-1.5 inline-block rounded px-1.5 py-0.5 align-middle text-[10px] font-semibold tracking-wide ${
        ja ? 'bg-mark/10 text-mark' : 'bg-line text-ink-faint'
      }`}
    >
      {ja ? 'JA' : 'EN'}
    </span>
  );
}

// "Translate to English" link, shown only when the text contains Japanese.
// Opens Google Translate in a new tab with the answer filled in.
export function TranslateLink({ text }) {
  if (!hasJapanese(text)) return null;
  const url =
    'https://translate.google.com/?sl=ja&tl=en&op=translate&text=' +
    encodeURIComponent(String(text).slice(0, 4000));
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="translate-link"
      className="mt-1 inline-block rounded border border-line px-2 py-1 text-xs font-medium text-ink-soft hover:border-ink hover:text-ink"
    >
      Translate to English &#8599;
    </a>
  );
}
