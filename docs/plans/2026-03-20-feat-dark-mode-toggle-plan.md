---
title: Dark Mode Toggle
type: feat
date: 2026-03-20
---

# feat: Dark Mode Toggle

## Overview

Add dark mode support to gamedostudio.com with OS preference detection, manual toggle in the navbar, localStorage persistence, and logo swapping. The site already uses CSS custom properties for theming, making this a natural extension.

## Problem Statement / Motivation

The site is light-only. A dark theme improves readability in low-light conditions, respects user OS preferences, and gives the site a more gaming-appropriate aesthetic. The near-black palette (`#1a1a2e`) aligns with the existing dark game card visuals.

## Proposed Solution

**Approach:** `data-theme="dark"` attribute on `<html>`, overriding CSS custom properties. JS-only dark mode (no CSS-only `@media` fallback — the toggle requires JS anyway). FOUC prevented by a blocking inline script in `<head>`.

### Architecture

```
<html data-theme="dark">          ← set by inline <script> in <head>
  ├── styles.css
  │   ├── :root { light vars }    ← default
  │   └── [data-theme="dark"] { dark vars }  ← overrides
  ├── <head> inline script         ← reads localStorage / matchMedia, sets data-theme BEFORE paint
  └── animations.js                ← toggle click handler, localStorage write, matchMedia listener
```

### Logo Swap Strategy

Duplicate `<img>` tags at each logo location. CSS controls visibility:

```css
/* Light mode: show light logos, hide dark logos */
.logo-light { display: block; }
.logo-dark { display: none; }

/* Dark mode: swap */
[data-theme="dark"] .logo-light { display: none; }
[data-theme="dark"] .logo-dark { display: block; }
```

**Logo mapping:**
| Location | Light file | Dark file |
|---|---|---|
| Navbar icon (all pages) | `gamedo-logo-transparent.png` | `GameDoStudio-logo-transparent-dark.png` |
| Footer icon (all pages) | `gamedo-logo-transparent.png` | `GameDoStudio-logo-transparent-dark.png` |
| Hero (index.html only) | `gamedo-logo-transparent.png` | `GameDoStudio-title-dark.png` |

## Implementation Phases

### Phase 1: FOUC Prevention — Inline Script in `<head>` (all 5 HTML files)

Add a blocking inline `<script>` in `<head>`, right after the existing `js` class script, on every page:

```html
<!-- index.html, about.html, projects.html, contact.html, 404.html -->
<script>
  (function() {
    var theme = null;
    try { theme = localStorage.getItem('theme'); } catch(e) {}
    if (theme === 'dark' || theme === 'light') {
      document.documentElement.setAttribute('data-theme', theme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  })();
</script>
```

**Files:** `index.html:~18`, `about.html:~18`, `projects.html:~18`, `contact.html:~18`, `404.html:~18`

### Phase 2: Dark Mode CSS Variables — `styles.css`

Add a `[data-theme="dark"]` block after `:root` with these overrides:

```css
/* styles.css — after :root closing brace */
[data-theme="dark"] {
    color-scheme: dark;

    --bg-primary: #1a1a2e;
    --bg-secondary: #16162a;
    --bg-card: #222240;
    --text-primary: #e8e8f0;
    --text-secondary: #a0a0b8;
    --text-muted: #6a6a80;

    --border-subtle: rgba(255, 255, 255, 0.08);
    --border-card: rgba(255, 255, 255, 0.06);
    --shadow-card: 0 2px 12px rgba(0, 0, 0, 0.3);
    --shadow-hover: 0 8px 30px rgba(0, 0, 0, 0.4);
    --glow-red: 0 0 20px rgba(196, 30, 58, 0.25);
    --color-red-glow: rgba(196, 30, 58, 0.25);
}
```

**File:** `styles.css` — insert after line ~63 (end of `:root`)

### Phase 3: Override Hardcoded Colors — `styles.css`

These hardcoded rgba values bypass CSS variables and need explicit dark-mode overrides:

