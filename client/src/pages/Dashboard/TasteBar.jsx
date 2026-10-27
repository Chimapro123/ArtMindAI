import "./TasteBar.css";

const roomTones = {
  Landscape: "#3f4f73",
  Figurative: "#6a6560",
  Religious: "#8a7347",
  Nature: "#5c7560",
  Flower: "#a98a4a",
  Abstract: "#7a8a6a"
};

function TasteBar({ rooms }) {
  const shown = rooms.filter((room) => room.percent > 0);

  if (shown.length === 0) {
    return <p className="taste-empty">Open a few paintings and your rooms will show up here.</p>;
  }

  return (
    <div className="taste-bar">
      <div className="taste-track">
        {shown.map((room) => (
          <span key={room.room} className="taste-part" style={{ width: room.percent + "%", backgroundColor: roomTones[room.room] || "#6a6560" }} title={room.room + " " + room.percent + "%"}></span>
        ))}
      </div>
      <ul className="taste-keys">
        {shown.map((room) => (
          <li key={room.room} className="taste-key">
            <span className="taste-key-dot" style={{ backgroundColor: roomTones[room.room] || "#6a6560" }}></span>
            <span className="taste-key-room">{room.room}</span>
            <span className="taste-key-percent">{room.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TasteBar;
