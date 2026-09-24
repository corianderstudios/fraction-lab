import { SECTIONS, TRACKED_SECTIONS } from "../data/sections.js";
import { useProgress } from "../context/ProgressContext.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";
import FractionBar from "../components/FractionBar.jsx";
import { CheckIcon } from "../components/Icons.jsx";

const STATUS_LABEL = {
  complete: "Complete",
  "in-progress": "In progress",
  "not-started": "Not started",
};

function StatusBadge({ status }) {
  const tone =
    status === "complete"
      ? "bg-good-soft text-good"
      : status === "in-progress"
        ? "bg-progress/50 text-ink"
        : "bg-canvas text-muted border border-line";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-bold ${tone}`}
    >
      {status === "complete" && <CheckIcon className="h-4 w-4" />}
      {STATUS_LABEL[status]}
    </span>
  );
}

export default function HomePage() {
  const { getStatus } = useProgress();
  const doneCount = TRACKED_SECTIONS.filter(
    (s) => getStatus(s.id) === "complete",
  ).length;
  const nextUp =
    TRACKED_SECTIONS.find((s) => getStatus(s.id) !== "complete") ??
    TRACKED_SECTIONS[0];
  const started = TRACKED_SECTIONS.some(
    (s) => getStatus(s.id) !== "not-started",
  );

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-5 sm:px-6">
      <Breadcrumb items={[{ label: "Home" }]} />

      <div className="mt-8 grid items-center gap-10 md:grid-cols-[1.2fr_1fr]">
        <div>
          <h1
            id="page-title"
            tabIndex={-1}
            className="text-4xl font-semibold leading-tight focus:outline-none sm:text-5xl"
          >
            Fractions, one piece at a time
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted">
            Learn how fractions work, then add, subtract, multiply and divide
            them. Every lesson has a plain explanation, worked examples and a
            playground. When you are ready, test yourself with games that adjust
            to how you are doing.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href={`#${nextUp.path}`} className="btn-primary">
              {started ? `Continue: ${nextUp.title}` : "Start with the basics"}
            </a>
            <a href="#/games" className="btn-secondary">
              Go to the games
            </a>
          </div>
        </div>

        <div className="panel p-5" aria-hidden="true">
          <p className="font-serif text-lg">1/2 = 2/4 = 4/8</p>
          <div className="mt-3 space-y-2">
            <FractionBar value={{ n: 1, d: 2 }} />
            <FractionBar value={{ n: 2, d: 4 }} />
            <FractionBar value={{ n: 4, d: 8 }} />
          </div>
          <p className="mt-3 text-sm text-muted">
            Different pieces, same amount.
          </p>
        </div>
      </div>

      <section aria-labelledby="path-heading" className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="path-heading" className="text-2xl font-semibold">
            Your learning path
          </h2>
          <p className="text-muted">
            {doneCount} of {TRACKED_SECTIONS.length} sections complete
          </p>
        </div>
        <div
          role="progressbar"
          aria-label="Sections complete"
          aria-valuemin={0}
          aria-valuemax={TRACKED_SECTIONS.length}
          aria-valuenow={doneCount}
          className="mt-3 h-2.5 overflow-hidden rounded-full bg-line/70"
        >
          <div
            className="h-full rounded-full bg-good transition-all"
            style={{ width: `${(doneCount / TRACKED_SECTIONS.length) * 100}%` }}
          />
        </div>

        <ol className="mt-6 grid gap-4 sm:grid-cols-2">
          {TRACKED_SECTIONS.map((s, i) => {
            const status = getStatus(s.id);
            return (
              <li
                key={s.id}
                className={`panel p-5 ${status === "in-progress" ? "ring-2 ring-progress" : ""}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="flex items-center gap-2 text-xl font-semibold">
                    {status === "complete" && (
                      <CheckIcon className="h-5 w-5 shrink-0 text-good" />
                    )}
                    <a
                      href={`#${s.path}`}
                      className="underline decoration-line decoration-2 underline-offset-4 hover:decoration-accent"
                    >
                      <span className="sr-only">{`Step ${i + 1}: `}</span>
                      {s.title}
                    </a>
                  </h3>
                  <StatusBadge status={status} />
                </div>
                <p className="mt-2 text-muted">{s.blurb}</p>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
