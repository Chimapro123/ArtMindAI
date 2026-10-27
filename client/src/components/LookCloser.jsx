import { useState } from "react";
import "./LookCloser.css";

const zoom = 3;

function closeUpPosition(value) {
  const fraction = (zoom * (value / 100) - 0.5) / (zoom - 1);
  const clamped = Math.min(1, Math.max(0, fraction));
  return (clamped * 100).toFixed(1) + "%";
}

function LookCloser({ painting }) {
  const [active, setActive] = useState(0);
  const points = painting.lookCloser || [];

  if (!points.length) {
    return null;
  }

  return (
    <div className="look-closer">
      <div className="look-picture">
        <img src={painting.image} alt={painting.title + " by " + painting.artist} loading="lazy" />
        {points.map((point, index) => (
          <button
            key={index}
            type="button"
            className={"look-point" + (active === index ? " look-point-active" : "")}
            style={{ left: point.x + "%", top: point.y + "%" }}
            aria-label={point.title}
            aria-pressed={active === index}
            onClick={() => setActive(index)}
          >
            <span className="look-point-number">{index + 1}</span>
          </button>
        ))}
      </div>
      <div className="look-closeups">
        {points.map((point, index) => (
          <button
            key={index}
            type="button"
            className={"look-closeup" + (active === index ? " look-closeup-active" : "")}
            onClick={() => setActive(index)}
          >
            <span
              className="look-circle"
              style={{
                backgroundImage: "url(" + painting.image + ")",
                backgroundSize: zoom * 100 + "%",
                backgroundPosition: closeUpPosition(point.x) + " " + closeUpPosition(point.y)
              }}
            ></span>
            <span className="look-title">{point.title}</span>
            <span className="look-note">{point.note}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default LookCloser;
