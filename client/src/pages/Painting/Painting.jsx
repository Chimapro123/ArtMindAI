import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { GuideContext } from "../../context/GuideContext";
import { getPainting, countPaintingView } from "../../services/api";
import Loader from "../../components/Loader";
import EmptyMessage from "../../components/EmptyMessage";
import LookCloser from "../../components/LookCloser";
import PigmentHeap from "../../components/PigmentHeap";
import PaintingCard from "../../components/PaintingCard";
import FadeIn from "../../components/FadeIn";
import { ArrowIcon } from "../../components/Icons";
import ViewingRoom from "./ViewingRoom";
import AboutList from "./AboutList";
import "./Painting.css";

function Painting() {
  const { slug } = useParams();
  const { openGuide } = useContext(GuideContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setErrorMessage("");
      try {
        const result = await getPainting(slug);
        if (!ignore) {
          setData(result);
        }
        countPaintingView(slug).catch(() => {});
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message);
        }
      }
      if (!ignore) {
        setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <section className="dark-section painting-loading">
        <div className="container">
          <Loader text="Bringing it out of storage." />
        </div>
      </section>
    );
  }

  if (errorMessage || !data) {
    return (
      <section className="dark-section painting-loading">
        <div className="container">
          <EmptyMessage title="We could not find that painting." text={errorMessage}>
            <Link to="/gallery" className="text-link">
              Back to the gallery
            </Link>
          </EmptyMessage>
        </div>
      </section>
    );
  }

  const { painting, related, moreByArtist, saved } = data;
  const colours = painting.colours || [];
  const storyParts = (painting.story || "").split(/\n+/).filter((part) => part.trim());

  return (
    <>
      <ViewingRoom painting={painting} saved={saved} onAsk={() => openGuide(painting.slug, painting.title)} />
      {storyParts.length > 0 && (
        <section className="stone-section">
          <div className="container story-inner">
            <p className="small-label">The story</p>
            {storyParts.map((part, index) => (
              <p key={index} className={index === 0 ? "story-lead" : "story-text"}>
                {part}
              </p>
            ))}
          </div>
        </section>
      )}
      {painting.lookCloser && painting.lookCloser.length > 0 && (
        <FadeIn>
          <section className="dark-section">
            <div className="container">
              <p className="small-label">Look closer</p>
              <LookCloser painting={painting} />
            </div>
          </section>
        </FadeIn>
      )}
      {colours.length > 0 && (
        <FadeIn>
          <section className="stone-section">
            <div className="container">
              <p className="small-label">Its colours</p>
              <h2 className="section-title">What this painting is made of</h2>
              <div className="colour-row">
                {colours.map((colour) => (
                  <PigmentHeap key={colour.name} name={colour.name} hex={colour.hex} percent={colour.percent} />
                ))}
              </div>
              <Link to={"/gallery?colour=" + encodeURIComponent(colours[0].name)} className="text-link">
                See paintings with the same colours <ArrowIcon size={16} />
              </Link>
            </div>
          </section>
        </FadeIn>
      )}
      <section className="about-and-similar">
        <div className="about-column dark-section">
          <p className="small-label">About this painting</p>
          <AboutList painting={painting} />
        </div>
        <div className="similar-column stone-section">
          <p className="small-label">If you like this one</p>
          <div className="similar-grid">
            {related.map((item) => (
              <div key={item.slug}>
                <PaintingCard painting={item} />
                <p className="similar-reason">{item.reason}</p>
              </div>
            ))}
          </div>
          {moreByArtist.length > 0 && (
            <>
              <p className="small-label more-label">More by {painting.artist}</p>
              <div className="similar-grid">
                {moreByArtist.map((item) => (
                  <PaintingCard key={item.slug} painting={item} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      <section className="dark-section credit-section">
        <div className="container">
          <p className="credit-line">
            {painting.licence || "Public domain"}.{" "}
            {painting.sourceUrl && (
              <a href={painting.sourceUrl} className="text-link" target="_blank" rel="noreferrer">
                Where the image came from
              </a>
            )}
          </p>
        </div>
      </section>
    </>
  );
}

export default Painting;