```css
/* Navbar backgrounds */
[data-theme="dark"] .navbar {
    background: rgba(26, 26, 46, 0.92);
}

/* Mobile dropdown */
@media (max-width: 768px) {
    [data-theme="dark"] .nav-links {
        background: rgba(26, 26, 46, 0.97);
    }
}

/* Badges and UI elements with hardcoded light backgrounds */
[data-theme="dark"] .badge {
    background: rgba(255, 255, 255, 0.06);
}

[data-theme="dark"] .btn-disabled {
    background: rgba(255, 255, 255, 0.06);
    color: var(--text-muted);
}

[data-theme="dark"] .location-badge {
    background: rgba(255, 255, 255, 0.04);
}

[data-theme="dark"] .social-link:hover {
    background: rgba(196, 30, 58, 0.12);
}

/* Badge variants */
[data-theme="dark"] .badge-live {
    background: rgba(34, 197, 94, 0.15);
}
```

**File:** `styles.css` — append after the dark variables block

### Phase 4: Logo Visibility CSS — `styles.css`

```css
/* Logo swap - light/dark variants */
.logo-dark { display: none; }
[data-theme="dark"] .logo-light { display: none; }
[data-theme="dark"] .logo-dark { display: block; }
```

**File:** `styles.css`

### Phase 5: Toggle Button Styles — `styles.css`

```css
/* Theme toggle button */
.theme-toggle {
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--space-2);
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--rounded-sm);
    transition: color 0.2s ease;
}

.theme-toggle:hover {
    color: var(--color-red);
}

.theme-toggle svg {
    width: 20px;
    height: 20px;
}

/* Hide the inactive icon */
.theme-toggle .icon-sun { display: none; }
[data-theme="dark"] .theme-toggle .icon-moon { display: none; }
[data-theme="dark"] .theme-toggle .icon-sun { display: block; }
```

**File:** `styles.css`

### Phase 6: HTML Changes — Toggle Button + Dark Logo Tags (all 5 pages)

**6a. Navbar toggle button** — Add after `.nav-links` and before `.nav-hamburger` in all 5 pages:

```html
<button class="theme-toggle" aria-label="Switch to dark mode">
    <svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
    <svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
</button>
```

**6b. Navbar logo — duplicate with dark variant** (all 5 pages, in `.nav-logo-icon`):

```html
<div class="nav-logo-icon">
    <img src="assets/images/gamedo-logo-transparent.png" alt="GameDō" class="logo-light">
    <img src="assets/images/GameDoStudio-logo-transparent-dark.png" alt="GameDō" class="logo-dark">
</div>
```

**6c. Footer logo — duplicate with dark variant** (all 5 pages, in footer `.nav-logo-icon`):

Same pattern as 6b.

**6d. Hero logo — index.html only:**

```html
<img src="assets/images/gamedo-logo-transparent.png" alt="GameDō Studio" class="hero-logo hero-hidden logo-light">
<img src="assets/images/GameDoStudio-title-dark.png" alt="GameDō Studio" class="hero-logo hero-hidden logo-dark">
```

**Files:** `index.html`, `about.html`, `projects.html`, `contact.html`, `404.html`

### Phase 7: Toggle Logic — `animations.js`

Add to the existing IIFE, following the ES5 style:

```javascript
// Theme toggle
var themeToggle = document.querySelector('.theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', function() {
        var current = document.documentElement.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
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
```

**File:** `animations.js` — inside existing IIFE, after the hamburger menu code

### Phase 8: Smooth Theme Transition

Add a brief transition class to avoid jarring instant switches when the user clicks the toggle, but NOT on initial page load:

```css
.theme-transitioning,
.theme-transitioning *,
.theme-transitioning *::before,
.theme-transitioning *::after {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
}
```

In JS, add/remove this class on toggle click:

```javascript
document.body.classList.add('theme-transitioning');
setTimeout(function() { document.body.classList.remove('theme-transitioning'); }, 400);
```

