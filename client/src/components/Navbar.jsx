import { useState, useEffect, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { SearchIcon, MenuIcon, CloseIcon } from "./Icons";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";
import "./Navbar.css";

const navLinks = [
  { to: "/gallery", text: "Gallery" },
  { to: "/artists", text: "Artists" },
  { to: "/collections", text: "Collections" },
  { to: "/image-lab", text: "Image Lab" },
  { to: "/guide", text: "Guide" }
];

function Navbar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleSearch(event) {
    event.preventDefault();
    const sentence = searchText.trim();
    if (!sentence) {
      return;
    }
    setSearchOpen(false);
    setSearchText("");
    navigate("/search?q=" + encodeURIComponent(sentence));
  }

  const navClass = "navbar" + (scrolled ? " navbar-scrolled" : "");

  return (
    <header className={navClass}>
      <div className="container nav-inner">
        <Link to="/" className="logo">
          ArtMind
        </Link>
        <nav className="nav-links" aria-label="Main">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className="nav-link">
              {link.text}
            </NavLink>
          ))}
        </nav>
        <div className="nav-right">
          <button
            type="button"
            className="icon-button"
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <SearchIcon />
          </button>
          {user ? (
            <UserMenu />
          ) : (
            <div className="nav-account">
              <Link to="/login" className="nav-link">
                Log in
              </Link>
              <Link to="/join" className="btn btn-light nav-join">
                Join
              </Link>
            </div>
          )}
          <button
            type="button"
            className="icon-button menu-button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon />
          </button>
        </div>
      </div>
      {searchOpen && (
        <form className="search-bar" onSubmit={handleSearch}>
          <div className="container search-inner">
            <SearchIcon />
            <input
              type="search"
              className="search-input"
              placeholder="Tell us what you'd like to see, like a stormy sea at sunset."
              aria-label="Search the gallery"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              autoFocus
            />
            <button type="submit" className="text-link">
              Search
            </button>
            <button
              type="button"
              className="icon-button"
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
            >
              <CloseIcon />
            </button>
          </div>
        </form>
      )}
      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
    </header>
  );
}

export default Navbar;
