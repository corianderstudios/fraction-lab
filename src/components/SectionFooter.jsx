import { useState } from "react";
import { useProgress } from "../context/ProgressContext.jsx";
import { getNextSection, getSection } from "../data/sections.js";
import { CheckIcon } from "./Icons.jsx";

/**
 * Progress controls for a section:
 * - "Mark as in progress" toggle (the only way a section becomes "in progress")
 * - "Mark section complete" toggle
 * - link to the next section
 */
export default function SectionFooter({ sectionId, sticky = false }) {
  const { getStatus, toggleComplete, toggleInProgress } = useProgress();
  const [announcement, setAnnouncement] = useState("");
  const section = getSection(sectionId);
  const next = getNextSection(sectionId);
  const status = getStatus(sectionId);
  const complete = status === "complete";
  const inProgress = status === "in-progress";

  function handleInProgress() {
    toggleInProgress(sectionId);
    setAnnouncement(
      inProgress
        ? `${section.title} is no longer in progress.`
        : `${section.title} marked as in progress.`,
    );
  }

  function handleComplete() {
    toggleComplete(sectionId);
    setAnnouncement(
      complete
        ? `${section.title} marked as not complete.`
        : `${section.title} marked complete.`,
    );
  }

  const showProgressButtons = sectionId !== "glossary" && !complete;

  return (
    <div
      className={`shrink-0 border-t border-line bg-surface ${sticky ? "" : "mt-10"}`}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {showProgressButtons && (
          <div className="flex flex-wrap gap-2">
            {!complete && (
              <button
                type="button"
                onClick={handleInProgress}
                className={
                  inProgress
                    ? "btn border border-slice/60 bg-progress/50 text-ink hover:bg-progress/70"
                    : "btn-secondary"
                }
              >
                {inProgress ? (
                  <>
                    <span>In progress</span>
                    <span className="sr-only"> (select to clear)</span>
                  </>
                ) : (
                  "Mark as in progress"
                )}
              </button>
            )}
            <button
              type="button"
              onClick={handleComplete}
              className={complete ? "btn-done" : "btn-secondary"}
            >
              {complete ? (
                <>
                  <CheckIcon className="h-5 w-5" />
                  <span>Section complete</span>
                  <span className="sr-only">
                    {" "}
                    (select to mark as not complete)
                  </span>
                </>
              ) : (
                "Mark section complete"
              )}
            </button>
          </div>
        )}
        <p role="status" className="sr-only">
          {announcement}
        </p>
        {next ? (
          <a href={`#${next.path}`} className="btn-primary">
            Next: {next.title}
          </a>
        ) : (
          <a href="#/" className="btn-primary">
            Back to home
          </a>
        )}
      </div>
    </div>
  );
}
