# ArtMind API

This is the agreement between the client and the server. Every page talks to the server through the functions in `client/src/services/api.js`, and the server on Chiboy's branch follows this file exactly. If something here needs to change, change this file first and tell the group, so both sides move together.

## The basics

- Every path starts with `/api`. In development Vite proxies `/api` and `/uploads` to the server, so the client calls them on its own address.
- Requests and answers are JSON, except the uploads, which are `multipart/form-data`.
- Logging in sets an httpOnly cookie called `token`. The browser sends it by itself because every fetch in `api.js` uses `credentials: "include"`.
- Lists come back as `{ items, total, page, pages }`. `page` starts at 1 and `limit` is 12 unless the request says otherwise.
- Errors come back with a fitting status code and a body of `{ message }`. The client shows that message to the visitor as it is.
- "Logged in" means the request needs the cookie. Without it the server answers 401. "Admin only" means the user's role must be `admin`, otherwise the server answers 403.
- Dates are ISO strings. Slugs are lowercase words joined by hyphens, like `the-starry-night`.

## The objects

### Painting

| Field | Type | What it is |
| --- | --- | --- |
| slug | string | The id used in links, like `hunters-in-the-snow` |
| title | string | |
| artist | string | The artist's name as shown |
| artistSlug | string | Links to `/artists/:slug` |
| year | string | What is printed on the label, like `1565` or `about 1818` |
| yearValue | number | A plain number for sorting and the era filter |
| room | string | One of Abstract, Landscape, Flower, Nature, Figurative, Religious |
| style | string | Renaissance, Northern Renaissance, Gothic, Baroque, Romanticism, Realism, Impressionism, Post Impressionism, Ukiyo-e, Modern |
| medium | string | Oil, Tempera, Fresco, Watercolour, Pastel, Woodblock print |
| surface | string | Canvas, Panel, Paper, Wall |
| widthCm | number | |
| heightCm | number | |
| whereItHangs | string | The museum, or `Private collection` |
| image | string | Path of the large image, like `/paintings/hunters-in-the-snow.jpg` |
| thumb | string | Path of the small image |
| story | string | A few short paragraphs about the painting |
| tags | array of strings | Plain words like `winter`, `hunters`, `snow` |
| colours | array of { name, hex, percent } | The pigments, biggest share first |
| lookCloser | array of { x, y, title, note } | Points on the picture. `x` and `y` are percentages from the top left |
| views | number | |
| saves | number | |
| status | string | `on-the-wall` or `in-storage`. Visitors only ever see paintings on the wall |
| licence | string | `Public domain` or `CC0` |
| sourceUrl | string | Where the image came from |

### Artist

| Field | Type | What it is |
| --- | --- | --- |
| slug | string | |
| name | string | |
| born | number | |
| died | number | |
| nationality | string | |
| era | string | The style name used for the era filter |
| portrait | string | Path of the portrait image. If the artist has no portrait the server sends the thumb of one of their paintings |
| portraitLicence | string or null | |
| portraitSourceUrl | string or null | |
| about | string | One or two sentences |
| quote | { text, source } or null | |
| life | array of { year, text } | Moments for the timeline |
| paintingCount | number | How many of their paintings are on the wall |

### User

| Field | Type | What it is |
| --- | --- | --- |
| id | string | |
| name | string | |
| email | string | |
| role | string | `member` or `admin` |
| photo | string or null | Path under `/uploads`, or null to show initials |
| about | string | |
| rooms | array of strings | The rooms they said they like |
| emails | { newsletter, newCollections } | Both booleans |
| emailConfirmed | boolean | |
| memberSince | string | Date |

### Collection

| Field | Type | What it is |
| --- | --- | --- |
| slug | string | |
| title | string | |
| description | string | |
| type | string | `chosen` (made by us), `made-for-you` (made by the server for one visitor) or `mine` (made by the visitor) |
| owner | string or null | User id for `mine` and `made-for-you`, otherwise null |
| cover | string | Thumb path of the first painting |
| paintingCount | number | |
| minutes | number | A rough reading time, about two minutes per painting |
| paintings | array of { painting, note } | Only sent by the single collection endpoint |
| createdAt | string | |

### Conversation

| Field | Type | What it is |
| --- | --- | --- |
| id | string | |
| title | string | Made by the server from the first question |
| messages | array of { from, text, paintings, sentAt } | `from` is `visitor` or `guide`. `paintings` is a list of Painting objects to show as cards, often empty |
| startedAt | string | |
| updatedAt | string | |

### Image Lab result

| Field | Type | What it is |
| --- | --- | --- |
| id | string | |
| image | string | Path of the uploaded photo under `/uploads` |
| style | string | The most likely style |
| confidence | number | 0 to 100 |
| otherStyles | array of { style, confidence } | |
| room | string | |
| mood | string | A few words like `Still and thoughtful` |
| colours | array of { name, hex, percent } | |
| closest | array of { painting, reason } | Up to four paintings from the gallery |
| note | string | A short honest line about how sure the guess is |
| checkedAt | string | |

