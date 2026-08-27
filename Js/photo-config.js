/* ==========================================================================
   BROTHERVERSE — photo-config.js
   Single source of truth for the 20 personal photo slots.

   HOW TO ADD YOUR REAL PHOTOS:
   1. Drop your 20 files into  assets/images/my-photos/
      named photo-01.jpg through photo-20.jpg (jpg/png/webp all fine —
      just update the `file` field below if your extension differs).
   2. That's it. Every page (hero, featured cards, gallery, Create Post
      default) reads from this file, so nothing else needs to change.

   Until real files exist at those paths, BrotherVerse automatically shows
   a designed placeholder (soft gradient + monogram) instead of a broken
   image or a random stock photo — never a stand-in you didn't provide.
   ========================================================================== */

const PHOTO_COUNT = 20;

const MY_PHOTOS = Array.from({ length: PHOTO_COUNT }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return {
    id: `photo-${n}`,
    file: `assets/images/my-photos/photo-${n}.jpg`,
    alt: `BrotherVerse memory photo ${n}`,
    // A calm, rotating palette so placeholders never feel repetitive
    // before real photos are added — purely cosmetic, no meaning attached.
    hue: (i * 37) % 360
  };
});

/* ---- Category → mood palette + icon, used for non-personal quote photos ---- */
const CATEGORY_MOOD = {
  'lovely':      { from: '#3a2a6b', to: '#160f2e', icon: 'heart' },
  'emotional':   { from: '#33285f', to: '#12101f', icon: 'heart' },
  'sad':         { from: '#1c2338', to: '#0a0c14', icon: 'rain' },
  'angry':       { from: '#4a1f2a', to: '#170a0e', icon: 'bolt' },
  'funny':       { from: '#5c4a1a', to: '#231a08', icon: 'smile' },
  'attitude':    { from: '#2a2f52', to: '#0c0e1c', icon: 'bolt' },
  'missing':     { from: '#22283f', to: '#0b0d18', icon: 'rain' },
  'best':        { from: '#3c2f66', to: '#140f26', icon: 'star' },
  'elder':       { from: '#2c2650', to: '#0f0d1e', icon: 'star' },
  'younger':     { from: '#375a52', to: '#0e1a17', icon: 'smile' },
  'birthday':    { from: '#5a3466', to: '#1e0f24', icon: 'cake' },
  'dua':         { from: '#274a45', to: '#0c1917', icon: 'moon' },
  'motivation':  { from: '#4a3417', to: '#1c1206', icon: 'bolt' }
};

const ICON_PATHS = {
  heart: '<path d="M12 21s-7.5-4.9-10-9.3C.4 8.7 1.6 5 5.1 4.2c2-.5 4 .3 5 2 1-1.7 3-2.5 5-2C18.4 5 19.6 8.7 22 11.7 19.5 16.1 12 21 12 21z"/>',
  star: '<path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8L5.8 21l1.6-7L2 9.2l7.1-.6L12 2z"/>',
  bolt: '<path d="M13 2 3 14h7l-1 8 11-14h-7l0-6z"/>',
  smile: '<circle cx="12" cy="12" r="9"/><path d="M8 13s1.5 3 4 3 4-3 4-3M9 9h.01M15 9h.01" stroke="currentColor" fill="none" stroke-width="1.4"/>',
  rain: '<path d="M7 15a5 5 0 1 1 1.3-9.8A6 6 0 0 1 20 8a4.5 4.5 0 0 1-1 7H7z"/><path d="M8 19l-1 3M13 19l-1 3M18 19l-1 3" stroke="currentColor" fill="none" stroke-width="1.4"/>',
  cake: '<path d="M4 21v-7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7H4z"/><path d="M4 17h16M9 12V8M15 12V8M9 5.5a1.5 1.5 0 1 0 0-3M15 5.5a1.5 1.5 0 1 0 0-3" stroke="currentColor" fill="none" stroke-width="1.4"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/>'
};

/**
 * Resolve a category label (e.g. "Lovely Brother") down to a mood key.
 */
function moodKeyFor(category){
  const key = (category || '').toLowerCase().split(' ')[0];
  return CATEGORY_MOOD[key] ? key : 'best';
}

/**
 * Build a designed placeholder element (used whenever a real photo file
 * is missing — never replaced with an unrelated stock image).
 */
function buildPlaceholder({ hue, category, monogram }){
  const wrap = document.createElement('div');
  wrap.className = 'ph-photo';
  if (typeof hue === 'number'){
    wrap.style.setProperty('--ph-bg', `linear-gradient(140deg, hsl(${hue},46%,22%), #0a0c16)`);
  } else if (category){
    const mood = CATEGORY_MOOD[moodKeyFor(category)];
    wrap.style.setProperty('--ph-bg', `linear-gradient(140deg, ${mood.from}, ${mood.to})`);
  }
  if (monogram){
    const span = document.createElement('span');
    span.className = 'ph-mono';
    span.textContent = monogram;
    wrap.appendChild(span);
  } else {
    const mood = CATEGORY_MOOD[moodKeyFor(category)] || CATEGORY_MOOD.best;
    wrap.innerHTML += `<svg class="ph-icon" viewBox="0 0 24 24" fill="currentColor">${ICON_PATHS[mood.icon]}</svg>`;
  }
  return wrap;
}

/**
 * Render a photo slot into `container`. Tries the real file first;
 * falls back to a designed placeholder if it 404s or isn't provided yet.
 * options: { category, monogram, alt }
 */
function renderPhotoInto(container, photoIdOrSrc, options = {}){
  container.innerHTML = '';
  let src = photoIdOrSrc;
  let hue;
  const asPhoto = MY_PHOTOS.find(p => p.id === photoIdOrSrc);
  if (asPhoto){ src = asPhoto.file; hue = asPhoto.hue; }

  if (!src){
    container.appendChild(buildPlaceholder({ category: options.category, monogram: options.monogram }));
    return;
  }

  const img = new Image();
  img.alt = options.alt || 'BrotherVerse photo';
  img.loading = 'lazy';
  img.onload = () => {
    container.innerHTML = '';
    img.classList.add('photo-fade-enter');
    container.appendChild(img);
  };
  img.onerror = () => {
    container.innerHTML = '';
    container.appendChild(buildPlaceholder({ hue, category: options.category, monogram: options.monogram }));
  };
  img.src = src;
}

/** Deterministically pick one of the 20 photos based on a string seed (e.g. quote id). */
function pickMyPhoto(seed){
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return MY_PHOTOS[h % MY_PHOTOS.length];
}

window.BrotherVersePhotos = {
  MY_PHOTOS,
  CATEGORY_MOOD,
  moodKeyFor,
  buildPlaceholder,
  renderPhotoInto,
  pickMyPhoto
};
