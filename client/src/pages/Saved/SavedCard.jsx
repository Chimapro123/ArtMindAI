import PaintingCard from "../../components/PaintingCard";
import "./SavedCard.css";

function SavedCard({ painting, onRemove, onAdd, onSave }) {
  return (
    <div className="saved-card">
      <PaintingCard painting={painting} saved onSave={onSave} />
      <div className="saved-actions">
        <button type="button" className="saved-action" onClick={onRemove}>
          Remove
        </button>
        <button type="button" className="saved-action" onClick={onAdd}>
          Add to a collection
        </button>
      </div>
    </div>
  );
}

export default SavedCard;
