#!/usr/bin/env python3
"""Build the studio blog: blog/posts/*.md -> blog/<slug>.html + blog/index.html.

Nav and footer are copied from about.html so the blog stays in sync with the site.
Needs `markdown` and `pyyaml`:
    python3 -m venv ~/.venvs/gamedostudio-blog
    ~/.venvs/gamedostudio-blog/bin/pip install markdown pyyaml
    ~/.venvs/gamedostudio-blog/bin/python tools/build_blog.py
(keep the venv outside the repo: the whole folder is uploaded to Cloudflare Pages)
"""
import datetime as dt
import html
import json
import re
from pathlib import Path

import markdown
import yaml

ROOT = Path(__file__).resolve().parent.parent
POSTS = ROOT / "blog" / "posts"
OUT = ROOT / "blog"
SITE = "https://gamedostudio.com"
CSS_VERSION = "20261118a"


def chrome():
    about = (ROOT / "about.html").read_text()
    nav = re.search(r"\s*<nav class=\"navbar\">.*?</nav>", about, re.S).group(0)
    footer = re.search(r"\s*<footer class=\"footer\">.*?</footer>", about, re.S).group(0)
    fix = lambda s: s.replace('src="assets/', 'src="/assets/')
    return fix(nav), fix(footer)


def load_posts():
    posts = []
    for path in sorted(POSTS.glob("*.md")):
        raw = path.read_text()
        _, fm, body = raw.split("---", 2)
        meta = yaml.safe_load(fm)
        # Python-Markdown needs a blank line before a list (Astro/GFM does not)
        body = re.sub(r"(?m)^(?![ \t]*(?:[-*+]|\d+\.)\s)(\S[^\n]*)\n(?=[ \t]*(?:[-*+]|\d+\.)\s)", r"\1\n\n", body)
        meta["body"] = markdown.markdown(body, extensions=["tables", "fenced_code", "sane_lists"])
        date = meta["published_date"]
        meta["date"] = date if isinstance(date, dt.datetime) else dt.datetime.fromisoformat(str(date))
        posts.append(meta)
    return sorted(posts, key=lambda p: p["date"], reverse=True)


def head(title, description, url, image, noindex=False, extra=""):
    e = html.escape
    robots = '\n    <meta name="robots" content="noindex">' if noindex else ""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{e(title)}</title>
    <meta name="description" content="{e(description)}">{robots}
    <link rel="canonical" href="{url}">
    <meta property="og:title" content="{e(title)}">
    <meta property="og:description" content="{e(description)}">
    <meta property="og:url" content="{url}">
    <meta property="og:type" content="article">
    <meta property="og:image" content="{e(image)}">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="alternate" type="application/rss+xml" title="GameDō Studio Blog" href="/blog/rss.xml">
    <link rel="stylesheet" href="/styles.css?v={CSS_VERSION}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
    <link rel="icon" type="image/png" href="/assets/images/favicon-circle.png">
    <script>document.documentElement.classList.add('js');</script>
    <script>
      (function() {{
        var theme = null;
        try {{ theme = localStorage.getItem('theme'); }} catch(e) {{}}
        if (theme === 'dark' || theme === 'light') {{
          document.documentElement.setAttribute('data-theme', theme);
        }} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {{
          document.documentElement.setAttribute('data-theme', 'dark');
        }}
      }})();
    </script>{extra}
</head>
<body>
    <a href="#main" class="skip-link">Skip to content</a>
"""


def tail(footer):
    return f"""{footer}

    <script src="/animations.js?v={CSS_VERSION}" defer></script>
