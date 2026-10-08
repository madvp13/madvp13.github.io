// Start each newly opened page at the top (back/forward and #links keep their own position).
(function () {
  var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  if ((!nav || nav.type === 'navigate') && !location.hash) {
    window.scrollTo(0, 0);
    window.addEventListener('load', function () { window.scrollTo(0, 0); });
  }
})();
// Shows the labeled placeholder behind any image file that hasn't been added yet.
document.querySelectorAll('.shot img').forEach(function (img) {
  function drop() { img.remove(); }
  function loaded() { img.closest('.shot').classList.add('has-img'); }
  if (img.complete) { if (img.naturalWidth === 0) drop(); else loaded(); }
  else { img.addEventListener('error', drop); img.addEventListener('load', loaded); }
});
// Header: shrink the name after scrolling past the top, grow it back near the top.
var header = document.querySelector('.site-header');
if (header) {
  var onScroll = function () {
    var yPos = window.scrollY;
    if (yPos > 60) header.classList.add('is-scrolled');
    else if (yPos < 20) header.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
// Home work folder: hover or focus a tab to show its card; on touch, the first tap shows it and the second opens it.
document.querySelectorAll('.work-folder').forEach(function (folder) {
  var tabs = Array.prototype.slice.call(folder.querySelectorAll('.ftab'));
  function activate(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  }
  var lastPointer = 'mouse', wasActive = false;
  tabs.forEach(function (tab) {
    tab.addEventListener('pointerdown', function (e) { lastPointer = e.pointerType; wasActive = tab.classList.contains('is-active'); });
    tab.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') activate(tab); });
    tab.addEventListener('focus', function () { activate(tab); });
    tab.addEventListener('click', function (e) {
      if (lastPointer !== 'mouse' && !wasActive) { e.preventDefault(); activate(tab); }
      lastPointer = 'mouse'; wasActive = true;
    });
  });
});
// Tap to enlarge: any .zoomable image opens full screen; close with the button, Escape, or a tap on the dark area.
(function () {
  var items = document.querySelectorAll('.zoomable');
  if (!items.length) return;
  var box = document.createElement('div');
  box.className = 'lightbox'; box.hidden = true;
  box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Enlarged image');
  box.innerHTML = '<div class="lb-bar"><span class="lb-hint">Scroll sideways to see the whole piece</span><button type="button" class="lb-close" id="lb-close">Close</button></div><div class="lb-scroll"><img alt=""></div>';
  document.body.appendChild(box);
  var big = box.querySelector('img'), hint = box.querySelector('.lb-hint'), closeBtn = box.querySelector('.lb-close'), scroller = box.querySelector('.lb-scroll');
  var opener = null;
  function open(el) {
    var img = el.querySelector('img');
    if (!img) return;
    opener = el;
    big.src = el.dataset.full || img.currentSrc || img.src; big.alt = img.alt;
    box.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    scroller.scrollLeft = 0;
    var check = function () { hint.style.visibility = big.offsetWidth > scroller.clientWidth ? 'visible' : 'hidden'; };
    if (big.complete) check(); else big.onload = check;
    closeBtn.focus();
  }
  function close() {
    box.hidden = true;
    document.documentElement.style.overflow = '';
    if (opener) opener.focus();
  }
  items.forEach(function (el) {
    el.setAttribute('tabindex', '0'); el.setAttribute('role', 'button');
    el.setAttribute('aria-label', 'Enlarge image');
    el.addEventListener('click', function () { open(el); });
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(el); } });
  });
  closeBtn.addEventListener('click', close);
  scroller.addEventListener('click', function (e) { if (e.target === scroller) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.hidden) close(); });
})();
// Hide a gallery section (data-hide-empty) until at least one of its images exists.
document.querySelectorAll('[data-hide-empty]').forEach(function (sec) {
  var imgs = sec.querySelectorAll('.shot img'), pending = imgs.length, found = false;
  function settle() { if (--pending === 0 && !found) sec.hidden = true; }
  if (!pending) { sec.hidden = true; return; }
  imgs.forEach(function (img) {
    if (img.complete) { if (img.naturalWidth) found = true; settle(); }
    else {
      img.addEventListener('load', function () { found = true; sec.hidden = false; settle(); });
      img.addEventListener('error', settle);
    }
  });
});
var y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// ERA'ZINE viewer: a two-page book. The cover sits alone on the right; Next turns the right-hand page
// over on the spine to reveal the next spread, Previous turns the left-hand page back. Arrow keys and swipe work too.
document.querySelectorAll('.flipbook').forEach(function (book) {
  var dir = book.dataset.dir || '';
  var files = (book.dataset.files || '').split('|');
  var total = files.length;
  var stage = book.querySelector('.fb-stage'), body = book.querySelector('.fb-book');
  var L = book.querySelector('.fb-left'), R = book.querySelector('.fb-right');
  var leaf = book.querySelector('.fb-leaf'), front = leaf.querySelector('.fb-front'), back = leaf.querySelector('.fb-back');
  var ph = book.querySelector('.ph'), file = book.querySelector('.fb-file'), hint = book.querySelector('.fb-hint');
  var count = book.querySelector('.fb-count');
  var prev = book.querySelector('.fb-prev'), next = book.querySelector('.fb-next');
  var page = 0, busy = false, missing = {};
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  files.forEach(function (f) {
    var im = new Image();
    im.onerror = function () { missing[f] = true; if (files[page] === f) render(page); };
    im.src = dir + f;
  });
  function label(i) { return i === 0 ? 'Cover' : 'Spread ' + i + ' of ' + (total - 1); }
  // Each view has a left and right page: the cover is right-only; a spread is split down the middle.
  function pages(i) {
    var src = 'url("' + dir + files[i] + '")';
    if (i === 0) return { left: null, right: { src: src, size: '100% 100%', pos: '0 0' } };
    return { left: { src: src, size: '200% 100%', pos: '0 0' }, right: { src: src, size: '200% 100%', pos: '100% 0' } };
  }
  function paint(el, p) {
    el.style.backgroundImage = p ? p.src : 'none';
    el.style.backgroundSize = p ? p.size : '';
    el.style.backgroundPosition = p ? p.pos : '';
    el.style.backgroundColor = p ? 'var(--surface)' : 'transparent';
  }
  function render(i) {
    var v = pages(i);
    paint(L, v.left); paint(R, v.right);
    body.classList.toggle('is-closed', i === 0);
    leaf.hidden = true;
    var gone = missing[files[i]];
    ph.hidden = !gone; file.textContent = dir + files[i]; hint.textContent = label(i);
    stage.setAttribute('aria-label', "ERA'ZINE, " + label(i).toLowerCase());
    count.textContent = label(i);
    prev.disabled = i === 0; next.disabled = i === total - 1;
  }
  function go(step) {
    var n = page + step;
    if (busy || n < 0 || n >= total) return;
    if (still || missing[files[page]] || missing[files[n]] || !leaf.animate) { page = n; render(n); return; }
    busy = true;
    var a = pages(page), b = pages(n);
    if (step > 0) {
      paint(L, a.left); paint(R, b.right);         // underneath: current left, next right
      paint(front, a.right); paint(back, b.left);  // the turning right-hand page
      leaf.classList.remove('on-left');
    } else {
      paint(L, b.left); paint(R, a.right);
      paint(front, a.left); paint(back, b.right);  // the turning left-hand page
      leaf.classList.add('on-left');
    }
    leaf.hidden = false;
    body.classList.toggle('is-closed', n === 0);
    var to = step > 0 ? -180 : 180;
    var anim = leaf.animate(
      [{ transform: 'perspective(2200px) rotateY(0deg)' }, { transform: 'perspective(2200px) rotateY(' + to + 'deg)' }],
      { duration: 650, easing: 'cubic-bezier(.45,.05,.35,1)' }
    );
    anim.onfinish = function () { page = n; render(n); busy = false; };
  }
  prev.addEventListener('click', function () { go(-1); });
  next.addEventListener('click', function () { go(1); });
  book.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  });
  var x0 = null;
  stage.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    x0 = null;
  });
  render(0);
});
