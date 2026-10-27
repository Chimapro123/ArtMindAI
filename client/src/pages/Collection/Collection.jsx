import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getCollection, savePainting } from "../../services/api";
import Frame from "../../components/Frame";
import Loader from "../../components/Loader";
import EmptyMessage from "../../components/EmptyMessage";
import { ArrowIcon } from "../../components/Icons";
import Entrance from "./Entrance";
import WalkStop from "./WalkStop";
import "./Collection.css";

function Collection() {
  const { slug } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [saved, setSaved] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setSaved(false);
    getCollection(slug)
      .then((result) => {
        if (!ignore) {
          setData(result);
          setErrorMessage("");
        }
      })
      .catch((error) => {
        if (!ignore) {
          setErrorMessage(error.message);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!note) {
      return undefined;
    }
    const timer = setTimeout(() => setNote(""), 2500);
    return () => clearTimeout(timer);
  }, [note]);

  function startWalk() {
    const first = document.getElementById("walk-start");
    if (first) {
      first.scrollIntoView({ block: "start" });
    }
  }

  async function saveAll() {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    try {
      for (const item of data.collection.paintings) {
        await savePainting(item.painting.slug);
      }
      setSaved(true);
      setNote("All of them are in your room now.");
    } catch (error) {
      setNote(error.message);
    }
  }

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setNote("Link copied");
    } catch (error) {
      setNote("Copy the address bar to share this room.");
    }
  }

  if (loading) {
    return (
      <section className="dark-section collection-loading">
        <div className="container">
          <Loader text="Opening the room." />
        </div>
      </section>
    );
  }

  if (errorMessage || !data) {
    return (
      <section className="dark-section collection-loading">
        <div className="container">
          <EmptyMessage title="We could not find that collection." text={errorMessage}>
            <Link to="/collections" className="text-link">
              Back to all collections
            </Link>
          </EmptyMessage>
        </div>
      </section>
    );
  }

  const { collection, next } = data;

  return (
    <>
      <Entrance collection={collection} saved={saved} note={note} onStart={startWalk} onSave={saveAll} onShare={share} />
      {collection.paintingCount === 0 && (
        <section className="stone-section">
          <div className="container">
            <EmptyMessage title="Nothing is hanging here yet." text="Open any painting and use Add to a collection from your saved page to fill it." />
          </div>
        </section>
      )}
      {collection.paintings.map((item, index) => (
        <WalkStop key={item.painting.slug} item={item} number={index + 1} right={index % 2 === 1} />
      ))}
      <section className="dark-section room-end">
        <div className="container room-end-inner">
          <div>
            <h2 className="room-end-title">You've reached the end of this room.</h2>
            <Link to="/collections" className="text-link">
              Back to all collections <ArrowIcon size={16} />
            </Link>
          </div>
          {next && (
            <Link to={"/collections/" + next.slug} className="next-room">
              <div className="next-room-cover">{next.leadPainting && <Frame image={next.leadPainting.thumb} title={next.leadPainting.title} artist={next.leadPainting.artist} />}</div>
              <div>
                <p className="small-label">Next room</p>
                <p className="next-room-title">{next.title}</p>
                <p className="next-room-count">{next.paintingCount} paintings</p>
              </div>
            </Link>
          )}
        </div>
      </section>
    </>
  );
}

export default Collection;
