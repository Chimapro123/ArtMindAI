# Chiboy's part of ArtMind

Hi Chiboy. This is your own map of what you built, so you can explain any piece of it without opening the code. You own the four pages that let people in, and the whole server behind the site.

## Your four pages

They all live in `client/src/pages`, one folder each, and they all share one layout.

### The split screen

`pages/Login/SplitScreen.jsx` is the frame around all four pages. The left half is the dark wall with one painting in a gold frame under a soft spotlight, its museum label, a counter like 02 / 04 and four thin lines. Every seven seconds it fades to the next of four paintings: The Return of the Herd, Young Woman with a Water Pitcher, The Love Letter and Wanderer above the Sea of Fog. The right half is the stone wall with the form. On phones the painting shrinks to a short banner above the form. If someone has reduced motion turned on, the paintings stop cycling. `SplitScreen.css` holds the layout and the shared form styles, like the field labels, the Show button and the big dark button.

### Log in

`pages/Login/Login.jsx` asks for an email and a password, with Show to reveal the password, a link to the reset page, and the error message the server sent, word for word. When the server says the email was never confirmed, the page sends the visitor to Verify Email instead of showing an error. After a good log in it puts the user into AuthContext and goes to their room, or back to the page they were trying to open.

### Join

`pages/Join/Join.jsx` is step 1 of 2. Name, email, password, confirm password, the six room choices, and the terms box. `pages/Join/StrengthLine.jsx` draws the four part line under the password and the hint beside it. The score counts length, a number, a symbol, and a longer mix of upper and lower case. The page checks everything itself first, in plain words, and only then calls register. When the server answers 201 it goes to Verify Email with the email in the router state.

### Verify Email

`pages/VerifyEmail/VerifyEmail.jsx` is step 2 of 2. `pages/VerifyEmail/CodeBoxes.jsx` is the six boxes. Typing one digit jumps to the next box, Backspace goes back, and pasting the whole code fills every box at once. A countdown starts at one minute, and when it reaches zero the Send a new code link appears. A good code logs the visitor in straight away, because the server sets the cookie in that same answer.

### Reset Password

`pages/ResetPassword/ResetPassword.jsx` has the three steps from the design, and `ResetStep.jsx` draws one step with its numbered circle, the gold line and the tick. Step 1 sends the email. Step 2 checks the code with the same six boxes. Step 3 takes the new password with a three part strength line. Each step only opens when the one before it is done, and Change on step 1 takes you back to the start.

## The server

Everything is in `server`. Here is what each folder is for.

- `server.js` starts Express, turns on cors for the client address with cookies allowed, reads JSON and cookies, serves `uploads` as plain files, plugs in every route, answers 404 for any unknown `/api` path and has one error handler at the end for things like a file that is too big.
- `config/db.js` connects to MongoDB with mongoose.
- `models` is one file per collection in the database: User, Painting, Artist, Collection, View, Search, Visit, Conversation, Upload, Message and Subscriber.
- `routes` is one file per part of the API. A route file only says which path goes to which controller function and which middleware runs first.
- `controllers` holds the functions that do the work. Every one is async, wrapped in try and catch, and answers with a status code and a JSON body with a plain message when something is wrong.
- `middleware` has checkLogin (reads the cookie and finds the user, or answers 401), checkAdmin (403 unless the role is admin), findUser (like checkLogin but lets visitors through with no user), limits (the rate limits) and uploadImage (multer, JPG or PNG, 5 MB at most).
- `utils` holds the helpers: askModel (the only file that talks to the model), sendEmail, getColours, makeToken, makeCode, the word lists and scoring for search, the taste helper for the dashboard, and the small shaping functions that turn a database record into the object the client expects.
- `data` holds paintings.json, artists.json, collections.json and extras.json, which has the look closer points, van Gogh's life stops and Rachel Ruysch's line.
- `uploads` is where photos go. Git ignores it.
- `seed.js` fills the database and `stories.js` writes the stories.

## How a request travels

Take someone opening Hunters in the Snow.

1. The Painting page calls getPainting from `client/src/services/api.js`.
2. That function does a fetch to the painting's address under `/api/paintings`, with the cookie included. In development Vite passes anything under `/api` to port 5000.
3. `server.js` hands the path to `routes/paintingRoutes.js`, which runs findUser first so the server knows if a member is looking, then calls getPainting in `controllers/paintingController.js`.
4. The controller asks the Painting model for that slug, and only one that is on the wall. If there is none it answers 404 with a message.
5. It then picks four similar paintings with `utils/similarPaintings.js`, which scores every other painting on the same style, the same room, shared colours and a close year, and writes a short reason for the best match.
6. The controller answers with the painting, the related ones, more by the same artist, and whether this member has saved it.
7. Back in the browser, `api.js` turns the answer into JSON. If the status was not ok it throws an Error with the server's message, which the page shows as it is.

Logging in works the same way, with one extra step: the login controller signs a token with the secret from `.env` and puts it in an httpOnly cookie. The browser sends that cookie by itself on every later request, so the client never sees or stores the token.

## The model service and its fallback

`utils/askModel.js` is the only place that calls the outside model. It reads the address, the key and the two model names from `.env` and nothing else in the code knows them. It sends a chat request, waits at most twenty seconds, and when it needs JSON it asks for JSON and checks the shape before handing it back. Pictures go through sharp first, shrunk to 1024 pixels, then as base64.

If the key is empty, or the call fails for any reason, askModel returns null and the caller uses its own plain answer:

- Search reads the sentence with the word lists in `utils/wordLists.js` and scores paintings by room, colour, mood, subject, style, medium and era.
- The guide finds paintings whose title, artist or tags match the question and answers with one friendly line made from the facts.
- Image Lab guesses the style, room and mood from the five colours that getColours found.
- The label and story helpers in the admin area fall back to the colours and a template sentence.

So the site always answers. With the key it answers better.

## Running seed and stories

From the server folder:

```
npm run seed
```

Seed loads the two JSON files, works out five colours for every painting from its thumbnail, adds the tags, the look closer points, the artists' eras and letters, the chosen collections and the admin user from `.env`. It uses upserts, so you can run it as often as you like and nothing is doubled.

```
npm run stories
```

Stories asks the model for a story for every painting that has none and a short bio for every artist that has none, waiting a few seconds between each call so a free account is not overwhelmed. It skips itself when the model key is empty. It can take ten minutes, so run it once and leave it.

## Five questions a lecturer might ask you

**Why is the token in a cookie and not in local storage?**
An httpOnly cookie cannot be read by JavaScript in the page, so a script sneaked into the site could not steal it. The browser sends it by itself, and SameSite set to lax stops other sites from sending it for us.

**How do you stop someone reading other people's conversations?**
Every guide route runs checkLogin first, and the controller only ever queries conversations where the user field equals the logged in user's id. If the id belongs to someone else the query finds nothing and the answer is 404.

**What happens if the model is down?**
askModel returns null and the controller uses its fallback, so search, the guide and Image Lab still answer with plain logic. The client never knows the difference, apart from the answers being simpler.

**Why do you hash the six digit code?**
If someone got a copy of the database they still could not log in as anyone, because the code is stored like a password, with bcrypt, and it dies after ten minutes anyway.

**How does the server make sure a password is strong enough?**
It is a plain if statement in `utils/shapeUser.js`: at least eight characters and at least one number or symbol. The same rule is checked in the Join page first so people get the message before they send anything.
