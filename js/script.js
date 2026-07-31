/* Prime Fades - site behaviour */
(function () {
  'use strict';

  /* year */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* sticky masthead */
  var masthead = document.getElementById('masthead');
  var onScroll = function () {
    masthead.classList.toggle('stuck', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* mobile nav */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  function setNav(open) {
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () {
    setNav(!nav.classList.contains('open'));
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setNav(false); });
  });

  /* book-now dropdowns */
  var bookDrops = Array.prototype.slice.call(document.querySelectorAll('.book-drop'));
  function closeBookDrops() {
    bookDrops.forEach(function (d) {
      d.classList.remove('open');
      d.querySelector('.book-toggle').setAttribute('aria-expanded', 'false');
    });
  }
  bookDrops.forEach(function (drop) {
    var toggle = drop.querySelector('.book-toggle');
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var wasOpen = drop.classList.contains('open');
      closeBookDrops();
      if (!wasOpen) {
        drop.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });
  document.addEventListener('click', closeBookDrops);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeBookDrops();
  });

  /* barber location filter */
  var crewLoc = document.getElementById('crewLoc');
  var crewItems = Array.prototype.slice.call(document.querySelectorAll('.crew li'));
  if (crewLoc) {
    crewLoc.addEventListener('change', function () {
      crewItems.forEach(function (li) {
        li.hidden = li.dataset.loc !== crewLoc.value;
      });
    });
  }

  /* reveal on scroll */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var group = e.target.parentElement;
        var peers = group ? Array.prototype.slice.call(group.children) : [];
        var i = peers.indexOf(e.target);
        e.target.style.transitionDelay = Math.min(i, 6) * 55 + 'ms';
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* lightbox */
  var tiles = Array.prototype.slice.call(document.querySelectorAll('.tile'));
  var box = document.getElementById('lightbox');
  var boxImg = document.getElementById('lbImg');
  var boxCap = document.getElementById('lbCap');
  var current = 0;
  var lastFocus = null;

  function render(i) {
    current = (i + tiles.length) % tiles.length;
    var t = tiles[current];
    boxImg.src = t.dataset.src;
    boxImg.alt = t.querySelector('img').alt;
    boxCap.textContent = t.dataset.cap || '';
  }

  function openBox(i) {
    lastFocus = document.activeElement;
    render(i);
    box.hidden = false;
    requestAnimationFrame(function () { box.classList.add('show'); });
    document.body.style.overflow = 'hidden';
    document.getElementById('lbClose').focus();
  }

  function closeBox() {
    box.classList.remove('show');
    document.body.style.overflow = '';
    setTimeout(function () {
      box.hidden = true;
      boxImg.src = '';
      if (lastFocus) lastFocus.focus();
    }, 280);
  }

  tiles.forEach(function (t, i) {
    t.addEventListener('click', function () { openBox(i); });
  });

  document.getElementById('lbClose').addEventListener('click', closeBox);
  document.getElementById('lbPrev').addEventListener('click', function () { render(current - 1); });
  document.getElementById('lbNext').addEventListener('click', function () { render(current + 1); });
  box.addEventListener('click', function (e) {
    if (e.target === box) closeBox();
  });

  document.addEventListener('keydown', function (e) {
    if (box.hidden) {
      if (e.key === 'Escape' && nav.classList.contains('open')) setNav(false);
      return;
    }
    if (e.key === 'Escape') closeBox();
    if (e.key === 'ArrowLeft') render(current - 1);
    if (e.key === 'ArrowRight') render(current + 1);
  });
})();
