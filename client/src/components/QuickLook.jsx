import { useEffect } from "react";
import { Link } from "react-router-dom";
import Frame from "./Frame";
import PaintingLabel from "./PaintingLabel";
import { HeartIcon, CloseIcon, ArrowIcon } from "./Icons";
import "./QuickLook.css";

function QuickLook({ painting, saved, onSave, onClose }) {
  useEffect(() => {
    function handleKey(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const heartClass = "quick-save" + (saved ? " quick-save-on" : "");

  return (
    <div className="quick-look-backdrop" onClick={onClose}>
      <div className="quick-look-box" role="dialog" aria-modal="true" aria-label={painting.title} onClick={(event) => event.stopPropagation()}>
        <button type="button" className="icon-button quick-close" aria-label="Close" onClick={onClose}>
          <CloseIcon size={20} />
        </button>
        <div className="quick-picture">
          <Frame image={painting.image} title={painting.title} artist={painting.artist} />
        </div>
        <div className="quick-details">
          <p className="small-label">{painting.room} room</p>
          <PaintingLabel title={painting.title} artist={painting.artist} year={painting.year} />
          {painting.medium && (
            <p className="quick-facts">
              {painting.medium} on {painting.surface ? painting.surface.toLowerCase() : "canvas"}
              {painting.widthCm ? ", " + painting.widthCm + " x " + painting.heightCm + " cm" : ""}
            </p>
          )}
          <div className="quick-buttons">
            <button type="button" className={heartClass} aria-pressed={saved} onClick={onSave}>
              <HeartIcon size={18} />
              {saved ? "Saved" : "Save"}
            </button>
            <Link to={"/painting/" + painting.slug} className="btn btn-light" onClick={onClose}>
              Open painting <ArrowIcon size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickLook;
