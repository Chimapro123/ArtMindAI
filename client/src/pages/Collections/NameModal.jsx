import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createCollection } from "../../services/api";
import { CloseIcon } from "../../components/Icons";
import "./NameModal.css";

function NameModal({ onClose }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [line, setLine] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    function handleKey(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) {
      setErrorMessage("Give your collection a name first.");
      return;
    }
    setSending(true);
    setErrorMessage("");
    try {
      const data = await createCollection({ title: title.trim(), description: line.trim(), paintingSlugs: [] });
      navigate("/collections/" + data.collection.slug);
    } catch (error) {
      setErrorMessage(error.message);
      setSending(false);
    }
  }

  return (
    <div className="name-backdrop" onClick={onClose}>
      <form className="name-box" role="dialog" aria-modal="true" aria-label="Name your collection" onClick={(event) => event.stopPropagation()} onSubmit={handleSubmit}>
        <button type="button" className="icon-button name-close" aria-label="Close" onClick={onClose}>
          <CloseIcon size={18} />
        </button>
        <p className="small-label">Your collection</p>
        <h2 className="name-title">What shall we call it?</h2>
        <label className="name-field">
          <span>Name</span>
          <input type="text" className="line-input" value={title} maxLength="60" autoFocus onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label className="name-field">
          <span>A line about it, if you like</span>
          <input type="text" className="line-input" value={line} maxLength="120" onChange={(event) => setLine(event.target.value)} />
        </label>
        {errorMessage && <p className="error-text">{errorMessage}</p>}
        <div className="name-buttons">
          <button type="button" className="text-link" onClick={onClose}>
            Not now
          </button>
          <button type="submit" className="btn btn-light" disabled={sending}>
            {sending ? "One moment." : "Create it"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NameModal;
