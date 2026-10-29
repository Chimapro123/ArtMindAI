# ArtMind demo video script

Hi team. This is the plan for our demo video. It runs for about seven minutes and follows the order of a real visit: first as a visitor, then as a new member, then as the admin, and a quick look on a phone at the end. The left column of each step says what to click, and the lines underneath are what to say. Speak slowly and let each page settle before you talk over it.

## Before recording

- Run `npm run dev` from the ArtMindAI folder and open http://localhost:5173 in Chrome at full screen.
- Log out first, so the video starts as a visitor.
- For the joining step, either leave MAIL_API_KEY empty so the six digit code is printed in the PowerShell window, or join with an email inbox you can open on screen.
- Keep a small photo of a painting ready on the desktop for the Image Lab, for example `client/public/paintings/the-great-wave-off-kanagawa.jpg`.
- Have the admin login and the demo member login to hand: admin@artmind.test with ArtMind2026!, and demo@artmind.test with ArtMind2026 (or the accounts in your own .env).
- Open the browser's device toolbar once beforehand (F12, then the phone icon) so you know where it is for the last step.

## The walkthrough

| Time | Step | What to click |
| --- | --- | --- |
| 0:00 | Home and the rooms | Start on the home page, scroll slowly past the rooms |
| 0:35 | Gallery with filters | Walk into the gallery, pick a room, open Filters |
| 1:05 | A painting page | Open Hunters in the Snow, zoom, see it on a wall, download the PDF |
| 1:45 | Artists | Open Artists, then Vincent van Gogh |
| 2:05 | A collection walk | Open Collections, then Good dogs |
| 2:30 | Sentence search | Search for a quiet painting of someone reading by a window |
| 2:55 | Joining with a code | Join, then type the code |
| 3:25 | The guide | Ask in the widget, then open the Guide page |
| 4:00 | Image Lab | Drop the photo of The Great Wave |
| 4:35 | Dashboard | Log in as the demo member and open the Dashboard |
| 5:00 | Saved | Open Saved, add one to a collection |
| 5:20 | Profile and password | Open Profile, change the password |
| 5:45 | Admin overview | Log in as the admin, open Admin |
| 6:10 | Adding a painting | Add a painting, label it, draft the story, hang it |
| 6:50 | On a phone | Turn on the device toolbar and scroll the home page |
| 7:15 | The end | Back to the home page |

### 1. Home and the rooms (0:00)

Click: nothing yet. Scroll slowly from the hero painting down past the rooms, the main wall and the colours.

Say: "This is ArtMind, an online gallery of 76 famous paintings that gets to know you as you look around. The paintings hang in six rooms, and the main wall shows what everyone is looking at this week."

### 2. Gallery with filters (0:35)

Click: Walk into the gallery, then the Landscape tab. Open the Colour list and pick Ultramarine, then clear it with Clear all.

Say: "The gallery can be narrowed down by room, style, medium, colour or era, and the filters stay in the address so a wall can be shared. Members can also hide the paintings they have already seen."

### 3. A painting page (1:05)

Click: open Hunters in the Snow. Click Zoom in and scroll to zoom, then close it. Click See it on a wall, then close it. Click Download PDF and open the file.

Say: "Every painting has its own viewing room. You can zoom right into the brushwork, and See it on a wall shows its real size next to a person. You can take the page away as a PDF or a Word file."

### 4. Artists (1:45)

Click: Artists in the navbar, then Vincent van Gogh.

Say: "Each artist has a page with their life on a timeline, every painting of theirs we hold and artists you might also like."

### 5. A collection walk (2:05)

Click: Collections, then Good dogs, then Start the walk, and scroll through two stops.

Say: "Collections are little exhibitions you can walk through in a few minutes. In this one, a gold circle shows where the dog is hiding in each painting."

### 6. Sentence search (2:30)

Click: the search icon in the navbar, type "a quiet painting of someone reading by a window" and press Enter. Take one tag off.

Say: "You can search the way you would say it out loud. The tags show what the search understood, and each painting says why it matched. Take a tag off and it searches again."

### 7. Joining with a code (2:55)

Click: Join. Fill in a name, an email and a password, pick two rooms, tick the terms and press Continue. Type the six digit code.

Say: "A free pass takes a minute. We send a six digit code to check the email is really yours. It works for ten minutes, and the password is stored safely as a hash."

### 8. The guide (3:25)

Click: open any painting, press Ask the guide about this painting and ask "Who painted this and why is it famous?". Then press the expand button to open the Guide page.

Say: "The guide answers questions about any painting in the gallery, and only those paintings. It knows which painting you are looking at, and your conversations are kept on the Guide page."

### 9. Image Lab (4:00)

Click: Image Lab, then drop the photo of The Great Wave on the box. Point at the style, the sure words, the colours and the closest paintings.

Say: "Took a photo of a painting in a museum or a book? The Image Lab tells you its likely style and how sure it is, its room, its mood and its colours, and finds the closest paintings in our gallery."

### 10. Dashboard (4:35)

Click: log out from your menu, log in as the demo member, and the Dashboard opens.

Say: "This is Ada's room. It shows what she has looked at and saved, four paintings waiting for her with a reason for each, and her taste in rooms and colours."

### 11. Saved (5:00)

Click: the Saved tab. On one painting choose add to a collection and make a new one called "For the weekend".

Say: "Every saved painting waits here. Ada can search them, sort them, download the list as a PDF or gather a few into her own collection."

### 12. Profile and change password (5:20)

Click: the Profile tab. Show the rooms she likes, then type the current password and a new one twice and press Update password. Change it back afterwards, or use a test account.

Say: "On her profile Ada can change her photo, her rooms and her emails, and change her password with her current one."

### 13. Admin overview (5:45)

Click: log out, log in as the admin, choose Admin in the menu. Change the range to This month.

Say: "The admin sees how the gallery is doing: visits, saves, searches and new passes, with charts for the days and the rooms, the most looked at paintings and what people searched for."

### 14. Adding a painting with labels and a story (6:10)

Click: Add a painting, choose an image, then press Label it for me and Keep all of these. Press Write a first draft for me, fill in the title and the artist, and press Hang it on the wall. Delete it again from Paintings after recording.

Say: "Adding a painting starts with its image. The site suggests a style, a room and labels, and writes a first draft of its story. The admin checks it, then hangs it on the wall for everyone to see."

### 15. On a phone (6:50)

Click: press F12, turn on the device toolbar, choose a phone size and scroll the home page. Open the menu and the guide.

Say: "Every page works on a phone too: the menu folds away, the walls drop to one or two columns and the guide fills the screen."

### 16. The end (7:15)

Click: close the device toolbar and go back to the home page.

Say: "That is ArtMind. Thank you for watching."

## After recording

- Delete the test painting and change any password back.
- Save the video as an MP4 and put it in the Video folder of the submission package.
