# Mobile Hero Cropping Fix

**Date:** 2026-03-23
**Status:** Ready for implementation

## What We're Fixing

On mobile devices, the homepage hero section crops the title logo and the text below it (h1, subtitle, action buttons). Users cannot scroll to see the full content.

## Root Cause

- `.home-hero` uses `overflow: hidden` + `min-height: 100vh`
- The hero logo (`max-width: 800px`) has no mobile-specific size reduction
- On small screens, the logo + text + buttons exceed the viewport height
- `overflow: hidden` clips everything beyond the container boundary

## Chosen Approach: Shrink Logo on Mobile

Add responsive rules to reduce the hero logo size at mobile breakpoints and remove `overflow: hidden` so content isn't clipped.

### Changes

**At 768px breakpoint:**
- `.hero-logo` max-width: 400px (from 800px)
- `.hero-logo` margin-bottom: -60px (from -100px)
- `.home-hero` overflow: visible

**At 480px breakpoint:**
- `.hero-logo` max-width: 280px
- `.hero-logo` margin-bottom: -40px

### Why This Approach

- Keeps the full-viewport hero feel on mobile (preserves `min-height: 100vh`)
- Simply scales the logo proportionally rather than changing the layout structure
- Minimal CSS changes with maximum impact

## Open Questions

None — straightforward CSS fix.
