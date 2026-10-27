import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Frame from "../../components/Frame";
import { SearchIcon, ArrowIcon } from "../../components/Icons";
import "./HomeHero.css";

function HomeHero({ painting, onAsk }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      return undefined;
    }
    function handleScroll() {
      setZoom(1 + Math.min(window.scrollY, 600) / 6000);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleSearch(event) {
    event.preventDefault();
    const sentence = search.trim();
    if (sentence) {
      navigate("/search?q=" + encodeURIComponent(sentence));
    }
  }

  return (
    <section className="dark-section hero">
      <div className="container hero-inner">
        <div className="hero-words">
          <p className="small-label">Open every day, from anywhere</p>
          <h1 className="hero-title">Come in. Take your time.</h1>
          <p className="hero-line">Six rooms of famous paintings, a guide who loves questions, and a gallery that gets to know you a little better every visit.</p>
          <div className="hero-buttons">
            <Link to="/gallery" className="btn btn-light">
              Walk into the gallery
            </Link>
            <button type="button" className="text-link" onClick={onAsk}>
              Ask the guide <ArrowIcon size={16} />
            </button>
          </div>
          <form className="hero-search" onSubmit={handleSearch} role="search">
            <SearchIcon size={18} />
            <input
              type="text"
              className="hero-search-input"
              placeholder="Tell us what you'd like to see, like a stormy sea at sunset."
              aria-label="Search the gallery"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </form>
        </div>
        {painting && (
          <div className="hero-picture">
            <div className="hero-spotlight"></div>
            <Link to={"/painting/" + painting.slug} className="hero-frame" style={{ transform: "scale(" + zoom + ")" }}>
              <Frame image={painting.image} title={painting.title} artist={painting.artist} />
            </Link>
            <div className="hero-label">
              <p className="small-label">{painting.artist}</p>
              <p className="hero-label-title">{painting.title}</p>
              <p className="hero-label-line">{painting.year}</p>
              {painting.medium && <p className="hero-label-line">{painting.medium.toLowerCase()} on {(painting.surface || "canvas").toLowerCase()}</p>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default HomeHero;
