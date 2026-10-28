# Goodluck: your pages

Hi Goodluck. This is a walk through the four pages that are yours: the Gallery, the Painting page, the Artists page and the Artist page. Each one lives in its own folder under `client/src/pages`, with its own CSS file next to it. Read this with the code open and you will be able to explain every file in it.

Every page talks to the server through the functions in `client/src/services/api.js`. Those functions call `fetch` with `credentials: "include"`, so the login cookie travels along by itself. When the server is unhappy it answers with `{ message }`, and the page simply shows that message.

## The Gallery (client/src/pages/Gallery)

This is the whole collection with filters down the side.

- `Gallery.jsx` is the page. It reads the filters from the address bar with `useSearchParams`, so a filtered gallery can be shared or bookmarked and the back button works. Whenever the address changes it asks the server for the first page of paintings again. It also holds the Wall or Grid choice and the Show more button, which asks for the next page and adds it under the first.
- `GalleryTop.jsx` is the dark band at the top: the intro with the real count, the room tabs, the slim search field that goes to `/search?q=`, and the cover painting on the right. The cover changes with the room.
- `FilterPanel.jsx` is the side panel. The style, medium and surface lists are built from the paintings themselves, the colour list is the six pigments, then the era slider and the two switches. On phones the panel hides and a Filters button slides it up from the bottom.
- `EraSlider.jsx` is two range inputs laid on top of each other, one for each end. It only tells the page when you let go, so the gallery does not reload while you drag.
- `ActiveFilters.jsx` is the row of tags with an x on each, plus Clear all.
- `WallToolbar.jsx` is the count line, the sort select and the Wall or Grid switch.
- `galleryHelpers.js` holds the small shared bits: the room names, the sort choices, the six pigments, `readFilters` that turns the address into an object, `loadFilterOptions` that fetches the whole list once to learn which styles, mediums and surfaces exist and the oldest and newest year, `loadSavedSlugs` for the hearts, and `wallWidth`, which turns a painting's width in centimetres into pixels so the wall hangs them at real relative sizes.

What it asks the server for: `GET /api/paintings` with the filters, `GET /api/paintings/:slug` for the cover painting, and `GET /api/saved` when someone is logged in so the hearts start filled in.

## The Painting page (client/src/pages/Painting)

One painting, from the viewing room at the top down to the credit line.

- `Painting.jsx` loads `GET /api/paintings/:slug`, which gives back the painting, the related paintings with their reasons, more by the same artist, and whether the visitor has saved it. It then sends `POST /api/paintings/:slug/view` once so the view is counted. After that it draws the sections in order: the story, Look closer, the colours, About this painting, If you like this one, and the credit.
- `ViewingRoom.jsx` is the dark top: the breadcrumb, the painting in its frame under a soft spotlight, the label on the right, and the three tools under the picture. Full screen uses the browser's own `requestFullscreen` and falls back to the zoom view if that is not allowed.
- `PaintingActions.jsx` is the row with Save, Download PDF, Download Word and Share. Save calls `POST` or `DELETE /api/saved/:slug`. A logged out visitor is sent to the login page and comes back afterwards. Share copies the address and says Link copied for a moment.
- `downloads.js` makes the two files in the browser with the jspdf and docx packages. It fetches the image, turns it into bytes, and lays out the picture, the label and the story. Nothing goes to the server. The file is only loaded when someone actually clicks a download, which keeps the first load of the site small.
- `ZoomView.jsx` is the full screen zoom. The wheel changes the scale, two fingers change it by the distance between them, and one finger or the mouse drags it around. It is all one CSS transform on the image.
- `WallView.jsx` shows the painting at its real size next to an outline of a person 1.7 metres tall. It works out how many pixels one centimetre should be from the window size, so a big canvas still fits on the screen. It only appears when the painting has a width and a height.
- `AboutList.jsx` is the list of facts, with the tags as links to the search page.

Shared parts it uses: `LookCloser` for the gold circles, `PigmentHeap` for the colours, `PaintingCard` for the related paintings, `FadeIn` so the lower sections rise in, and `openGuide` from `GuideContext` so Ask the guide opens the widget already talking about this painting.

## The Artists page (client/src/pages/Artists)

- `Artists.jsx` asks `GET /api/artists` with the search text, the era, the letter and the page. The same answer carries `spotlight`, which is Rachel Ruysch with three of her paintings, so the spotlight needs no second request. It waits a quarter of a second after you stop typing before asking, so it does not ask on every letter.
- `ArtistsTop.jsx` is the intro, the search field, the era tabs and the A to Z row.
- `ArtistCard.jsx` is one painter in the grid: the portrait in a frame that lifts on hover, the name, the years, the nationality and how many paintings we have.

