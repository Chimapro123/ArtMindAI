import { NavLink } from "react-router-dom";
import "./YourRoomTabs.css";

function YourRoomTabs() {
  return (
    <nav className="room-tabs" aria-label="Your room">
      <NavLink to="/dashboard" className="room-tab">
        Your room
      </NavLink>
      <NavLink to="/saved" className="room-tab">
        Saved
      </NavLink>
      <NavLink to="/profile" className="room-tab">
        Profile
      </NavLink>
    </nav>
  );
}

export default YourRoomTabs;
