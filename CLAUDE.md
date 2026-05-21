# Instructions for Claude Code

## What this project is

A single-page static marketing site for **GagRx Labs**, a novelty candy brand. Everything lives in `index.html` (HTML + CSS + JS inline) plus an `images/` folder. No build step. No dependencies.

## Your job right now

The user has just dropped this project into Claude Code and wants you to get it onto GitHub and deployed. Walk through these steps **in order**, confirming with the user between each:

### Step 1 — Verify prerequisites

Check that `git` and `gh` (GitHub CLI) are installed and `gh` is authenticated:

```bash
git --version
gh --version
gh auth status
```

If `gh auth status` fails, run `gh auth login` and walk the user through it.

### Step 2 — Initialize the repo

```bash
git init
git add .
git status
```

Show the user what's about to be committed. Then:

```bash
git commit -m "Initial commit: GagRx Labs landing site"
```

### Step 3 — Create the GitHub repo

Ask the user:
1. What name they want (suggest `gagrx-site`)
2. Public or private

Then:

```bash
gh repo create <repo-name> --<public|private> --source=. --remote=origin --push
```

### Step 4 — Enable GitHub Pages

```bash
gh api -X POST /repos/:owner/:repo/pages -f "source[branch]=main" -f "source[path]=/"
```

Give the user the URL: `https://<username>.github.io/<repo-name>/`. Note it takes 1–2 minutes to go live.

### Step 5 — Done

Tell the user the URL, and mention they can also connect this repo to Vercel or Netlify for free if they want a custom domain.

## What NOT to do

- **Don't refactor.** The site is intentionally a single HTML file. Don't split it, don't add a framework, don't add a build step.
- **Don't add `npm`/`package.json`.** There are no JS dependencies.
- **Don't change the design** unless the user explicitly asks.
- **Don't optimize the images** unless asked — they're already reasonable sizes.

## If the user asks for changes later

Make them directly in `index.html`. The CSS variables at the top of the `<style>` block (`:root { ... }`) control the entire color palette. Product data is inline in HTML — to add a product, copy a `.product-card` block in the carousel section.
