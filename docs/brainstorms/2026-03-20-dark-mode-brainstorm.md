# Dark Mode for gamedostudio.com

**Date**: 2026-03-20
**Status**: Ready for planning

## What We're Building

A dark mode toggle for the GameDo Studio website that:
- Defaults to the user's OS preference (`prefers-color-scheme`)
- Provides a manual sun/moon toggle button in the navbar
- Persists the user's choice in `localStorage`
- Swaps between light and dark logo variants

## Why This Approach

**Approach chosen: `data-theme` attribute + CSS variable overrides**

- The site already uses CSS custom properties for all theme colors (`--bg-primary`, `--text-primary`, etc.), making variable overrides natural
- Duplicating `<img>` tags with CSS show/hide avoids any flash of wrong logo on page load
- `data-theme` on `<html>` is the standard pattern, works with CSS selectors cleanly
- localStorage persistence + system preference detection covers all user expectations

**Rejected alternatives:**
- JS `src` swap: possible flash of wrong logo before JS executes
- CSS `filter: invert()`: doesn't match the custom-designed dark logos

## Key Decisions

1. **Toggle location**: Sun/moon icon in the navbar (visible on all pages)
2. **Default behavior**: Follow `prefers-color-scheme`, allow manual override
3. **Persistence**: `localStorage` stores user preference; overrides system default
4. **Color palette**: Near-black backgrounds (`#1a1a2e` family)
5. **Logo strategy**: Duplicate `<img>` tags — one light, one dark — CSS controls visibility via `[data-theme]` selectors
6. **Dark logo files**:
   - `GameDoStudio-logo-transparent-dark.png` (square, for navbar + favicon area)
   - `GameDoStudio-title-dark.png` (horizontal, for hero if needed)

## Scope

### In scope
- Dark CSS variable overrides for all theme tokens (bg, text, borders, shadows)
- Toggle button with sun/moon icon in navbar (all 5 pages)
- Logo swapping (navbar logo on all pages, hero logo on index.html)
- localStorage persistence
- `prefers-color-scheme` media query for default
- Smooth color transition on toggle

### Out of scope
- Per-game color adjustments (GravityShot, A Helping Hand, etc. cards keep their existing game-specific colors)
- Dark favicon swap (browser limitation)
- Animation changes between themes

## Files to Modify

- `styles.css` — add `[data-theme="dark"]` variable overrides + toggle button styles + logo visibility rules
- `animations.js` — add theme toggle logic (detect preference, toggle, persist)
- `index.html` — add toggle button to navbar, add dark logo `<img>` tags
- `about.html` — add toggle button to navbar, add dark logo `<img>` tags
- `projects.html` — add toggle button to navbar, add dark logo `<img>` tags
- `contact.html` — add toggle button to navbar, add dark logo `<img>` tags
- `404.html` — add toggle button to navbar, add dark logo `<img>` tags

## Open Questions

None — ready for implementation planning.
