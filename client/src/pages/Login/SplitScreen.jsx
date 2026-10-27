import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./SplitScreen.css";

const paintings = [
  { slug: "the-return-of-the-herd", title: "The Return of the Herd", artist: "Pieter Bruegel the Elder", year: "1565" },
  { slug: "young-woman-with-a-water-pitcher", title: "Young Woman with a Water Pitcher", artist: "Johannes Vermeer", year: "about 1662" },
  { slug: "the-love-letter", title: "The Love Letter", artist: "Johannes Vermeer", year: "about 1669" },
  { slug: "wanderer-above-the-sea-of-fog", title: "Wanderer above the Sea of Fog", artist: "Caspar David Friedrich", year: "about 1818" }
];

const everyMs = 7000;
const fadeMs = 800;

function pad(number) {
  return String(number).padStart(2, "0");
}

function SplitScreen({ children, topLink, topText }) {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      return undefined;
    }
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex((old) => (old + 1) % paintings.length);
        setFading(false);
      }, fadeMs);
    }, everyMs);
    return () => clearInterval(timer);
  }, []);

  const painting = paintings[index];
  const pictureClass = "split-picture" + (fading ? " split-picture-fading" : "");

  return (
    <div className="split-screen">
      <aside className="split-left">
        <Link to="/" className="logo split-logo">
          ArtMind
        </Link>
        <div className="split-spotlight"></div>
        <div className={pictureClass}>
          <div className="split-frame">
            <img src={"/paintings/" + painting.slug + ".jpg"} alt={painting.title + " by " + painting.artist} />
          </div>
          <div className="split-label">
            <p className="split-artist">{painting.artist}</p>
            <p className="split-title">{painting.title}</p>
            <p className="split-year">{painting.year}</p>
          </div>
        </div>
        <div className="split-counter">
          <span className="split-count">
            {pad(index + 1)} <span className="split-count-total">/ {pad(paintings.length)}</span>
          </span>
          <span className="split-lines">
            {paintings.map((item, lineIndex) => (
              <span key={item.slug} className={"split-line" + (lineIndex === index ? " split-line-active" : "")}></span>
            ))}
          </span>
        </div>
      </aside>
      <section className="split-right">
        <div className="split-top">
          <Link to={topLink || "/gallery"} className="split-top-link">
            {topText || "Back to the gallery"}
          </Link>
        </div>
        <div className="split-form">{children}</div>
      </section>
    </div>
  );
}

export default SplitScreen;
