import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getAdminPainting, createPainting, updatePainting, labelPainting, writeStory, getArtists } from "../../services/api";
import Loader from "../../components/Loader";
import EditorPicture from "./EditorPicture";
import EditorForm from "./EditorForm";
import NoticedBox from "./NoticedBox";
import { emptyForm, formFromPainting, formToData } from "./editorChoices";
import "./PaintingEditor.css";

function PaintingEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [painting, setPainting] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [artists, setArtists] = useState([]);
  const [noticed, setNoticed] = useState(null);
  const [colours, setColours] = useState(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [busy, setBusy] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getArtists({ limit: 60 })
      .then((data) => setArtists(data.items))
      .catch(() => setArtists([]));
  }, []);

  useEffect(() => {
    if (!slug) {
      setPainting(null);
      setForm(emptyForm);
      setNoticed(null);
      return;
    }
    setLoading(true);
    getAdminPainting(slug)
      .then((data) => {
        setPainting(data.painting);
        setForm(formFromPainting(data.painting));
        setErrorMessage("");
      })
      .catch((error) => setErrorMessage(error.message))
      .finally(() => setLoading(false));
  }, [slug]);

  function changeField(key, value) {
    setForm((old) => ({ ...old, [key]: value }));
  }

  async function chooseImage(file) {
    setBusy("image");
    setErrorMessage("");
    try {
      if (painting) {
        const data = await updatePainting(painting.slug, formToData(form, { image: file }));
        setPainting(data.painting);
      } else {
        const data = await createPainting(formToData(form, { image: file, status: "in-storage" }));
        navigate("/admin/paintings/" + data.painting.slug + "/edit", { replace: true });
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
    setBusy("");
  }

  async function labelIt() {
    setBusy("labels");
    setErrorMessage("");
    try {
      setNoticed(await labelPainting(painting.slug));
    } catch (error) {
      setErrorMessage(error.message);
    }
    setBusy("");
  }

  function keepLabels() {
    setForm((old) => ({ ...old, style: noticed.style, room: noticed.room, tags: noticed.tags }));
    setColours(noticed.colours);
  }

  async function draftStory() {
    setBusy("story");
    setErrorMessage("");
    try {
      const data = await writeStory(painting.slug);
      changeField("story", data.story);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setBusy("");
  }

  async function save(status) {
    if (!painting) {
      setErrorMessage("Choose an image first. That is what makes the painting.");
      return;
    }
    if (!form.title.trim()) {
      setErrorMessage("The painting needs a title.");
      return;
    }
    setBusy("save");
    setErrorMessage("");
    try {
      const extra = { status };
      if (colours) {
        extra.colours = JSON.stringify(colours);
      }
      await updatePainting(painting.slug, formToData(form, extra));
      navigate("/admin/paintings");
    } catch (error) {
      setErrorMessage(error.message);
      setBusy("");
    }
  }

  if (loading) {
    return <Loader text="Opening the painting." />;
  }

  return (
    <div className="editor-page">
      <nav className="breadcrumb" aria-label="You are here">
        <Link to="/admin/paintings">Paintings</Link>
        <span>/</span>
        <span className="breadcrumb-here">{painting ? "Edit a painting" : "Add a painting"}</span>
      </nav>
      <h1 className="editor-title">{painting ? painting.title : "Hang a new painting"}</h1>
      <div className="editor-columns">
        <div className="editor-left">
          <EditorPicture painting={painting} busy={busy} onPick={chooseImage} />
          {painting && (
            <button type="button" className="btn btn-dark editor-label-button" disabled={busy !== ""} onClick={labelIt}>
              {busy === "labels" ? "Having a look." : "Label it for me"}
            </button>
          )}
          {noticed && <NoticedBox noticed={noticed} onKeep={keepLabels} onRemoveTag={(tag) => setNoticed({ ...noticed, tags: noticed.tags.filter((item) => item !== tag) })} />}
        </div>
        <EditorForm form={form} artists={artists} onChange={changeField} onDraft={draftStory} busy={busy} canDraft={Boolean(painting)} />
      </div>
      {errorMessage && <p className="error-text editor-error">{errorMessage}</p>}
      <div className="editor-bar">
        <Link to="/admin/paintings" className="editor-cancel">
          Cancel
        </Link>
        <div className="editor-bar-right">
          <button type="button" className="editor-storage" disabled={busy !== ""} onClick={() => save("in-storage")}>
            Keep it in storage
          </button>
          <button type="button" className="btn btn-light" disabled={busy !== ""} onClick={() => save("on-the-wall")}>
            {busy === "save" ? "Saving." : "Hang it on the wall"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaintingEditor;
