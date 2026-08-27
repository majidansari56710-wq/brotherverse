/* ==========================================================================
   BROTHERVERSE — editor.js
   The Create Post engine: Canvas-rendered quote + photo poster with
   drag-to-reposition, zoom, aspect ratio switching, save & PNG download.
   ========================================================================== */

(function(){
  const canvas = document.getElementById('post-canvas');
  if (!canvas) return; // not on create.html
  const ctx = canvas.getContext('2d');

  const RATIOS = {
    square:  { w: 1080, h: 1080, label: 'Square' },
    portrait:{ w: 1080, h: 1350, label: 'Portrait' },
    story:   { w: 1080, h: 1920, label: 'Story' }
  };

  const state = {
    ratio: 'portrait',
    img: null,          // HTMLImageElement or null (placeholder mode)
    category: 'Best Brother',
    quoteText: '',
    zoom: 1,             // 1..2.5 multiplier on top of "cover" scale
    offsetX: 0,
    offsetY: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
    fontScale: 1         // 0.8..1.3 relative text size
  };

  const els = {
    quoteSelect: document.getElementById('quote-select'),
    categorySelect: document.getElementById('category-select'),
    customToggle: document.getElementById('custom-toggle'),
    quoteTextarea: document.getElementById('quote-textarea'),
    changePhotoBtn: document.getElementById('change-photo-btn'),
    removePhotoBtn: document.getElementById('remove-photo-btn'),
    zoomSlider: document.getElementById('zoom-slider'),
    textSizeSlider: document.getElementById('textsize-slider'),
    ratioBtns: document.querySelectorAll('[data-ratio]'),
    saveBtn: document.getElementById('save-post-btn'),
    downloadBtn: document.getElementById('download-post-btn'),
    resetBtn: document.getElementById('reset-post-btn'),
    hint: document.getElementById('editor-hint')
  };

  /* ---------------- Populate category + quote selects ---------------- */
  function populateSelects(){
    window.BrotherVerseQuotes.getCategories().forEach(c => {
      const opt = document.createElement('option');
      opt.value = c; opt.textContent = c;
      els.categorySelect.appendChild(opt);
    });
    refreshQuoteOptions();
  }
  function refreshQuoteOptions(){
    els.quoteSelect.innerHTML = '';
    const list = window.BrotherVerseQuotes.filterQuotes({ category: els.categorySelect.value });
    list.forEach(q => {
      const opt = document.createElement('option');
      opt.value = q.id; opt.textContent = q.t.length > 62 ? q.t.slice(0,60) + '…' : q.t;
      els.quoteSelect.appendChild(opt);
    });
  }

  /* ---------------- Load initial quote (from ?quote=ID or default) ---------------- */
  function loadInitialQuote(){
    const params = new URLSearchParams(location.search);
    const qid = params.get('quote');
    let quote = qid ? window.BrotherVerseQuotes.getQuoteById(qid) : null;
    if (!quote) quote = window.BrotherVerseQuotes.getAllQuotes()[0];
    state.category = quote.c;
    state.quoteText = quote.t;
    els.categorySelect.value = quote.c;
    refreshQuoteOptions();
    els.quoteSelect.value = quote.id;
    els.quoteTextarea.value = quote.t;

    const defaultPhoto = window.BrotherVersePhotos.pickMyPhoto(quote.id);
    loadImageSrc(defaultPhoto.file, true);
  }

  /* ---------------- Image loading ---------------- */
  function loadImageSrc(src, isDefaultAttempt){
    if (!src){ state.img = null; resetTransform(); draw(); return; }
    const img = new Image();
    img.onload = () => {
      state.img = img;
      resetTransform();
      draw();
    };
    img.onerror = () => {
      state.img = null; // falls back to designed placeholder in draw()
      resetTransform();
      draw();
      if (!isDefaultAttempt) window.BrotherVerseUI.toast('Could not load that photo', 'error');
    };
    img.src = src;
  }

  function resetTransform(){
    state.zoom = 1;
    state.offsetX = 0;
    state.offsetY = 0;
    els.zoomSlider.value = 100;
  }

  /* ---------------- Canvas geometry helpers ---------------- */
  function getCoverRect(){
    const r = RATIOS[state.ratio];
    const img = state.img;
    const coverScale = Math.max(r.w / img.width, r.h / img.height);
    const scale = coverScale * state.zoom;
    const dw = img.width * scale;
    const dh = img.height * scale;
    const maxOffX = Math.max(0, (dw - r.w) / 2);
    const maxOffY = Math.max(0, (dh - r.h) / 2);
    state.offsetX = Math.min(maxOffX, Math.max(-maxOffX, state.offsetX));
    state.offsetY = Math.min(maxOffY, Math.max(-maxOffY, state.offsetY));
    const dx = (r.w - dw) / 2 + state.offsetX;
    const dy = (r.h - dh) / 2 + state.offsetY;
    return { dx, dy, dw, dh };
  }

  function wrapText(context, text, maxWidth){
    const words = text.split(' ');
    const lines = [];
    let line = '';
    words.forEach(word => {
      const test = line ? line + ' ' + word : word;
      if (context.measureText(test).width > maxWidth && line){
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);
    return lines;
  }

  function roundRect(context, x, y, w, h, r){
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + w, y, x + w, y + h, r);
    context.arcTo(x + w, y + h, x, y + h, r);
    context.arcTo(x, y + h, x, y, r);
    context.arcTo(x, y, x + w, y, r);
    context.closePath();
  }

  /* ---------------- Main draw routine ---------------- */
  function draw(){
    const r = RATIOS[state.ratio];
    canvas.width = r.w;
    canvas.height = r.h;

    // Background
    if (state.img){
      const { dx, dy, dw, dh } = getCoverRect();
      ctx.drawImage(state.img, dx, dy, dw, dh);
    } else {
      const mood = window.BrotherVersePhotos.CATEGORY_MOOD[window.BrotherVersePhotos.moodKeyFor(state.category)];
      const grad = ctx.createLinearGradient(0, 0, r.w, r.h);
      grad.addColorStop(0, mood.from);
      grad.addColorStop(1, mood.to);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, r.w, r.h);
      // soft vignette glow
      const glow = ctx.createRadialGradient(r.w*0.3, r.h*0.25, 0, r.w*0.3, r.h*0.25, r.w*0.7);
      glow.addColorStop(0, 'rgba(255,255,255,0.10)');
      glow.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, r.w, r.h);
    }

    // Bottom scrim for text legibility
    const scrim = ctx.createLinearGradient(0, r.h * 0.35, 0, r.h);
    scrim.addColorStop(0, 'rgba(4,5,10,0)');
    scrim.addColorStop(1, 'rgba(4,5,10,0.92)');
    ctx.fillStyle = scrim;
    ctx.fillRect(0, r.h * 0.35, r.w, r.h * 0.65);
    // subtle top scrim so category pill stays legible on bright photos
    const topScrim = ctx.createLinearGradient(0, 0, 0, r.h * 0.22);
    topScrim.addColorStop(0, 'rgba(4,5,10,0.55)');
    topScrim.addColorStop(1, 'rgba(4,5,10,0)');
    ctx.fillStyle = topScrim;
    ctx.fillRect(0, 0, r.w, r.h * 0.22);

    const pad = r.w * 0.07;

    // Category pill
    ctx.font = `800 ${r.w*0.021}px Manrope, sans-serif`;
    const catLabel = state.category.toUpperCase();
    const catW = ctx.measureText(catLabel).width;
    const pillPadX = r.w * 0.022;
    const pillH = r.w * 0.05;
    ctx.fillStyle = 'rgba(6,7,14,0.55)';
    roundRect(ctx, pad, pad, catW + pillPadX * 2, pillH, pillH/2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#c9baff';
    ctx.textBaseline = 'middle';
    ctx.fillText(catLabel, pad + pillPadX, pad + pillH/2 + 1);

    // Quote text (bottom aligned, italic display font)
    const baseSize = r.w * 0.062 * state.fontScale;
    ctx.font = `italic 500 ${baseSize}px Fraunces, Georgia, serif`;
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = 'alphabetic';
    const maxWidth = r.w - pad * 2;
    const text = '"' + (state.quoteText || '') + '"';
    const lines = wrapText(ctx, text, maxWidth);
    const lineHeight = baseSize * 1.32;
    let y = r.h - pad - (state.__brandReserve || r.w*0.09) - (lines.length - 1) * lineHeight;
    lines.forEach(line => {
      ctx.fillText(line, pad, y);
      y += lineHeight;
    });

    // Brand watermark
    const bw = r.w * 0.024;
    const bx = pad, by = r.h - pad * 0.65;
    const ring = ctx.createLinearGradient(bx - bw, by - bw, bx + bw, by + bw);
    ring.addColorStop(0, '#8b6bff');
    ring.addColorStop(1, '#d9b877');
    ctx.beginPath();
    ctx.arc(bx, by, bw, 0, Math.PI*2);
    ctx.fillStyle = ring;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(bx, by, bw*0.62, 0, Math.PI*2);
    ctx.fillStyle = '#05060b';
    ctx.fill();
    ctx.font = `700 ${r.w*0.023}px Manrope, sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.82)';
    ctx.textBaseline = 'middle';
    ctx.fillText('BrotherVerse', bx + bw * 1.9, by + 1);
  }

  /* ---------------- Drag to reposition ---------------- */
  function canvasPoint(e){
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  }
  function dragStart(e){
    if (!state.img) return;
    state.dragging = true;
    const p = canvasPoint(e);
    state.lastX = p.x; state.lastY = p.y;
    canvas.style.cursor = 'grabbing';
  }
  function dragMove(e){
    if (!state.dragging) return;
    const p = canvasPoint(e);
    state.offsetX += (p.x - state.lastX);
    state.offsetY += (p.y - state.lastY);
    state.lastX = p.x; state.lastY = p.y;
    draw();
    e.preventDefault();
  }
  function dragEnd(){ state.dragging = false; canvas.style.cursor = state.img ? 'grab' : 'default'; }

  canvas.addEventListener('mousedown', dragStart);
  window.addEventListener('mousemove', dragMove);
  window.addEventListener('mouseup', dragEnd);
  canvas.addEventListener('touchstart', dragStart, { passive: true });
  canvas.addEventListener('touchmove', dragMove, { passive: false });
  canvas.addEventListener('touchend', dragEnd);

  /* ---------------- Control wiring ---------------- */
  els.categorySelect.addEventListener('change', () => {
    state.category = els.categorySelect.value;
    refreshQuoteOptions();
    if (els.quoteSelect.options.length){
      els.quoteSelect.selectedIndex = 0;
      applySelectedQuote();
    } else {
      draw();
    }
  });

  function applySelectedQuote(){
    const q = window.BrotherVerseQuotes.getQuoteById(els.quoteSelect.value);
    if (!q) return;
    state.quoteText = q.t;
    els.quoteTextarea.value = q.t;
    draw();
  }
  els.quoteSelect.addEventListener('change', applySelectedQuote);

  els.quoteTextarea.addEventListener('input', () => {
    state.quoteText = els.quoteTextarea.value;
    draw();
  });

  els.changePhotoBtn.addEventListener('click', () => {
    window.BrotherVerseUI.openPhotoPicker((selection) => {
      loadImageSrc(selection.src, false);
    });
  });

  els.removePhotoBtn.addEventListener('click', () => {
    state.img = null;
    canvas.style.cursor = 'default';
    draw();
  });

  els.zoomSlider.addEventListener('input', () => {
    state.zoom = Number(els.zoomSlider.value) / 100;
    draw();
  });

  els.textSizeSlider?.addEventListener('input', () => {
    state.fontScale = Number(els.textSizeSlider.value) / 100;
    draw();
  });

  els.ratioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      els.ratioBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.ratio = btn.dataset.ratio;
      draw();
    });
  });

  els.resetBtn.addEventListener('click', () => {
    resetTransform();
    state.fontScale = 1;
    els.textSizeSlider.value = 100;
    draw();
    window.BrotherVerseUI.toast('Adjustments reset');
  });

  els.saveBtn.addEventListener('click', () => {
    const dataUrl = canvas.toDataURL('image/png');
    const result = window.BrotherVerseSaved.savePost({
      dataUrl, quoteText: state.quoteText, category: state.category
    });
    if (result.ok) window.BrotherVerseUI.toast(window.BrotherVerseI18n.t('toastSaved'), 'success');
    else window.BrotherVerseUI.toast('Storage is full — delete an old saved post first', 'error');
  });

  els.downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'brotherverse-post.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    window.BrotherVerseUI.toast(window.BrotherVerseI18n.t('toastDownloaded'), 'success');
  });

  /* ---------------- Init ---------------- */
  function init(){
    populateSelects();
    canvas.style.cursor = 'grab';
    if (document.fonts && document.fonts.ready){
      document.fonts.ready.then(loadInitialQuote);
    } else {
      loadInitialQuote();
    }
  }
  init();

})();
