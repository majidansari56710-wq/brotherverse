/* ==========================================================================
   BROTHERVERSE — favorites.js
   Persists favorited quote IDs to localStorage.
   ========================================================================== */

const FAV_KEY = 'bv_favorites_v1';

function getFavorites(){
  try{
    const raw = localStorage.getItem(FAV_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch(e){ return []; }
}

function isFavorite(quoteId){
  return getFavorites().includes(quoteId);
}

function toggleFavorite(quoteId){
  const list = getFavorites();
  const idx = list.indexOf(quoteId);
  let nowFav;
  if (idx > -1){ list.splice(idx, 1); nowFav = false; }
  else { list.unshift(quoteId); nowFav = true; }
  localStorage.setItem(FAV_KEY, JSON.stringify(list));
  document.dispatchEvent(new CustomEvent('bv:favorites-changed', { detail: { quoteId, nowFav } }));
  return nowFav;
}

function clearFavorites(){
  localStorage.removeItem(FAV_KEY);
  document.dispatchEvent(new CustomEvent('bv:favorites-changed', { detail: { cleared: true } }));
}

function favoritesCount(){
  return getFavorites().length;
}

window.BrotherVerseFavorites = { getFavorites, isFavorite, toggleFavorite, clearFavorites, favoritesCount };
