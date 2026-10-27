import "./PigmentHeap.css";

const heapImages = import.meta.glob("../images/pigment-heap.png", { eager: true, query: "?url", import: "default" });
const heapImage = Object.values(heapImages)[0];

function PigmentHeap({ name, hex, percent, selected, onClick }) {
  const heapStyle = { backgroundColor: hex };
  if (heapImage) {
    heapStyle.maskImage = "url(" + heapImage + ")";
    heapStyle.WebkitMaskImage = "url(" + heapImage + ")";
  }
  const shapeClass = "pigment-shape" + (heapImage ? "" : " pigment-blob");
  const heapClass = "pigment-heap" + (selected ? " pigment-selected" : "");

  const inside = (
    <>
      <span className={shapeClass} style={heapStyle}></span>
      <span className="pigment-name">{name}</span>
      {percent !== undefined && <span className="pigment-share">{percent}%</span>}
    </>
  );

  if (onClick) {
    return (
      <button type="button" className={heapClass} onClick={onClick} aria-pressed={selected}>
        {inside}
      </button>
    );
  }

  return <div className={heapClass}>{inside}</div>;
}

export default PigmentHeap;
