/* ==========================================================================
   BROTHERVERSE — quotes.js
   Quote data + rendering + filtering/search for the Quotes library.
   ========================================================================== */

const CATEGORIES = [
  'Lovely Brother', 'Emotional Brother', 'Sad Brother', 'Angry Brother',
  'Funny Brother', 'Attitude Brother', 'Missing Brother', 'Best Brother',
  'Elder Brother', 'Younger Brother', 'Birthday Brother',
  'Dua / Blessing Brother', 'Motivation Brother'
];

const QUOTES = [
  // ---- Lovely Brother ----
  { c:'Lovely Brother', t:"A brother is a friend the heart chose before we could speak." },
  { c:'Lovely Brother', t:"Some people are born already carrying half of your heart. Mine calls himself my brother." },
  { c:'Lovely Brother', t:"Home was never a place. It was the sound of my brother laughing down the hall." },
  { c:'Lovely Brother', t:"He didn't just grow up beside me — he grew into the best part of me." },
  { c:'Lovely Brother', t:"Brotherhood is the quiet kind of love that never needs to announce itself." },
  { c:'Lovely Brother', t:"You were my first friend, my first fight, and my forever favorite person." },

  // ---- Emotional Brother ----
  { c:'Emotional Brother', t:"Some bonds don't need words. They just need to keep breathing in the same direction." },
  { c:'Emotional Brother', t:"I didn't know what unconditional meant until I watched my brother show up, every time." },
  { c:'Emotional Brother', t:"There is a version of me that only exists because my brother believed in it first." },
  { c:'Emotional Brother', t:"We grew up sharing a room, a name, and somehow, the exact same heartbreaks." },
  { c:'Emotional Brother', t:"Every scar I have has a story, and my brother is in half of them, holding my hand." },
  { c:'Emotional Brother', t:"He carries pieces of our childhood that even I forgot I had." },

  // ---- Sad Brother ----
  { c:'Sad Brother', t:"The house got quieter the day my brother moved away — some silences never fill back up." },
  { c:'Sad Brother', t:"Missing him isn't a moment. It's a season that never quite ends." },
  { c:'Sad Brother', t:"Some nights I still reach for a phone call I know won't be answered." },
  { c:'Sad Brother', t:"Grief is just love with nowhere left to go — and mine still goes looking for my brother." },
  { c:'Sad Brother', t:"Distance didn't break us. It just taught me how heavy an empty chair can be." },
  { c:'Sad Brother', t:"I kept his voicemail. Some goodbyes deserve to stay unfinished." },

  // ---- Angry Brother ----
  { c:'Angry Brother', t:"We can scream at each other at midnight and still show up for each other by morning." },
  { c:'Angry Brother', t:"Brothers fight like storms — loud, sudden, and gone before the sun comes back up." },
  { c:'Angry Brother', t:"He's the only person who can make me furious and forgiven in the same conversation." },
  { c:'Angry Brother', t:"We don't hold grudges. We just hold each other accountable, loudly." },
  { c:'Angry Brother', t:"Even when I was mad enough to not speak to him, I was still scared for him." },
  { c:'Angry Brother', t:"Anger between brothers is just love that ran out of patience for a while." },

  // ---- Funny Brother ----
  { c:'Funny Brother', t:"My brother is proof that best friends and worst enemies can share a birthday." },
  { c:'Funny Brother', t:"We've survived shared bathrooms, shared clothes, and shared blame. Nothing scares us now." },
  { c:'Funny Brother', t:"He knows all my secrets and somehow still uses half of them as jokes at dinner." },
  { c:'Funny Brother', t:"Being brothers means I have a lifetime witness to every embarrassing thing I've ever done." },
  { c:'Funny Brother', t:"We don't do sentimental. We do roasting each other until someone laughs first." },
  { c:'Funny Brother', t:"He's the reason I know exactly how far 'just kidding' can stretch." },

  // ---- Attitude Brother ----
  { c:'Attitude Brother', t:"Mess with me and you've just signed up for my brother's problem too." },
  { c:'Attitude Brother', t:"We don't walk into rooms. We walk in as a package deal." },
  { c:'Attitude Brother', t:"Loyalty isn't a trend for us — it's the only setting we come in." },
  { c:'Attitude Brother', t:"Two brothers, one backbone. Try us." },
  { c:'Attitude Brother', t:"We were raised to bow to no one and back down for no one — especially each other's enemies." },
  { c:'Attitude Brother', t:"Respect is given. Loyalty is earned. My brother has both, permanently." },

  // ---- Missing Brother ----
  { c:'Missing Brother', t:"Different cities, same heartbeat — I carry him with me wherever I land." },
  { c:'Missing Brother', t:"The miles changed, but the missing never learned how to shrink." },
  { c:'Missing Brother', t:"I count down days like they're the only currency that matters when he's away." },
  { c:'Missing Brother', t:"His side of the room is empty, but his side of my life never is." },
  { c:'Missing Brother', t:"Some conversations are just silence, waiting for him to be back in the room." },
  { c:'Missing Brother', t:"Missing my brother is the quiet tax I pay for loving him this much." },

  // ---- Best Brother ----
  { c:'Best Brother', t:"He's not just my brother. He's the standard I measure loyalty against." },
  { c:'Best Brother', t:"Ask me my greatest achievement and I'll tell you: growing up next to him." },
  { c:'Best Brother', t:"The best part of my story has always had his name in it." },
  { c:'Best Brother', t:"He shows up before I even finish asking. That's not luck — that's brotherhood." },
  { c:'Best Brother', t:"I've met a lot of good people. None of them replaced the original." },
  { c:'Best Brother', t:"Everyone deserves one person who's simply, unshakably on their side. Mine is my brother." },

  // ---- Elder Brother ----
  { c:'Elder Brother', t:"He walked every path first so I'd never have to walk it blind." },
  { c:'Elder Brother', t:"An older brother is a preview of the man you're allowed to become." },
  { c:'Elder Brother', t:"He took every hit meant for me and called it 'just older brother things.'" },
  { c:'Elder Brother', t:"Before I had my own compass, I just followed his footsteps." },
  { c:'Elder Brother', t:"He taught me how to fall without ever letting me fall alone." },
  { c:'Elder Brother', t:"Being the younger one just means I got a head start borrowed from him." },

  // ---- Younger Brother ----
  { c:'Younger Brother', t:"He followed me everywhere as a kid — turns out I was following him the whole time." },
  { c:'Younger Brother', t:"My little brother stopped being little the day he started catching me when I fell." },
  { c:'Younger Brother', t:"He used to borrow my shoes. Now he's the one holding me steady." },
  { c:'Younger Brother', t:"Watching him grow up was the closest thing I've had to watching hope in motion." },
  { c:'Younger Brother', t:"He's still my baby brother, even on the days he's the wiser one." },
  { c:'Younger Brother', t:"I taught him to ride a bike. He taught me how to be patient. Fair trade." },

  // ---- Birthday Brother ----
  { c:'Birthday Brother', t:"Another year older, brother — and somehow still my favorite chapter to celebrate." },
  { c:'Birthday Brother', t:"Happy birthday to the person who's made every year of mine better just by being in it." },
  { c:'Birthday Brother', t:"Here's to more birthdays, more memories, and more reasons to be proud of you." },
  { c:'Birthday Brother', t:"You don't just age, brother — you level up. Happy birthday." },
  { c:'Birthday Brother', t:"May this year bring you everything you've quietly been hoping for." },
  { c:'Birthday Brother', t:"Blow out the candles. The best gift was always having you around." },

  // ---- Dua / Blessing Brother ----
  { c:'Dua / Blessing Brother', t:"May your path always be lit, brother, even on the nights you can't see it yourself." },
  { c:'Dua / Blessing Brother', t:"I pray for you the way I pray for myself — quietly, and every single day." },
  { c:'Dua / Blessing Brother', t:"May you be protected from everything you can't protect yourself from." },
  { c:'Dua / Blessing Brother', t:"Peace to your heart, ease to your struggles, and light to every road ahead." },
  { c:'Dua / Blessing Brother', t:"May your good days multiply and your hard days pass gently." },
  { c:'Dua / Blessing Brother', t:"I ask for nothing but blessings on the person who's been one for me." },

  // ---- Motivation Brother ----
  { c:'Motivation Brother', t:"Get up, brother. I've seen what you're capable of, even when you forget." },
  { c:'Motivation Brother', t:"You don't have to be fearless. You just have to keep moving while you're afraid." },
  { c:'Motivation Brother', t:"Every setback you've survived was practice for the comeback you're about to have." },
  { c:'Motivation Brother', t:"I believed in you before you had proof. I still do." },
  { c:'Motivation Brother', t:"Whatever you're building right now, keep going. I've got your back the whole way." },
  { c:'Motivation Brother', t:"You were never meant to stay where you are. Rise, brother." }
];

