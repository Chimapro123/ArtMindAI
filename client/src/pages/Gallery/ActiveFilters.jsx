import { CloseIcon } from "../../components/Icons";
import "./ActiveFilters.css";

function tagText(key, value) {
  if (key === "hideSeen") {
    return "Hiding seen";
  }
  if (key === "curated") {
    return "Curated picks";
  }
  if (key === "fromYear") {
    return "From " + value;
  }
  if (key === "toYear") {
    return "To " + value;
  }
  return value;
}

function ActiveFilters({ filters, onRemove, onClear }) {
  const keys = Object.keys(filters).filter((key) => key !== "sort");

  if (keys.length === 0) {
    return null;
  }

  return (
    <div className="active-filters">
      {keys.map((key) => (
        <span key={key} className="active-tag">
          {tagText(key, filters[key])}
          <button type="button" className="active-tag-remove" aria-label={"Remove " + tagText(key, filters[key])} onClick={() => onRemove(key)}>
            <CloseIcon size={12} />
          </button>
        </span>
      ))}
      <button type="button" className="text-link clear-all" onClick={onClear}>
        Clear all
      </button>
    </div>
  );
}

export default ActiveFilters;
