# Treasure: your pages

Hi Treasure. Your three pages are the member's own corner of the site: the Dashboard, which we call Your room, the Saved page and the Profile page. They share the `YourRoomTabs` component at the top, and App.jsx wraps all three in `ProtectedRoute`, so a visitor who is not logged in is sent to the login page first. Each page lives in its own folder under `client/src/pages` with its CSS beside it.

All three talk to the server through `client/src/services/api.js`. The cookie goes with every request by itself, and when the server is unhappy it answers `{ message }`, which the page shows.

## The Dashboard (client/src/pages/Dashboard)

- `Dashboard.jsx` asks `GET /api/dashboard` once and gets everything in one answer: the user, the counts, the favourite room, four paintings waiting for them with reasons, the last six places they have been with friendly times, their taste, and their collections. It greets them by their first name, which is just the part of their name before the first space, and shows the membership card with the month and year they joined. If the counts are all zero it shows "Look around the gallery and this room will start to fill up." with a link to the gallery.
- `TasteBar.jsx` draws the rooms they spend time in as one bar split into parts, each part as wide as its percentage, with a small key underneath.
- `RoomCollections.jsx` is the row of their collections, their own and the two made for them, with a Start a new one box that goes to the collections page.

The four figures, the Waiting for you cards and the Where you've been row are in `Dashboard.jsx` itself, using the shared `PaintingCard`, `Frame` and `PigmentHeap` parts.

## Saved (client/src/pages/Saved)

- `Saved.jsx` keeps the search text, the room, the sort, the Wall or Grid choice, the list from the server and the page number. It asks `GET /api/saved` with those whenever one changes, waiting a quarter of a second after typing. Removing a painting calls `DELETE /api/saved/:slug` and takes the card off the wall without asking the server for the list again. The wall view hangs paintings at real relative sizes from their width in centimetres, the same idea as the gallery.
- `SavedToolbar.jsx` is the row under the tabs: the search field, the room filters, the sort select, the Wall or Grid switch and Download as PDF.
- `SavedCard.jsx` wraps the shared `PaintingCard` and adds Remove and Add to a collection underneath, which appear on hover and are always there on a phone. The heart on the card also works, because `PaintingCard` tells the page through `onSave` when a painting was unsaved.
- `CollectionPicker.jsx` is the small box that opens from Add to a collection. It lists the visitor's own collections from `GET /api/collections?type=mine` and sends `POST /api/collections/:slug/paintings`, or makes a new one with `POST /api/collections` with this painting already in it.
- `savedPdf.js` builds the PDF in the browser with jspdf: a heading, then one row per painting with the small picture, the title and the artist, starting a new page when the current one is full. It is only loaded when someone clicks the download, so it does not slow the page down.

## Profile (client/src/pages/Profile)

- `Profile.jsx` asks `GET /api/profile` for the full user and lays out the four sections. When a section saves something it gets the fresh user back from the server and passes it to `setUser` in `AuthContext`, so the initials in the navbar change straight away too.
- `AboutYouForm.jsx` is the About you section: the photo circle with Change photo, the name, the email with Confirmed next to it, the line about them, and the six room buttons. Change photo sends the file at once with `POST /api/profile/photo` and shows a preview while it goes. The server keeps the photo in the database, and only that member can load it. Save changes sends `PUT /api/profile` with the name, the line and the rooms.
- `PasswordForm.jsx` asks for the current password, the new one and the new one again, and checks the new one in the browser with the same `passwordOk` rule and `StrengthLine` that the Join page uses. Then it sends `PUT /api/profile/password`.
- `EmailSwitches.jsx` is the two switches. Each one saves the moment it is flicked with `PUT /api/profile/emails`.
- `ClosePass.jsx` is the last section. Close my pass opens a confirm step where they have to type CLOSE before the button comes alive. Then it sends `DELETE /api/profile`, logs them out through `AuthContext` and sends them to the home page.

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

Log in and open http://localhost:5173/dashboard.

## Getting the code onto your machine

`docs/SETUP.md` walks you through Node, Git and the .env file. The short version, one line at a time in PowerShell:

```
git clone https://github.com/Chimapro123/ArtMindAI.git
cd ArtMindAI
git checkout treasure
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
git commit -m "collections figure on the dashboard"
git push origin treasure
```

Shared files, which means anything in `components`, `context`, `services`, `css` or App.jsx, stay as they are. If a page of yours needs something changed there, tell me and I will do it. Your three pages need a logged in member, so join with your own email first, or ask me for a test account.

## Things to practice on your pages

Do these in order. Each one is small, and together they take you through everything on your pages. After every change, open the page, press F12, and look at the Console and Network tabs so you can see what happened. Drag the window down to 1024, 768 and 480 pixels wide too, because every page has to work at all three.

1. In `Dashboard.jsx`, greet people by their full name instead of their first name, then put it back.
2. In `RoomFigures.jsx`, add a fifth figure for their collections. The count is `collections.length` in the dashboard answer, so the figure needs a new prop from `Dashboard.jsx`.
3. In `TasteBar.jsx`, pick your own tones for the six rooms.
4. In `SavedToolbar.jsx`, make the Download as PDF button say how many paintings it will include.
5. In `AboutYouForm.jsx`, show a character count under About you. The field allows 160.
6. In `ClosePass.jsx`, make people type GOODBYE instead of CLOSE, and update the label to match.
7. Open the Network tab, flick one of the email switches, find the request to `/api/profile/emails`, and read what was sent and what came back.

When you can explain each change and why it worked, you are ready for the questions below.

## Five questions a lecturer might ask you

**Why does the dashboard make only one request?**
Because the server already knows everything the page needs about this visitor, it is simpler and faster to gather it in one answer than to make the page ask six times. The page just reads the pieces out of that one object.

**How does the taste bar get its widths?**
The server sends each room with a percentage. Every part of the bar gets `width: percent%` as an inline style and the bar is a flex row, so the parts line up and add to the full width.

**When a painting is removed from Saved, why not ask the server for the list again?**
The server already confirmed the removal, so the page just filters that painting out of the list it holds and takes one off the count. That feels instant, and it saves a request.

**How does the profile keep the navbar in step with a name change?**
`AuthContext` holds the logged in user for the whole app. After a successful save the server sends the updated user back, and the page passes it to `setUser`, so anything that reads the context, like the initials in the navbar, redraws with the new name.

**What stops someone closing their pass by accident?**
Two steps. Close my pass only opens a confirm box, and the real button stays disabled until they have typed the word CLOSE. Only then does the delete request go to the server, which clears the cookie and deletes their data.