## Auth

All under `/api/auth`. None of these need to be logged in.

### POST /api/auth/register

Sends `{ name, email, password, rooms }`. `rooms` is an array of room names and can be empty.
Returns 201 and `{ message, email }`. The server emails a six digit code that works for ten minutes.
Errors: 400 if a field is missing or the password is shorter than 8 characters, 409 if the email is already taken.

### POST /api/auth/verify-email

Sends `{ email, code }`.
Returns `{ user }` and sets the cookie, so the visitor is logged in straight away.
Errors: 400 if the code is wrong or has run out.

### POST /api/auth/resend-code

Sends `{ email }`. Returns `{ message }`. The server will not send more than one code a minute.

### POST /api/auth/login

Sends `{ email, password }`.
Returns `{ user }` and sets the cookie.
Errors: 401 if the email or password is wrong. 403 with `{ message, needsVerification: true }` if the email was never confirmed, so the client can send them to the verify page.

### POST /api/auth/logout

Sends nothing. Returns `{ message }` and clears the cookie.

### GET /api/auth/me

Returns `{ user }` when the cookie is good, otherwise 401. The client calls this once when it starts. If the server cannot be reached the client treats the visitor as logged out.

### POST /api/auth/forgot-password

Sends `{ email }`. Returns `{ message }`. The answer is the same whether or not the email exists, so nobody can use it to look up members. The server emails a six digit code.

### POST /api/auth/check-reset-code

Sends `{ email, code }`. Returns `{ message }` if the code is right, 400 if not.

### POST /api/auth/reset-password

Sends `{ email, code, password }`. Returns `{ message }`. The code stops working after this.

## Profile

All under `/api/profile`. All logged in.

### GET /api/profile

Returns `{ user }`.

### PUT /api/profile

Sends any of `{ name, about, rooms }`. Returns `{ user }`.

### POST /api/profile/photo

Multipart form with one file field called `photo` (JPG or PNG, up to 5 MB). Returns `{ user }` with the new photo path.

### PUT /api/profile/password

Sends `{ currentPassword, newPassword }`. Returns `{ message }`. 400 if the current one is wrong or the new one is too short.

### PUT /api/profile/emails

Sends `{ newsletter, newCollections }`, both booleans. Returns `{ user }`.

### DELETE /api/profile

Sends nothing. Deletes the user, their saved paintings, their collections, their conversations and their Image Lab history. Returns `{ message }` and clears the cookie.

## Home

### GET /api/home

Returns everything the home page needs in one go:

```
{
  hero: Painting,
  rooms: [ { name, description, painting: Painting } ],
  mainWall: [ Painting ],
  lookCloser: Painting,
  colours: [ { name, hex, paintings: [ Painting ] } ],
  throughTime: [ { style, era, painting: Painting } ],
  regular: Painting
}
```

`mainWall` is the five most viewed paintings this week. `throughTime` has one painting per style, oldest first. `regular` is the painting shown next to the free pass box.

## Paintings

### GET /api/paintings

Query values, all optional: `room`, `style`, `medium`, `surface`, `colour` (a pigment name like `Ultramarine`), `fromYear`, `toYear`, `hideSeen` (`true` hides paintings the logged in visitor has already opened), `curated` (`true` shows only our picks), `sort`, `page`, `limit`.

`sort` is one of `most-viewed` (the default), `most-saved`, `newest`, `oldest`, `title`.

Returns a list of Painting objects. Only paintings on the wall are included.

### GET /api/paintings/:slug

Returns `{ painting, related, saved }`. `related` is up to four paintings that go well with it. `saved` is true if the logged in visitor has saved it, otherwise false. 404 if the slug does not exist or the painting is in storage.

### POST /api/paintings/:slug/view

Sends nothing. Adds one to the painting's views and, if the visitor is logged in, adds it to the places they have been. Returns `{ views }`.

## Artists

### GET /api/artists

Query values, all optional: `era` (a style name), `letter` (one letter, matches the surname), `search` (part of a name), `page`, `limit`.

Returns a list of Artist objects plus one extra field, `spotlight`, which is the artist to feature at the top of the page.

### GET /api/artists/:slug

Returns `{ artist, paintings, mostViewed, related }`. `paintings` are theirs, oldest first. `mostViewed` is one Painting. `related` is up to four other Artist objects.

## Collections

### GET /api/collections

Query value `type`: `all` (the default), `chosen` or `mine`. `mine` needs the visitor to be logged in and also includes the ones made for them.

Returns a list of Collection objects without their paintings.

### GET /api/collections/:slug

Returns `{ collection, next }`. `collection` includes `paintings`. `next` is the collection to suggest at the bottom, or null.

### POST /api/collections (logged in)

Sends `{ title, description, paintingSlugs }`. Returns 201 and `{ collection }`.

### POST /api/collections/:slug/paintings (logged in)

