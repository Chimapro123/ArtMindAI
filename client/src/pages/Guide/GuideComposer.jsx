import { useState } from "react";
import { Link } from "react-router-dom";
import { CloseIcon, ImageIcon, SendIcon } from "../../components/Icons";
import "./GuideComposer.css";

const suggestions = ["Explain this style simply.", "Who painted this?", "Something like The Starry Night.", "What should I look at first?"];

function GuideComposer({ onSend, thinking, paintingTitle, hasPainting, onClearPainting }) {
  const [question, setQuestion] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onSend(question);
    setQuestion("");
  }

  return (
    <div className="guide-composer">
      {hasPainting && (
        <div className="talking-about">
          <span>
            Talking about: <strong>{paintingTitle || "..."}</strong>
          </span>
          <button type="button" className="talking-clear" aria-label="Stop talking about this painting" onClick={onClearPainting}>
            <CloseIcon size={14} />
          </button>
        </div>
      )}
      <div className="composer-suggestions">
        {suggestions.map((text) => (
          <button key={text} type="button" className="tag" onClick={() => onSend(text)} disabled={thinking}>
            {text}
          </button>
        ))}
      </div>
      <form className="composer-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="composer-input"
          placeholder="Ask about a painting, an artist or a style."
          aria-label="Ask the guide"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
        />
        <Link to="/image-lab" className="composer-image" aria-label="Check a photo in the Image Lab">
          <ImageIcon size={20} />
        </Link>
        <button type="submit" className="composer-send" aria-label="Send" disabled={thinking}>
          <SendIcon size={20} />
        </button>
      </form>
      <p className="composer-note">The guide only talks about paintings in this gallery.</p>
    </div>
  );
}

export default GuideComposer;
