import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { GuideContext } from "../../context/GuideContext";
import { getArtist } from "../../services/api";
import Loader from "../../components/Loader";
import EmptyMessage from "../../components/EmptyMessage";
import PaintingCard from "../../components/PaintingCard";
import FadeIn from "../../components/FadeIn";
import ArtistHeader from "./ArtistHeader";
import LifeLine from "./LifeLine";
import RelatedArtist from "./RelatedArtist";
import "./Artist.css";

const sortChoices = [
  { value: "oldest", text: "Oldest first" },
  { value: "newest", text: "Newest first" },
  { value: "most-viewed", text: "Most looked at" },
  { value: "title", text: "Title" }
];

function sortPaintings(paintings, sort) {
  const list = [...paintings];
  if (sort === "newest") {
    return list.sort((first, second) => second.yearValue - first.yearValue);
  }
  if (sort === "most-viewed") {
    return list.sort((first, second) => second.views - first.views);
  }
  if (sort === "title") {
    return list.sort((first, second) => first.title.localeCompare(second.title));
  }
  return list.sort((first, second) => first.yearValue - second.yearValue);
}

function wallWidth(painting) {
  const pixels = Math.round((painting.widthCm || 100) * 1.4);
  return Math.min(380, Math.max(170, pixels)) + "px";
}

function possessive(name) {
  return name.endsWith("s") ? name + "'" : name + "'s";
}

function Artist() {
  const { slug } = useParams();
  const { openGuide } = useContext(GuideContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [sort, setSort] = useState("oldest");

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setErrorMessage("");
      try {
        const result = await getArtist(slug);
        if (!ignore) {
          setData(result);
        }
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
      <section className="dark-section artist-loading">
        <div className="container">
          <Loader text="Looking up the painter." />
        </div>
      </section>
    );
  }

  if (errorMessage || !data) {
    return (
      <section className="dark-section artist-loading">
        <div className="container">
          <EmptyMessage title="We could not find that artist." text={errorMessage}>
            <Link to="/artists" className="text-link">
              Back to the artists
            </Link>
          </EmptyMessage>
        </div>
      </section>
    );
  }

  const { artist, paintings, mostViewed, related } = data;

  return (
    <>
      <ArtistHeader artist={artist} mostViewed={mostViewed} onAsk={() => openGuide(mostViewed ? mostViewed.slug : null, artist.name)} />
      {artist.life.length > 0 && (
        <FadeIn>
          <section className="stone-section">
            <div className="container">
              <p className="small-label">{possessive(artist.name)} life</p>
              <LifeLine stops={artist.life} />
            </div>
          </section>
        </FadeIn>
      )}
      <section className="dark-section">
        <div className="container">
          <div className="artist-wall-top">
            <p className="small-label">{possessive(artist.name)} paintings here</p>
            <label className="artist-sort">
              <span>Sort by:</span>
              <select className="artist-sort-select" value={sort} onChange={(event) => setSort(event.target.value)}>
                {sortChoices.map((choice) => (
                  <option key={choice.value} value={choice.value}>
                    {choice.text}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {paintings.length === 0 && <EmptyMessage title="Nothing of theirs is on the wall right now." />}
          <div className="artist-wall">
            {sortPaintings(paintings, sort).map((painting) => (
              <div key={painting.slug} className="artist-wall-item" style={{ width: wallWidth(painting) }}>
                <PaintingCard painting={painting} />
              </div>
            ))}
          </div>
        </div>
      </section>
      {artist.quote && (
        <FadeIn>
          <section className="stone-section">
            <div className="container quote-inner">
              <p className="small-label">In their own words</p>
              <blockquote className="artist-quote">{artist.quote.text}</blockquote>
              <p className="quote-source">{artist.quote.source}</p>
            </div>
          </section>
        </FadeIn>
      )}
      {related.length > 0 && (
        <section className="dark-section">
          <div className="container">
            <p className="small-label">You might also like</p>
            <div className="related-artists">
              {related.map((other) => (
                <RelatedArtist key={other.slug} other={other} era={artist.era} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default Artist;
