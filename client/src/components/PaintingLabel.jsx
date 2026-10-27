import "./PaintingLabel.css";

function PaintingLabel({ title, artist, year }) {
  return (
    <div className="painting-label">
      <h3 className="label-title">{title}</h3>
      <p className="label-artist">{artist}</p>
      {year && <p className="label-year">{year}</p>}
    </div>
  );
}

export default PaintingLabel;
