import { Link } from "react-router-dom";
import "./RoomDoors.css";

function RoomDoors({ rooms }) {
  return (
    <div className="room-doors">
      {rooms.map((room) => (
        <Link key={room.name} to={"/gallery?room=" + encodeURIComponent(room.name)} className="room-door">
          <span className="door-arch">
            {room.painting && <img src={room.painting.thumb} alt={room.painting.title + " by " + room.painting.artist} loading="lazy" />}
          </span>
          <span className="door-name">{room.name}</span>
          <span className="door-line">{room.description}</span>
        </Link>
      ))}
    </div>
  );
}

export default RoomDoors;
