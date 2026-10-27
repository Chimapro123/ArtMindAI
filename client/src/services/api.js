const API_URL = (import.meta.env.VITE_API_URL || "") + "/api";

async function request(path, options) {
  const response = await fetch(API_URL + path, { credentials: "include", ...options });
  let data = {};
  try {
    data = await response.json();
  } catch (error) {
    data = {};
  }
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }
  return data;
}

function get(path) {
  return request(path);
}

function post(path, body) {
  return request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {})
  });
}

function put(path, body) {
  return request(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {})
  });
}

function remove(path) {
  return request(path, { method: "DELETE" });
}

function postForm(path, formData) {
  return request(path, { method: "POST", body: formData });
}

function putForm(path, formData) {
  return request(path, { method: "PUT", body: formData });
}

function toQuery(params) {
  const query = new URLSearchParams();
  Object.keys(params || {}).forEach((key) => {
    const value = params[key];
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });
  const text = query.toString();
  return text ? "?" + text : "";
}

export function register(details) {
  return post("/auth/register", details);
}

export function verifyEmail(email, code) {
  return post("/auth/verify-email", { email, code });
}

export function resendCode(email) {
  return post("/auth/resend-code", { email });
}

export function logIn(email, password) {
  return post("/auth/login", { email, password });
}

export function logOut() {
  return post("/auth/logout");
}

export function getMe() {
  return get("/auth/me");
}

export function forgotPassword(email) {
  return post("/auth/forgot-password", { email });
}

export function checkResetCode(email, code) {
  return post("/auth/check-reset-code", { email, code });
}

export function resetPassword(email, code, password) {
  return post("/auth/reset-password", { email, code, password });
}

export function getProfile() {
  return get("/profile");
}

export function updateProfile(details) {
  return put("/profile", details);
}

export function uploadProfilePhoto(file) {
  const formData = new FormData();
  formData.append("photo", file);
  return postForm("/profile/photo", formData);
}

export function updatePassword(currentPassword, newPassword) {
  return put("/profile/password", { currentPassword, newPassword });
}

export function updateEmailSettings(settings) {
  return put("/profile/emails", settings);
}

export function deleteProfile() {
  return remove("/profile");
}

export function getHome() {
  return get("/home");
}

export function getPaintings(filters) {
  return get("/paintings" + toQuery(filters));
}

export function getPainting(slug) {
  return get("/paintings/" + slug);
}

export function countPaintingView(slug) {
  return post("/paintings/" + slug + "/view");
}

export function getArtists(filters) {
  return get("/artists" + toQuery(filters));
}

export function getArtist(slug) {
  return get("/artists/" + slug);
}

export function getCollections(type) {
  return get("/collections" + toQuery({ type }));
}

export function getCollection(slug) {
  return get("/collections/" + slug);
}

export function createCollection(details) {
  return post("/collections", details);
}

export function addToCollection(slug, paintingSlug, note) {
  return post("/collections/" + slug + "/paintings", { paintingSlug, note });
}

export function getSaved(filters) {
  return get("/saved" + toQuery(filters));
}

export function savePainting(slug) {
  return post("/saved/" + slug);
}

export function unsavePainting(slug) {
  return remove("/saved/" + slug);
}

export function searchBySentence(sentence) {
  return post("/search", { sentence });
}

export function askGuide(question, conversationId, paintingSlug) {
  return post("/guide/ask", { question, conversationId, paintingSlug });
}

export function getConversations() {
  return get("/guide/conversations");
}

export function getConversation(id) {
  return get("/guide/conversations/" + id);
}

export function checkImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  return postForm("/image-lab/check", formData);
}

export function getImageLabHistory() {
  return get("/image-lab/history");
}

export function getDashboard() {
  return get("/dashboard");
}

export function getAdminOverview(range) {
  return get("/admin/overview" + toQuery({ range }));
}

export function getAdminPaintings(filters) {
  return get("/admin/paintings" + toQuery(filters));
}

export function createPainting(formData) {
  return postForm("/admin/paintings", formData);
}

export function updatePainting(slug, formData) {
  return putForm("/admin/paintings/" + slug, formData);
}

export function deletePainting(slug) {
  return remove("/admin/paintings/" + slug);
}

export function labelPainting(slug) {
  return post("/admin/paintings/" + slug + "/labels");
}

export function writeStory(slug) {
  return post("/admin/paintings/" + slug + "/story");
}

export function bulkUpdatePaintings(action, slugs) {
  return post("/admin/paintings/bulk", { action, slugs });
}

export function sendMessage(details) {
  return post("/contact", details);
}

export function subscribeToNewsletter(email) {
  return post("/newsletter", { email });
}

export function recordVisit(page) {
  return post("/visits", { page });
}

export function getHealth() {
  return get("/health");
}
