import "./SelectedBar.css";

function SelectedBar({ count, busy, onAction }) {
  return (
    <div className="selected-bar">
      <span className="selected-count">{count} selected</span>
      <button type="button" className="selected-action" disabled={busy} onClick={() => onAction("label")}>
        Label them for me
      </button>
      <button type="button" className="selected-action" disabled={busy} onClick={() => onAction("storage")}>
        Move to storage
      </button>
      <button type="button" className="selected-action" disabled={busy} onClick={() => onAction("wall")}>
        Hang on the wall
      </button>
      <button type="button" className="selected-action selected-remove" disabled={busy} onClick={() => onAction("remove")}>
        Remove
      </button>
      {busy && <span className="selected-busy">Working on it.</span>}
    </div>
  );
}

export default SelectedBar;