Respect `prefers-reduced-motion` — skip the class entirely if the user prefers reduced motion.

**Files:** `styles.css`, `animations.js`

## Acceptance Criteria

- [x] Dark mode activates automatically if OS prefers dark (first visit, no localStorage)
- [x] Dark mode activates if localStorage contains `'dark'`
- [x] No flash of wrong theme (white flash) on any page load in dark mode
- [x] Sun/moon toggle visible in navbar on all 5 pages, on all screen sizes
- [x] Toggle persists choice in localStorage across page navigations
- [x] Logos swap correctly: light logos in light mode, dark logos in dark mode
- [x] Navbar and mobile menu backgrounds adapt to dark theme
- [x] Game card visual areas (GravityShot, Helping Hand, Regressor) remain unchanged
- [x] Game card content areas (text, badges) adapt correctly
- [x] Smooth color transition on toggle click (skipped for prefers-reduced-motion)
- [x] `color-scheme: dark` set for native browser elements (scrollbars, form controls)
- [x] Toggle has correct `aria-label` reflecting available action
- [x] OS theme change mid-session updates the site (when no manual override is stored)
- [x] Site remains fully functional in light mode (no regressions)

## Technical Considerations

- **FOUC prevention is critical**: The blocking inline script in `<head>` MUST execute before any CSS paints. It cannot be deferred.
- **localStorage errors**: Wrap all `localStorage` calls in try/catch (private browsing, quota exceeded).
- **Hardcoded rgba values**: ~10 locations in `styles.css` use hardcoded `rgba(255,255,255,...)` or `rgba(0,0,0,...)` that won't respond to variable overrides. Each needs an explicit `[data-theme="dark"]` rule.
- **Brand red stays the same**: `--color-red` (#c41e3a) has 4.5:1+ contrast on both white and `#1a1a2e` — no change needed.
- **No template system**: Every HTML change must be manually duplicated across 5 files.
- **`prefers-reduced-motion`**: The existing global `transition-duration: 0.01ms !important` override (line ~1404) will prevent theme transitions for users who prefer reduced motion, which is correct behavior.

## Dependencies & Risks

- **Risk**: Dark logo files have different dimensions/proportions than light logos — test at 40x40 (navbar), 32x32 (footer), and 800px max-width (hero) to ensure they look correct
- **Risk**: `GameDoStudio-title-dark.png` has an opaque dark background — may show a visible rectangle if hero section background isn't exactly matching. Verify visual result.
- **Risk**: Manual duplication across 5 HTML files increases maintenance burden for future changes

## Files Modified

| File | Changes |
|---|---|
| `styles.css` | Dark variable overrides, hardcoded color overrides, logo visibility, toggle button styles, transition class |
| `animations.js` | Toggle click handler, localStorage persistence, matchMedia listener, aria-label updates |
| `index.html` | Inline head script, toggle button in navbar, dark logo img tags (navbar, hero, footer) |
| `about.html` | Inline head script, toggle button in navbar, dark logo img tags (navbar, footer) |
| `projects.html` | Inline head script, toggle button in navbar, dark logo img tags (navbar, footer) |
| `contact.html` | Inline head script, toggle button in navbar, dark logo img tags (navbar, footer) |
| `404.html` | Inline head script, toggle button in navbar, dark logo img tags (navbar, footer) |

## References

- Brainstorm: `docs/brainstorms/2026-03-20-dark-mode-brainstorm.md`
- Current CSS variables: `styles.css:1-63`
- Navbar structure: identical across all 5 HTML files
- Existing progressive enhancement pattern: inline `<script>` adding `js` class in `<head>`
- Hardcoded navbar bg: `styles.css:267` (`rgba(255, 255, 255, 0.9)`)
- Mobile dropdown bg: `styles.css:1456` (`rgba(255, 255, 255, 0.97)`)
- `prefers-reduced-motion` handler: `styles.css:~1404`
