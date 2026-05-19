# PdfWriter

PdfWriter is a fast, single-page Cloudflare Worker app for preparing professional legal application PDFs. It includes a live editor, court-ready preview, reusable application templates, clause management, and native jsPDF export for clean, sharp PDF files.

## Highlights

- **Cloudflare Worker ready** - one deployable `src/worker.js` file.
- **Native PDF generation** - uses jsPDF text rendering instead of screenshot-based PDF export.
- **Legal-size output** - 8.5 x 14 inch legal paper with court-style margins.
- **Live preview** - edit fields and see the formatted application instantly.
- **Clause controls** - add, delete, move up, move down, and edit factual statements.
- **Safer preview rendering** - user text is escaped before insertion into the document preview.
- **Mobile friendly** - editor and preview tabs work cleanly on phones.
- **Health endpoint** - `/health` returns a JSON status response.

## Project structure

```text
PdfWriter/
├── src/
│   └── worker.js        # Cloudflare Worker and complete web app
├── docs/
│   └── TESTING.md       # Manual QA checklist
├── examples/
│   └── sample-application.pdf
├── package.json
├── wrangler.toml
├── .gitignore
├── LICENSE
└── README.md
```

## Local development

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

The Worker name is configured in `wrangler.toml`:

```toml
name = "pdfwriter"
main = "src/worker.js"
compatibility_date = "2026-05-19"
```

## Usage

1. Choose an application template.
2. Fill in court name, parties, FIR details, sections, police station, subject, prayer, date, and counsel.
3. Add or reorder factual statement clauses.
4. Review the live legal-size preview.
5. Click **Download Legal PDF**.

## Templates included

- Application for exemption of personal appearance
- Bail bond modification application
- Blank standard legal application form

## Quality notes

PdfWriter avoids the earlier screenshot-to-PDF approach because it can create oversized, blurry, or blank PDFs. The updated version uses native jsPDF text commands, which keeps output selectable, small, and cleaner for printing.

## Legal disclaimer

This app formats document drafts. It does not provide legal advice. Review every generated document before filing it in court.
