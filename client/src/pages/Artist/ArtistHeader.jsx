import { Link } from "react-router-dom";
import Frame from "../../components/Frame";
import { ArrowIcon } from "../../components/Icons";
import "./ArtistHeader.css";

function ArtistHeader({ artist, mostViewed, onAsk }) {
  const countText = artist.paintingCount === 1 ? "1 painting here." : artist.paintingCount + " paintings here.";

  return (
    <section className="dark-section artist-header">
      <div className="container">
        <nav className="breadcrumb" aria-label="You are here">
          <Link to="/artists">Artists</Link>
          <span>/</span>
          <span className="breadcrumb-here">{artist.name}</span>
        </nav>
        <div className="artist-header-inner">
          <div className="artist-portrait-column">
            <div className="artist-glow"></div>
            <div className="artist-portrait-frame">
              <Frame image={artist.portrait} title={artist.name} artist="portrait" />
            </div>
          </div>
          <div className="artist-words">
            <p className="small-label">{artist.era}</p>
            <h1 className="artist-title">{artist.name}</h1>
            <p className="artist-years">
              {artist.nationality}, {artist.born} to {artist.died}
            </p>
            {artist.about && <p className="artist-about">{artist.about}</p>}
            <div className="artist-facts">
              <p className="artist-fact">{countText}</p>
              {mostViewed && (
                <p className="artist-fact">
                  Most looked at:
                  <br />
                  <Link to={"/painting/" + mostViewed.slug} className="artist-fact-link">
                    {mostViewed.title}.
                  </Link>
                </p>
              )}
            </div>
            <button type="button" className="text-link" onClick={onAsk}>
              Ask the guide about {artist.name} <ArrowIcon size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ArtistHeader;
