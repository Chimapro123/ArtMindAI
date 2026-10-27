import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPainting } from "../../services/api";
import Frame from "../../components/Frame";
import { SearchIcon } from "../../components/Icons";
import { rooms } from "./galleryHelpers";
import "./GalleryTop.css";

const covers = {
  "": "the-hay-wain",
  Abstract: "composition-vii",
  Landscape: "the-hay-wain",
  Flower: "sunflowers",
  Nature: "young-hare",
  Figurative: "girl-with-a-pearl-earring",
  Religious: "madonna-of-the-meadow"
};

function GalleryTop({ count, room, onRoom }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [cover, setCover] = useState(null);

  useEffect(() => {
    let ignore = false;
    getPainting(covers[room] || covers[""])
      .then((data) => {
        if (!ignore) {
          setCover(data.painting);
        }
      })
      .catch(() => setCover(null));
    return () => {
      ignore = true;
    };
  }, [room]);

  function handleSearch(event) {
    event.preventDefault();
    const sentence = search.trim();
    if (sentence) {
      navigate("/search?q=" + encodeURIComponent(sentence));
    }
  }

  return (
    <section className="dark-section gallery-top">
      <div className="container gallery-top-inner">
        <div className="gallery-intro">
          <p className="small-label">The gallery</p>
          <h1 className="page-title">The whole collection</h1>
          <p className="gallery-line">
            {count ? count + " paintings" : "Paintings"} across six rooms. Narrow it down, or just wander.
          </p>
          <nav className="room-list" aria-label="Rooms">
            <button type="button" className={"room-link" + (room === "" ? " room-link-active" : "")} onClick={() => onRoom("")}>
              All rooms
            </button>
            {rooms.map((name) => (
              <button key={name} type="button" className={"room-link" + (room === name ? " room-link-active" : "")} onClick={() => onRoom(name)}>
                {name}
              </button>
            ))}
          </nav>
          <form className="gallery-search" onSubmit={handleSearch} role="search">
            <SearchIcon size={18} />
            <input
              type="text"
              className="gallery-search-input"
              placeholder="Tell us what you'd like to see, like a stormy sea at sunset."
              aria-label="Search the gallery"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </form>
        </div>
        {cover && (
          <div className="gallery-cover">
            <div className="cover-spotlight"></div>
            <div className="cover-frame">
              <Frame image={cover.image} title={cover.title} artist={cover.artist} />
            </div>
            <div className="cover-label">
              <p className="small-label">{cover.room}</p>
              <p className="cover-title">{cover.title}</p>
              <p className="cover-artist">{cover.artist}</p>
              <p className="cover-artist">{cover.year}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default GalleryTop;
