/* ==========================================================================
   BROTHERVERSE — main.js
   Shared chrome: navbar, mobile menu, scroll reveal, toasts, modals,
   the reusable photo picker, and small page-init helpers.
   ========================================================================== */

(function(){

  /* ---------------- Navbar scroll state ---------------- */
  const navbar = document.querySelector('.navbar');
  function onScroll(){
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 12);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Active nav link ---------------- */
  const page = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')){
      a.classList.add('active');
    }
  });

  /* ---------------- Mobile menu ---------------- */
  const burger = document.querySelector('.nav-burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const scrim = document.querySelector('.scrim');
  function setMenu(open){
    if (!burger || !mobileMenu) return;
    burger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    scrim?.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger?.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
  scrim?.addEventListener('click', () => setMenu(false));
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ---------------- Footer year ---------------- */
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  /* ---------------- Scroll reveal ---------------- */
  const revealObserver = ('IntersectionObserver' in window)
    ? new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting){
            entry.target.classList.add('in');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    : null;

  function observeReveal(scope){
    const root = scope || document;
    const nodes = root.matches?.('.reveal') ? [root, ...root.querySelectorAll('.reveal')] : root.querySelectorAll('.reveal');
    nodes.forEach(node => {
      if (node.classList.contains('in')) return;
      if (revealObserver) revealObserver.observe(node);
      else node.classList.add('in'); // fallback: no IO support
    });
  }
  document.addEventListener('DOMContentLoaded', () => observeReveal(document));

  /* ---------------- Toasts ---------------- */
  let toastStack = document.querySelector('.toast-stack');
  if (!toastStack){
    toastStack = document.createElement('div');
    toastStack.className = 'toast-stack';
    document.body.appendChild(toastStack);
  }
  function toast(message, type = 'default'){
    const el = document.createElement('div');
    el.className = `toast ${type === 'success' ? 'success' : type === 'error' ? 'error' : ''}`;
    el.innerHTML = `<span class="toast-dot"></span><span>${message}</span>`;
    toastStack.appendChild(el);
    setTimeout(() => {
      el.classList.add('hide');
      setTimeout(() => el.remove(), 380);
    }, 2600);
  }

  /* ---------------- Generic modal helper ---------------- */
  function openModal(scrimEl){ scrimEl.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeModal(scrimEl){ scrimEl.classList.remove('open'); document.body.style.overflow = ''; }

  document.querySelectorAll('.modal-scrim').forEach(scrimEl => {
    scrimEl.addEventListener('click', (e) => { if (e.target === scrimEl) closeModal(scrimEl); });
    scrimEl.querySelectorAll('.modal-close, [data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => closeModal(scrimEl));
    });
  });

  /* ---------------- Shared Photo Picker Modal ----------------
     Injected once per page on first use. Lets the user choose one of
     the 20 provided photos OR upload their own from device/gallery.
  ------------------------------------------------------------------ */
  let pickerScrim = null;
  function ensurePicker(){
    if (pickerScrim) return pickerScrim;
    pickerScrim = document.createElement('div');
    pickerScrim.className = 'modal-scrim';
    pickerScrim.innerHTML = `
      <div class="modal glass" role="dialog" aria-modal="true" aria-label="Change photo">
        <div class="modal-head">
          <h3>Change photo</h3>
          <button class="modal-close" aria-label="Close">&times;</button>
        </div>
        <label class="btn btn-primary btn-block" style="margin-bottom:18px;">
          Upload from your gallery
          <input type="file" accept="image/*" capture="environment" style="display:none" data-upload-input>
        </label>
        <p style="font-size:.82rem; text-transform:uppercase; letter-spacing:.08em; color:var(--mist-dim); margin-bottom:2px;">or choose a provided photo</p>
        <div class="photo-picker-grid" data-picker-grid></div>
      </div>`;
    document.body.appendChild(pickerScrim);

    const grid = pickerScrim.querySelector('[data-picker-grid]');
    window.BrotherVersePhotos.MY_PHOTOS.forEach(photo => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'photo-pick';
      window.BrotherVersePhotos.renderPhotoInto(btn, photo.id, { alt: photo.alt });
      btn.addEventListener('click', () => {
        pickerScrim._onSelect?.({ type: 'preset', id: photo.id, src: photo.file });
        closeModal(pickerScrim);
      });
      grid.appendChild(btn);
    });

    pickerScrim.querySelector('[data-upload-input]').addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        pickerScrim._onSelect?.({ type: 'upload', src: reader.result });
        closeModal(pickerScrim);
        toast('Photo uploaded', 'success');
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    });

    pickerScrim.addEventListener('click', (e) => { if (e.target === pickerScrim) closeModal(pickerScrim); });
    pickerScrim.querySelector('.modal-close').addEventListener('click', () => closeModal(pickerScrim));

    return pickerScrim;
  }

  function openPhotoPicker(onSelect){
    const scrimEl = ensurePicker();
    scrimEl._onSelect = onSelect;
    openModal(scrimEl);
  }

  /* ---------------- Expose shared UI API ---------------- */
  window.BrotherVerseUI = { toast, openModal, closeModal, observeReveal, openPhotoPicker };

})();
