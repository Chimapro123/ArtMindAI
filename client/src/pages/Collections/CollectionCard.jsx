import { Link } from "react-router-dom";
import Frame from "../../components/Frame";
import { ArrowIcon } from "../../components/Icons";
import "./CollectionCard.css";

const typeNames = {
  chosen: "Chosen by us",
  "made-for-you": "Made for you",
  mine: "Yours"
};

function CollectionCard({ collection }) {
  const lead = collection.leadPainting;
  const countText = collection.paintingCount === 1 ? "1 painting" : collection.paintingCount + " paintings";

  return (
    <Link to={"/collections/" + collection.slug} className="collection-card">
      <div className="collection-cover">
        {lead ? (
          <Frame image={lead.thumb} title={lead.title} artist={lead.artist} />
        ) : (
          <div className="collection-empty-cover">Nothing hung yet</div>
        )}
      </div>
      <h3 className="collection-title">{collection.title}</h3>
      {collection.description && <p className="collection-line">{collection.description}</p>}
      <p className="collection-count">{countText}</p>
      <div className="collection-foot">
        <span className={"collection-type" + (collection.type === "chosen" ? "" : " collection-type-you")}>{typeNames[collection.type] || "Collection"}</span>
        <span className="text-link collection-open">
          Open <ArrowIcon size={14} />
        </span>
      </div>
    </Link>
  );
}

export default CollectionCard;