// Assign stable IDs + a deterministic "my photo" pick for variety
QUOTES.forEach((q, i) => {
  q.id = 'q' + String(i + 1).padStart(3, '0');
});

function getCategories(){ return CATEGORIES.slice(); }
function getAllQuotes(){ return QUOTES.slice(); }
function getQuoteById(id){ return QUOTES.find(q => q.id === id); }

function filterQuotes({ category, search } = {}){
  let list = QUOTES.slice();
  if (category && category !== 'All'){
    list = list.filter(q => q.c === category);
  }
  if (search && search.trim()){
    const s = search.trim().toLowerCase();
    list = list.filter(q => q.t.toLowerCase().includes(s) || q.c.toLowerCase().includes(s));
  }
  return list;
}

/* ---- SVG icons used on quote cards ---- */
const ICON_HEART = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7.5-4.9-10-9.3C.4 8.7 1.6 5 5.1 4.2c2-.5 4 .3 5 2 1-1.7 3-2.5 5-2C18.4 5 19.6 8.7 22 11.7 19.5 16.1 12 21 12 21z"/></svg>';
const ICON_HEART_FILLED = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.9-10-9.3C.4 8.7 1.6 5 5.1 4.2c2-.5 4 .3 5 2 1-1.7 3-2.5 5-2C18.4 5 19.6 8.7 22 11.7 19.5 16.1 12 21 12 21z"/></svg>';
const ICON_EDIT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>';

