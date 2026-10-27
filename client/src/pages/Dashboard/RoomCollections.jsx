import { Link } from "react-router-dom";
import Frame from "../../components/Frame";
import "./RoomCollections.css";

const typeNames = { chosen: "Chosen by us", "made-for-you": "Made for you", mine: "Yours" };

function RoomCollections({ collections }) {
  return (
    <div className="room-collections">
      {collections.map((collection) => (
        <Link key={collection.slug} to={"/collections/" + collection.slug} className="room-collection">
          <div className="room-collection-cover">
            {collection.leadPainting ? (
              <Frame image={collection.leadPainting.thumb} title={collection.leadPainting.title} artist={collection.leadPainting.artist} />
            ) : (
              <div className="room-collection-empty">Nothing hung yet</div>
            )}
          </div>
          <span className="room-collection-type">{typeNames[collection.type] || "Collection"}</span>
          <p className="room-collection-title">{collection.title}</p>
          <p className="room-collection-count">{collection.paintingCount} paintings</p>
        </Link>
      ))}
      <Link to="/collections" className="room-collection-new">
        Start a new one
      </Link>
    </div>
  );
}

export default RoomCollections;
