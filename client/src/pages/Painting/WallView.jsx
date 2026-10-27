import { useState, useEffect } from "react";
import { CloseIcon } from "../../components/Icons";
import "./WallView.css";

const personCm = 170;

function workOutScale(painting) {
  const roomWidth = window.innerWidth - 80;
  const roomHeight = window.innerHeight - 220;
  const neededWidth = painting.widthCm + 90;
  const neededHeight = Math.max(painting.heightCm, personCm);
  return Math.min(2.4, roomWidth / neededWidth, roomHeight / neededHeight);
}

function WallView({ painting, onClose }) {
  const [scale, setScale] = useState(() => workOutScale(painting));

  useEffect(() => {
    function handleKey(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    function handleResize() {
      setScale(workOutScale(painting));
    }
    document.addEventListener("keydown", handleKey);
    window.addEventListener("resize", handleResize);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "";
    };
  }, [onClose, painting]);

  const frameStyle = { width: painting.widthCm * scale + "px", height: painting.heightCm * scale + "px" };
  const personStyle = { height: personCm * scale + "px" };
  const metres = (painting.widthCm / 100).toFixed(2).replace(/0+$/, "").replace(/\.$/, "");

  return (
    <div className="wall-view" role="dialog" aria-modal="true" aria-label={painting.title + " on a wall"}>
      <div className="wall-top">
        <p className="wall-title">
          {painting.title} is {painting.widthCm} by {painting.heightCm} cm, about {metres} metres wide.
        </p>
        <button type="button" className="icon-button wall-close" aria-label="Close" onClick={onClose}>
          <CloseIcon size={22} />
        </button>
      </div>
      <div className="wall-room">
        <div className="wall-frame" style={frameStyle}>
          <img src={painting.image} alt={painting.title + " by " + painting.artist} />
        </div>
        <svg className="wall-person" style={personStyle} viewBox="0 0 60 170" aria-label="A person 1.7 metres tall">
          <circle cx="30" cy="16" r="12" />
          <path d="M30 28 L30 100 M30 48 L8 80 M30 48 L52 80 M30 100 L14 165 M30 100 L46 165" />
        </svg>
      </div>
      <p className="wall-note">The outline is a person 1.7 metres tall, so you can see how big it really is.</p>
    </div>
  );
}

export default WallView;
