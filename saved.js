/* ==========================================================================
   BROTHERVERSE — saved.js
   Persists user-created posts (from the Create Post editor) to localStorage.
   Each saved post: { id, dataUrl, quoteText, category, createdAt }
   ========================================================================== */

const SAVED_KEY = 'bv_saved_posts_v1';
const SAVED_LIMIT = 40; // keep localStorage usage sane (images are base64)

function getSavedPosts(){
  try{
    const raw = localStorage.getItem(SAVED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch(e){ return []; }
}

function savePost({ dataUrl, quoteText, category, photoLabel }){
  const list = getSavedPosts();
  const entry = {
    id: 'post_' + Date.now() + '_' + Math.random().toString(36).slice(2,7),
    dataUrl,
    quoteText,
    category,
    photoLabel: photoLabel || '',
    createdAt: new Date().toISOString()
  };
  list.unshift(entry);
  if (list.length > SAVED_LIMIT) list.length = SAVED_LIMIT;
  try{
    localStorage.setItem(SAVED_KEY, JSON.stringify(list));
    document.dispatchEvent(new CustomEvent('bv:saved-changed'));
    return { ok: true, entry };
  } catch(e){
    // Quota exceeded — drop oldest and retry once
    if (list.length > 1){
      list.pop();
      try{
        localStorage.setItem(SAVED_KEY, JSON.stringify(list));
        document.dispatchEvent(new CustomEvent('bv:saved-changed'));
        return { ok: true, entry };
      } catch(e2){ /* fall through */ }
    }
    return { ok: false, error: 'storage_full' };
  }
}

function deleteSavedPost(id){
  const list = getSavedPosts().filter(p => p.id !== id);
  localStorage.setItem(SAVED_KEY, JSON.stringify(list));
  document.dispatchEvent(new CustomEvent('bv:saved-changed'));
}

function clearSavedPosts(){
  localStorage.removeItem(SAVED_KEY);
  document.dispatchEvent(new CustomEvent('bv:saved-changed'));
}

window.BrotherVerseSaved = { getSavedPosts, savePost, deleteSavedPost, clearSavedPosts };
