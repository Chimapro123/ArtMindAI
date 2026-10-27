import "./ResetStep.css";

function ResetStep({ number, title, done, open, summary, last, children }) {
  const circleClass = "step-circle" + (open ? " step-circle-open" : "") + (done ? " step-circle-done" : "");
  const stepClass = "reset-step" + (last ? " reset-step-last" : "") + (open || done ? "" : " reset-step-waiting");

  return (
    <div className={stepClass}>
      <div className="step-side">
        <span className={circleClass}>{number}</span>
        {!last && <span className="step-line"></span>}
      </div>
      <div className="step-body">
        <div className="step-head">
          <h2 className="step-title">{title}</h2>
          {done && (
            <span className="step-check" aria-label="Done">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12l5 5 9-10" />
              </svg>
            </span>
          )}
        </div>
        {done && summary && <div className="step-summary">{summary}</div>}
        {open && !done && <div className="step-form">{children}</div>}
      </div>
    </div>
  );
}

export default ResetStep;
