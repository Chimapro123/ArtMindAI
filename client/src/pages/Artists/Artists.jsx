import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getArtists } from "../../services/api";
import Frame from "../../components/Frame";
import Loader from "../../components/Loader";
import EmptyMessage from "../../components/EmptyMessage";
import FadeIn from "../../components/FadeIn";
import { ArrowIcon } from "../../components/Icons";
import ArtistsTop from "./ArtistsTop";
import ArtistCard from "./ArtistCard";
import "./Artists.css";

function Artists() {
  const [search, setSearch] = useState("");
  const [era, setEra] = useState("");
  const [letter, setLetter] = useState("");
  const [artists, setArtists] = useState([]);
  const [spotlight, setSpotlight] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await getArtists({ search, era, letter, page: 1, limit: 12 });
        if (!ignore) {
          setArtists(data.items);
          setPages(data.pages);
          setPage(1);
          setSpotlight(data.spotlight);
        }
      } catch (error) {
        if (!ignore) {
          setArtists([]);
        }
      }
      if (!ignore) {
        setLoading(false);
      }
    }, 250);
    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [search, era, letter]);

  async function showMore() {
    try {
      const data = await getArtists({ search, era, letter, page: page + 1, limit: 12 });
      setArtists((old) => [...old, ...data.items]);
      setPage(page + 1);
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <>
      <ArtistsTop search={search} onSearch={setSearch} era={era} onEra={setEra} letter={letter} onLetter={setLetter} spotlight={spotlight} />
      {spotlight && (
        <FadeIn>
          <section className="stone-section spotlight-section">
            <div className="container spotlight-inner">
              <div className="spotlight-portrait">
                <Frame image={spotlight.portrait} title={spotlight.name} artist="portrait" />
              </div>
              <div className="spotlight-words">
                <p className="small-label">In the spotlight</p>
                <h2 className="spotlight-name">{spotlight.name}</h2>
                <p className="spotlight-years">
                  {spotlight.nationality}, {spotlight.born} to {spotlight.died}
                </p>
                <p className="spotlight-line">{spotlight.spotlightLine || spotlight.about}</p>
                <div className="spotlight-paintings">
                  {spotlight.paintings.map((painting) => (
                    <Link key={painting.slug} to={"/painting/" + painting.slug} className="spotlight-painting">
                      <Frame image={painting.thumb} title={painting.title} artist={painting.artist} />
                    </Link>
                  ))}
                </div>
                <Link to={"/artists/" + spotlight.slug} className="text-link">
                  See her paintings <ArrowIcon size={16} />
                </Link>
              </div>
            </div>
          </section>
        </FadeIn>
      )}
      <section className="dark-section">
        <div className="container">
          <p className="small-label">Every artist</p>
          {loading && <Loader text="Finding the painters." />}
          {!loading && artists.length === 0 && (
            <EmptyMessage title="No painter matches that." text="Try another name or letter.">
              <button type="button" className="text-link" onClick={() => { setSearch(""); setEra(""); setLetter(""); }}>
                Show everyone
              </button>
            </EmptyMessage>
          )}
          {!loading && artists.length > 0 && (
            <div className="artist-grid">
              {artists.map((artist) => (
                <ArtistCard key={artist.slug} artist={artist} />
              ))}
            </div>
          )}
          {!loading && page < pages && (
            <button type="button" className="text-link show-more-artists" onClick={showMore}>
              Show more artists <ArrowIcon size={16} />
            </button>
          )}
        </div>
      </section>
    </>
  );
}

export default Artists;
