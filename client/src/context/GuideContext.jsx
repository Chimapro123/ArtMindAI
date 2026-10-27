import { createContext, useState } from "react";

export const GuideContext = createContext(null);

export function GuideProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [paintingSlug, setPaintingSlug] = useState(null);
  const [paintingTitle, setPaintingTitle] = useState("");

  function openGuide(slug, title) {
    setPaintingSlug(slug || null);
    setPaintingTitle(title || "");
    setOpen(true);
  }

  function closeGuide() {
    setOpen(false);
  }

  function clearPainting() {
    setPaintingSlug(null);
    setPaintingTitle("");
  }

  const value = { open, setOpen, openGuide, closeGuide, paintingSlug, paintingTitle, setPaintingTitle, clearPainting };

  return <GuideContext.Provider value={value}>{children}</GuideContext.Provider>;
}
