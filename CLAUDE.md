# Project: gamedostudio.com

## Deployment

- Hosted on Cloudflare Pages (project: `gamedostudio-com`)
- When told to "push": stage and commit ALL untracked/modified files (except `.claude/` and `.wrangler/`), then `git push origin main`. No questions.
- When told to "deploy": run `npx wrangler pages deploy . --project-name gamedostudio-com --branch main`. Don't mention auto-deploy, just do it.
