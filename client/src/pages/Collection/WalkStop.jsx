import { Link } from "react-router-dom";
import Frame from "../../components/Frame";
import FadeIn from "../../components/FadeIn";
import "./WalkStop.css";

function pad(number) {
  return String(number).padStart(2, "0");
}

function WalkStop({ item, number, right }) {
  const painting = item.painting;
  const hasPoint = item.x !== null && item.y !== null;
  const stopClass = right ? "walk-stop walk-stop-right dark-section" : "walk-stop stone-section";

  return (
    <section className={stopClass} id={number === 1 ? "walk-start" : undefined}>
      <FadeIn>
        <div className="container walk-inner">
          <div className="walk-picture">
            <Link to={"/painting/" + painting.slug} className="walk-frame">
              <Frame image={painting.image} title={painting.title} artist={painting.artist} />
            </Link>
            {hasPoint && <span className="walk-circle" style={{ left: item.x + "%", top: item.y + "%" }} aria-hidden="true"></span>}
          </div>
          <div className="walk-words">
            <p className="walk-number">{pad(number)}</p>
            <h2 className="walk-title">
              <Link to={"/painting/" + painting.slug}>{painting.title}</Link>
            </h2>
            <p className="walk-artist">
              {painting.artist}, {painting.year}
            </p>
            {item.note && <p className="walk-note">{item.note}</p>}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

export default WalkStop;
