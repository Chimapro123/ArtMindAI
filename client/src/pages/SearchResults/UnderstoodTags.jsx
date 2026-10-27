import { CloseIcon } from "../../components/Icons";
import "./UnderstoodTags.css";

function firstCapital(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function UnderstoodTags({ parts, onRemove }) {
  return (
    <div className="understood">
      {parts.map((part, index) => (
        <span key={part.type + part.text} className="understood-tag">
          {firstCapital(part.text)}
          <button type="button" className="understood-remove" aria-label={"Search without " + part.text} onClick={() => onRemove(index)}>
            <CloseIcon size={12} />
          </button>
        </span>
      ))}
      <p className="understood-hint">Not quite right? Change any of these.</p>
    </div>
  );
}

export default UnderstoodTags;
