---
title: "GravityShot Postmortem: I Shipped a Tiny Mobile Puzzle Game"
slug: gravityshot-postmortem-shipping-mobile-game-godot
excerpt: "I shipped a small physics puzzle game in Godot 4.6, on nights and weekends, around a day job and a family. Here is what went right, what went wrong, and the cent of revenue that proves it."
category: dev
cover_image: https://play-lh.googleusercontent.com/IXlM544yh4FvxhutnFt_tEdbFCGHShwGOOMDH8RbxO3xUA0TgKLtpB430QAw7XS0X9tyW9CmUPo9-gZj1XvsFg
cover_image_alt: "GravityShot logo art with the title over an orbital arc and a small orb in a starfield"
author: "Florian Huet"
published_date: 2026-05-30T03:00:00
tags: ["gravityshot", "postmortem", "godot", "indie-dev", "mobile-games", "solo-dev"]
related_games: []
reading_time: 7
seo_title: "GravityShot Postmortem: Shipping a Mobile Game in Godot 4.6"
seo_description: "Solo dev postmortem of GravityShot, a mobile puzzle game built in Godot 4.6 over nights and weekends. Scope, gotchas, numbers, and a stolen copy."
lang: en
---

I write about other people's indie games on this site as a hobby. Last week I shipped one of my own.

**GravityShot** is a small physics puzzle game built in Godot 4.6, made on nights and weekends, around a day job and a family. It launched on Google Play with almost no marketing, around 50 downloads at the time of writing, and a grand total of **10 cents in revenue**. That is funny on its own. The fact that someone already cloned it is funnier.

This is the honest version of the postmortem. Not the kind where I pretend everything went to plan and the numbers are about to take off any second. The numbers are what they are. The lessons are real.

<div style="display:flex;justify-content:center;margin:1.5rem 0"><img src="https://play-lh.googleusercontent.com/zdvwLms7wKswcMH_usWowtWMRkL5Wlukv0kd1wqVu7y_DLm7CZEvmyIxiOhtkJn4TOUV7cUHnZcNJraxVQgr=w1080" alt="GravityShot gameplay: the orb trails light as it slingshots past glowing gravity sources" style="width:340px;height:680px;object-fit:cover;border-radius:0.75rem" loading="lazy"></div>

## The Game in One Paragraph

You drag and release to slingshot an orb through space. Black holes pull you in. Wormholes spit you somewhere else. You collect gravity cores to unlock new orbs with different stats: heavier, faster, smaller hitbox, gains speed on bounces. The game ships with **70 hand-designed levels** across a tutorial and six sectors, **9 orbs**, EN and FR localization, and ad-supported unlocks for the trickier skins. No microtransactions in the gameplay path. It is free.

## What Went Right

### Closed testing via the Testers Community

The single best decision I made was sending the build into the **Testers Community** for closed testing before going live. The feedback was real, specific, and free. Strangers told me which levels felt unfair, which orbs felt useless, and which animations were too slow. Most of the changes that made the game actually playable came out of that loop.

If you are a solo dev about to ship a mobile game, do this. Pay the cost in time. Skip the part where you launch into silence and learn nothing.

### Godot 4.6 mostly held up

Godot is now a genuinely viable mobile engine in 2026. The mobile renderer was fast enough for what I needed, the export pipeline worked for both iOS and Android, and the editor stayed out of my way. Things broke (more on that below) but never in ways that would have made me switch engines.

If you are still picking an engine, our [Godot vs Unity vs Unreal comparison](/blog/godot-vs-unity-vs-unreal-engine-comparison) goes deeper on the trade-offs.

### Cuts saved the project

The version of the game in my head had **galaxy levels** (entire systems with multiple gravity sources and warp gates), a meta-progression layer, and a couple of mechanics that never made it in. Cutting them was painful and was 100 percent the right call. What shipped was 70 finished levels and 9 distinct orbs. What did not ship would have been six months of bad design.

Edmund McMillen's career-long advice on shipping kept echoing in my head. Finish small things. Then finish another one. Then another.

### Free audio from working indie artists

JDSherbert and DavidKBD on itch.io carry an absurd amount of this game's vibe on their backs. Royalty-free, attribution-only, and genuinely good. If you cannot afford an audio designer, this is the move.

## What Went Wrong

### Scope, again, but harder than I expected

Designing a single good gravity puzzle takes hours. Designing **60 of them** that ramp in difficulty without repeating themselves takes weeks. I underestimated this by an order of magnitude. The version 1 cut of galaxy levels collapsed under its own design complexity. It was not that I could not build it. I could not **design** it in a way that was actually fun across sixty distinct layouts.

