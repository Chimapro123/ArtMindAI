import { useState, useEffect } from "react";
import "./EraSlider.css";

function EraSlider({ min, max, from, to, onChange }) {
  const [low, setLow] = useState(from);
  const [high, setHigh] = useState(to);

  useEffect(() => {
    setLow(from);
    setHigh(to);
  }, [from, to]);

  const span = Math.max(1, max - min);
  const lowPercent = ((low - min) / span) * 100;
  const highPercent = ((high - min) / span) * 100;

  function commit() {
    if (low !== from || high !== to) {
      onChange(low, high);
    }
  }

  function changeLow(event) {
    setLow(Math.min(Number(event.target.value), high - 10));
  }

  function changeHigh(event) {
    setHigh(Math.max(Number(event.target.value), low + 10));
  }

  return (
    <div className="era-slider">
      <div className="era-track"></div>
      <div className="era-fill" style={{ left: lowPercent + "%", width: highPercent - lowPercent + "%" }}></div>
      <input type="range" min={min} max={max} step="10" value={low} aria-label="From year" onChange={changeLow} onPointerUp={commit} onKeyUp={commit} onBlur={commit} />
      <input type="range" min={min} max={max} step="10" value={high} aria-label="To year" onChange={changeHigh} onPointerUp={commit} onKeyUp={commit} onBlur={commit} />
      <div className="era-years">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  );
}

export default EraSlider;
