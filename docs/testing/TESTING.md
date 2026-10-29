# How we tested ArtMind

Hi team. This is how we tested the whole site, what we found and what we did about it. Everything here was run for real against our MongoDB database on 28 and 29 October 2026, with the server on port 5000 and the client running in Vite on port 5173. Nothing in the CSV files was typed in by hand: our test scripts wrote down what the server and the pages really answered.

## How we tested

- Our test scripts were small Node programs kept outside the project folder. They call the same API that the pages use, and they drive Google Chrome and Microsoft Edge to click through the pages like a visitor would.
- We made four throwaway test users for the run (see `test-data/test-users.json`). We also used the demo member, Ada Obi, and the admin from the seed.
- While testing we left MAIL_API_KEY empty, so every six digit code was printed in the server window and no real emails went out. The scripts read the codes from there.
- The main runs had the model key switched on. For the fallback check we started the server again with MODEL_API_KEY switched off.
- Between runs we restarted the server, because the rate limits are kept in memory and one of our tests uses up the log in limit on purpose.

## The files in this folder

| File | What is in it |
| --- | --- |
| test-cases.csv | Every test case with its ID, module, what we tested, the input, the expected result, the actual result and pass or fail |
| search-check.csv | 30 sentences with the tags we expected, run with and without the model |
| image-lab-check.csv | 20 paintings sent through the Image Lab, with and without the model |
| guide-check.csv | 6 questions for the guide, with and without the model |
| fallback-check.csv | The totals with the model key on and off, side by side |
| screen-check.csv | Every page in Chrome and Edge at four widths |
| `test-data` | The test users, the sentences, the painting list, the guide questions, the pages for the screen check and sample requests |

## Test cases

We ran 145 test cases: 123 through the API and 22 in Chrome. Every feature has at least three. All 145 passed on the final run.

| Module | Cases | Passed |
| --- | --- | --- |
| Accounts | 29 | 29 |
| Profile | 14 | 14 |
| Home | 4 | 4 |
| Gallery | 12 | 12 |
| Painting page | 8 | 8 |
| Artists | 6 | 6 |
| Collections | 10 | 10 |
| Saved | 8 | 8 |
| Search | 5 | 5 |
| Guide | 9 | 9 |
| Image Lab | 9 | 9 |
| Dashboard | 4 | 4 |
| Admin paintings | 14 | 14 |
| Admin overview | 6 | 6 |
| Contact | 4 | 4 |
| Newsletter | 3 | 3 |
| Total | 145 | 145 |

The cases cover the happy path and the things that should be refused: wrong codes, weak passwords, files that are too big or not pictures, members trying to open someone else's photo, conversation or collection, members trying the admin pages, and too many log in tries. They also check the safety details, for example that the password and the code are stored as bcrypt hashes and that the login cookie is httpOnly.

## Search check

We wrote 30 sentences the way a visitor would type them, each with the tags we expected the search to understand (room, colour, mood, subject or style), 66 tags in all. We ran them with the model and again with the model key switched off.

| | With the model | Without the model |
| --- | --- | --- |
| Expected tags understood | 58 of 66 | 63 of 66 |
| Sentences with every expected tag | 22 of 30 | 27 of 30 |
| Sentences that found paintings | 30 of 30 | 30 of 30 |
| Paintings found on average | 20.6 | 14.8 |
| Time for one search on average | 3.9 s | 0.6 s |

The word lists scored higher on our tag count, because our expected tags use the same plain words as the lists. The model reads the meaning instead: it turned "reading" into "person", treated "sunset" as red and gold colours and added a room or a colour to most sentences, so it often missed our exact word but found more paintings. The word lists missed "Impressionist" (they only know "Impressionism"), did not see "the Virgin Mary" or "a hare on the grass" as the Religious and Nature rooms, and found only one painting for "sunflowers", "a tiger in the jungle" and "a hare sitting on the grass". With the model every sentence found at least six paintings.

## Image Lab check

We sent the large images of 20 paintings from `client/public/paintings`, at least one from every style, through the Image Lab and compared the style it gave with the style in our data.

| | With the model | Without the model |
| --- | --- | --- |
| Style right | 17 of 20 (85%) | 3 of 20 (15%) |
| Room right | 16 of 20 | 8 of 20 |
| Time for one photo on average | 3.4 s | 1.1 s |

