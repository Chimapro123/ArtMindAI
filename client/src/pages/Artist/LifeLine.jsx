import "./LifeLine.css";

function LifeLine({ stops }) {
  return (
    <ol className="life-line">
      {stops.map((stop) => (
        <li key={stop.year + stop.text} className="life-stop">
          <p className="life-year">{stop.year}</p>
          <span className="life-dot"></span>
          <p className="life-text">{stop.text}</p>
        </li>
      ))}
    </ol>
  );
}

export default LifeLine;
