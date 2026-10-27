import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { GuideContext } from "../../context/GuideContext";
import { getHome } from "../../services/api";
import PaintingCard from "../../components/PaintingCard";
import { ArrowIcon } from "../../components/Icons";
import frameImage from "../../images/frame-gold.png";
import "./NotFound.css";

function NotFound() {
  const { openGuide } = useContext(GuideContext);
  const [paintings, setPaintings] = useState([]);

  useEffect(() => {
    getHome()
      .then((data) => setPaintings(data.mainWall.slice(0, 3)))
      .catch(() => setPaintings([]));
  }, []);

  return (
    <>
      <section className="dark-section lost-top">
        <div className="container">
          <div className="lost-wall">
            <div className="lost-spotlight"></div>
            <div className="lost-frame" style={{ borderImageSource: "url(" + frameImage + ")" }}></div>
            <div className="lost-label">
              <p className="lost-label-title">Page Not Found</p>
              <p className="lost-label-line">Artist unknown</p>
              <p className="lost-label-line">404</p>
              <p className="lost-label-quiet">Nothing on canvas</p>
            </div>
          </div>
          <h1 className="lost-title">Someone's moved this one.</h1>
          <p className="lost-text">The page you wanted isn't on this wall. It may have been rehung somewhere else, or there's a small mistake in the link.</p>
          <div className="lost-buttons">
            <Link to="/gallery" className="btn btn-light">
              Take me to the gallery
            </Link>
            <button type="button" className="text-link" onClick={() => openGuide(null)}>
              Ask the guide where it went <ArrowIcon size={16} />
            </button>
          </div>
        </div>
      </section>
      {paintings.length > 0 && (
        <section className="stone-section">
          <div className="container">
            <p className="small-label">Meanwhile, on the main wall</p>
            <div className="lost-grid">
              {paintings.map((painting) => (
                <PaintingCard key={painting.slug} painting={painting} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default NotFound;
