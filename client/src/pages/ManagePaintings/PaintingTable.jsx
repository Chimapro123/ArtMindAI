import { useState } from "react";
import { Link } from "react-router-dom";
import "./PaintingTable.css";

function isLabelled(painting) {
  return Boolean(painting.style && painting.room && painting.colours && painting.colours.length && painting.tags && painting.tags.length);
}

function EditIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 20h4l10-10-4-4L4 16v4z" />
      <path d="M12 8l4 4" />
    </svg>
  );
}

function BinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M6 7l1 13h10l1-13" />
    </svg>
  );
}

function PaintingTable({ paintings, selected, onSelect, onRemove }) {
  const [asking, setAsking] = useState("");
  const allPicked = paintings.length > 0 && paintings.every((painting) => selected.includes(painting.slug));

  function toggleAll() {
    onSelect(allPicked ? [] : paintings.map((painting) => painting.slug));
  }

  function toggleOne(slug) {
    onSelect(selected.includes(slug) ? selected.filter((item) => item !== slug) : [...selected, slug]);
  }

  return (
    <table className="paintings-table">
      <thead>
        <tr>
          <th>
            <input type="checkbox" checked={allPicked} onChange={toggleAll} aria-label="Select every painting on this page" />
          </th>
          <th>Painting</th>
          <th>Artist</th>
          <th>Room</th>
          <th>Style</th>
          <th>Where</th>
          <th>Labels</th>
          <th>Views</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {paintings.map((painting) => (
          <tr key={painting.slug} className={selected.includes(painting.slug) ? "row-picked" : ""}>
            <td className="cell-check">
              <input type="checkbox" checked={selected.includes(painting.slug)} onChange={() => toggleOne(painting.slug)} aria-label={"Select " + painting.title} />
            </td>
            <td className="cell-painting">
              <img src={painting.thumb} alt="" className="cell-thumb" loading="lazy" />
              <span>{painting.title}</span>
            </td>
            <td data-label="Artist">{painting.artist}</td>
            <td data-label="Room">{painting.room || "Not set"}</td>
            <td data-label="Style">{painting.style || "Not set"}</td>
            <td data-label="Where" className={painting.status === "on-the-wall" ? "cell-on-wall" : "cell-storage"}>
              {painting.status === "on-the-wall" ? "On the wall" : "In storage"}
            </td>
            <td data-label="Labels">{isLabelled(painting) ? "Labelled" : "Needs labels"}</td>
            <td data-label="Views">{painting.views}</td>
            <td className="cell-actions">
              {asking === painting.slug ? (
                <span className="row-confirm">
                  Are you sure?
                  <button type="button" className="row-yes" onClick={() => onRemove(painting.slug)}>
                    Yes, remove it
                  </button>
                  <button type="button" className="row-no" onClick={() => setAsking("")}>
                    No
                  </button>
                </span>
              ) : (
                <>
                  <Link to={"/admin/paintings/" + painting.slug + "/edit"} className="row-icon" aria-label={"Edit " + painting.title}>
                    <EditIcon />
                  </Link>
                  <button type="button" className="row-icon" aria-label={"Remove " + painting.title} onClick={() => setAsking(painting.slug)}>
                    <BinIcon />
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PaintingTable;