</body>
</html>
"""


def fmt_date(d):
    return d.strftime("%B %-d, %Y")


def build_post(p, nav, footer):
    e = html.escape
    url = f"{SITE}/blog/{p['slug']}"
    image = p["cover_image"] if p["cover_image"].startswith("http") else SITE + p["cover_image"]
    title = p.get("seo_title") or p["title"]
    desc = p.get("seo_description") or p["excerpt"]
    ld = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": p["title"],
        "description": desc,
        "image": image,
        "datePublished": p["date"].isoformat(),
        "author": {"@type": "Person", "name": p["author"]},
        "publisher": {"@type": "Organization", "name": "GameDō Studio", "url": SITE},
        "mainEntityOfPage": url,
    }
    if p.get("updated_date"):
        ld["dateModified"] = str(p["updated_date"])
    extra = f'\n    <script type="application/ld+json">{json.dumps(ld, ensure_ascii=False, default=str)}</script>'
    return (
        head(f"{title} | GameDō Studio Blog", desc, url, image, p.get("noindex", False), extra)
        + nav
        + f"""

    <main id="main">
        <article class="blog-post">
            <header class="blog-post-header">
                <a href="/blog" class="blog-back">&larr; All posts</a>
                <h1>{e(p['title'])}</h1>
                <p class="blog-meta">{e(p['author'])} · <time datetime="{p['date'].date().isoformat()}">{fmt_date(p['date'])}</time> · {p.get('reading_time', 5)} min read</p>
            </header>
            <img class="blog-cover" src="{e(p['cover_image'])}" alt="{e(p.get('cover_image_alt', ''))}" width="1200" height="630">
            <div class="blog-body">
{p['body']}
            </div>
        </article>
    </main>
"""
        + tail(footer)
    )


def build_index(posts, nav, footer):
    e = html.escape
    cards = "\n".join(
        f"""                <a class="blog-card reveal-element" href="/blog/{p['slug']}">
                    <img src="{e(p['cover_image'])}" alt="{e(p.get('cover_image_alt', ''))}" loading="lazy" width="616" height="353">
                    <div class="blog-card-body">
                        <p class="blog-meta"><time datetime="{p['date'].date().isoformat()}">{fmt_date(p['date'])}</time> · {p.get('reading_time', 5)} min read</p>
                        <h2>{e(p['title'])}</h2>
                        <p>{e(p['excerpt'])}</p>
                    </div>
                </a>"""
        for p in posts
    )
    desc = "Devlogs, postmortems and game development notes from GameDō Studio, a small indie studio making mobile games in Godot."
    return (
        head("Blog — GameDō Studio", desc, f"{SITE}/blog", f"{SITE}/assets/images/brand/og-studio.jpg")
        + nav
        + f"""

    <main id="main">
        <section class="page-hero">
            <div class="section-container">
                <div class="kanji hero-hidden">道</div>
                <h1 class="hero-hidden">The <span class="accent">Blog</span></h1>
                <p class="hero-subtitle hero-hidden">Devlogs, postmortems and what we learn making our games.</p>
            </div>
        </section>
        <section class="blog-list-section">
            <div class="blog-grid">
{cards}
            </div>
        </section>
    </main>
"""
        + tail(footer)
    )


def build_rss(posts):
    e = html.escape
    items = "\n".join(
        f"""    <item>
      <title>{e(p['title'])}</title>
      <link>{SITE}/blog/{p['slug']}</link>
      <guid>{SITE}/blog/{p['slug']}</guid>
      <pubDate>{p['date'].strftime('%a, %d %b %Y %H:%M:%S +0000')}</pubDate>
      <description>{e(p['excerpt'])}</description>
    </item>"""
        for p in posts
    )
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>GameDō Studio Blog</title>
    <link>{SITE}/blog</link>
    <description>Devlogs, postmortems and game development notes from GameDō Studio.</description>
{items}
  </channel>
</rss>
"""


def update_sitemap(posts):
    path = ROOT / "sitemap.xml"
    s = path.read_text()
    s = re.sub(r"\s*<!-- blog:start -->.*?<!-- blog:end -->", "", s, flags=re.S)
    urls = [f"{SITE}/blog"] + [f"{SITE}/blog/{p['slug']}" for p in posts if not p.get("noindex")]
    block = "\n  <!-- blog:start -->\n" + "\n".join(
        f"  <url><loc>{u}</loc></url>" for u in urls
    ) + "\n  <!-- blog:end -->"
    s = s.replace("</urlset>", block + "\n</urlset>")
    path.write_text(s)


def main():
    nav, footer = chrome()
    posts = load_posts()
    for p in posts:
        (OUT / f"{p['slug']}.html").write_text(build_post(p, nav, footer))
    (OUT / "index.html").write_text(build_index(posts, nav, footer))
    (OUT / "rss.xml").write_text(build_rss(posts))
    update_sitemap(posts)
    print(f"Built {len(posts)} posts + index + rss, sitemap updated")


if __name__ == "__main__":
    main()
