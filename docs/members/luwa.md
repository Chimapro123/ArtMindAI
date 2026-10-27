# Luwa: your pages

Hi Luwa. These are your four pages: Search Results, the Guide, Collections and a single Collection. Each one has its own folder under `client/src/pages` with its CSS next to it. Go through this with the code open and you will be able to say what every file is for and why it is there.

All four pages talk to the server through `client/src/services/api.js`. Every call there uses `fetch` with `credentials: "include"`, so the login cookie goes with it. If the server is not happy it answers `{ message }`, and the page shows that message as it is.

## Search Results (client/src/pages/SearchResults)

The page that answers a sentence typed into any search box on the site.

- `SearchResults.jsx` reads `?q=` from the address with `useSearchParams`. Whenever that changes it sends `POST /api/search` with the sentence and keeps the answer, which has the paintings (each with a `why` line), the `parts` the server understood, and four `suggestions`. The big search field at the top sends you to a new address rather than searching on the spot, so the back button and sharing both work. Removing an understood tag joins the remaining parts back into a sentence and searches again with that.
- `UnderstoodTags.jsx` is the row of tags with an x on each, with the line "Not quite right? Change any of these."
- `TryThese.jsx` is the dark band at the bottom with four big sentences. Clicking one searches for it.

When nothing matches, the page says "Nothing matched that. Try fewer words, or one of these." and the four sentences are right underneath.

What it asks the server for: `POST /api/search` with `{ sentence }`.

## The Guide (client/src/pages/Guide)

The full page version of the little chat in the corner. The route is wrapped in `ProtectedRoute` in App.jsx, so only logged in visitors get here.

- `Guide.jsx` holds everything that changes: the list of conversations, which one is open, its messages, whether the guide is typing, and the painting from `?painting=` in the address. Sending a question adds it to the messages straight away, shows the typing dots, then sends `POST /api/guide/ask` with the question, the conversation id (null for a new one) and the painting slug. The answer and its painting cards go under it. If the request itself fails it shows "The guide is resting right now. Try again in a moment."
- `ConversationList.jsx` is the dark side column: New conversation and the list of earlier ones from `GET /api/guide/conversations`. Picking one asks `GET /api/guide/conversations/:id` for its messages. On phones the list folds away behind a Your conversations button.
- `GuideMessages.jsx` draws the messages. The guide's replies are in the serif and the visitor's in small panels on the right. Painting cards in a reply have Open painting links. A `useEffect` scrolls to the newest message every time the list changes.
- `GuideComposer.jsx` is the bottom part: the Talking about tag with its x, the four suggestion tags, the input, the image icon that goes to the Image Lab, the send button and the small note.

What it asks the server for: `GET /api/guide/conversations`, `GET /api/guide/conversations/:id`, `POST /api/guide/ask`, and `GET /api/paintings/:slug` once to show the title in the Talking about tag.

## Collections (client/src/pages/Collections)

- `Collections.jsx` asks `GET /api/collections?type=all`. For a logged in visitor that list already has the two made for you collections and their own, so the three tabs only filter what is there. It also asks `GET /api/collections/good-dogs` for this week's show, because the list endpoint does not send paintings, and `GET /api/paintings/the-milkmaid` for the cover at the top. It waits for `AuthContext` to finish checking who is logged in before asking, so it only asks once.
- `CollectionCard.jsx` is one card in the grid: the lead painting, the title, the line, the count, and a tag that says Chosen by us, Made for you or Yours.
- `NameModal.jsx` is the small box that asks for a name when you press Start a collection. It sends `POST /api/collections` and then opens the new collection. A logged out visitor is sent to the login page instead.

## A Collection (client/src/pages/Collection)

- `Collection.jsx` asks `GET /api/collections/:slug`, which gives the collection with its paintings and the `next` one to suggest at the end. Start the walk scrolls to the first painting. Save adds every painting in the room to the visitor's saved list, one `POST /api/saved/:slug` at a time. Share copies the address.
- `WalkStop.jsx` is one painting on the walk: the number, the framed picture, the title, the artist and year, and the note. The stops take turns, picture on the left then on the right, and each one sits in `FadeIn` so it rises in as you scroll down. When the collection has a point for a painting, a gold circle sits at that `x` and `y` on the picture, which is how Good dogs shows where the dog is.

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

Then log in and open http://localhost:5173/guide.

## Five questions a lecturer might ask you

**How does removing an understood tag search again without it?**
The server sends the parts it understood, each with a plain `text`. When you click the x on one, I take the other parts, join their texts with spaces into a new sentence, and go to `/search?q=` with that. The page sees the new address and searches again.

**Why does the guide page keep the conversation id?**
The first answer from `POST /api/guide/ask` comes back with a `conversationId`. I keep it in state and send it with every later question, so the server adds to the same conversation and the guide can see what was said earlier.

**How does the page scroll to the newest message?**
There is an empty div at the bottom of the messages with a `ref`. A `useEffect` that runs whenever the messages or the typing state change calls `scrollIntoView` on it.

**Where do the made for you collections come from?**
The server builds them on the spot from what the visitor has opened and saved, so they are never stored. The list endpoint includes them when someone is logged in, and their slugs start with `for-you-`.

**How do the gold circles on the walk know where to sit?**
Each painting in a collection can carry an `x` and `y` in percent. The circle is positioned absolutely inside the picture box with `left` and `top` set from those numbers, so it lands on the same spot whatever size the picture is drawn at.