The lesson I keep coming back to: when you cannot picture ten finished examples of a new mechanic, you do not yet understand the mechanic well enough to ship it.

<div style="display:flex;justify-content:center;margin:1.5rem 0"><img src="https://play-lh.googleusercontent.com/vaOsgoFws4F5OAMbAJqjr8gnxN1hhg45gz6UPHwMOdF4UXgtLGE76nxlYzgr7L9c5KssxYnHe6CyQVE-PNvY-EU=w1080" alt="GravityShot gameplay: the orb curves around celestial objects and gravity wells" style="width:340px;height:680px;object-fit:cover;border-radius:0.75rem" loading="lazy"></div>

### Optimization on cheap Android devices

The orbs leave particle trails. The celestial objects use custom shaders for the black hole, wormhole, and lensing effects. On a flagship phone, it looks great. On a five-year-old budget Android, the framerate would tank in any scene with three or more gravity sources active.

Fixing this meant a lot of profiling, a glow-mode toggle in the settings, and merciless cuts to particle counts. It also meant accepting that the game cannot look as good as the marketing screenshots on every device. Mobile is brutal that way.

### Marketing, talking about the game, impostor syndrome

This is the hardest section to write honestly.

I run a website that covers indie games. I know how to talk about other people's games. The second the game in question was **mine**, I froze. I had a hundred half-written tweets that I never sent. I launched with almost no announcement. I am writing this postmortem days after launch, not on launch day, because the launch-day version was paralyzing.

The impostor syndrome of shipping a small mobile game is real. The voice in your head says "this is not a real game, this is not impressive enough to talk about." That voice is wrong, but knowing it is wrong does not make it shut up.

### The day-job-and-family math

I have a 9 to 5. I have a family. I have a website to write for. The time I had for GravityShot was the hours after the kid was asleep and before I was too tired to think.

Every feature on the cutting room floor got cut not because it was bad, but because there were not enough hours. If you are an indie dev with a life, this is the only thing that actually matters. **Scope is not a number of features. Scope is the number of hours you actually have.**

## The Numbers (Such As They Are)

- **Downloads at time of writing**: under 50
- **Revenue**: 10 cents
- **Marketing spend**: 0
- **Total project cost**: basically zero (free engine, free tools, free music)
- **Time investment**: hard to say. Months of evenings. I stopped counting somewhere along the way.

I am not going to pretend the launch numbers are impressive. They are not. They are also exactly what you should expect when a solo dev ships a small mobile game with no marketing into the most saturated app market in the history of software.

The point was never the numbers. The point was fun and finishing.

## The Weird Part: A Copy Showed Up

A couple of weeks after I started closed testing, I came across a game in the wild with the same mechanics, the same vibe, and a different name.

I am not going to link it or name names because I do not want to give it traffic. I also have no proof it is a deliberate copy versus someone arriving at a parallel idea, and the difference does not change my next move.

What I will say: the moment you put your game in front of strangers, even in a closed test, you are putting the idea in the wild. If an idea is small enough to clone, it will get cloned. The defense is not to keep the idea secret. The defense is to be the one who actually finishes the version that feels good to play.

<div style="display:flex;justify-content:center;margin:1.5rem 0"><img src="https://play-lh.googleusercontent.com/pRSAXtVa4oSfvUU68j66q97GSzjZQ33UehYpHweT0ByNn1NO3UR742CmVIfU4btXw8O0zxkCsSjUOhgch5F7fmA=w1080" alt="GravityShot's orb selection screen showing the Solar orb and its stats" style="width:340px;height:680px;object-fit:cover;border-radius:0.75rem" loading="lazy"></div>

## What I'd Do Differently

Three things, ordered by how hard they are to apply.

**One: announce louder.** Even when it feels cringeworthy. Even when impostor syndrome is screaming. The launch-day silence is a self-inflicted wound. Half-written tweets in the drafts folder is the lowest-yield form of marketing in existence.

**Two: design ten levels before committing to a mechanic.** If I had forced myself to design ten finished galaxy levels on paper before building any of them, I would have cut the whole feature six months earlier. The cost of finding out late is enormous.

**Three: ship more closed-test builds, and ship them earlier.** The Testers Community feedback was so valuable that the only mistake was not getting in there sooner. The earliest playable thing should already be in front of strangers.

## Try It

[GravityShot is live on Google Play.](https://play.google.com/store/apps/details?id=com.gamedostudio.gravityshot) It is free. It has 70 levels, 9 orbs, ad-supported skin unlocks if you want the harder modes, and exactly zero microtransactions in the gameplay path.

If you play it, the most useful thing you can do is leave a review with the bug, the level, or the moment that broke your flow. I will read every word.

The point was never the numbers. The point was fun and finishing.
