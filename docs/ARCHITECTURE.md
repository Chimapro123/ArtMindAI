# How ArtMind works

Hi team. Here is the shape of the whole thing in plain words, so you know where your page fits and where to look when something breaks.

## Two halves

ArtMind is two programs that run side by side.

The client is a React app made with Vite. It lives in the `client` folder, runs in the browser, and is everything the visitor sees: the rooms, the frames, the guide widget, the forms.

The server is an Express app in plain Node. It lives in the `server` folder, runs on port 5000, and is everything the visitor does not see: the database, the login cookie, the painting data, the emails, and the model service that answers for the guide, the sentence search and the Image Lab.

```
  Browser                               Our machine, later the host
+----------------------+   fetch    +------------------------------+
|  React client        | ---------> |  Express server              |
|  port 5173           | <--------- |  port 5000                   |
|                      |   JSON     |                              |
|  pages/              |            |  routes under /api           |
|  components/         |            |  models                      |
|  services/api.js     |            |  uploads/                    |
|  context/AuthContext |            |  model service               |
+----------------------+            +------+----------------+------+
                                           |                |
                                       MongoDB        outside model
                                                   (only when a key is set)
```

## How a page gets its data

A page never calls fetch itself. It imports a function from `client/src/services/api.js`, for example getPaintings, and that function does the fetch, sends the cookie, turns the answer into JSON, and throws an Error with a readable message when the server says no.

A typical page keeps three pieces of state, the data, `loading` and `errorMessage`. In `useEffect` it calls the api function. It shows a Loader while it waits, an EmptyMessage or an error line if something went wrong, and the real content once the data is there.

```
Gallery page  --calls-->  getPaintings({ room: "Landscape" })
                            |
                            v
                     fetch("/api/paintings?room=Landscape")
                            |
             Vite proxy passes /api to port 5000
                            |
                            v
                     server route sends { items, total, page, pages }
```

During development Vite proxies `/api` and `/uploads` to the server, so the browser thinks everything is on one address. That is why the login cookie works with no extra setup. Every endpoint and the shape of every answer is written down in `docs/API.md`.

## Where the paintings live

The images are in `client/public/paintings` for the large versions (longest side 1600 pixels) and `client/public/paintings/thumbs` for the small ones (600 pixels). The database never holds image bytes, only the paths.

The facts about each painting (title, artist, year, room, style, size, where it hangs, licence and source) start life in `server/data/paintings.json`, and the artists in `server/data/artists.json`. `server/seed.js` loads these two files into MongoDB, works out five colours for every painting from its thumbnail, adds tags, the look closer points and the chosen collections from `server/data/collections.json`, and makes the admin account. From then on the database is the truth, and the admin pages change it. Stories, tags, colours, look closer points, views and saves are kept on the same painting records. `server/stories.js` fills in the stories and the artist bios with the model, one at a time.

Pictures that admins upload through the Painting Editor, profile photos and Image Lab photos go to `server/uploads`, which git ignores.

## Logging in

1. Join. The client sends the name, email and password to POST /api/auth/register. The server stores the user with a hashed password and emails a six digit code through Resend, using MAIL_API_KEY and MAIL_FROM from `server/.env`. The code itself is stored hashed and dies after ten minutes. When MAIL_API_KEY is empty the code is printed in the server window instead.
2. Verify. The client sends the code to POST /api/auth/verify-email. The server marks the email as confirmed, makes a signed token and sends it back inside an httpOnly cookie called token.
3. From then on the browser sends that cookie with every request by itself. The client never sees the token, which is the point.
4. When the app starts, AuthContext calls GET /api/auth/me. If the cookie is good the server answers with the user, and the navbar shows the avatar. If it is not, or the server is off, the visitor is treated as logged out.
5. Log out. POST /api/auth/logout clears the cookie.

ProtectedRoute wraps the pages that need a user, and AdminRoute also checks that the role is admin. The server checks the same things on its side for every route, so the page guards are there for a nicer experience, not for safety.

## The guide, the sentence search and the Image Lab

All three get their answers from one place, a model service on the server. The browser never talks to an outside model and never holds a key.

- The guide (POST /api/guide/ask). The server gathers the facts and the story for the paintings the question mentions, sends them with the question to the model, and returns the answer plus any paintings to show as cards.
- The sentence search (POST /api/search). The server asks the model to pull the ideas out of the sentence, such as a subject, a mood, a colour or a time, then matches those against the rooms, tags, colours and years of the paintings.
- The Image Lab (POST /api/image-lab/check). The server sends the uploaded photo to the vision model, asks for the style, the room, the mood and the main colours, then finds the closest paintings in our own gallery.

The model settings live in `server/.env` as MODEL_API_URL, MODEL_API_KEY, MODEL_NAME and VISION_MODEL_NAME.

The fallback. If MODEL_API_KEY is empty, or a call fails or takes more than twenty seconds, `utils/askModel.js` returns null and the controller uses its own plain logic. The guide answers with the painting's facts and the first line of its story, the search reads the sentence with word lists for rooms, colours, moods, styles and eras and scores the paintings, and the Image Lab guesses from the five colours of the photo. Everything still works, just more simply, so you can build and test your pages without a key. The model names and the key only ever live in `.env`. No other file knows which model it is.

## Inside the server folder

- `server.js` sets up cors, JSON, cookies, the `/uploads` folder, every route, a 404 for unknown `/api` paths and one error handler.
- `routes` has one file per part of the API. Each one lists its paths and which middleware runs first.
- `controllers` has the functions behind the routes. Each one is async with try and catch and answers with a status and a plain message.
- `models` has the mongoose schemas: User, Painting, Artist, Collection, View, Search, Visit, Conversation, Upload, Message and Subscriber.
- `middleware` has checkLogin, checkAdmin, findUser (optional login), the rate limits and the image upload.
- `utils` has the helpers: askModel, sendEmail, getColours, the search word lists and scoring, the taste and recommendation helpers for the dashboard, and the shaping functions that turn a record into the object the client expects.
- `data` has the JSON files, and `uploads` has the files people send in.

## The admin side

Admins are ordinary users whose role is admin. The first one is made from ADMIN_EMAIL and ADMIN_PASSWORD in `server/.env` when you run the seed. The admin pages live under `/admin`, use AdminLayout for the sidebar, and only call routes under `/api/admin`.

## Folder map

```
ArtMindAI/
  package.json          dev and install-all scripts
  client/               the React app
    index.html          fonts and the root div
    public/             paintings, thumbs, artist portraits
    src/
      main.jsx          starts React, the router and AuthContext
      App.jsx           every route
      pages/            one folder per page
      components/       the shared parts
      context/          AuthContext.jsx
      services/         api.js
      css/              root.css and global.css
      images/           art files such as the frame
  server/               the Express app
    server.js           starts everything
    seed.js             fills the database
    stories.js          writes stories and bios with the model
    config/db.js        connects to MongoDB
    models/             one schema per collection
    routes/             one file per part of the API
    controllers/        the functions behind the routes
    middleware/         login checks, rate limits, uploads
    utils/              the helpers
    data/               paintings, artists, collections and extras
    uploads/            files people upload, ignored by git
  docs/                 these files and the page designs in docs/ui
```
