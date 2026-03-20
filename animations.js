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
