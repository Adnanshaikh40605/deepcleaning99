# Deepcleaning99.com — React website

Production React app for Deepcleaning99.com (Vite + React Router).

## Develop

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal (usually `http://localhost:5173`).

## Build for hosting

```bash
npm run build
```

Upload the contents of `dist/` to your web root (for example `public_html` on shared hosting).

- Apache: includes `.htaccess` for SPA routing and 404 fallback
- Netlify-style hosts: includes `_redirects`

## What was preserved

- All customer pages and SEO titles/descriptions
- Package rates and AMC plans from the original rate sheet
- Homepage booking form and detailed `/book-cleaning/` form
- WhatsApp request flow (no server booking / payment)
- Mobile Call / WhatsApp / Book bar
- Service cities, contacts, robots.txt, sitemap.xml

## Edit rates or phone

Update `src/data/site.js`. Homepage featured starting prices are in `src/pages/Home.jsx` and should stay in sync with the 1BHK / sample package rates.
