import { Link } from "react-router-dom";
import Frame from "../../components/Frame";
import "./RelatedArtist.css";

function reasonFor(other, era) {
  if (other.era && other.era === era) {
    return "Also painted in the " + era + " years.";
  }
  return "Another painter worth a look.";
}

function RelatedArtist({ other, era }) {
  return (
    <Link to={"/artists/" + other.slug} className="related-artist">
      <div className="related-portrait">
        <Frame image={other.portrait} title={other.name} artist="portrait" />
      </div>
      <h3 className="related-name">{other.name}</h3>
      <p className="related-line">
        {other.born} to {other.died}
      </p>
      <p className="related-line">{other.nationality}</p>
      <p className="related-reason">{reasonFor(other, era)}</p>
    </Link>
  );
}

export default RelatedArtist;
