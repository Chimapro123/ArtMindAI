import { useState } from "react";
import { rooms, styles, mediums, surfaces, licences } from "./editorChoices";
import "./EditorForm.css";

function Field({ label, children }) {
  return (
    <label className="editor-field">
      <span className="editor-field-label">{label}</span>
      {children}
    </label>
  );
}

function Choice({ label, value, choices, onChange }) {
  return (
    <Field label={label}>
      <select className="editor-select" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Not set</option>
        {choices.map((choice) => (
          <option key={choice} value={choice}>
            {choice}
          </option>
        ))}
      </select>
    </Field>
  );
}

function EditorForm({ form, artists, onChange, onDraft, busy, canDraft }) {
  const [newTag, setNewTag] = useState("");
  const knownArtist = artists.some((artist) => artist.slug === form.artistSlug);

  function addTag(event) {
    event.preventDefault();
    const tag = newTag.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      onChange("tags", [...form.tags, tag]);
    }
    setNewTag("");
  }

  return (
    <div className="editor-form">
      <Field label="Title">
        <input type="text" className="line-input" value={form.title} onChange={(event) => onChange("title", event.target.value)} />
      </Field>
      <Field label="Artist">
        <select className="editor-select" value={knownArtist ? form.artistSlug : ""} onChange={(event) => onChange("artistSlug", event.target.value)}>
          <option value="">Someone not on the list</option>
          {artists.map((artist) => (
            <option key={artist.slug} value={artist.slug}>
              {artist.name}
            </option>
          ))}
        </select>
      </Field>
      {!knownArtist && (
        <Field label="Artist's name">
          <input type="text" className="line-input" value={form.artist} onChange={(event) => onChange("artist", event.target.value)} />
        </Field>
      )}
      <Field label="Year">
        <input type="text" className="line-input" value={form.year} placeholder="1850, or about 1850" onChange={(event) => onChange("year", event.target.value)} />
      </Field>
      <Choice label="Room" value={form.room} choices={rooms} onChange={(value) => onChange("room", value)} />
      <Choice label="Style" value={form.style} choices={styles} onChange={(value) => onChange("style", value)} />
      <Choice label="Medium" value={form.medium} choices={mediums} onChange={(value) => onChange("medium", value)} />
      <Choice label="Surface" value={form.surface} choices={surfaces} onChange={(value) => onChange("surface", value)} />
      <div className="editor-size">
        <Field label="Width in cm">
          <input type="number" min="1" className="line-input" value={form.widthCm} onChange={(event) => onChange("widthCm", event.target.value)} />
        </Field>
        <Field label="Height in cm">
          <input type="number" min="1" className="line-input" value={form.heightCm} onChange={(event) => onChange("heightCm", event.target.value)} />
        </Field>
      </div>
      <Field label="Where it hangs">
        <input type="text" className="line-input" value={form.whereItHangs} onChange={(event) => onChange("whereItHangs", event.target.value)} />
      </Field>
      <Field label="The story">
        <textarea className="editor-textarea" rows="6" value={form.story} onChange={(event) => onChange("story", event.target.value)} />
      </Field>
      {canDraft && (
        <button type="button" className="text-link editor-draft" disabled={busy !== ""} onClick={onDraft}>
          {busy === "story" ? "Writing." : "Write a first draft for me"}
        </button>
      )}
      <Field label="Tags">
        <span className="editor-tags">
          {form.tags.map((tag) => (
            <button key={tag} type="button" className="editor-tag" onClick={() => onChange("tags", form.tags.filter((item) => item !== tag))}>
              {tag} <span aria-hidden="true">&times;</span>
            </button>
          ))}
        </span>
      </Field>
      <form className="editor-add-tag" onSubmit={addTag}>
        <input type="text" className="line-input" placeholder="Add a tag and press Enter" aria-label="Add a tag" value={newTag} onChange={(event) => setNewTag(event.target.value)} />
      </form>
      <Choice label="Image licence" value={form.licence} choices={licences} onChange={(value) => onChange("licence", value)} />
      <Field label="Source link">
        <input type="url" className="line-input" value={form.sourceUrl} onChange={(event) => onChange("sourceUrl", event.target.value)} />
      </Field>
    </div>
  );
}

export default EditorForm;
