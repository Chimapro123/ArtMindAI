import { useState, useEffect, useRef } from "react";
import PaintingCard from "../../components/PaintingCard";
import { ChevronIcon } from "../../components/Icons";
import "./MainWall.css";

function MainWall({ paintings }) {
  const stripRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [visibleShare, setVisibleShare] = useState(1);

  function measure() {
    const strip = stripRef.current;
    if (!strip) {
      return;
    }
    const room = strip.scrollWidth - strip.clientWidth;
    setProgress(room > 0 ? strip.scrollLeft / room : 0);
    setVisibleShare(strip.scrollWidth > 0 ? strip.clientWidth / strip.scrollWidth : 1);
  }

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [paintings]);

  function slide(direction) {
    const strip = stripRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    strip.scrollBy({ left: direction * strip.clientWidth * 0.7, behavior: reducedMotion ? "auto" : "smooth" });
  }

  const thumbWidth = Math.max(8, visibleShare * 100);
  const thumbLeft = progress * (100 - thumbWidth);

  return (
    <div className="main-wall">
      <div className="wall-strip" ref={stripRef} onScroll={measure}>
        {paintings.map((painting) => (
          <div key={painting.slug} className="wall-strip-item">
            <PaintingCard painting={painting} />
          </div>
        ))}
      </div>
      <div className="wall-foot">
        <div className="wall-progress" aria-hidden="true">
          <span className="wall-progress-thumb" style={{ width: thumbWidth + "%", left: thumbLeft + "%" }}></span>
        </div>
        <div className="wall-arrows">
          <button type="button" className="wall-arrow wall-arrow-back" aria-label="Scroll back" onClick={() => slide(-1)}>
            <ChevronIcon size={18} />
          </button>
          <button type="button" className="wall-arrow wall-arrow-next" aria-label="Scroll on" onClick={() => slide(1)}>
            <ChevronIcon size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainWall;
