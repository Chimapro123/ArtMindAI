import { Link } from "react-router-dom";
import Frame from "../../components/Frame";
import { SearchIcon } from "../../components/Icons";
import "./ArtistsTop.css";

const eras = ["Gothic", "Renaissance", "Northern Renaissance", "Baroque", "Romanticism", "Realism", "Impressionism", "Post Impressionism", "Ukiyo-e", "Modern"];
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function ArtistsTop({ search, onSearch, era, onEra, letter, onLetter, spotlight }) {
  const cover = spotlight && spotlight.paintings ? spotlight.paintings[0] : null;

  return (
    <section className="dark-section artists-top">
      <div className="container artists-top-inner">
        <div>
          <p className="small-label">The artists</p>
          <h1 className="page-title">The people behind the paintings</h1>
          <p className="artists-line">
            Painters from seven centuries, from Siena in the 1300s to Munich in the 1900s. Pick one and see everything of theirs we have.
          </p>
          <label className="artists-search">
            <SearchIcon size={18} />
            <input
              type="text"
              className="artists-search-input"
              placeholder="Find an artist by name."
              aria-label="Find an artist by name"
              value={search}
              onChange={(event) => onSearch(event.target.value)}
            />
          </label>
          <div className="era-tabs">
            <button type="button" className={"era-tab" + (era === "" ? " era-tab-active" : "")} onClick={() => onEra("")}>
              All
            </button>
            {eras.map((name) => (
              <button key={name} type="button" className={"era-tab" + (era === name ? " era-tab-active" : "")} onClick={() => onEra(name)}>
                {name}
              </button>
            ))}
          </div>
          <div className="letter-row" aria-label="Filter by surname">
            {letters.map((item) => (
              <button
                key={item}
                type="button"
                className={"letter-button" + (letter === item ? " letter-active" : "")}
                aria-pressed={letter === item}
                onClick={() => onLetter(letter === item ? "" : item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        {cover && (
          <div className="artists-cover">
            <div className="artists-glow"></div>
            <Link to={"/painting/" + cover.slug} className="artists-cover-frame">
              <Frame image={cover.image} title={cover.title} artist={cover.artist} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default ArtistsTop;
