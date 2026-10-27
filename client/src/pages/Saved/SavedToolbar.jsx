import { SearchIcon } from "../../components/Icons";
import "./SavedToolbar.css";

const rooms = ["Abstract", "Landscape", "Flower", "Nature", "Figurative", "Religious"];

function SavedToolbar({ search, onSearch, room, onRoom, sort, onSort, view, onView, onDownload, making }) {
  return (
    <div className="saved-toolbar">
      <label className="saved-search">
        <SearchIcon size={16} />
        <input type="text" placeholder="Look through what you've saved." aria-label="Look through what you've saved" value={search} onChange={(event) => onSearch(event.target.value)} />
      </label>
      <div className="saved-rooms">
        <button type="button" className={"saved-room" + (room === "" ? " saved-room-on" : "")} onClick={() => onRoom("")}>
          All
        </button>
        {rooms.map((name) => (
          <button key={name} type="button" className={"saved-room" + (room === name ? " saved-room-on" : "")} onClick={() => onRoom(name)}>
            {name}
          </button>
        ))}
      </div>
      <label className="saved-sort">
        <span>Sort by:</span>
        <select value={sort} onChange={(event) => onSort(event.target.value)}>
          <option value="most-recent">Most recent</option>
          <option value="title">Title</option>
        </select>
      </label>
      <div className="saved-view" role="group" aria-label="Layout">
        <button type="button" className={"saved-view-button" + (view === "wall" ? " saved-view-on" : "")} aria-pressed={view === "wall"} onClick={() => onView("wall")}>
          Wall
        </button>
        <button type="button" className={"saved-view-button" + (view === "grid" ? " saved-view-on" : "")} aria-pressed={view === "grid"} onClick={() => onView("grid")}>
          Grid
        </button>
      </div>
      <button type="button" className="saved-download" disabled={making} onClick={onDownload}>
        {making ? "Making it." : "Download as PDF"}
      </button>
    </div>
  );
}

export default SavedToolbar;
