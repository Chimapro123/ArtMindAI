import { sortChoices } from "./galleryHelpers";
import "./WallToolbar.css";

function WallToolbar({ total, sort, onSort, view, onView }) {
  const countText = total === 1 ? "1 painting" : total + " paintings";

  return (
    <div className="wall-toolbar">
      <p className="count-line">{countText}</p>
      <div className="toolbar-right">
        <label className="sort-box">
          <span>Sort by:</span>
          <select className="sort-select" value={sort} onChange={(event) => onSort(event.target.value)}>
            {sortChoices.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.text}
              </option>
            ))}
          </select>
        </label>
        <div className="view-switch" role="group" aria-label="Layout">
          <button type="button" className={"view-button" + (view === "wall" ? " view-button-on" : "")} aria-pressed={view === "wall"} onClick={() => onView("wall")}>
            Wall
          </button>
          <button type="button" className={"view-button" + (view === "grid" ? " view-button-on" : "")} aria-pressed={view === "grid"} onClick={() => onView("grid")}>
            Grid
          </button>
        </div>
      </div>
    </div>
  );
}

export default WallToolbar;
