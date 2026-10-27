# Who builds what

Hi team. This is the split we agreed on, written down so nobody has to scroll back through the group chat to find it. Each of us has one branch with our own name on it, and each of us owns a few pages. The shared parts (the navbar, the footer, the frames, the guide widget and so on) are already on develop, so please use them instead of building your own versions.

If you want to swap a page with someone that is fine, just tell me first so I can update this file.

## Chiboy, branch `chiboy`

Pages: Log in, Join, Verify Email, Reset Password.

Also the whole server. That means every route in `docs/API.md`, the database models, the login cookie, the emails with the six digit codes, the uploads folder, and the model service behind the guide, the sentence search and the Image Lab.

Behind the pages: `AuthContext` for the logged in user, `ProtectedRoute` and `AdminRoute`, and the auth functions in `services/api.js` (register, verifyEmail, resendCode, logIn, logOut, getMe, forgotPassword, checkResetCode and resetPassword). The four pages share the split layout from the designs, with the painting on the left and the form on the right, and none of them show the navbar or the footer.

## Goodluck, branch `goodluck`

Pages: Gallery, Painting, Artists, Artist.

Behind the pages: GET /api/paintings with all its filters, GET /api/paintings/:slug, POST /api/paintings/:slug/view, GET /api/artists and GET /api/artists/:slug. In `api.js` those are getPaintings, getPainting, countPaintingView, getArtists and getArtist.

The shared parts you will use most are PaintingCard, Frame, PaintingLabel and PigmentHeap, the tag classes for the filters, and FadeIn for each section as it scrolls in.

## Luwa, branch `luwa`

Pages: Search Results, Guide, Collections, Collection.

Behind the pages: POST /api/search, POST /api/guide/ask, GET /api/guide/conversations and GET /api/guide/conversations/:id, GET /api/collections, GET /api/collections/:slug, POST /api/collections and POST /api/collections/:slug/paintings. In `api.js` those are searchBySentence, askGuide, getConversations, getConversation, getCollections, getCollection, createCollection and addToCollection.

The navbar search sends people to `/search?q=` followed by their sentence, so read the q value from the address and call searchBySentence with it. The Guide page is the big version of the chat in GuideChat, so have a look at that component before you start. The small widget hides itself on your page.

## Miles, branch `miles`

Pages: Image Lab, Manage Paintings, Painting Editor.

Behind the pages: POST /api/image-lab/check and GET /api/image-lab/history, GET /api/admin/paintings, POST, PUT and DELETE on /api/admin/paintings, the labels and story helpers, and POST /api/admin/paintings/bulk. In `api.js` those are checkImage, getImageLabHistory, getAdminPaintings, createPainting, updatePainting, deletePainting, labelPainting, writeStory and bulkUpdatePaintings.

The two admin pages sit inside AdminLayout, which gives you the dark sidebar for free. The Painting Editor is one page used for two routes, `/admin/paintings/new` and `/admin/paintings/:slug/edit`, so check whether there is a slug in the address to know which one you are on.

## Treasure, branch `treasure`

Pages: Dashboard, Saved, Profile.

Also testing the whole site and putting the report together. Testing means every page at 1024, 768 and 480 wide, logged in and logged out, with the server on and with the server off, and writing down what breaks so the owner can fix it.

Behind the pages: GET /api/dashboard, the three /api/saved routes and the six /api/profile routes. In `api.js` those are getDashboard, getSaved, savePainting, unsavePainting, getProfile, updateProfile, uploadProfilePhoto, updatePassword, updateEmailSettings and deleteProfile.

YourRoomTabs gives you the three tabs at the top of all three pages, and the placeholders already show where they go.

## Noble, branch `noble`

Pages: Home, About, Contact, Admin Overview, Not Found.

Also the look of the whole site: the colours and fonts in `root.css`, the shared classes in `global.css`, and the shared components in `components`. If a page of yours needs a new shared style, add it to `global.css`, name it the same plain way, and tell the group.

Behind the pages: GET /api/home, POST /api/contact, POST /api/newsletter, POST /api/visits and GET /api/admin/overview. In `api.js` those are getHome, sendMessage, subscribeToNewsletter, recordVisit and getAdminOverview.

## The parts everyone shares

These are on develop already. `docs/STYLES.md` shows how to use each one.

- Navbar and Footer, which every normal page gets from SiteLayout without doing anything.
- GuideWidget, the floating button and chat box, on every page except the Guide page and the admin pages.
- Frame, PaintingLabel and PaintingCard for showing paintings.
- PigmentHeap for colours.
- FadeIn for sections that rise in as you scroll.
- Loader and EmptyMessage for waiting and for empty lists.
- ProtectedRoute and AdminRoute for pages that need a user.
- AdminLayout for the admin pages and YourRoomTabs for the three your room pages.