With the model, the three it got wrong were View of Delft (Baroque, seen as Northern Renaissance), The Horse Fair (Realism, seen as Romanticism) and Reading Le Figaro (Impressionism, seen as Realism). It still said Fairly sure about those three, at 85% to 88%, so the confidence words can sound surer than they should. These were clean pictures of very famous paintings, so real phone photos will probably do worse. Without the model the style is guessed from the colours alone and always shown as Just a guess at 40%, which is honest but rarely right.

The first time we ran this check we sent the 20 photos straight after each other. The model service answered 429 (too many requests) for 16 of them, the server fell back to the colour guess for those, and only 6 of 20 came out right. Nothing broke and every photo got a result. We ran the check again with 20 seconds between photos for the numbers above, and kept the first run in the CSV too.

## Fallback check

We started the server with MODEL_API_KEY switched off and ran the search check, the guide questions and the Image Lab check again. Every request still answered with status 200 and every page kept working.

- Search: the word lists read the sentence (see above).
- Guide: all 6 questions were answered about the right painting, or with a polite "I'm not sure" for the question about France, using the painting's facts and the first line of its story. With the model the answers were warmer and fuller, and 6 of 6 were also right.
- Image Lab: 3 of 20 styles right from the colours alone.

## Screen check

We opened all 23 pages in Google Chrome 156 and Microsoft Edge 156 at 1440, 1024, 768 and 390 pixels wide, 184 page loads in all, as a visitor, the demo member or the admin as each page needs. Firefox is not installed on the computer we tested on, and Safari only runs on Apple computers, so we could not test them.

| Browser | Width | What we saw |
| --- | --- | --- |
| Chrome and Edge | 1440 | Every page loaded fully with no sideways scroll. The full menu shows in the navbar and the admin pages have their sidebar. |
| Chrome and Edge | 1024 | The same as 1440, with less space at the sides. |
| Chrome and Edge | 768 | The navbar turns into a menu button and the admin sidebar becomes a bar across the top. No sideways scroll. |
| Chrome and Edge | 390 | Phone layout with the menu button, one or two columns and the filters behind a Filters button. No sideways scroll. |

The log in, join, verify email and reset password pages use the split screen layout with a back link instead of the navbar, at every width, as designed.

The only messages in the browser console were two 401 answers from `/api/auth/me` on pages opened by a visitor. That is the client asking who is logged in when nobody is, and it shows twice because React's StrictMode runs effects twice in development. Once, in Edge at 390 pixels, one thumbnail on the gallery failed with "connection refused" from the Vite development server. We opened that page in Edge three more times, scrolling to the bottom each time, and every image loaded, so we put it down to a dropped connection on the development server.

Pages took 4.5 seconds on average to load fully, including the time to reach our cloud database.

## What failed and what we did about it

1. **Visits were never counted.** While reading the code we found that `client/src/App.jsx` imported `recordVisit` but never called it, so the visits figure and chart on the admin overview stayed at zero. We added the call (commit fde27c7).
2. **The first page of a new browser counted two visits.** Our Chrome test for visits failed: in development React runs the effect twice, and both requests went out before the visitor cookie existed. We made the client remember the last page it counted (commit c1a4c89). The test then passed.
3. **The year chart repeated months.** On the admin overview, the year range sent 364 points instead of one per month, because a month with no visits was treated as new on every day. Our first version of the test only checked that there were at least 12 points, so it passed wrongly. We noticed the 364 in the result, fixed the code (commit 46ecce9), made the test check for one point per month and ran every case again.
4. **The model service said too many requests.** Sending 20 photos straight after each other was refused for 16 of them. The site fell back as it should. We left the code as it is and wrote this down as a limitation.
5. **Our own test script.** The first try at the three download tests found no files, because our script did not allow downloads in its private browser window. We fixed the script, not the page.

## Cleaning up

Sara Tester was deleted by the close pass test itself. When testing was finished we deleted the other three test users and everything that belonged to them: 63 searches, 14 conversations, 61 Image Lab results, 62 stored photos, a collection, the test contact message and the test newsletter sign up, and we took their views and saves back off the paintings' counts. Between runs we had already cleaned up the users from our first run and an older test user from earlier in the week in the same way. Ada Obi, the demo member, and the admin were kept. Ada now also has the guide conversations and Image Lab photos from our screenshots and page tests, which makes her room look lived in for the demo. The anonymous views, searches and visits from our test browsers are still counted on the admin overview.
