import { Link } from "react-router-dom";
import { HeartIcon, ArrowIcon } from "../../components/Icons";
import "./Entrance.css";

const typeNames = { chosen: "Chosen by us", "made-for-you": "Made for you", mine: "Your collection" };

function Entrance({ collection, saved, note, onStart, onSave, onShare }) {
  const countText = collection.paintingCount === 1 ? "1 painting" : collection.paintingCount + " paintings";
  const empty = collection.paintingCount === 0;

  return (
    <section className="dark-section entrance">
      <div className="container">
        <nav className="breadcrumb" aria-label="You are here">
          <Link to="/collections">Collections</Link>
          <span>/</span>
          <span className="breadcrumb-here">{collection.title}</span>
        </nav>
        <p className="small-label">{typeNames[collection.type] || "Collection"}</p>
        <h1 className="page-title">{collection.title}</h1>
        {collection.description && <p className="entrance-line">{collection.description}</p>}
        <p className="entrance-facts">
          <span>{countText}</span>
          <span>About {collection.minutes} minutes</span>
        </p>
        <div className="entrance-buttons">
          <button type="button" className="btn btn-light" onClick={onStart} disabled={empty}>
            Start the walk
          </button>
          <button type="button" className={"entrance-action" + (saved ? " entrance-action-on" : "")} onClick={onSave} disabled={saved || empty}>
            <HeartIcon size={18} />
            {saved ? "Saved" : "Save"}
          </button>
          <button type="button" className="entrance-action" onClick={onShare}>
            <ArrowIcon size={18} />
            Share
          </button>
        </div>
        {note && <p className="entrance-note">{note}</p>}
      </div>
    </section>
  );
}

export default Entrance;
