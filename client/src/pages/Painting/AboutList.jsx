import { Link } from "react-router-dom";
import "./AboutList.css";

function AboutList({ painting }) {
  const rows = [
    ["Room", painting.room],
    ["Style", painting.style],
    ["Medium", painting.medium ? painting.medium + " on " + (painting.surface || "canvas").toLowerCase() : ""],
    ["Size", painting.widthCm && painting.heightCm ? painting.widthCm + " x " + painting.heightCm + " cm" : ""],
    ["Where it hangs", painting.whereItHangs],
    ["Image", painting.licence]
  ].filter((row) => row[1]);

  return (
    <dl className="about-list">
      {rows.map((row) => (
        <div key={row[0]} className="about-row">
          <dt>{row[0]}</dt>
          <dd>{row[1]}</dd>
        </div>
      ))}
      {painting.tags && painting.tags.length > 0 && (
        <div className="about-row about-tags">
          <dt>Tags</dt>
          <dd>
            {painting.tags.map((tag) => (
              <Link key={tag} to={"/search?q=" + encodeURIComponent(tag)} className="tag">
                {tag}
              </Link>
            ))}
          </dd>
        </div>
      )}
    </dl>
  );
}

export default AboutList;
