import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { GuideContext } from "../../context/GuideContext";
import { checkImage, getImageLabHistory, getPainting } from "../../services/api";
import Frame from "../../components/Frame";
import PaintingCard from "../../components/PaintingCard";
import DropZone from "./DropZone";
import PhotoTools from "./PhotoTools";
import Results from "./Results";
import { friendlyTime } from "./photoHelpers";
import "./ImageLab.css";

function ImageLab() {
  const { openGuide } = useContext(GuideContext);
  const [photo, setPhoto] = useState(null);
  const [result, setResult] = useState(null);
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [cover, setCover] = useState(null);

  function loadHistory() {
    getImageLabHistory()
      .then((data) => setHistory(data.items))
      .catch(() => setHistory([]));
  }

  useEffect(() => {
    loadHistory();
    getPainting("moonrise-over-the-sea")
      .then((data) => setCover(data.painting))
      .catch(() => setCover(null));
  }, []);

  async function send(file) {
    setSending(true);
    setErrorMessage("");
    setResult(null);
    try {
      const data = await checkImage(file);
      setResult(data.result);
      loadHistory();
    } catch (error) {
      setErrorMessage(error.message);
    }
    setSending(false);
  }

  function choosePhoto(file) {
    setPhoto(file);
    setResult(null);
    setErrorMessage("");
    send(file);
  }

  function startAgain() {
    setPhoto(null);
    setResult(null);
    setErrorMessage("");
  }

  function askAboutIt() {
    const closest = result && result.closest.length ? result.closest[0].painting : null;
    openGuide(closest ? closest.slug : null, closest ? closest.title : "");
  }

  return (
    <>
      <section className="dark-section lab-top">
        <div className="container lab-top-inner">
          <div>
            <p className="small-label">Image Lab</p>
            <h1 className="page-title">Show us a painting</h1>
            <p className="lab-line">Took a photo of a painting in a museum, a book or on a friend's wall? Upload it and we'll tell you what we can.</p>
          </div>
          {cover && (
            <div className="lab-cover">
              <div className="lab-glow"></div>
              <Link to={"/painting/" + cover.slug} className="lab-cover-frame">
                <Frame image={cover.image} title={cover.title} artist={cover.artist} />
              </Link>
            </div>
          )}
        </div>
      </section>
      <section className="stone-section lab-body">
        <div className="container lab-columns">
          <div className="lab-photo-column">
            <p className="small-label">Your photo</p>
            {!photo && <DropZone onPick={choosePhoto} onError={setErrorMessage} />}
            {photo && <PhotoTools photo={photo} sending={sending} onChange={choosePhoto} onReset={startAgain} />}
            {errorMessage && <p className="error-text">{errorMessage}</p>}
          </div>
          <div className="lab-result-column">
            <p className="small-label">What we think</p>
            {!result && !sending && <p className="lab-waiting">Pick a photo and this side fills in.</p>}
            {sending && <p className="lab-waiting">Having a good look at it.</p>}
            {result && <Results result={result} onAsk={askAboutIt} />}
          </div>
        </div>
      </section>
      {result && result.closest.length > 0 && (
        <section className="dark-section">
          <div className="container">
            <p className="small-label">Closest in our gallery</p>
            <div className="closest-grid">
              {result.closest.map((item) => (
                <div key={item.painting.slug}>
                  <PaintingCard painting={item.painting} />
                  <p className="closest-reason">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {history.length > 0 && (
        <section className="stone-section">
          <div className="container">
            <p className="small-label">Your earlier photos</p>
            <div className="earlier-grid">
              {history.map((item) => (
                <button key={item.id} type="button" className="earlier-photo" onClick={() => setResult(item)}>
                  <span className="earlier-frame">
                    <img src={item.image} alt={"Your photo, " + item.style} loading="lazy" />
                  </span>
                  <span className="earlier-style">{item.style}</span>
                  <span className="earlier-when">{friendlyTime(item.checkedAt)}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default ImageLab;
