import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { savePainting, unsavePainting } from "../../services/api";
import { HeartIcon } from "../../components/Icons";
import { downloadPdf, downloadWord } from "./downloads";
import "./PaintingActions.css";

function PaintingActions({ painting, saved }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSaved, setIsSaved] = useState(Boolean(saved));
  const [busy, setBusy] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    setIsSaved(Boolean(saved));
  }, [saved]);

  useEffect(() => {
    if (!note) {
      return undefined;
    }
    const timer = setTimeout(() => setNote(""), 2500);
    return () => clearTimeout(timer);
  }, [note]);

  async function toggleSave() {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    try {
      if (isSaved) {
        await unsavePainting(painting.slug);
      } else {
        await savePainting(painting.slug);
      }
      setIsSaved(!isSaved);
    } catch (error) {
      setNote(error.message);
    }
  }

  async function download(kind) {
    setBusy(kind);
    try {
      if (kind === "pdf") {
        await downloadPdf(painting);
      } else {
        await downloadWord(painting);
      }
    } catch (error) {
      setNote("The file could not be made. Please try again.");
    }
    setBusy("");
  }

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setNote("Link copied");
    } catch (error) {
      setNote("Copy the address bar to share this painting.");
    }
  }

  return (
    <div className="painting-actions">
      <div className="action-row">
        <button type="button" className={"action-button" + (isSaved ? " action-saved" : "")} aria-pressed={isSaved} onClick={toggleSave}>
          <HeartIcon size={18} />
          {isSaved ? "Saved" : "Save"}
        </button>
        <button type="button" className="action-button" disabled={busy !== ""} onClick={() => download("pdf")}>
          <span className="action-letter">P</span>
          {busy === "pdf" ? "Making it." : "Download PDF"}
        </button>
        <button type="button" className="action-button" disabled={busy !== ""} onClick={() => download("word")}>
          <span className="action-letter">W</span>
          {busy === "word" ? "Making it." : "Download Word"}
        </button>
        <button type="button" className="action-button" onClick={share}>
          <span className="action-letter">S</span>
          Share
        </button>
      </div>
      {note && <p className="action-note">{note}</p>}
    </div>
  );
}

export default PaintingActions;
