import { Link } from "react-router-dom";
import Frame from "../../components/Frame";
import "./ArtistCard.css";

function ArtistCard({ artist }) {
  const countText = artist.paintingCount === 1 ? "1 painting" : artist.paintingCount + " paintings";

  return (
    <Link to={"/artists/" + artist.slug} className="artist-card">
      <div className="artist-portrait">
        <Frame image={artist.portrait} title={artist.name} artist="portrait" />
      </div>
      <h3 className="artist-name">{artist.name}</h3>
      <p className="artist-line">
        {artist.born} to {artist.died}
      </p>
      <p className="artist-line">{artist.nationality}</p>
      <p className="artist-line">{countText}</p>
    </Link>
  );
}

export default ArtistCard;
