import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getPaintings } from "../../services/api";
import PaintingCard from "../../components/PaintingCard";
import Loader from "../../components/Loader";
import EmptyMessage from "../../components/EmptyMessage";
import { ArrowIcon } from "../../components/Icons";
import GalleryTop from "./GalleryTop";
import FilterPanel from "./FilterPanel";
import ActiveFilters from "./ActiveFilters";
import WallToolbar from "./WallToolbar";
import { readFilters, loadFilterOptions, loadSavedSlugs, wallWidth } from "./galleryHelpers";
import "./Gallery.css";

const emptyOptions = { count: 0, styles: [], mediums: [], surfaces: [], minYear: 1300, maxYear: 1930 };

function Gallery() {
  const { user } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = readFilters(searchParams);
  const filterKey = searchParams.toString();
  const [paintings, setPaintings] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("wall");
  const [options, setOptions] = useState(emptyOptions);
  const [savedSlugs, setSavedSlugs] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    loadFilterOptions().then(setOptions).catch(() => setOptions(emptyOptions));
  }, []);

  useEffect(() => {
    if (user) {
      loadSavedSlugs().then(setSavedSlugs).catch(() => setSavedSlugs([]));
    } else {
      setSavedSlugs([]);
    }
  }, [user]);

  useEffect(() => {
    let ignore = false;
    async function loadWall() {
      setLoading(true);
      try {
        const data = await getPaintings({ ...readFilters(searchParams), page: 1 });
        if (!ignore) {
          setPaintings(data.items);
          setTotal(data.total);
          setPages(data.pages);
          setPage(1);
        }
      } catch (error) {
        if (!ignore) {
          setPaintings([]);
          setTotal(0);
        }
      }
      if (!ignore) {
        setLoading(false);
      }
    }
    loadWall();
    return () => {
      ignore = true;
    };
  }, [filterKey]);

  async function showMore() {
    try {
      const data = await getPaintings({ ...filters, page: page + 1 });
      setPaintings((old) => [...old, ...data.items]);
      setPage(page + 1);
    } catch (error) {
      console.log(error.message);
    }
  }

  function changeFilters(changes) {
    const next = new URLSearchParams(searchParams);
    Object.keys(changes).forEach((key) => {
      if (!changes[key]) {
        next.delete(key);
      } else {
        next.set(key, changes[key]);
      }
    });
    setSearchParams(next);
  }

  function changeFilter(key, value) {
    changeFilters({ [key]: value });
  }

  function clearFilters() {
    setSearchParams({});
  }

  const wallClass = view === "wall" ? "painting-wall" : "painting-grid";

  return (
    <>
      <GalleryTop count={options.count} room={filters.room || ""} onRoom={(room) => changeFilter("room", room)} />
      <section className="stone-section gallery-body">
        <div className="container gallery-layout">
          <FilterPanel filters={filters} options={options} onChange={changeFilter} onChangeMany={changeFilters} open={panelOpen} onClose={() => setPanelOpen(false)} />
          <div className="gallery-main">
            <button type="button" className="btn btn-dark filters-button" onClick={() => setPanelOpen(true)}>
              Filters
            </button>
            <ActiveFilters filters={filters} onRemove={(key) => changeFilter(key, "")} onClear={clearFilters} />
            <WallToolbar total={total} sort={filters.sort || "most-viewed"} onSort={(value) => changeFilter("sort", value)} view={view} onView={setView} />
            {loading && <Loader text="Hanging the paintings." />}
            {!loading && paintings.length === 0 && (
              <EmptyMessage title="Nothing on this wall." text="Try taking a filter off.">
                <button type="button" className="text-link" onClick={clearFilters}>
                  Clear all
                </button>
              </EmptyMessage>
            )}
            {!loading && paintings.length > 0 && (
              <div className={wallClass}>
                {paintings.map((painting) => (
                  <div key={painting.slug} className="wall-item" style={view === "wall" ? { width: wallWidth(painting) } : undefined}>
                    <PaintingCard painting={painting} saved={savedSlugs.includes(painting.slug)} />
                  </div>
                ))}
              </div>
            )}
            {!loading && page < pages && (
              <div className="show-more">
                <button type="button" className="text-link" onClick={showMore}>
                  Show more paintings <ArrowIcon size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Gallery;
