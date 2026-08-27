/* ==========================================================================
   BROTHERVERSE — translations.js
   Central UI string dictionary. Everything user-facing routes through t()
   so BrotherVerse can add languages later without touching page logic.
   ========================================================================== */

const STRINGS = {
  en: {
    tagline: 'Quotes. Memories. Brotherhood.',
    heroHeadline1: 'Brotherhood deserves',
    heroHeadlineEm: 'more than words.',
    heroLead: 'Discover beautiful brother quotes and turn your memories into posts.',
    ctaCreate: 'Create Your Post',
    ctaExplore: 'Explore Quotes',
    changePhoto: 'Change Photo',
    toastFavAdded: 'Added to favorites',
    toastFavRemoved: 'Removed from favorites',
    toastSaved: 'Post saved to your library',
    toastDownloaded: 'Image downloaded',
    emptyFavorites: 'No favorites yet',
    emptySaved: 'No saved posts yet'
  }
};

let currentLocale = 'en';

function t(key){
  return (STRINGS[currentLocale] && STRINGS[currentLocale][key]) || STRINGS.en[key] || key;
}

function setLocale(locale){
  if (STRINGS[locale]) currentLocale = locale;
}

window.BrotherVerseI18n = { t, setLocale };
