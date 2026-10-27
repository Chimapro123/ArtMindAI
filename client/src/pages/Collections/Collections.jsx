import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getCollections, getCollection, getPainting } from "../../services/api";
import Frame from "../../components/Frame";
import Loader from "../../components/Loader";
import EmptyMessage from "../../components/EmptyMessage";
import FadeIn from "../../components/FadeIn";
import WeeksShow from "./WeeksShow";
import CollectionCard from "./CollectionCard";
import NameModal from "./NameModal";
import "./Collections.css";

const tabs = [
  { key: "all", text: "All" },
  { key: "chosen", text: "Chosen by us" },
  { key: "made-for-you", text: "Made for you" }
];

function Collections() {
  const { user, loading: checkingUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tab, setTab] = useState("all");
  const [collections, setCollections] = useState([]);
  const [show, setShow] = useState(null);
  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (checkingUser) {
      return undefined;
    }
    let ignore = false;
    async function load() {
      setLoading(true);
      try {
        const data = await getCollections("all");
        if (!ignore) {
          setCollections(data.items);
        }
      } catch (error) {
        if (!ignore) {
          setCollections([]);
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
  }, [user, checkingUser]);

  useEffect(() => {
    getCollection("good-dogs").then((data) => setShow(data.collection)).catch(() => setShow(null));
    getPainting("the-milkmaid").then((data) => setCover(data.painting)).catch(() => setCover(null));
  }, []);

  function startOne() {
    if (!user) {
      navigate("/login", { state: { from: "/collections" } });
      return;
    }
    setModalOpen(true);
  }

  const shown = collections.filter((collection) => {
    if (tab === "chosen") {
      return collection.type === "chosen";
    }
    if (tab === "made-for-you") {
      return collection.type !== "chosen";
    }
    return true;
  });

  return (
    <>
      <section className="dark-section collections-top">
        <div className="container collections-top-inner">
          <div>
            <p className="small-label">Collections</p>
            <h1 className="page-title">Little exhibitions you can see in ten minutes</h1>
            <p className="collections-line">
              Each one gathers a handful of paintings around one idea. Some we put together ourselves, and some are put together just for you.
            </p>
            <div className="collection-tabs">
              {tabs.map((item) => (
                <button key={item.key} type="button" className={"collection-tab" + (tab === item.key ? " collection-tab-active" : "")} onClick={() => setTab(item.key)}>
                  {item.text}
                </button>
              ))}
            </div>
          </div>
          {cover && (
            <div className="collections-cover">
              <div className="collections-glow"></div>
              <Link to={"/painting/" + cover.slug} className="collections-cover-frame">
                <Frame image={cover.image} title={cover.title} artist={cover.artist} />
              </Link>
            </div>
          )}
        </div>
      </section>
      {show && tab !== "made-for-you" && <WeeksShow show={show} />}
      <section className="dark-section">
        <div className="container">
          <p className="small-label">{tab === "made-for-you" ? "Made for you" : "All collections"}</p>
          {loading && <Loader text="Opening the rooms." />}
          {!loading && tab === "made-for-you" && !user && (
            <EmptyMessage title="Log in and we'll put two together for you." text="They are built from the rooms and colours you keep coming back to.">
              <Link to="/login" className="btn btn-light">
                Log in
              </Link>
            </EmptyMessage>
          )}
          {!loading && shown.length > 0 && (
            <div className="collection-grid">
              {shown.map((collection) => (
                <CollectionCard key={collection.slug} collection={collection} />
              ))}
            </div>
          )}
        </div>
      </section>
      <FadeIn>
        <section className="stone-section make-own">
          <div className="container">
            <h2 className="section-title make-own-title">Make your own collection</h2>
            <p className="make-own-line">Start with one painting you love and keep adding to it.</p>
            <button type="button" className="btn btn-dark" onClick={startOne}>
              Start a collection
            </button>
          </div>
        </section>
      </FadeIn>
      {modalOpen && <NameModal onClose={() => setModalOpen(false)} />}
    </>
  );
}

export default Collections;
