import { Link } from "react-router-dom";
import Frame from "./Frame";
import PaintingLabel from "./PaintingLabel";
import { HeartIcon, EyeIcon } from "./Icons";
import "./PaintingCard.css";

function PaintingCard({ painting, saved, onSave }) {
  const link = "/painting/" + painting.slug;
  const heartClass = "heart-button" + (saved ? " heart-saved" : "");

  function handleSave(event) {
    event.preventDefault();
    if (onSave) {
      onSave(painting);
    }
  }

  return (
    <article className="painting-card">
      <div className="card-frame">
        <Link to={link} className="card-link">
          <Frame image={painting.thumb} title={painting.title} artist={painting.artist} />
        </Link>
        <button
          type="button"
          className={heartClass}
          aria-label={saved ? "Remove from saved" : "Save this painting"}
          aria-pressed={saved}
          onClick={handleSave}
        >
          <HeartIcon size={18} />
        </button>
        <Link to={link} className="quick-look">
          <EyeIcon size={16} />
          Quick look
        </Link>
      </div>
      <Link to={link} className="card-link">
        <PaintingLabel title={painting.title} artist={painting.artist} year={painting.year} />
      </Link>
    </article>
  );
}

export default PaintingCard;
