import { useState, useEffect } from "react";
import { getCollections, addToCollection, createCollection } from "../../services/api";
import { CloseIcon } from "../../components/Icons";
import "./CollectionPicker.css";

function CollectionPicker({ painting, onClose, onDone }) {
  const [collections, setCollections] = useState([]);
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getCollections("mine")
      .then((data) => setCollections(data.items.filter((item) => item.type === "mine")))
      .catch(() => setCollections([]));
  }, []);

  useEffect(() => {
    function handleKey(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  async function addTo(collection) {
    setBusy(true);
    setErrorMessage("");
    try {
      await addToCollection(collection.slug, painting.slug, "");
      onDone("Added to " + collection.title + ".");
    } catch (error) {
      setErrorMessage(error.message);
      setBusy(false);
    }
  }

  async function makeNew(event) {
    event.preventDefault();
    if (!newName.trim()) {
      setErrorMessage("Give the new collection a name first.");
      return;
    }
    setBusy(true);
    setErrorMessage("");
    try {
      const data = await createCollection({ title: newName.trim(), description: "", paintingSlugs: [painting.slug] });
      onDone("Added to " + data.collection.title + ".");
    } catch (error) {
      setErrorMessage(error.message);
      setBusy(false);
    }
  }

  return (
    <div className="picker-backdrop" onClick={onClose}>
      <div className="picker-box" role="dialog" aria-modal="true" aria-label="Add to a collection" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="icon-button picker-close" aria-label="Close" onClick={onClose}>
          <CloseIcon size={18} />
        </button>
        <p className="small-label">Add to a collection</p>
        <h2 className="picker-title">{painting.title}</h2>
        {collections.length > 0 ? (
          <ul className="picker-list">
            {collections.map((collection) => (
              <li key={collection.slug}>
                <button type="button" className="picker-choice" disabled={busy} onClick={() => addTo(collection)}>
                  <span>{collection.title}</span>
                  <span className="picker-count">{collection.paintingCount} paintings</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="picker-none">You have no collections of your own yet. Make one below.</p>
        )}
        <form className="picker-new" onSubmit={makeNew}>
          <label className="picker-new-label" htmlFor="picker-name">
            Or make a new one
          </label>
          <div className="picker-new-row">
            <input id="picker-name" type="text" className="line-input" placeholder="A name for it" maxLength="60" value={newName} onChange={(event) => setNewName(event.target.value)} />
            <button type="submit" className="btn btn-light" disabled={busy}>
              Make it
            </button>
          </div>
        </form>
        {errorMessage && <p className="error-text">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default CollectionPicker;
