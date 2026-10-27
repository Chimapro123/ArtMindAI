import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAdminPaintings, deletePainting, bulkUpdatePaintings } from "../../services/api";
import Loader from "../../components/Loader";
import EmptyMessage from "../../components/EmptyMessage";
import { SearchIcon, ChevronIcon } from "../../components/Icons";
import PaintingTable from "./PaintingTable";
import SelectedBar from "./SelectedBar";
import "./ManagePaintings.css";

const rooms = ["Abstract", "Landscape", "Flower", "Nature", "Figurative", "Religious"];
const perPage = 10;

function ManagePaintings() {
  const [search, setSearch] = useState("");
  const [room, setRoom] = useState("");
  const [status, setStatus] = useState("all");
  const [labels, setLabels] = useState("all");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], total: 0, pages: 1, inStorage: 0 });
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [reloads, setReloads] = useState(0);

  useEffect(() => {
    setPage(1);
  }, [search, room, status, labels]);

  useEffect(() => {
    let ignore = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const result = await getAdminPaintings({ search, room, status, labels, page, limit: perPage });
        if (!ignore) {
          setData(result);
          setSelected([]);
        }
      } catch (error) {
        if (!ignore) {
          setMessage(error.message);
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
  }, [search, room, status, labels, page, reloads]);

  async function removeOne(slug) {
    try {
      const result = await deletePainting(slug);
      setMessage(result.message);
      setReloads(reloads + 1);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function doBulk(action) {
    setBusy(true);
    try {
      const result = await bulkUpdatePaintings(action, selected);
      setMessage(result.message);
      setReloads(reloads + 1);
    } catch (error) {
      setMessage(error.message);
    }
    setBusy(false);
  }

  const countLine = data.total + (data.total === 1 ? " painting, " : " paintings, ") + data.inStorage + " in storage.";

  return (
    <div className="manage-page">
      <div className="manage-head">
        <div>
          <h1 className="manage-title">Every painting in the gallery</h1>
          <p className="manage-count">{countLine}</p>
        </div>
        <Link to="/admin/paintings/new" className="btn btn-dark">
          Add a painting
        </Link>
      </div>
      <div className="manage-filters">
        <label className="manage-search">
          <SearchIcon size={18} />
          <input type="text" placeholder="Find a painting or an artist." aria-label="Find a painting or an artist" value={search} onChange={(event) => setSearch(event.target.value)} />
        </label>
        <label className="manage-select">
          <span>Room:</span>
          <select value={room} onChange={(event) => setRoom(event.target.value)}>
            <option value="">All</option>
            {rooms.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className="manage-select">
          <span>Where:</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">On the wall or In storage</option>
            <option value="on-the-wall">On the wall</option>
            <option value="in-storage">In storage</option>
          </select>
        </label>
        <label className="manage-select">
          <span>Labels:</span>
          <select value={labels} onChange={(event) => setLabels(event.target.value)}>
            <option value="all">All</option>
            <option value="labelled">Labelled</option>
            <option value="needs-labels">Needs labels</option>
          </select>
        </label>
      </div>
      {message && <p className="manage-message">{message}</p>}
      {loading && <Loader text="Fetching the list." />}
      {!loading && data.items.length === 0 && <EmptyMessage title="No painting matches that." text="Try another word or take a filter off." />}
      {!loading && data.items.length > 0 && <PaintingTable paintings={data.items} selected={selected} onSelect={setSelected} onRemove={removeOne} />}
      {data.pages > 1 && (
        <div className="manage-pages">
          <button type="button" className="page-arrow page-arrow-back" aria-label="Previous page" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            <ChevronIcon size={18} />
          </button>
          <span>
            Page {page} of {data.pages}
          </span>
          <button type="button" className="page-arrow page-arrow-next" aria-label="Next page" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>
            <ChevronIcon size={18} />
          </button>
        </div>
      )}
      {selected.length > 0 && <SelectedBar count={selected.length} busy={busy} onAction={doBulk} />}
    </div>
  );
}

export default ManagePaintings;
