# The look of ArtMind, and how to use it

Hi team. Everything that makes the site look like one place is in three spots: the variables in `client/src/css/root.css`, the shared classes in `client/src/css/global.css`, and the shared components in `client/src/components`. Use them and your page will match everyone else's without trying. This file goes through each one with a small example.

A few habits that keep it tidy:

- Every page has its own CSS file next to it, imported at the top of the component. Put page styles there, not in global.css.
- Class names are plain lowercase words joined by hyphens, like `painting-card` or `nav-links`.
- Use the variables for colours, fonts, spacing and speeds. If you type a hex colour or a number of seconds straight into your CSS, stop and check whether a variable already covers it.
- Keep motion slow and calm, and only use the three speed variables. Anyone with reduced motion turned on gets no animation at all, which global.css handles for you.

## The variables in root.css

Colours:

| Variable | What it is for |
| --- | --- |
| `--dark-wall` | The main dark background, like a gallery wall at night |
| `--darker-wall` | The footer, the sidebar, the chat box, and anything that needs to sit behind the dark wall |
| `--stone-wall` | The light background for the cream sections |
| `--stone-shadow` | A slightly darker stone for lines and shaded bits on the stone wall |
| `--gold` | The frames, the small labels, the active underline, the gold lines |
| `--light-gold` | The logo, hover colour for links on dark, text that needs to glow a little |
| `--cream` | The light button and the visitor bubbles in the chat |
| `--white-text` | Text on the dark wall |
| `--grey-text` | Quieter text on the dark wall, like the artist under a title |
| `--black-text` | Text on the stone wall |
| `--brown-grey-text` | Quieter text on the stone wall |
| `--dark-button` | The dark button |
| `--gold-line` | A see through gold line, for borders that should feel gold but not loud |
| `--line-on-dark` | A faint line on the dark wall |
| `--line-on-stone` | A faint line on the stone wall |
| `--error-red` | Error text and the error state of a field |

Fonts, sizes and shapes:

| Variable | What it is for |
| --- | --- |
| `--heading-font` | EB Garamond, for titles, page headings and painting titles |
| `--text-font` | Inter, for everything else |
| `--page-width` | The widest the content gets, used by the container class |
| `--side-space` | The space on the left and right of the page. It gets smaller on tablets and phones by itself |
| `--section-space` | The space above and below each section. Also shrinks on small screens |
| `--button-corner` | The corner radius of buttons |
| `--box-corner` | The corner radius of boxes, cards, inputs and menus |
| `--frame-shadow` | The deep shadow under a frame |
| `--soft-shadow` | A gentle shadow for floating things like the chat button |

Speeds:

| Variable | What it is for |
| --- | --- |
| `--slow-speed` | Fading in, rising in, pages appearing |
| `--normal-speed` | Menus opening, cards lifting, the navbar changing |
| `--fast-speed` | Hover colours and borders |

Example of using them in a page CSS file:

```css
.room-title {
  font-family: var(--heading-font);
  color: var(--white-text);
  margin-bottom: var(--section-space);
  transition: color var(--fast-speed);
}
```

If your page needs a variable that is not here, add it to root.css with the same kind of plain name and tell the group.

## The shared classes in global.css

### container

Keeps content in the middle at the page width with the side space on both sides. Put one inside every section.

```jsx
<section className="dark-section">
  <div className="container">...</div>
</section>
```

### dark-section and stone-section

A full width band with the section space above and below. Dark has white text, stone has black text. Pages are built by stacking these.

```jsx
<section className="stone-section">
  <div className="container">
    <p className="small-label">The story</p>
    <h2>A cold day, and not much to show for it</h2>
  </div>
</section>
```

### small-label

The little gold uppercase line that sits above a heading.

```jsx
<p className="small-label">On the main wall</p>
```

### page-title

The big serif heading at the top of a page.

```jsx
<h1 className="page-title">The whole collection</h1>
```

### btn, btn-light, btn-dark

