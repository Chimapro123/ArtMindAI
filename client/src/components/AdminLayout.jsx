import { useContext } from "react";
import { NavLink, Link, Outlet } from "react-router-dom";
import { AuthContext, getInitials } from "../context/AuthContext";
import { MonitorIcon, ImageIcon, PlusSquareIcon, BackIcon } from "./Icons";
import "./AdminLayout.css";

function AdminLayout() {
  const { user } = useContext(AuthContext);

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <Link to="/admin" className="logo">
            ArtMind
          </Link>
          <p className="small-label">Curator's Desk</p>
        </div>
        <nav className="admin-nav" aria-label="Admin">
          <NavLink to="/admin" end className="admin-link">
            <MonitorIcon />
            Overview
          </NavLink>
          <NavLink to="/admin/paintings" end className="admin-link">
            <ImageIcon />
            Paintings
          </NavLink>
          <NavLink to="/admin/paintings/new" className="admin-link">
            <PlusSquareIcon />
            Add a painting
          </NavLink>
          <Link to="/" className="admin-link">
            <BackIcon />
            Back to the gallery
          </Link>
        </nav>
        <div className="admin-user">
          <span className="avatar">{getInitials(user.name)}</span>
          <div>
            <p className="admin-user-name">{user.name}</p>
            <p className="admin-user-role">Admin</p>
          </div>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
