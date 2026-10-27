import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Frame from "../../components/Frame";
import { SearchIcon, ImageIcon, ExpandIcon, ArrowIcon } from "../../components/Icons";
import PaintingActions from "./PaintingActions";
import ZoomView from "./ZoomView";
import WallView from "./WallView";
import "./ViewingRoom.css";

function sizeLine(painting) {
  if (!painting.medium) {
    return "";
  }
  let line = painting.medium + " on " + (painting.surface || "canvas").toLowerCase();
  if (painting.widthCm && painting.heightCm) {
    line += ", " + painting.widthCm + " x " + painting.heightCm + " cm";
  }
  return line;
}

function ViewingRoom({ painting, saved, onAsk }) {
  const [zoomOpen, setZoomOpen] = useState(false);
  const [wallOpen, setWallOpen] = useState(false);
  const pictureRef = useRef(null);
  const hasSize = Boolean(painting.widthCm && painting.heightCm);

  function goFullScreen() {
    const picture = pictureRef.current;
    if (picture && picture.requestFullscreen) {
      picture.requestFullscreen().catch(() => setZoomOpen(true));
    } else {
      setZoomOpen(true);
    }
  }

  return (
    <section className="dark-section viewing-room">
      <div className="container">
        <nav className="breadcrumb" aria-label="You are here">
          <Link to="/gallery">Gallery</Link>
          <span>/</span>
          <Link to={"/gallery?room=" + encodeURIComponent(painting.room)}>{painting.room}</Link>
          <span>/</span>
          <span className="breadcrumb-here">{painting.title}</span>
        </nav>
        <div className="room-inner">
          <div className="room-picture-column">
            <div className="room-spotlight"></div>
            <div className="room-picture" ref={pictureRef}>
              <Frame image={painting.image} title={painting.title} artist={painting.artist} />
            </div>
            <div className="room-tools">
              <button type="button" className="room-tool" onClick={() => setZoomOpen(true)}>
                <SearchIcon size={18} />
                Zoom in
              </button>
              {hasSize && (
                <button type="button" className="room-tool" onClick={() => setWallOpen(true)}>
                  <ImageIcon size={18} />
                  See it on a wall
                </button>
              )}
              <button type="button" className="room-tool" onClick={goFullScreen}>
                <ExpandIcon size={18} />
                Full screen
              </button>
            </div>
          </div>
          <div className="room-label">
            <p className="small-label">{painting.room} room</p>
            <h1 className="room-title">{painting.title}</h1>
            <p className="room-artist">
              <Link to={"/artists/" + painting.artistSlug}>{painting.artist}</Link>, {painting.year}
            </p>
            <p className="room-fact">{sizeLine(painting)}</p>
            <p className="room-fact">{painting.whereItHangs}</p>
            <PaintingActions painting={painting} saved={saved} />
            <button type="button" className="text-link room-ask" onClick={onAsk}>
              Ask the guide about this painting <ArrowIcon size={16} />
            </button>
          </div>
        </div>
      </div>
      {zoomOpen && <ZoomView painting={painting} onClose={() => setZoomOpen(false)} />}
      {wallOpen && <WallView painting={painting} onClose={() => setWallOpen(false)} />}
    </section>
  );
}

export default ViewingRoom;
