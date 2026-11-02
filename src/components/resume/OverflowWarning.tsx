interface OverflowWarningProps {
  usedPx: number;
  availablePx: number;
  overflowCount: number;
}

/** Page-full indicator. Turns into a red warning when content runs past one page. */
export function OverflowWarning({ usedPx, availablePx, overflowCount }: OverflowWarningProps) {
  const percent = availablePx > 0 ? Math.round((usedPx / availablePx) * 100) : 0;
  const over = percent > 100;

  return (
    <div
      role={over ? "alert" : "status"}
      className={[
        "flex items-center gap-4 border-b px-6 py-2 text-sm print:hidden",
        over ? "border-red-200 bg-red-50 text-red-800" : "border-neutral-300 bg-neutral-100 text-neutral-600",
      ].join(" ")}
    >
      <div className="h-2 w-40 shrink-0 overflow-hidden rounded-full bg-neutral-300">
        <div
          className={`h-full rounded-full ${over ? "bg-red-500" : percent > 90 ? "bg-amber-500" : "bg-emerald-500"}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      {over ? (
        <span>
          <strong>Over one page ({percent}%).</strong>{" "}
          {overflowCount > 0
            ? `${overflowCount} highlighted ${overflowCount === 1 ? "entry doesn't" : "entries don't"} fit. `
            : ""}
          Remove an entry or shorten bullets. Fonts and margins are never shrunk automatically.
        </span>
      ) : (
        <span>Page {percent}% full</span>
      )}
    </div>
  );
}