/**
 * Build one quote card. `photoMode`:
 *   'my' -> deterministically use one of the 20 personal photo slots
 *   'mood' -> use a category-mood designed placeholder (default)
 */
function createQuoteCard(quote, { photoMode = 'mood' } = {}){
  const card = document.createElement('article');
  card.className = 'quote-card reveal';
  card.dataset.id = quote.id;

  const media = document.createElement('div');
  media.className = 'qc-media';

  const catTag = document.createElement('span');
  catTag.className = 'qc-cat';
  catTag.textContent = quote.c;
  media.appendChild(catTag);

  const photoHolder = document.createElement('div');
  photoHolder.style.width = '100%';
  photoHolder.style.height = '100%';
  media.appendChild(photoHolder);

  if (photoMode === 'my'){
    const photo = window.BrotherVersePhotos.pickMyPhoto(quote.id);
    window.BrotherVersePhotos.renderPhotoInto(photoHolder, photo.id, { category: quote.c, alt: quote.c });
  } else {
    window.BrotherVersePhotos.renderPhotoInto(photoHolder, null, { category: quote.c });
  }

  const text = document.createElement('p');
  text.className = 'qc-text';
  text.textContent = '"' + quote.t + '"';
  media.appendChild(text);

  const actions = document.createElement('div');
  actions.className = 'qc-actions';

  const favBtn = document.createElement('button');
  favBtn.className = 'qc-icon-btn fav-btn';
  favBtn.setAttribute('aria-label', 'Toggle favorite');
  const fav = window.BrotherVerseFavorites.isFavorite(quote.id);
  favBtn.innerHTML = fav ? ICON_HEART_FILLED : ICON_HEART;
  if (fav) favBtn.classList.add('active');
  favBtn.addEventListener('click', () => {
    const nowFav = window.BrotherVerseFavorites.toggleFavorite(quote.id);
    favBtn.innerHTML = nowFav ? ICON_HEART_FILLED : ICON_HEART;
    favBtn.classList.toggle('active', nowFav);
    favBtn.classList.add('pop');
    setTimeout(() => favBtn.classList.remove('pop'), 400);
    window.BrotherVerseUI?.toast(nowFav ? 'Added to favorites' : 'Removed from favorites', nowFav ? 'success' : 'default');
  });

  const useBtn = document.createElement('a');
  useBtn.className = 'qc-icon-btn';
  useBtn.setAttribute('aria-label', 'Use in Create Post');
  useBtn.title = 'Use in Create Post';
  useBtn.innerHTML = ICON_EDIT;
  useBtn.href = `create.html?quote=${quote.id}`;

  actions.appendChild(favBtn);
  actions.appendChild(useBtn);

  card.appendChild(media);
  card.appendChild(actions);
  return card;
}

function renderQuoteGrid(container, quotes, opts = {}){
  container.innerHTML = '';
  if (!quotes.length){
    container.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="ph-icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg></div>
        <h3>No quotes found</h3>
        <p>Try a different category or search term.</p>
      </div>`;
    return;
  }
  quotes.forEach(q => container.appendChild(createQuoteCard(q, opts)));
  if (window.BrotherVerseUI?.observeReveal) window.BrotherVerseUI.observeReveal(container);
}

window.BrotherVerseQuotes = {
  CATEGORIES, getCategories, getAllQuotes, getQuoteById, filterQuotes,
  createQuoteCard, renderQuoteGrid
};
