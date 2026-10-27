import { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CloseIcon } from "./Icons";
import "./MobileMenu.css";

function MobileMenu({ onClose }) {
  const { user, isAdmin, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  async function handleLogOut() {
    onClose();
    await logOut();
    navigate("/");
  }

  return (
    <div className="mobile-menu">
      <div className="mobile-menu-top">
        <span className="logo">ArtMind</span>
        <button type="button" className="icon-button" aria-label="Close menu" onClick={onClose}>
          <CloseIcon size={24} />
        </button>
      </div>
      <nav className="mobile-links" aria-label="Main">
        <Link to="/gallery" onClick={onClose}>
          Gallery
        </Link>
        <Link to="/artists" onClick={onClose}>
          Artists
        </Link>
        <Link to="/collections" onClick={onClose}>
          Collections
        </Link>
        <Link to="/image-lab" onClick={onClose}>
          Image Lab
        </Link>
        <Link to="/guide" onClick={onClose}>
          Guide
        </Link>
      </nav>
      <div className="mobile-account">
        {user ? (
          <>
            <Link to="/dashboard" onClick={onClose}>
              Dashboard
            </Link>
            <Link to="/saved" onClick={onClose}>
              Saved
            </Link>
            <Link to="/profile" onClick={onClose}>
              Profile
            </Link>
            {isAdmin && (
              <Link to="/admin" onClick={onClose}>
                Admin
              </Link>
            )}
            <button type="button" onClick={handleLogOut}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={onClose}>
              Log in
            </Link>
            <Link to="/join" className="btn btn-light" onClick={onClose}>
              Join
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default MobileMenu;
