# GagRx Labs — Landing Site

The marketing landing page for GagRx Labs, a novelty candy brand based in Maple Valley, WA. Single-page static site, no build step needed.

## Files

- `index.html` — the entire site (HTML, CSS, JS all inline)
- `images/` — product photos used throughout the site

## Tech

Plain HTML + CSS + vanilla JavaScript. No frameworks, no build tools, no dependencies. Fonts load from Google Fonts via CDN.

## Local Preview

Open `index.html` directly in a browser, or run a local server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying

This is a static site — any static host works:

- **GitHub Pages**: push to `main`, enable Pages in repo settings, point at root
- **Vercel / Netlify**: connect the repo, no build command, no output dir (just deploy `/`)
- **Cloudflare Pages**: same — framework preset = "None"

---

## Instructions for Claude Code

When the user opens this project in Claude Code, do the following in order. Confirm each step before moving to the next.

### 1. Initialize the Git repository

```bash
git init
git add .
git commit -m "Initial commit: GagRx Labs landing site"
```

### 2. Create the GitHub repository

Ask the user for their preferred repo name (suggest `gagrx-site` or `gagrx-labs`) and whether it should be public or private. Then use the GitHub CLI:

```bash
gh repo create <repo-name> --<public|private> --source=. --remote=origin --push
```

If `gh` isn't installed or authenticated, walk the user through `gh auth login` first.

### 3. Set up GitHub Pages (default deploy option)

After the push completes, enable GitHub Pages from the `main` branch root:

```bash
gh api -X POST /repos/{owner}/{repo}/pages -f source[branch]=main -f source[path]=/
```

Then give the user the live URL: `https://<username>.github.io/<repo-name>/`

### 4. Offer alternative hosts

After Pages is live, mention Vercel and Netlify as alternatives the user can connect to the same repo for a custom domain or faster previews. Don't push them — just mention it.

### 5. Stop there

Don't refactor the code, don't split the HTML into separate files, don't add a build step, don't suggest a framework. The site is intentionally a single file. If the user later wants changes, make them in place.

---

## Notes on the Code

- All styling uses CSS custom properties at the top of the `<style>` block — change the palette by editing the `:root` variables
- The cart is in-memory only (resets on reload) — this is intentional for a marketing site
- Product data lives directly in the HTML (no JSON, no API). To add a product, copy a `.product-card` block in the carousel section and update the image, name, price, and `data-*` attributes on the "+" button
- Image paths are relative (`images/foo.png`) so the site works on any host or subdirectory
