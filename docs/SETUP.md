# Getting ArtMind running on your computer

Hi team. Follow these steps once and you will have the whole project running on your own machine. It takes about ten minutes. If anything goes wrong, send a screenshot in the group and we will sort it out together.

Everything below is for Windows PowerShell. Type one line at a time and press Enter after each one.

## 1. Install Node

Go to https://nodejs.org and download the LTS version. Run the installer and keep clicking Next. When it finishes, open a new PowerShell window and check it worked:

```
node --version
npm --version
```

You should see two version numbers. Anything from Node 20 upwards is fine.

## 2. Install Git

If you do not have Git yet, get it from https://git-scm.com/download/win and install it with the default choices. Then tell Git who you are, using the same name and email as your GitHub account:

```
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

## 3. Clone the repo

Pick a folder you will remember, for example Documents, and run:

```
cd Documents
git clone https://github.com/Chimapro123/ArtMindAI.git
cd ArtMindAI
```

## 4. Switch to your branch

Everyone has a branch with their own name on it. Switch to yours (swap goodluck for your own name) and pull in the shared work from develop:

```
git checkout goodluck
git pull origin develop
```

The second line brings the latest shared code into your branch, so you start from the same place as everyone else.

## 5. Install everything

From the ArtMindAI folder run:

```
npm run install-all
```

This installs the root, the client and the server one after the other. It can take a few minutes the first time.

## 6. Make your .env files

The client and the server each have an example file with the names of the settings in it. Copy them:

```
Copy-Item client\.env.example client\.env
Copy-Item server\.env.example server\.env
```

Open `server\.env` in VS Code and fill in the values I shared in the group. Keep them to yourself. Git is already set up to ignore .env files, so they will never be pushed, and please never paste the real values into the .env.example files.

What each line is for:

- MONGO_URI is the database address.
- JWT_SECRET is the long random string that signs the login cookie.
- CLIENT_URL and PORT can stay as they are on your own machine.
- MODEL_API_URL, MODEL_API_KEY, MODEL_NAME and VISION_MODEL_NAME are the model service behind the guide, the search and the Image Lab. Leave MODEL_API_KEY empty if you do not have one. Everything still works, just with simpler answers.
- MAIL_API_KEY and MAIL_FROM are for sending the six digit codes through Resend. Leave MAIL_API_KEY empty and the server prints every code in its own window instead, which is the easiest way to work while building.
- ADMIN_EMAIL and ADMIN_PASSWORD make the first admin account when you seed.

The client one can stay as it is. The VITE_API_URL line only gets a value when we put the site online.

## 7. Fill the database

The database starts empty. From the ArtMindAI folder run:

```
cd server
npm run seed
cd ..
```

This loads the 76 paintings and 43 artists, works out their colours, adds the chosen collections and makes the admin account. You can run it again any time, it never doubles anything.

If you have a model key you can also run `npm run stories` inside the server folder. It writes a story for every painting and a short bio for every artist, pausing between each one, so it takes about ten minutes. It is optional.

## 8. Run it

```
npm run dev
```

That starts the client and the server together in the same window. Open http://localhost:5173 in your browser and you should see the site. The server runs on http://localhost:5000, and you can check it is alive by opening http://localhost:5000/api/health, which should show a small ok message.

Press Ctrl and C in the PowerShell window to stop both.

## If something goes wrong

- PowerShell says npm is not recognised. Node did not finish installing, or you need to close PowerShell and open a new window.
- Something about a port already in use. You have another copy of the project running. Close that window first.
- Red text about the database when the server starts. The database address in `server\.env` is empty or wrong. The server keeps running anyway, but logging in and the pages that need data will not work until it is right.
- The gallery is empty. You have not run the seed yet. See step 7.
- You joined but no email came. Look in the server window. With MAIL_API_KEY empty the code is printed there.
- The page is blank. Press F12 in the browser, open the Console tab and send me what it says.
