import PigmentHeap from "../../components/PigmentHeap";
import { ArrowIcon } from "../../components/Icons";
import { sureWords } from "./photoHelpers";
import "./Results.css";

function saveResult(result) {
  const lines = [
    "Most likely style: " + result.style + " (" + result.confidence + "%)",
    "Could also be: " + result.otherStyles.map((item) => item.style + " " + item.confidence + "%").join(", "),
    "Room: " + result.room,
    "Mood: " + result.mood,
    "Colours: " + result.colours.map((colour) => colour.name + " " + colour.percent + "%").join(", "),
    "Closest in the gallery: " + result.closest.map((item) => item.painting.title + " by " + item.painting.artist).join("; "),
    result.note
  ];
  const blob = new Blob([lines.join("\n") + "\n"], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "image-lab-result.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function Results({ result, onAsk }) {
  return (
    <div className="lab-results">
      <p className="result-style">Most likely style: {result.style}</p>
      <div className="result-bar-row">
        <span className="result-bar">
          <span className="result-fill" style={{ width: result.confidence + "%" }}></span>
        </span>
        <span className="result-percent">{result.confidence}%</span>
      </div>
      <p className="result-sure">{sureWords(result.confidence)}</p>
      {result.otherStyles.length > 0 && (
        <div className="result-others">
          <p className="result-others-title">Could also be:</p>
          {result.otherStyles.map((item) => (
            <div key={item.style} className="result-other">
              <span className="result-other-name">{item.style}</span>
              <span className="result-bar">
                <span className="result-fill" style={{ width: item.confidence + "%" }}></span>
              </span>
              <span className="result-percent">{item.confidence}%</span>
            </div>
          ))}
        </div>
      )}
      <dl className="result-facts">
        <div>
          <dt>Room</dt>
          <dd>{result.room}</dd>
        </div>
        <div>
          <dt>Mood</dt>
          <dd>{result.mood}</dd>
        </div>
      </dl>
      <p className="result-colours-title">Its colours</p>
      <div className="result-colours">
        {result.colours.map((colour) => (
          <PigmentHeap key={colour.name} name={colour.name} hex={colour.hex} percent={colour.percent} />
        ))}
      </div>
      <p className="result-note">{result.note}</p>
      <div className="result-buttons">
        <button type="button" className="result-button" onClick={() => saveResult(result)}>
          Save this result
        </button>
        <button type="button" className="result-button" onClick={onAsk}>
          Ask the guide about it <ArrowIcon size={14} />
        </button>
      </div>
    </div>
  );
}

export default Results;
