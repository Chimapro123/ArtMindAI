# How we work with Git

Hi team. This is how we move work around without stepping on each other. Read it once, then keep it open the first few times you push.

## The three kinds of branches

- `main` is what we submit. Nobody pushes to it. When we are ready to hand in, I merge develop into it.
- `develop` is where our work comes together. Nobody pushes to it directly either. Work gets there through pull requests, which I review and merge.
- Your own branch (`chiboy`, `goodluck`, `luwa`, `miles`, `treasure` or `noble`) is the only branch you push to. Do what you like there.

## Every morning

Before you start, get the latest shared work so you are building on top of what everyone else has done:

```
git checkout goodluck
git pull origin develop
```

Use your own branch name instead of goodluck. If Git says there is a conflict, do not panic. Open the files it lists, look for the lines between the <<<<<<< and >>>>>>> markers, keep the version you want, delete the markers, save, and then:

```
git add .
git commit -m "fix conflict"
```

Or send me a message and we will do it together.

## Saving your work

Commit little and often. A commit should be one small thing with a short plain message, like "add gallery filters" or "fix footer on phones".

```
git status
git add .
git commit -m "add gallery filters"
git push origin goodluck
```

The first line shows what you changed. The second stages everything. The third saves it with your message. The last one sends your branch to GitHub.

Before you push, please check three things: there is no .env file in the list from `git status`, there is no node_modules folder in it, and the client still builds.

```
cd client
npm run build
cd ..
```

## Opening a pull request

When a page is ready for develop:

1. Push your branch, as above.
2. Open https://github.com/Chimapro123/ArtMindAI in your browser.
3. You will usually see a yellow box near the top saying your branch had recent pushes, with a green button that says Compare and pull request. Click it. If the box is not there, click the Pull requests tab, then the green New pull request button.
4. Check the two dropdowns at the top. The one on the left, base, must say `develop`. The one on the right, compare, must say your branch. Never pick main as the base.
5. Give it a short title like "Gallery page". In the box underneath, write what you built and anything you want me to look at.
6. Click Create pull request.
7. Paste the link in the group.

I will read it, maybe leave a comment or two, and merge it. Once it is merged your morning pull brings it to everyone.

If I ask for a change, just commit and push to your branch again. The pull request picks up the new commits by itself.

## Things to never do

- Never push to main or develop.
- Never commit a .env file or a node_modules folder.
- Never force push.
- Never delete anything in `client/public/paintings` or `server/data` without asking.
