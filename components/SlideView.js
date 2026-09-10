const ACCENT_TEXT = {
  1: 'text-class-1',
  2: 'text-class-2',
  3: 'text-class-3',
  4: 'text-class-4',
  5: 'text-class-5',
};
const ACCENT_BG_SOFT = {
  1: 'bg-classSoft-1',
  2: 'bg-classSoft-2',
  3: 'bg-classSoft-3',
  4: 'bg-classSoft-4',
  5: 'bg-classSoft-5',
};

const LETTERS = ['A', 'B', 'C', 'D'];

function Eyebrow({ children, classId }) {
  if (!children) return null;
  return (
    <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${ACCENT_TEXT[classId]}`}>
      {children}
    </p>
  );
}

function Bullets({ items }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-[17px] leading-relaxed text-ink">
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-faint" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Table({ header, rows, classId }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-line">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className={ACCENT_BG_SOFT[classId]}>
            {header.map((h, i) => (
              <th key={i} className="px-4 py-2.5 font-semibold text-ink">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 ? 'bg-card' : 'bg-paper/60'}>
              {row.map((cell, ci) => (
                <td key={ci} className="border-t border-line px-4 py-2.5 align-top text-ink-soft">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Quick Check / Answer slides: paragraphs are option text (up to 4), plus an
// optional trailing instruction ("Vote with...") or explanation ("Correct answer: ...").
function CheckOptions({ body, isAnswer }) {
  const paras = body.filter((b) => b.role === 'paragraph').map((b) => b.text);
  const correctMatch = paras.find((p) => /^Correct answer:/i.test(p));
  const options = paras.filter((p) => p !== correctMatch && !/^(Vote|Discuss|Decide)/i.test(p)).slice(0, 4);
  const footNote = paras.find((p) => /^(Vote|Discuss|Decide)/i.test(p));
  const correctLetter = correctMatch ? correctMatch.match(/Correct answer:\s*([A-D])/i)?.[1] : null;

  return (
    <div className="mt-5 space-y-2.5">
      {options.map((opt, i) => {
        const letter = LETTERS[i];
        const isCorrect = isAnswer && letter === correctLetter;
        return (
          <div
            key={i}
            className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-[15px] leading-relaxed ${
              isCorrect ? 'border-mark/40 bg-mark/[0.05] text-ink' : 'border-line text-ink-soft'
            }`}
          >
            <span
              className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                isCorrect ? 'bg-mark text-white' : 'bg-paper text-ink-faint'
              }`}
            >
              {letter}
            </span>
            <span className={isCorrect ? 'font-medium' : ''}>{opt}</span>
          </div>
        );
      })}
      {footNote && <p className="pt-1 text-sm italic text-ink-faint">{footNote}</p>}
      {correctMatch && (
        <div className="mt-3 rounded-lg border border-mark/30 bg-mark/[0.04] px-4 py-3 text-[15px] leading-relaxed text-ink">
          {correctMatch}
        </div>
      )}
    </div>
  );
}

function BodyBlock({ block, classId }) {
  if (block.role === 'bullets') return <Bullets items={block.items} />;
  if (block.role === 'table') return <Table header={block.header} rows={block.rows} classId={classId} />;
  if (block.role === 'subheading')
    return <h3 className="mt-5 font-serif text-lg font-semibold text-ink first:mt-0">{block.text}</h3>;
  return <p className="mt-3 text-[17px] leading-relaxed text-ink-soft first:mt-0">{block.text}</p>;
}

export default function SlideView({ slide, classId }) {
  if (slide.kind === 'divider') {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 py-16 text-center">
        <p className={`text-sm font-semibold uppercase tracking-[0.18em] ${ACCENT_TEXT[classId]}`}>
          {slide.partLabel}
        </p>
        <h2 className="mt-4 max-w-lg font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          {slide.title}
        </h2>
      </div>
    );
  }

  if (slide.kind === 'class-cover') {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 py-16 text-center">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${ACCENT_BG_SOFT[classId]} ${ACCENT_TEXT[classId]}`}
        >
          {slide.classLabel}
        </span>
        <h2 className="mt-5 max-w-xl font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          {slide.title}
        </h2>
        {slide.body.map((b, i) => (
          <p key={i} className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-faint">
            {b.text}
          </p>
        ))}
      </div>
    );
  }

  if (slide.kind === 'title') {
    const badge = slide.body.find((b) => b.role === 'subheading');
    const rest = slide.body.filter((b) => b.role !== 'subheading');
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 py-16 text-center">
        {badge && (
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
            {badge.text}
          </p>
        )}
        <h1 className="mt-4 max-w-2xl font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          {slide.title}
        </h1>
        {rest.map((b, i) => (
          <p
            key={i}
            className={`mt-3 max-w-md text-ink-soft ${i === 0 ? 'text-lg' : 'text-sm text-ink-faint'}`}
          >
            {b.text}
          </p>
        ))}
      </div>
    );
  }

  const isCheck = slide.eyebrow === 'QUICK CHECK' || slide.eyebrow === 'ANSWER';

  return (
    <div className="px-6 py-10 sm:px-10 sm:py-12">
      <Eyebrow classId={classId}>{slide.eyebrow}</Eyebrow>
      <h2 className="mt-2 font-serif text-2xl font-semibold leading-snug text-ink sm:text-[28px]">
        {slide.title}
      </h2>
      {isCheck ? (
        <CheckOptions body={slide.body} isAnswer={slide.eyebrow === 'ANSWER'} />
      ) : (
        <div>
          {slide.body.map((block, i) => (
            <BodyBlock key={i} block={block} classId={classId} />
          ))}
        </div>
      )}
    </div>
  );
}
