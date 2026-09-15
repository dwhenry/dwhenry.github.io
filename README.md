# dwhenry.github.io

Personal blog, built with Jekyll and deployed to GitHub Pages via GitHub Actions (`.github/workflows/pages.yml`).

## Local development

```bash
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000.

## Adding a post

Add a new file to `_posts/` named `YYYY-MM-DD-title-slug.md` with front matter:

```yaml
---
title: "Post title"
subtitle: "Optional subtitle"
date: YYYY-MM-DD
---
```

## Deploying

Push to `main` — the GitHub Actions workflow builds and deploys automatically. In the repo's Settings → Pages, set the source to "GitHub Actions".
