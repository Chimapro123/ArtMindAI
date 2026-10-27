import "./StrengthLine.css";

export function passwordScore(password) {
  const text = password || "";
  let score = 0;
  if (text.length >= 8) {
    score += 1;
  }
  if (/[0-9]/.test(text)) {
    score += 1;
  }
  if (/[^A-Za-z0-9]/.test(text)) {
    score += 1;
  }
  if (text.length >= 12 && /[a-z]/.test(text) && /[A-Z]/.test(text)) {
    score += 1;
  }
  return score;
}

export function passwordOk(password) {
  const text = password || "";
  return text.length >= 8 && (/[0-9]/.test(text) || /[^A-Za-z0-9]/.test(text));
}

const hints = ["Use at least 8 characters, with a number or a symbol.", "Nearly there. Add a number or a symbol.", "Strong enough.", "Good and strong.", "Very strong."];

function StrengthLine({ password, parts }) {
  const score = passwordScore(password);
  const total = parts || 4;
  const shown = Math.min(total, score);
  let hint = hints[0];
  if (password && passwordOk(password)) {
    hint = hints[Math.max(2, Math.min(4, score))];
  } else if (password) {
    hint = hints[Math.min(1, score)];
  }

  return (
    <div className="strength">
      <div className="strength-line" aria-hidden="true">
        {Array.from({ length: total }).map((item, index) => (
          <span key={index} className={"strength-part" + (index < shown ? " strength-part-on" : "")}></span>
        ))}
      </div>
      <p className="strength-hint">{hint}</p>
    </div>
  );
}

export default StrengthLine;
