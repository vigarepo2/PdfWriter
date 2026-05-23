# PDFWriter Legal

Cloudflare Workers legal-size PDF generator for exemption applications. The project serves a client-side editor, live legal-page preview, and PDF export flow from one Worker.

## Features

- Worker compatible app shell
- Mobile editor and preview tabs
- Legal-size PDF output using 612 x 1008 points
- FIR and complaint or appeal modes
- Court, counsel, applicant, clause, prayer, date, place, and stamp controls
- Raw PDF export and scanned PDF export
- Health endpoint for deployment checks
- No database and no server framework

## Files

```txt
backend/index.js   HTML shell and response helper
frontend/index.js  UI, preview, form logic, PDF export
src/index.js       Worker routes
package.json       Scripts and dependencies
wrangler.toml      Cloudflare Worker config
```

## Setup

```bash
npm install
npm run check
npm run dev
```

Open the local Wrangler URL, usually `http://localhost:8787`.

## Deploy

```bash
npm run deploy
```

## Routes

- `/` loads the app
- `/index.html` loads the app
- `/frontend/index.js` serves frontend JavaScript
- `/health` returns JSON status
- unknown paths return 404

## Usage

Select the court and case type, fill FIR or complaint details, add applicants and clauses, review the legal-size preview, then export the PDF.

## Troubleshooting

Run `npm run check` before deploying. Confirm Node.js 20 or newer. If mobile preview looks small, switch to the Preview tab so the page scales to the available screen.
