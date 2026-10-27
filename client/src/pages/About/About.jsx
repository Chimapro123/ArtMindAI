import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPainting } from "../../services/api";
import Frame from "../../components/Frame";
import FadeIn from "../../components/FadeIn";
import "./About.css";

const team = [
  { initials: "CB", name: "Chiboy,", role: "group leader.", line: "Kept the six of us moving, and built the way in: log in, join and verify." },
  { initials: "GD", name: "Goodluck.", role: "", line: "The gallery, the painting pages and the artists." },
  { initials: "LW", name: "Luwa.", role: "", line: "The search, the guide and the collections." },
  { initials: "ML", name: "Miles.", role: "", line: "The Image Lab and every painting in our database." },
  { initials: "TR", name: "Treasure.", role: "", line: "Your dashboard and profile, and testing everything twice." },
  { initials: "NB", name: "Noble.", role: "", line: "The look and feel, the home page and the numbers behind it." }
];

const things = [
  "Wander the six rooms at your own pace.",
  "Describe what you want to see, in your own words.",
  "Ask the guide about anything you're looking at.",
  "Show us a photo of a painting and find out more about it.",
  "Save what you love, and come back to a gallery that remembers you."
];

const numerals = ["I.", "II.", "III.", "IV.", "V."];

function About() {
  const [cover, setCover] = useState(null);

  useEffect(() => {
    getPainting("the-art-of-painting")
      .then((data) => setCover(data.painting))
      .catch(() => setCover(null));
  }, []);

  return (
    <>
      <section className="dark-section about-top">
        <div className="container about-top-inner">
          <div>
            <p className="small-label">About ArtMind</p>
            <h1 className="page-title">We built the gallery we wanted to visit.</h1>
            <p className="about-line">
              Most art websites show everyone the same wall of pictures. We wanted a place that notices what you linger on, answers your questions like a friend who knows a lot about art, and never rushes you.
            </p>
          </div>
          {cover && (
            <div className="about-cover">
              <div className="about-glow"></div>
              <Link to={"/painting/" + cover.slug} className="about-cover-frame">
                <Frame image={cover.image} title={cover.title} artist={cover.artist} />
              </Link>
              <div className="about-cover-label">
                <p className="small-label">{cover.artist}</p>
                <p className="about-cover-title">{cover.title}</p>
                <p className="about-cover-year">{cover.year}</p>
              </div>
            </div>
          )}
        </div>
      </section>
      <section className="stone-section about-story">
        <div className="container">
          <p className="small-label">How it started</p>
          <p className="about-big-text">
            ArtMind began as a school project at Aptech. Six of us, one brief, and a shared feeling that looking at art online should feel less like scrolling and more like walking slowly through a quiet room.
          </p>
        </div>
      </section>
      <FadeIn>
        <section className="dark-section">
          <div className="container">
            <p className="small-label">What you can do here</p>
            <ol className="about-list">
              {things.map((thing, index) => (
                <li key={thing} className="about-list-item">
                  <span className="about-numeral">{numerals[index]}</span>
                  <span>{thing}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </FadeIn>
      <section className="stone-section about-story" id="credits">
        <div className="container">
          <p className="small-label">Where the paintings come from</p>
          <p className="about-big-text">
            Every painting here is old enough to belong to everyone. We take them from open museum collections like The Met, the Art Institute of Chicago, the Rijksmuseum and Wikimedia Commons, and credit each one on its own page.
          </p>
        </div>
      </section>
      <FadeIn>
        <section className="dark-section">
          <div className="container">
            <p className="small-label">The team</p>
            <h2 className="section-title about-team-title">Six students, one gallery</h2>
            <p className="about-team-line">Students at Aptech Computer Education</p>
            <div className="team-grid">
              {team.map((member) => (
                <div key={member.initials} className="team-card">
                  <span className="team-frame">{member.initials}</span>
                  <p className="team-name">
                    {member.name} {member.role && <span className="team-role">{member.role}</span>}
                  </p>
                  <p className="team-text">{member.line}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>
    </>
  );
}

export default About;
