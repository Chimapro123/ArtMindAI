# Miles: your pages

Hi Miles. You have three pages: the Image Lab, which any member can use, and two admin pages, Manage Paintings and the Painting Editor. Each one lives in its own folder under `client/src/pages` with its CSS beside it. The admin pages sit inside `AdminLayout`, which is the dark sidebar, and App.jsx wraps them in `AdminRoute`, so only an admin ever reaches them.

Everything goes through `client/src/services/api.js`. The uploads use a `FormData` object instead of JSON, because a file has to travel as multipart form data. The cookie goes along by itself, and when the server is unhappy it answers `{ message }`, which the page shows.

## The Image Lab (client/src/pages/ImageLab)

- `ImageLab.jsx` is the page. It keeps the chosen photo, the result from the server, whether a check is running, any error, and the visitor's last four photos. Choosing a photo sends it straight away with `POST /api/image-lab/check`. When the answer comes back it fills the right hand column and asks for the history again so the new photo appears at the bottom. The server keeps each photo in the database, and only the member who sent it can load it.
- `DropZone.jsx` is the dashed box. You can drop a file on it or click it to open the file picker. `checkFile` turns away anything that is not a JPG or PNG or is over 5 MB, with a plain message.
- `PhotoTools.jsx` shows the photo once there is one, with Crop, Rotate and Try another photo under it. While the photo is being checked a slow gold line scans across it. Crop lets you drag a box over the picture and then press Use this crop.
- `photoHelpers.js` does the picture work on a canvas in the browser. `rotatePhoto` turns the image a quarter turn and `cropPhoto` cuts out the box, and both hand back a new JPG file that is sent in place of the old one. It also has `friendlyTime` for the history and `sureWords`, which turns the confidence into Fairly sure from 70, Not very sure from 50 and Just a guess under that.
- `Results.jsx` is the right hand column: the most likely style with its bar, the two it could also be, the room and mood, the colours as pigment heaps, the honest note, Save this result, which downloads a small text file of the result, and Ask the guide about it, which opens the guide on the closest painting in the gallery.

What it asks the server for: `POST /api/image-lab/check` with the file, `GET /api/image-lab/history` for the earlier photos, and `GET /api/paintings/moonrise-over-the-sea` for the cover picture at the top.

## Manage Paintings (client/src/pages/ManagePaintings)

- `ManagePaintings.jsx` holds the search text, the three filters, the page number, the list from the server and which rows are ticked. It asks `GET /api/admin/paintings` whenever any of those change, waiting a quarter of a second after typing so it does not ask on every letter. The count line under the title uses `total` and `inStorage` from the same answer. Remove on a row calls `DELETE /api/admin/paintings/:slug`, and the floating bar calls `POST /api/admin/paintings/bulk` with an action and the ticked slugs.
- `PaintingTable.jsx` is the table: the select all box, the thumbnail and title, artist, room, style, where it is, whether it is labelled, views, and the edit and remove icons. Remove first swaps the icons for Are you sure? with Yes and No, so nothing goes by accident. A painting counts as labelled when it has a style, a room, colours and tags. On phones the CSS turns each row into a stacked card and writes the column name in front of each value.
- `SelectedBar.jsx` is the dark bar that appears when rows are ticked, with Label them for me, Move to storage, Hang on the wall and Remove.

## The Painting Editor (client/src/pages/PaintingEditor)

The same page does both adding and editing. With a slug in the address it loads that painting with `GET /api/admin/paintings/:slug`. Without one it starts empty.

- `PaintingEditor.jsx` holds the painting, the form values, the artists for the select, what the labels helper noticed, and which job is running. Choosing an image on a new painting sends `POST /api/admin/paintings` at once, which creates the painting in storage, and then moves to the edit address for it. That is what lets Label it for me and Write a first draft for me run, because both need a saved painting with an image. Keep it in storage and Hang it on the wall both send `PUT /api/admin/paintings/:slug` with every field and the status, then go back to the list.
- `EditorPicture.jsx` is the left column picture, with Choose an image before there is one and Replace image after. The server keeps the picture in the database and sends back an address under `/api/images`, which works in the Frame like any other image path.
- `NoticedBox.jsx` is the What we noticed box filled from `POST /api/admin/paintings/:slug/labels`: style, room, five colours and the tags, each with an x. Keep all of these copies them into the form.
- `EditorForm.jsx` is the right column: title, the artist select with a name field for a painter not on the list, year, the selects for room, style, medium, surface and licence, the size, where it hangs, the story with Write a first draft for me, which calls `POST /api/admin/paintings/:slug/story`, the tags, and the source link.
- `editorChoices.js` keeps the option lists and three small helpers: the empty form, turning a painting into form values, and turning form values into a `FormData` object for sending.

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

Log in with the admin account from server/.env and open http://localhost:5173/admin/paintings.

## Getting the code onto your machine

`docs/SETUP.md` walks you through Node, Git and the .env file. The short version, one line at a time in PowerShell:

```
git clone https://github.com/Chimapro123/ArtMindAI.git
cd ArtMindAI
git checkout miles
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
git commit -m "year column in the paintings table"
git push origin miles
```

Shared files, which means anything in `components`, `context`, `services`, `css` or App.jsx, stay as they are. If a page of yours needs something changed there, tell me and I will do it. For the two admin pages, log in with the admin account from the group.

## Things to practice on your pages

Do these in order. Each one is small, and together they take you through everything on your pages. After every change, open the page, press F12, and look at the Console and Network tabs so you can see what happened. Drag the window down to 1024, 768 and 480 pixels wide too, because every page has to work at all three.

1. In `photoHelpers.js`, make Rotate turn the photo the other way. One number in `rotatePhoto` changes.
2. In `PhotoTools.jsx`, show the photo's size in kilobytes under the preview. `photo.size` is in bytes.
3. In `ManagePaintings.jsx`, change `perPage` from 10 to 15 and watch the page count change.
4. In `PaintingTable.jsx`, add a column for the year, and give it a `data-label` so it still shows on a phone.
5. In `ManagePaintings.jsx`, add a Clear filters link that empties the search and puts the three selects back to their first choice.
6. In `EditorForm.jsx`, show how many tags there are under the tag list, with a quiet note when there are more than eight.
7. Open the Network tab, choose a photo in the Image Lab, find the request to `/api/image-lab/check`, and look at the form data it sent and the result that came back.

When you can explain each change and why it worked, you are ready for the questions below.

## Five questions a lecturer might ask you

**Why is the photo sent as FormData and not JSON?**
JSON is text, and a photo is a binary file. A `FormData` object is sent as multipart form data, which is what the `multer` middleware on the server reads. The field is called `image`, the same name the server expects.

**How do crop and rotate work without sending anything to the server?**
Both draw the photo onto a canvas element. Rotate makes a canvas with the width and height swapped, turns the drawing context a quarter turn and draws the image. Crop draws only the chosen part. `canvas.toBlob` then gives me a new JPG file to send instead.

**Why does choosing an image create the painting straight away?**
The labels and story helpers run on the server against a saved painting with an image on disk. If the painting did not exist yet there would be nothing for them to look at. So the editor creates it in storage first, which visitors never see, and the admin finishes it from there.

**How does the table become cards on a phone?**
With CSS only. Under 768 pixels the table head is hidden and each row becomes a block with a border. Every cell carries a `data-label` attribute, and a `::before` rule prints it in front of the value, so you still know which number is the views.

**What stops a painting being removed by mistake?**
Clicking the bin does not remove anything. It swaps the two icons for the words Are you sure? with Yes and No, and only Yes calls the delete endpoint. The bulk Remove goes through the same server route, one painting at a time.
