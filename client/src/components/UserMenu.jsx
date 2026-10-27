import { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext, getInitials } from "../context/AuthContext";
import { ChevronIcon } from "./Icons";
import "./UserMenu.css";

function UserMenu() {
  const { user, isAdmin, logOut } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function closeMenu() {
    setOpen(false);
  }

  async function handleLogOut() {
    setOpen(false);
    await logOut();
    navigate("/");
  }

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        type="button"
        className="avatar-button"
        aria-label="Your account"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className="avatar">
          {user.photo ? <img src={user.photo} alt="" /> : getInitials(user.name)}
        </span>
        <ChevronIcon size={16} />
      </button>
      {open && (
        <div className="user-dropdown">
          <Link to="/dashboard" onClick={closeMenu}>
            Dashboard
          </Link>
          <Link to="/saved" onClick={closeMenu}>
            Saved
          </Link>
          <Link to="/profile" onClick={closeMenu}>
            Profile
          </Link>
          {isAdmin && (
            <Link to="/admin" onClick={closeMenu}>
              Admin
            </Link>
          )}
          <button type="button" onClick={handleLogOut}>
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
