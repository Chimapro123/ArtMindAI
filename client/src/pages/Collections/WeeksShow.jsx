import { Link } from "react-router-dom";
import Frame from "../../components/Frame";
import "./WeeksShow.css";

function WeeksShow({ show }) {
  return (
    <section className="stone-section show-section">
      <div className="container show-inner">
        <div className="show-words">
          <p className="small-label">Chosen by us</p>
          <h2 className="show-title">{show.title}</h2>
          <p className="show-line">{show.description}</p>
          <p className="show-count">{show.paintingCount} paintings</p>
          <Link to={"/collections/" + show.slug} className="btn btn-dark">
            Walk through it
          </Link>
        </div>
        <div className="show-wall">
          {show.paintings.slice(0, 5).map((item) => (
            <Link key={item.painting.slug} to={"/painting/" + item.painting.slug} className="show-painting">
              <Frame image={item.painting.thumb} title={item.painting.title} artist={item.painting.artist} />
              <p className="show-painting-title">{item.painting.title}</p>
              <p className="show-painting-artist">
                {item.painting.artist}, {item.painting.year}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WeeksShow;
