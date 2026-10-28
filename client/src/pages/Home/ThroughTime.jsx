import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./ThroughTime.css";

function ThroughTime({ stops }) {
  const boxRef = useRef(null);
  const dotRef = useRef(null);
  const [drawn, setDrawn] = useState(0);
  const [lineTop, setLineTop] = useState(0);

  useEffect(() => {
    function placeLine() {
      if (boxRef.current && dotRef.current) {
        const box = boxRef.current.getBoundingClientRect();
        const dot = dotRef.current.getBoundingClientRect();
        setLineTop(dot.top - box.top + dot.height / 2);
      }
    }
    placeLine();
    window.addEventListener("resize", placeLine);
    return () => window.removeEventListener("resize", placeLine);
  }, [stops]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setDrawn(1);
      return undefined;
    }
    function handleScroll() {
      if (!boxRef.current) {
        return;
      }
      const box = boxRef.current.getBoundingClientRect();
      const start = window.innerHeight * 0.95;
      const end = window.innerHeight * 0.35;
      const fraction = (start - box.top) / (start - end);
      setDrawn(Math.min(1, Math.max(0, fraction)));
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div className="through-time" ref={boxRef}>
      <div className="time-line" aria-hidden="true" style={{ top: lineTop + "px" }}>
        <span className="time-line-drawn" style={{ width: drawn * 100 + "%" }}></span>
      </div>
      <ol className="time-stops">
        {stops.map((stop, index) => {
          const reached = drawn * stops.length >= index + 0.5;
          return (
            <li key={stop.painting.slug} className={"time-stop" + (reached ? " time-stop-on" : "")}>
              <Link to={"/painting/" + stop.painting.slug} className="time-picture">
                <img src={stop.painting.thumb} alt={stop.painting.title + " by " + stop.painting.artist} loading="lazy" />
              </Link>
              <span className="time-dot" ref={index === 0 ? dotRef : null}></span>
              <span className="time-style">{stop.style}</span>
              <span className="time-era">{stop.era}</span>
              <span className="time-title">{stop.painting.title}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default ThroughTime;
