import "./RoomFigures.css";

function RoomFigures({ counts, favouriteRoom }) {
  const figures = [
    { number: counts.lookedAt, text: "paintings looked at" },
    { number: counts.saved, text: "saved" },
    { number: counts.searches, text: "searches" }
  ];

  return (
    <section className="stone-section figures-section">
      <div className="container">
        <p className="small-label">Your visits so far</p>
        <div className="figures">
          {figures.map((figure) => (
            <div key={figure.text} className="figure">
              <p className="figure-number">{figure.number}</p>
              <p className="figure-text">{figure.text}</p>
            </div>
          ))}
          <div className="figure">
            <p className="figure-number figure-word">{favouriteRoom || "Not yet"}</p>
            <p className="figure-text">your favourite room</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RoomFigures;
