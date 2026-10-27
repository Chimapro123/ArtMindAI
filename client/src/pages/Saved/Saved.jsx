import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSaved, unsavePainting } from "../../services/api";
import YourRoomTabs from "../../components/YourRoomTabs";
import Loader from "../../components/Loader";
import EmptyMessage from "../../components/EmptyMessage";
import { ArrowIcon } from "../../components/Icons";
import SavedToolbar from "./SavedToolbar";
import SavedCard from "./SavedCard";
import CollectionPicker from "./CollectionPicker";
import "./Saved.css";

const perPage = 12;

function wallWidth(painting) {
  const pixels = Math.round((painting.widthCm || 100) * 1.5);
  return Math.min(420, Math.max(180, pixels)) + "px";
}

function Saved() {
  const [search, setSearch] = useState("");
  const [room, setRoom] = useState("");
  const [sort, setSort] = useState("most-recent");
  const [view, setView] = useState("wall");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [picking, setPicking] = useState(null);
  const [note, setNote] = useState("");
  const [making, setMaking] = useState(false);

  useEffect(() => {
    let ignore = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await getSaved({ search, room, sort, page: 1, limit: perPage });
        if (!ignore) {
          setItems(data.items);
          setTotal(data.total);
          setPages(data.pages);
          setPage(1);
        }
      } catch (error) {
        if (!ignore) {
          setNote(error.message);
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
  }, [search, room, sort]);

  useEffect(() => {
    if (!note) {
      return undefined;
    }
    const timer = setTimeout(() => setNote(""), 3000);
    return () => clearTimeout(timer);
  }, [note]);

  async function showMore() {
    try {
      const data = await getSaved({ search, room, sort, page: page + 1, limit: perPage });
      setItems((old) => [...old, ...data.items]);
      setPage(page + 1);
    } catch (error) {
      setNote(error.message);
    }
  }

  function takeOff(slug) {
    setItems((old) => old.filter((item) => item.slug !== slug));
    setTotal((old) => Math.max(0, old - 1));
  }

  async function remove(painting) {
    try {
      await unsavePainting(painting.slug);
      takeOff(painting.slug);
    } catch (error) {
      setNote(error.message);
    }
  }

  async function downloadList() {
    setMaking(true);
    try {
      const everything = await getSaved({ sort, limit: 60 });
      const pdf = await import("./savedPdf");
      await pdf.makeSavedPdf(everything.items);
    } catch (error) {
      setNote("The PDF could not be made. Please try again.");
    }
    setMaking(false);
  }

  const countText = total === 1 ? "1 painting so far." : total + " paintings so far.";

  return (
    <>
      <section className="dark-section saved-top">
        <div className="container">
          <p className="small-label">Your room</p>
          <h1 className="page-title">Everything you've saved</h1>
          <p className="saved-line">{countText} They're kept here for you, and only you can see them.</p>
          <YourRoomTabs />
          <SavedToolbar search={search} onSearch={setSearch} room={room} onRoom={setRoom} sort={sort} onSort={setSort} view={view} onView={setView} onDownload={downloadList} making={making} />
          {note && <p className="saved-note">{note}</p>}
        </div>
      </section>
      <section className="stone-section saved-body">
        <div className="container">
          {loading && <Loader text="Taking them off the shelf." />}
          {!loading && items.length === 0 && (
            <EmptyMessage title="Nothing saved here yet." text="Tap the heart on any painting and it will wait for you here.">
              <Link to="/gallery" className="btn btn-dark">
                Walk into the gallery
              </Link>
            </EmptyMessage>
          )}
          {!loading && items.length > 0 && (
            <div className={view === "wall" ? "saved-wall" : "saved-grid"}>
              {items.map((painting) => (
                <div key={painting.slug} className="saved-item" style={view === "wall" ? { width: wallWidth(painting) } : undefined}>
                  <SavedCard painting={painting} onRemove={() => remove(painting)} onAdd={() => setPicking(painting)} onSave={(item, nowSaved) => !nowSaved && takeOff(item.slug)} />
                </div>
              ))}
            </div>
          )}
          {!loading && page < pages && (
            <div className="saved-more">
              <button type="button" className="text-link" onClick={showMore}>
                Show more <ArrowIcon size={16} />
              </button>
            </div>
          )}
        </div>
      </section>
      <section className="dark-section saved-foot">
        <div className="container saved-foot-inner">
          <p className="saved-foot-text">Want to share a few of these? Put them in a collection.</p>
          <Link to="/collections" className="text-link">
            Start a collection <ArrowIcon size={16} />
          </Link>
        </div>
      </section>
      {picking && <CollectionPicker painting={picking} onClose={() => setPicking(null)} onDone={(text) => { setNote(text); setPicking(null); }} />}
    </>
  );
}

export default Saved;
