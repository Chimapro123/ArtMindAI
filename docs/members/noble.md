# Noble: your pages

Hi Noble. Your pages are the front door and the back office: the Home page, About, Contact, the Admin Overview and the Not Found page. You also look after the look of the whole site, which lives in `client/src/css/root.css`, `client/src/css/global.css` and the shared components, and `docs/STYLES.md` explains all of that. Each page has its own folder under `client/src/pages` with its CSS beside it.

Every page talks to the server through `client/src/services/api.js`. The cookie goes along by itself, and when the server is unhappy it answers `{ message }`, which the page shows.

## The Home page (client/src/pages/Home)

The home page asks the server for one thing, `GET /api/home`, and gets back everything it needs: the hero painting, the six rooms with a cover each, the main wall, the look closer painting, the six pigments with paintings for each, the seven stops through time, and the painting beside the free pass box. `Home.jsx` makes that one request and hands each piece to a smaller part.

- `HomeHero.jsx` is the top: the headline, the two buttons, the slim search field that goes to `/search?q=`, and The Milkmaid under a spotlight. A scroll listener makes the painting zoom in very slowly as you scroll down, and it stays still for anyone with reduced motion turned on.
- `RoomDoors.jsx` is the six arched doorways. Each one is a link to `/gallery?room=` with that room's name, so the gallery opens already filtered.
- `MainWall.jsx` is the sideways strip of this week's most looked at paintings. It is a normal scrolling box with the scrollbar hidden. The arrows scroll it by most of a screen, and the thin gold line under it is drawn from how far along the box has scrolled.
- `ColourPicker.jsx` shows the six pigments as heaps. Clicking one swaps the row of paintings under it for the ones with the most of that colour, with a short fade, and offers a link to the gallery filtered by that colour.
- `ThroughTime.jsx` is the timeline. As the section comes up the screen a scroll listener works out how much of it has arrived, and that number becomes the width of the gold line, so the line draws itself while you scroll and each stop lights up as the line reaches it.
- `HomePanels.jsx` is the pair of panels for the guide and the Image Lab, with a little sample conversation.
- `FreePass.jsx` reads the user from `AuthContext`. A logged out visitor sees Become a regular with Get your free pass going to `/join`. A logged in visitor sees Welcome back with a link to their room.

The shared `LookCloser` draws the Arnolfini Portrait section, and `FadeIn` makes the sections rise in.

## About (client/src/pages/About)

`About.jsx` is mostly words, kept in small arrays at the top of the file so the text is easy to change: the five things you can do here with their roman numerals, and the six of us with our initials and what we built. It asks `GET /api/paintings/the-art-of-painting` for the picture at the top. The section about where the paintings come from has the id `credits`, which is where the Image credits link in the footer points.

## Contact (client/src/pages/Contact)

- `Contact.jsx` is the form: name, email, the subject select with the four choices, the message, Send me a copy, and Send message. If someone is logged in their name and email are filled in for them. It sends `POST /api/contact` and then shows the server's reply, "Thanks, we've got your message." The picture at the top comes from `GET /api/paintings/man-writing-a-letter`.
- `Faq.jsx` is the accordion of questions people ask. One is open at a time, and the answer slides open with a CSS grid trick, from `0fr` to `1fr`, so no heights have to be measured.

## Admin Overview (client/src/pages/AdminOverview)

This page sits inside `AdminLayout`, and only an admin can reach it.

- `AdminOverview.jsx` asks `GET /api/admin/overview?range=` with week, month or year from the select at the top. The answer has the four figures with their change from the period before, the visits per day, the time in each room, the most looked at paintings, the top searches, and three plain sentences for the Worth knowing box. The page lays all of that out and turns each change into words like "up 9% on last week."
- `VisitsChart.jsx` is the line chart and `RoomsChart.jsx` the bar chart, both drawn with chart.js through react-chartjs-2.
- `chartSetup.js` registers the chart.js parts we use and reads the colours for the charts out of the CSS variables in root.css, so the charts use the same gold and charcoal as everything else without the hex codes being typed twice.

## Not Found (client/src/pages/NotFound)

`NotFound.jsx` is what App.jsx shows for any address that matches nothing. It draws an empty gold frame with a museum label that reads Page Not Found, Artist unknown, 404, with Take me to the gallery and Ask the guide where it went underneath. It also asks `GET /api/home` for the main wall and shows the first three paintings, so nobody leaves empty handed.

## The visit counter

App.jsx sends `POST /api/visits` with the current path every time the address changes. The server gives each browser a visitor cookie and counts one visit per browser per day, which is where the visits figure on your overview comes from.

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

Then open http://localhost:5173, and log in with the admin account from server/.env for http://localhost:5173/admin.

## Getting the code onto your machine

`docs/SETUP.md` walks you through Node, Git and the .env file. The short version, one line at a time in PowerShell:

```
git clone https://github.com/Chimapro123/ArtMindAI.git
cd ArtMindAI
git checkout noble
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
git commit -m "sixth question on the contact page"
git push origin noble
```

Shared files, which means anything in `components`, `context`, `services`, `css` or App.jsx, stay as they are. You own the look of the site, so if a shared style needs to change, tell me what and why and I will put it on chiboy. For the Admin Overview, log in with the admin account from the group.

## Things to practice on your pages

Do these in order. Each one is small, and together they take you through everything on your pages. After every change, open the page, press F12, and look at the Console and Network tabs so you can see what happened. Drag the window down to 1024, 768 and 480 pixels wide too, because every page has to work at all three.

1. In `HomeHero.jsx`, make the slow zoom stop at 5 percent instead of 10. One number in the scroll handler changes.
2. In `MainWall.css`, make the strip show four cards at once by changing the card width.
3. In `ColourPicker.jsx`, make the page start on Vermilion instead of Ultramarine.
4. In `Faq.jsx`, add a sixth question with its answer.
5. In `AdminOverview.jsx`, show the Worth knowing notes as a numbered list.
6. In `VisitsChart.jsx`, set `tension` to 0 and see the curve become straight lines.
7. In `NotFound.jsx`, show four paintings from the main wall instead of three.
8. Open the Network tab on the home page, find the request to `/api/home`, and match each part of the answer to a section of the page.

When you can explain each change and why it worked, you are ready for the questions below.

## Five questions a lecturer might ask you

**Why does the home page make a single request?**
The home page shows eight different things, and asking for each one separately would mean eight requests before the page settles. The server already has everything, so it gathers it into one answer and the page only waits once.

**How does the timeline draw itself as you scroll?**
A scroll listener reads where the section is on the screen with `getBoundingClientRect`. When the section is just entering at the bottom the number is 0, and when it is a third of the way up the screen it is 1. That number becomes the width of the gold line as a percentage, and each stop lights up once the line has passed it.

**Where do the chart colours come from?**
From the CSS variables in root.css. `chartSetup.js` calls `getComputedStyle` on the page and reads `--gold`, `--light-gold` and the others, so if the site's colours ever change the charts follow without anyone touching the chart code.

**How does the sideways strip on the home page work on a phone?**
It is an ordinary box with `overflow-x: auto` and scroll snapping, so a finger can swipe it, and the arrows just call `scrollBy` for people with a mouse. The page itself never scrolls sideways because only that box is allowed to.

**What happens when someone opens an address that does not exist?**
The last route in App.jsx is `*`, which matches anything the other routes did not. It shows the Not Found page, which keeps the navbar and footer so the visitor is still inside the gallery and can get back to it in one click.
