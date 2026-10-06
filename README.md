# Anna Yuli Wen — AI Industry Map

A static editorial/research website organized into five top-level pages:

- `index.html` — positioning + navigation
- `ecosystem.html` — interactive AI stack × industry map
- `essays.html` — five long-form deep dives
- `big-tech.html` — product-line + partnership network for major tech incumbents
- `terms.html` — interactive technical-term cards
- `articles/` — standalone essay pages

## Preview
Open `index.html` directly, or serve the directory with any static server.

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deployment
The site has no build step and can be deployed directly to Vercel, Netlify, Cloudflare Pages, GitHub Pages, or any static host.

## Content architecture
The design intentionally separates four lenses: ecosystem mapping, essays, incumbent AI moves, and technical primitives. Company/product facts in the Big Tech page should be refreshed periodically because that page is time-sensitive.