## The Artist page (client/src/pages/Artist)

- `Artist.jsx` asks `GET /api/artists/:slug`, which gives the artist, their paintings oldest first, their most looked at painting and four related painters. The sort select sorts the paintings in the browser, so no second request is needed. Their paintings hang salon style, with each width worked out from the painting's real width.
- `ArtistHeader.jsx` is the breadcrumb, the portrait under a spotlight, the era label, the name, the nationality and years, the short bio, the two facts and Ask the guide. The guide opens on their most looked at painting, so it has something real to talk about.
- `LifeLine.jsx` draws the timeline from `artist.life`. It is a row across on a wide screen and a line down the side on a phone.
- `RelatedArtist.jsx` is a card for each related painter with a one line reason.

## Running it

Open two PowerShell windows.

In the first:

```
cd server
npm run dev
```

In the second:

```
cd client
npm run dev
```

Then open http://localhost:5173/gallery.

## Getting the code onto your machine

`docs/SETUP.md` walks you through Node, Git and the .env file. The short version, one line at a time in PowerShell:

```
git clone https://github.com/Chimapro123/ArtMindAI.git
cd ArtMindAI
git checkout goodluck
git pull origin develop
npm run install-all
```

Then copy the two .env.example files to .env as SETUP.md shows, fill in the server one with the values from the group, and run the seed:

```
cd server
npm run seed
cd ..
npm run dev
```

The pull from develop brings every finished page onto your branch, yours included, so you are reading and changing working code rather than starting from nothing. Keep your changes on your branch and save them the way `docs/WORKFLOW.md` describes:

```
git add .
git commit -m "gallery grid with four columns"
git push origin goodluck
```

Shared files, which means anything in `components`, `context`, `services`, `css` or App.jsx, stay as they are. If a page of yours needs something changed there, tell me and I will do it.

## Things to practice on your pages

Do these in order. Each one is small, and together they take you through everything on your pages. After every change, open the page, press F12, and look at the Console and Network tabs so you can see what happened. Drag the window down to 1024, 768 and 480 pixels wide too, because every page has to work at all three.

1. In `Gallery.css`, make the grid view four columns wide instead of three, then narrow the window to 1024 and 768 and watch which rule takes over.
2. In `galleryHelpers.js`, change `wallWidth` so the biggest painting is 520 pixels wide, and check the wall still wraps on a phone.
3. In `EraSlider.jsx`, make the two thumbs move in steps of 5 years instead of 10. Both inputs and both change functions need the new number.
4. In `ZoomView.jsx`, make the zoom open at 150 percent instead of 100.
5. In `artistHelpers.js`, add a fifth sort choice, Most saved, that sorts by `saves`, and check it appears in the select on the Artist page.
6. In `Artists.jsx`, show two of the spotlight paintings instead of three, then put it back.
7. Open the Network tab, click a room tab in the Gallery, find the request to `/api/paintings`, and read the answer. Match what you see to the fields in `docs/API.md`.

When you can explain each change and why it worked, you are ready for the questions below.

## Five questions a lecturer might ask you

**Why do the gallery filters live in the address bar instead of in state?**
So a filtered view can be shared, bookmarked and reached with the back button. `useSearchParams` gives me the values and a way to set them, and a `useEffect` that watches the address asks the server again when it changes.

**How does the wall view hang paintings at real relative sizes?**
The server sends each painting's width in centimetres. `wallWidth` multiplies that by 1.6 and keeps the result between 180 and 460 pixels, and the wall is a flex row that wraps and centres each item. A small panel really does look small next to a big canvas.

**What happens when someone who is not logged in clicks Save?**
The page checks the user from `AuthContext`. If there is nobody, it sends them to `/login` and passes the current address along, so after logging in they land back on the same painting.

**How do the PDF and Word downloads work without the server?**
Both run in the browser. I fetch the image, turn it into bytes, and hand it to jspdf or docx along with the label and the story. jspdf saves the file itself. For Word, docx gives me a blob and I click a hidden link to download it.

**How does Zoom in work on a phone?**
With touch events. When two fingers are down I remember the distance between them, and as they move the new distance divided by the old one becomes the new scale. One finger moves the picture. The image has `touch-action: none` so the browser does not scroll the page at the same time.