Sends `{ paintingSlug, note }`. Only the owner can add. Returns `{ collection }`.

## Saved

All under `/api/saved`. All logged in.

### GET /api/saved

Query values, all optional: `room`, `search`, `sort` (`most-recent` or `title`), `page`, `limit`. Returns a list of Painting objects, each with an extra `savedAt`.

### POST /api/saved/:slug

Returns `{ saved: true, saves }`.

### DELETE /api/saved/:slug

Returns `{ saved: false, saves }`.

## Search

### POST /api/search

Sends `{ sentence }`, the words the visitor typed.

Returns a list of Painting objects with two extra fields: `parts`, the ideas pulled out of the sentence as `[ { text, type } ]` where `type` is `subject`, `mood`, `colour`, `time` or `room`, and `suggestions`, four sentences to try next.

## Guide

All under `/api/guide`. All logged in.

### POST /api/guide/ask

Sends `{ question, conversationId, paintingSlug }`. `conversationId` is null for a new conversation. `paintingSlug` is optional and tells the guide which painting the visitor is looking at.

Returns `{ answer, paintings, conversationId, title }`. `paintings` is a list of Painting objects to show as cards under the answer, often empty.

If the model service cannot be reached the server still answers 200 with a plain answer made from the painting's story. The client shows "The guide is resting right now. Try again in a moment." only when the request itself fails.

### GET /api/guide/conversations

Returns a list of conversations without their messages, newest first.

### GET /api/guide/conversations/:id

Returns `{ conversation }` with all its messages. 404 if it belongs to someone else.

## Image Lab

All under `/api/image-lab`. All logged in.

### POST /api/image-lab/check

Multipart form with one file field called `image` (JPG or PNG, up to 5 MB). Returns `{ result }`, an Image Lab result object.

### GET /api/image-lab/history

Returns a list of Image Lab result objects for this visitor, newest first.

## Dashboard

### GET /api/dashboard (logged in)

```
{
  user: User,
  counts: { lookedAt, saved, searches },
  favouriteRoom: string,
  waitingForYou: [ { painting: Painting, reason } ],
  whereYouHaveBeen: [ { painting: Painting, when } ],
  taste: {
    rooms: [ { room, percent } ],
    colours: [ { name, hex, percent } ]
  },
  collections: [ Collection ]
}
```

`when` is a short phrase like `2 hours ago` or `Monday`, made by the server.

## Admin

All under `/api/admin`. All admin only.

### GET /api/admin/overview

Query value `range`: `week` (the default), `month` or `year`.

```
{
  visits, visitsChange, saves, searches, newPasses,
  visitsByDay: [ { day, count } ],
  timeInRooms: [ { room, percent } ],
  mostLookedAt: [ { painting: Painting, views, saves } ],
  searchedFor: [ { sentence, count } ],
  notes: [ string ]
}
```

`visitsChange` is a percentage compared to the range before, and can be negative.

### GET /api/admin/paintings

Query values, all optional: `search`, `room`, `status` (`on-the-wall`, `in-storage` or `all`, the default), `labels` (`labelled`, `needs-labels` or `all`), `page`, `limit`.

Returns a list of Painting objects of every status, plus one extra field, `inStorage`, the number in storage.

### POST /api/admin/paintings

Multipart form. Text fields: `title`, `artistSlug`, `year`, `room`, `style`, `medium`, `surface`, `widthCm`, `heightCm`, `whereItHangs`, `story`, `tags` (JSON string), `colours` (JSON string), `lookCloser` (JSON string), `status`, `licence`, `sourceUrl`. One file field called `image`. The server makes the slug, the large image and the thumb.

Returns 201 and `{ painting }`.

### PUT /api/admin/paintings/:slug

Same shape as POST, every field optional. `image` is optional. Returns `{ painting }`.

### DELETE /api/admin/paintings/:slug

Returns `{ message }`. Also removes it from everyone's saved lists and collections.

### POST /api/admin/paintings/:slug/labels

Sends nothing. The server shows the image to the vision model and returns `{ style, room, colours, tags }`. Nothing is saved until the admin sends a PUT.

### POST /api/admin/paintings/:slug/story

Sends nothing. Returns `{ story }`, a first draft. Nothing is saved until the admin sends a PUT.

### POST /api/admin/paintings/bulk

Sends `{ action, slugs }`. `action` is `label`, `storage`, `wall` or `remove`. Returns `{ message, count }`.

## Contact

### POST /api/contact

Sends `{ name, email, subject, message, sendCopy }`. `subject` is one of the four choices on the contact page. Returns `{ message }`.

## Newsletter

### POST /api/newsletter

Sends `{ email }`. Returns `{ message }`. Answers 200 even if the email was already on the list.

## Visits

### POST /api/visits

Sends `{ page }`, the path the visitor opened, like `/gallery`. Returns `{ ok: true }`. The client calls this once per page view and ignores the answer.

## Health

### GET /api/health

Returns `{ status: "ok" }`. This is the one route that already exists on develop.