Buttons and links that look like buttons. Always add btn and one of the two colours.

```jsx
<Link to="/gallery" className="btn btn-light">Walk into the gallery</Link>
<button type="submit" className="btn btn-dark">Log in</button>
```

### text-link

A gold link with a thin line under it, with room for a small arrow icon.

```jsx
<Link to="/guide" className="text-link">Ask the guide <ArrowIcon size={16} /></Link>
```

### tag and tag-selected

Small pills for filters and suggestions. Add tag-selected when one is picked.

```jsx
<button type="button" className={picked ? "tag tag-selected" : "tag"}>Landscape</button>
```

### line-input

A field with only a bottom line, as in the designs. Works on both walls.

```jsx
<input type="email" className="line-input" placeholder="Email" />
```

### error-text

A short red line under a field or a form.

```jsx
{errorMessage && <p className="error-text">{errorMessage}</p>}
```

### icon-button and avatar

A round button that holds one icon, and the round circle with initials. You will mostly meet these through the navbar, but you can use them.

```jsx
<button type="button" className="icon-button" aria-label="Close"><CloseIcon /></button>
```

Every button, link and field gets a gold focus outline from global.css when someone tabs to it. Please do not remove it.

## The shared components

Import them from `../../components/Name`.

### Navbar and Footer

You do not add these yourself. SiteLayout in App.jsx puts them around every normal page. The log in, join, verify and reset pages and the admin pages do not have them, on purpose.

### GuideWidget and GuideContext

The widget is added for you in App.jsx. It shows on every page except the Guide page and the admin pages. If you need to open the full guide from a page, link to `/guide`.

The widget is driven by GuideContext, which lives in `client/src/context/GuideContext.jsx` and is already wrapped around the app in main.jsx. It gives you `openGuide(paintingSlug, title)`, which opens the small chat already talking about one painting. The chat then shows a "Talking about:" line with the title and a small x to clear it, and every question goes to the server with that painting's slug. The title is optional, because the chat looks it up when you only give the slug.

```jsx
import { useContext } from "react";
import { GuideContext } from "../../context/GuideContext";

const { openGuide } = useContext(GuideContext);

<button type="button" className="text-link" onClick={() => openGuide(painting.slug, painting.title)}>
  Ask the guide about this painting <ArrowIcon size={16} />
</button>
```

When nobody is logged in the chat says "Log in and I'll help you find your way around." with a Log in button and a Get your free pass link, so you do not need to check for a user before showing the button.

### Frame

A painting in a gold frame with the deep shadow, in the painting's own shape. It loads lazily and fades in once the image is there. Give it the image path, the title and the artist, and it makes the alt text for you. The width comes from the parent, so put it in a column or a grid cell.

```jsx
<Frame image={painting.image} title={painting.title} artist={painting.artist} />
```

If `client/src/images/frame-gold.png` exists, the frame uses it as a border image. If not, it draws a plain gold border with CSS. Right now the picture is not there, so it is the CSS border.

### PaintingLabel

The title in the heading font with the artist and the year under it, like the card next to a painting in a museum.

```jsx
<PaintingLabel title={painting.title} artist={painting.artist} year={painting.year} />
```

### PaintingCard

Frame plus PaintingLabel, linked to the painting page, with a heart and a Quick look button that appear on hover. On phones the heart and the button are always shown.

The heart does the saving for you. It calls POST or DELETE `/api/saved/:slug` on the server, fills itself in when the painting is saved, and sends a logged out visitor to `/login` (and back again afterwards). Pass `saved` so the heart starts in the right state, and `onSave` if your page wants to know when it changes. `onSave` gets the painting and a boolean that is true when it was just saved, which the Saved page uses to take a card off the wall.

```jsx
<PaintingCard painting={painting} saved={savedSlugs.includes(painting.slug)} onSave={handleSave} />
```

Quick look opens QuickLook, below, so you get that for free as well.

### QuickLook

