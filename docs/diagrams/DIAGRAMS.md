# Our diagrams

Hi team. These are the diagrams for the report, drawn with Mermaid. The sources are in `docs/diagrams/source` and each one is exported at twice the normal size into this folder as a PNG. They are all black lines on white so they print well in black and white. Where a diagram was too tall for one page we split it into a part a and a part b, and a small circle with a letter shows where one part carries on in the next.

The flowcharts use ovals for Start and End, plain boxes for the steps, diamonds for the Yes and No questions, slanted boxes for what the visitor types in or sees, and small numbered circles for "go back to this point". The data flow diagrams use the Gane and Sarson style, and each one has its own legend in a dashed box.

## Design diagrams

### 01-system-architecture.png

The whole system on one page. The React client runs in the visitor's browser and sends every request through `services/api.js` to the Express server on port 5000, with the login cookie going along by itself. The server talks to MongoDB through the Mongoose models, asks the model service for help with the guide, the search and the Image Lab when a key is set, and sends the six digit codes through the email service when a mail key is set. The painting images come straight from `client/public`.

### 02-site-map.png

All 23 pages in three groups: the public pages anyone can open, the member pages that need a log in, and the admin pages that need the admin role. The lines show the main ways people move from page to page, starting from Home, and the Not Found page sends people back to the gallery.

### 03a-er-diagram-members.png and 03b-er-diagram-gallery.png

The collections in our database and how they connect, split in two so the text stays readable. Part a is everything around a member: their views, searches, conversations, Image Lab results, uploaded images and visits. Part b is the gallery side: artists and their paintings, our collections, the stored painting images, and the messages and newsletter subscribers. Saved paintings live inside the user record as a list.

## Flowcharts

### 04a and 04b, join and verify

Part a is joining: the page checks the form, the server checks it again, the password is hashed and a six digit code is made, stored hashed and either emailed or printed in the server window. Part b is the Verify Email page, where a right code in time confirms the email and logs the member straight in, and a new code can be asked for once a minute.

### 05-flow-log-in.png

Logging in with an email and a password. A wrong email or password gets the same message, an email that was never confirmed is sent to the Verify Email page with a fresh code, and a good log in sets the cookie and opens the Dashboard or the page the member came from.

### 06a and 06b, reset password

The three steps on the Reset Password page. The server always gives the same answer to step 1 so nobody can use it to check who is a member, step 2 checks the code, and step 3 checks the code once more before saving the new password.

### 07-flow-change-password.png

Changing the password from the Profile page. The page checks the new password first, then the server checks the login cookie, the current password and the new password rule before it saves the new hash.

### 08a and 08b, gallery and filters

How the Gallery fills its wall. The filters live in the address, the server keeps only paintings on the wall, applies each filter, hides paintings already seen when asked, keeps only our picks when asked, sorts them and sends twelve at a time.

### 09a and 09b, painting page

What happens on a painting page. Opening it counts a view, then the visitor can save it (after logging in), zoom in, ask the guide about it, see it on a wall next to a person 1.7 metres tall, or download it as a PDF or a Word file made in the browser.

### 10a and 10b, sentence search

The sentence search with its two branches. With a model key the sentence goes to a pretrained language model reached through an API, which pulls out the room, colours, moods and subjects. Without a key, or when the answer is not good JSON within 20 seconds, our own word lists read the sentence instead. Both branches then score every painting the same way and the search is saved.

### 11a and 11b, guide chat

The guide, in the widget or on its own page. Only members can ask. The server finds up to five matching paintings, then either asks the model with their facts and the last six messages, or builds a plain answer from the best match. The question and the answer are saved in the conversation. If the request fails the page says the guide is resting.

### 12a and 12b, Image Lab

The Image Lab from the photo to the result. The page and the server both check the file is a JPG or PNG under 5 MB, the member can crop and rotate it, the server works out five colours, then the model guesses the style or our colour rules do. The confidence turns into the words Fairly sure, Not very sure or Just a guess, and the four closest paintings in our gallery are shown.

### 13-flow-recommendations.png

How the four paintings under Waiting for you are picked. They are never paintings the member has already opened or saved, and each one comes with a plain reason, such as the painting they lingered on, the one they saved, their favourite room or colour, or simply what everyone is looking at.

### 14-flow-dashboard.png

The Dashboard from top to bottom: the welcome, the figures, a friendly line when there is nothing yet, Waiting for you, Where you've been, the member's taste in rooms and colours, and their collections.

### 15a and 15b, collections

Part a shows the Collections page and opening a collection, whether it is one we chose, one made fresh for the member from their taste, or their own, followed by the walk through its paintings. Part b shows making a collection of your own and adding paintings to it from the Saved page.

### 16a and 16b, admin add painting

Adding a painting as an admin. Choosing the image creates the painting in storage straight away, with the image and thumb saved in the database. The admin then fills in the details, can ask for suggested labels and a first draft of the story, and finally hangs it on the wall or keeps it in storage.

### 17-flow-admin-overview.png

The admin overview. For the chosen week, month or year the server counts visits, saves, searches and new passes, compares them with the period before, and builds the visits chart, the rooms chart, the most looked at table, the top searches and three plain notes.

### 18-flow-contact-and-newsletter.png

Two small flows side by side: sending a message from the Contact page, which is saved for us to read, and subscribing to the newsletter from the footer, which only adds an email once.

### 19-flow-close-pass.png

Closing a pass from the Profile page. The member has to type CLOSE, then the server deletes their photos, Image Lab results, views, searches, conversations, their own collections and finally the user, clears the cookie and sends them home.

## Data flow diagrams

### 20-dfd-level-0.png

The context diagram. ArtMind is one process in the middle, with the five things outside it: the visitor, the member, the admin, the model service and the email service, and the main data that moves between them.

### 21a and 21b, level 1

ArtMind broken into its ten main processes, 1.0 to 5.0 in part a and 6.0 to 10.0 in part b, with the data stores they read and write. We added D12 Images, because every uploaded picture is kept in its own collection in the database.

### 22a and 22b, level 2 accounts

Process 1.0 broken into register, verify email, log in, reset password, change password, update profile and close pass, with exactly which parts of the user record each one reads or writes.

### 23-dfd-level-2-search.png

Process 3.0 as four steps: take the sentence, understand it with the model service (or the word lists), score the paintings on the wall, then save the search and send the results.

### 24-dfd-level-2-guide.png

Process 4.0 as five steps: check the question, load the earlier conversation, find matching paintings, write the answer with the model service, and save the conversation.

### 25a and 25b, level 2 Image Lab

Process 5.0 as six steps: check the photo, find its colours, guess the style, find the closest paintings, save the photo and the result, and show the member's earlier photos.

### 26a and 26b, level 2 manage paintings

Process 8.0 as six steps: list the paintings, add a new one, suggest labels, draft a story, save and hang it, and the bulk actions, where removing a painting also takes it out of every saved list and collection and deletes its views and images.
