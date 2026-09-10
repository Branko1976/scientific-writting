export default function ProgressBar({ value, colorClass = 'bg-mark', trackClass = 'bg-line' }) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full ${trackClass}`}>
      <div
        className={`h-full rounded-full ${colorClass} transition-[width] duration-500 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