A modal for one painting: the big image in a Frame, the room, the label, a Save button and an Open painting link. PaintingCard opens it from its Quick look button, so you will rarely add it yourself, but you can. Escape and a click outside both close it.

```jsx
{open && <QuickLook painting={painting} saved={saved} onSave={handleSave} onClose={() => setOpen(false)} />}
```

### LookCloser

The painting with small gold circles at its `lookCloser` points, and a round close up for each point made from the same image zoomed to that spot. Clicking a circle on the painting, or a close up, picks that point. It draws nothing when the painting has no points, so you can drop it on any painting page without checking first.

```jsx
<LookCloser painting={painting} />
```

The Painting page and the home page both use it, the second one with the Arnolfini Portrait.

### PigmentHeap

A heap of pigment in any colour, with the name and the share under it. Give it `onClick` and it becomes a button, which is what the colour filter on the home page needs. Add `selected` to underline the name.

```jsx
<PigmentHeap name="Ultramarine" hex="#1f3fae" percent={31} />
<PigmentHeap name="Vermilion" hex="#c43b2a" selected={colour === "Vermilion"} onClick={() => setColour("Vermilion")} />
```

If `client/src/images/pigment-heap.png` exists it is used as a mask, so the heap has the real shape. If not, you get a soft round blob of the colour. Right now the picture is not there.

### FadeIn

Wrap a section in it and the section fades and rises in when it scrolls into view. It does it once and then leaves the section alone.

```jsx
<FadeIn>
  <section className="stone-section">...</section>
</FadeIn>
```

### Loader and EmptyMessage

A small gold spinner, and a quiet box for when there is nothing to show.

```jsx
{loading && <Loader text="Hanging the paintings." />}
{!loading && paintings.length === 0 && (
  <EmptyMessage title="Nothing on this wall yet." text="Try taking a filter off.">
    <button type="button" className="text-link" onClick={clearFilters}>Clear all</button>
  </EmptyMessage>
)}
```

### ProtectedRoute and AdminRoute

Already used in App.jsx around the pages that need a user. If you add a new page that needs one, wrap it the same way.

```jsx
<Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
```

### AdminLayout

The dark sidebar with Overview, Paintings, Add a painting and Back to the gallery. App.jsx already puts the admin pages inside it. On tablets and phones it turns into a bar across the top.

### YourRoomTabs

The Your room, Saved and Profile tabs. Put it under the page title in the dark section at the top of those three pages.

```jsx
<YourRoomTabs />
```

### AuthContext

Not a component you draw, but the one place that knows who is logged in.

```jsx
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const { user, isAdmin, setUser, logOut } = useContext(AuthContext);
```

`user` is null when nobody is logged in. After a successful log in, call `setUser(data.user)` with what the server sent back.

### Icons

Small line icons used by the shared parts. Import the ones you need from `../../components/Icons`: SearchIcon, ChatIcon, HeartIcon, EyeIcon, MenuIcon, CloseIcon, ChevronIcon, ArrowIcon, BackIcon, SendIcon, ExpandIcon, ImageIcon, MonitorIcon and PlusSquareIcon. Each one takes a `size`.

## Screens and motion

Everything shared works at 1024, 768 and 480 pixels wide, and your pages should too. The side space and the section space shrink by themselves, the navbar turns into a menu button at 768, the footer stacks into one column at 480, and the chat box fills the screen on phones. Nothing should ever scroll sideways. A quick way to check is to drag the browser narrower and watch the bottom of the window for a scrollbar.

Animations only use the three speed variables, and global.css turns all of them off for anyone with reduced motion switched on in their system settings.

## The art files

The four art files from the design brief (two wall textures, the gold frame and the pigment heap) are not in the project yet. When they arrive they go in `client/src/images` as `wall-charcoal.jpg`, `wall-stone.jpg`, `frame-gold.png` and `pigment-heap.png`. Frame and PigmentHeap pick up theirs by themselves. The two walls need two lines in global.css, a faint `background-image` on `dark-section` and on `stone-section`.
