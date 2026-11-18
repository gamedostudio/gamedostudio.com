# Project: gamedostudio.com

## Deployment

- Hosted on Cloudflare Pages (project: `gamedostudio-com`)
- When told to "push": stage and commit ALL untracked/modified files (except `.claude/` and `.wrangler/`), then `git push origin main`. No questions.
- When told to "deploy": run `npx wrangler pages deploy . --project-name gamedostudio-com --branch main`. Don't mention auto-deploy, just do it.

## Blog (since 2026-11-18)

- Posts are Markdown in `blog/posts/` (same frontmatter as the old gamedo.live articles: title, slug, excerpt, cover_image, author, published_date, optional noindex, seo_title, seo_description).
- Build with `~/.venvs/gamedostudio-blog/bin/python tools/build_blog.py` (venv with `markdown` + `pyyaml`, kept outside the repo because the whole folder is uploaded to Cloudflare Pages). It writes `blog/<slug>.html`, `blog/index.html`, `blog/rss.xml` and the blog block of `sitemap.xml`. Nav and footer are copied from `about.html`: rebuild after changing them.
- gamedo.live 301s to this blog (its old articles to their `/blog/<slug>` pages).
