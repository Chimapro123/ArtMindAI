import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { savePainting, unsavePainting } from "../services/api";
import Frame from "./Frame";
import PaintingLabel from "./PaintingLabel";
import QuickLook from "./QuickLook";
import { HeartIcon, EyeIcon } from "./Icons";
import "./PaintingCard.css";

function PaintingCard({ painting, saved, onSave }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSaved, setIsSaved] = useState(Boolean(saved));
  const [busy, setBusy] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);

  useEffect(() => {
    setIsSaved(Boolean(saved));
  }, [saved]);

  const link = "/painting/" + painting.slug;
  const heartClass = "heart-button" + (isSaved ? " heart-saved" : "");

  async function handleSave(event) {
    if (event) {
      event.preventDefault();
    }
    if (!user) {
      navigate("/login", { state: { from: location.pathname + location.search } });
      return;
    }
    if (busy) {
      return;
    }
    setBusy(true);
    try {
      if (isSaved) {
        await unsavePainting(painting.slug);
      } else {
        await savePainting(painting.slug);
      }
      setIsSaved(!isSaved);
      if (onSave) {
        onSave(painting, !isSaved);
      }
    } catch (error) {
      console.log(error.message);
    }
    setBusy(false);
  }

  function openQuickLook(event) {
    event.preventDefault();
    setQuickOpen(true);
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
          aria-label={isSaved ? "Remove from saved" : "Save this painting"}
          aria-pressed={isSaved}
          onClick={handleSave}
        >
          <HeartIcon size={18} />
        </button>
        <button type="button" className="quick-look" onClick={openQuickLook}>
          <EyeIcon size={16} />
          Quick look
        </button>
      </div>
      <Link to={link} className="card-link">
        <PaintingLabel title={painting.title} artist={painting.artist} year={painting.year} />
      </Link>
      {quickOpen && <QuickLook painting={painting} saved={isSaved} onSave={handleSave} onClose={() => setQuickOpen(false)} />}
    </article>
  );
}

export default PaintingCard;
