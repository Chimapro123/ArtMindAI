import "./TryThese.css";

function TryThese({ sentences, onPick }) {
  return (
    <section className="dark-section try-these">
      <div className="container">
        <p className="small-label">Try one of these</p>
        <ul className="try-list">
          {sentences.map((sentence) => (
            <li key={sentence}>
              <button type="button" className="try-sentence" onClick={() => onPick(sentence)}>
                {sentence}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default TryThese;
