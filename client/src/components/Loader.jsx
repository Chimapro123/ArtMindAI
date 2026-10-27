import "./Loader.css";

function Loader({ text }) {
  return (
    <div className="loader" role="status">
      <span className="spinner"></span>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
}

export default Loader;
