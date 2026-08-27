# BrotherVerse
**Quotes. Memories. Brotherhood.** — by Majid Hub

A premium, dark-themed brother-quotes + photo post maker. Pure HTML5 / CSS3 / vanilla JavaScript, no build step, no frameworks — ready to deploy as a static site.

## Structure

```
brotherverse/
├── index.html        Home
├── quotes.html        Brother Quotes library (13 categories, search + filter)
├── create.html         Create Post — the Canvas-based post editor
├── saved.html          My Saved Quotes (localStorage)
├── favorites.html      Favorites (localStorage)
├── about.html           About Me
├── contact.html         Contact
├── css/
│   ├── style.css        Design tokens, layout, components
│   ├── responsive.css    Breakpoints, mobile menu
│   └── animations.css    Reveal/entrance animations, reduced-motion support
├── js/
│   ├── main.js           Nav, mobile menu, toasts, modal, photo picker, scroll reveal
│   ├── quotes.js         Quote data (13 categories) + rendering + filtering
│   ├── editor.js         Canvas post editor: drag/zoom/text size/ratio/save/download
│   ├── saved.js          Saved-posts localStorage API
│   ├── favorites.js      Favorites localStorage API
│   ├── photo-config.js   The 20 personal photo slots (see below)
│   └── translations.js   Small UI string table (toasts, etc.)
└── assets/
    ├── images/my-photos/   ← put your 20 real photos here
    ├── images/quote-images/
    └── icons/
```

## Adding your 20 real photos

1. Name your files `photo-01.jpg` through `photo-20.jpg` (or update the
   extension in `js/photo-config.js` if you're using `.png`/`.webp`).
2. Drop them into `assets/images/my-photos/`.
3. That's it — no other file needs to change. The homepage hero, featured
   quote cards, and the Create Post default photo all read from
   `js/photo-config.js` and will start showing your real photos immediately.

Until real files exist, every photo slot shows a designed gradient
placeholder (never a random stock photo) so the site still looks and feels
finished while you add your own images.

## Deployment (Vercel)

This is a static site — no build command needed.

1. Push this folder to a Git repo (or drag-and-drop it into Vercel).
2. In Vercel: **New Project → Import** → set **Framework Preset: Other**,
   **Build Command: (none)**, **Output Directory: /** (root).
3. Deploy.

## Notes

- Saved posts and favorites are stored in the browser's `localStorage` —
  they're per-device/per-browser, no backend required.
- The Create Post editor renders everything to an off-screen `<canvas>`,
  so the downloaded PNG always matches the live preview exactly.
- Respects `prefers-reduced-motion`.
