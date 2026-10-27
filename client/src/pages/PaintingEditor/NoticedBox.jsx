import PigmentHeap from "../../components/PigmentHeap";
import { CloseIcon } from "../../components/Icons";
import "./NoticedBox.css";

function NoticedBox({ noticed, onKeep, onRemoveTag }) {
  return (
    <div className="noticed-box">
      <h2 className="noticed-title">What we noticed:</h2>
      <p className="noticed-label">Style:</p>
      <p className="noticed-value">{noticed.style}</p>
      <p className="noticed-label">Room:</p>
      <p className="noticed-value">{noticed.room}</p>
      <p className="noticed-label">Colours:</p>
      <div className="noticed-colours">
        {noticed.colours.map((colour) => (
          <PigmentHeap key={colour.name} name={colour.name} hex={colour.hex} />
        ))}
      </div>
      <p className="noticed-label">Labels:</p>
      <div className="noticed-tags">
        {noticed.tags.map((tag) => (
          <span key={tag} className="noticed-tag">
            {tag}
            <button type="button" className="noticed-tag-remove" aria-label={"Drop " + tag} onClick={() => onRemoveTag(tag)}>
              <CloseIcon size={12} />
            </button>
          </span>
        ))}
        {noticed.tags.length === 0 && <span className="noticed-none">No labels left.</span>}
      </div>
      <button type="button" className="text-link noticed-keep" onClick={onKeep}>
        Keep all of these
      </button>
    </div>
  );
}

export default NoticedBox;
