(function () {
  'use strict';

  // ===== Hamburger Menu Toggle =====
  var hamburger = document.querySelector('.nav-hamburger');
  var navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });
  }

  // ===== Pathname-Based Active Nav State =====
  var currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPath || (href === '/' && (currentPath === '/index.html' || currentPath === '/'))) {
      link.classList.add('active');
    }
  });

  // ===== Dynamic Copyright Year =====
  var yearEl = document.querySelector('.current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ===== Create Stars for GravityShot Section =====
  var starsContainer = document.querySelector('.stars-bg');
  if (starsContainer) {
    for (var i = 0; i < 100; i++) {
      var star = document.createElement('div');
      star.className = 'star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = Math.random() * 2 + 's';
      star.style.width = star.style.height = (Math.random() * 2 + 1) + 'px';
      starsContainer.appendChild(star);
    }
  }

  // ===== Hero Section Entrance =====
  var heroElements = document.querySelectorAll('.hero-hidden');
  var delays = [0, 200, 400, 600];

  heroElements.forEach(function (el, index) {
    setTimeout(function () {
      el.classList.add('hero-visible');
    }, delays[index] || 0);
  });

  // ===== Theme Toggle =====
  var themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';

      // Add smooth transition (skip if user prefers reduced motion)
      if (!window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('theme-transitioning');
        setTimeout(function() { document.body.classList.remove('theme-transitioning'); }, 400);
      }

      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch(e) {}
      themeToggle.setAttribute('aria-label',
        next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    });

    // Set initial aria-label
    var initialTheme = document.documentElement.getAttribute('data-theme');
    themeToggle.setAttribute('aria-label',
      initialTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );

    // Listen for OS theme changes (only if no manual override)
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        var stored = null;
        try { stored = localStorage.getItem('theme'); } catch(err) {}
        if (!stored) {
          var newTheme = e.matches ? 'dark' : 'light';
          document.documentElement.setAttribute('data-theme', newTheme);
          themeToggle.setAttribute('aria-label',
            newTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
          );
        }
      });
    }
  }

  // ===== Home showcase: tabs switch the featured game, autoplay pauses on hover/focus/touch =====
  var showcase = document.querySelector('[data-showcase]');
  if (showcase) {
    var sTabs = Array.prototype.slice.call(showcase.querySelectorAll('.show-tab'));
    var sSlides = sTabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    var sReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var sDelay = 8000;
    var sTimer = null;
    var sIndex = 0;

    showcase.style.setProperty('--show-delay', (sDelay / 1000) + 's');

    var sShow = function (i, focus) {
      sIndex = (i + sTabs.length) % sTabs.length;
      sTabs.forEach(function (t, k) {
        var on = k === sIndex;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        sSlides[k].classList.toggle('is-active', on);
        sSlides[k].setAttribute('aria-hidden', on ? 'false' : 'true');
      });
      if (focus) sTabs[sIndex].focus();
      // Restart the progress bar on the new tab
      if (showcase.classList.contains('is-playing')) {
        showcase.classList.remove('is-playing');
        void showcase.offsetWidth;
        showcase.classList.add('is-playing');
      }
    };

    var sStop = function () {
      if (sTimer) { clearInterval(sTimer); sTimer = null; }
      showcase.classList.remove('is-playing');
    };
    var sStart = function () {
      if (sReduce || sTimer) return;
      showcase.classList.add('is-playing');
      sTimer = setInterval(function () { sShow(sIndex + 1); }, sDelay);
    };

    sTabs.forEach(function (t, i) {
      t.addEventListener('click', function () { sStop(); sShow(i); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); sStop(); sShow(sIndex + 1, true); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); sStop(); sShow(sIndex - 1, true); }
      });
    });

    showcase.addEventListener('mouseenter', sStop);
    showcase.addEventListener('mouseleave', sStart);
    showcase.addEventListener('focusin', sStop);
    showcase.addEventListener('touchstart', sStop, { passive: true });
    sShow(0);
    sStart();
  }

  // ===== Trailers: play muted while on screen =====
  var trailers = document.querySelectorAll('video[data-autoplay]');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (trailers.length > 0 && 'IntersectionObserver' in window && !reduceMotion) {
    var trailerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) {
          if (v.paused && !v.dataset.userPaused) {
            var p = v.play();
            if (p && p.catch) p.catch(function () {});
          }
        } else if (!v.paused) {
          v.dataset.autoPaused = '1';
          v.pause();
        }
      });
    }, { threshold: 0.5 });

    trailers.forEach(function (v) {
      v.addEventListener('pause', function () {
        if (v.dataset.autoPaused) { delete v.dataset.autoPaused; return; }
        v.dataset.userPaused = '1';
      });
      v.addEventListener('play', function () { delete v.dataset.userPaused; });
      trailerObserver.observe(v);
    });
  }

  // ===== Scroll-Triggered Reveals =====
  var revealElements = document.querySelectorAll('.reveal-element');

  if (revealElements.length > 0) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }
})();
