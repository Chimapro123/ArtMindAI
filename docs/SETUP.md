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

Open `server\.env` in VS Code and fill in the values I shared in the group: the database address, the secret, the mail account and the model settings. Keep them to yourself. Git is already set up to ignore .env files, so they will never be pushed, and please never paste the real values into the .env.example files.

The client one can stay as it is. The VITE_API_URL line only gets a value when we put the site online.

## 7. Run it

```
npm run dev
```

That starts the client and the server together in the same window. Open http://localhost:5173 in your browser and you should see the site. The server runs on http://localhost:5000, and you can check it is alive by opening http://localhost:5000/api/health, which should show a small ok message.

Press Ctrl and C in the PowerShell window to stop both.

## If something goes wrong

- PowerShell says npm is not recognised. Node did not finish installing, or you need to close PowerShell and open a new window.
- Something about a port already in use. You have another copy of the project running. Close that window first.
- Red text about the database when the server starts. The database address in `server\.env` is empty or wrong. The server keeps running anyway, but logging in and the pages that need data will not work until it is right.
- The page is blank. Press F12 in the browser, open the Console tab and send me what it says.
