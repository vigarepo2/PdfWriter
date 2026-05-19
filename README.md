# PdfWriter

PdfWriter is a mobile-first Cloudflare Worker app for preparing professional legal application PDFs. It includes a polished editor, legal-size live preview, reusable templates, multi-accused/applicant support, clause management, and native jsPDF export.

## What is new in v3

- Completely redesigned mobile and desktop UI.
- Separate **case title** fields from **absent accused/applicant** fields.
- Supports one absent person or multiple accused/applicants.
- Subject lines can auto-fill names using `{{names}}`.
- Signature block now uses the actual absent accused/applicant names, not only the case-title right side.
- Improved legal PDF spacing and cleaner preview layout.
- True mobile preview tabs: Editor and Preview.
- Safer preview rendering with escaped user input.

## Highlights

- **Cloudflare Worker ready** - one deployable `src/worker.js` file.
- **Native PDF generation** - uses jsPDF text rendering instead of screenshot-based PDF export.
- **Legal-size output** - 8.5 x 14 inch legal paper with court-style margins.
- **Live preview** - edit fields and see the formatted application instantly.
- **Applicant manager** - add, delete, move, and edit accused/applicant names.
- **Clause controls** - add, delete, move up, move down, and edit factual statements.
- **Mobile friendly** - editor and preview are cleanly separated on phones.
- **Health endpoint** - `/health` returns a JSON status response.

## Project structure

```text
PdfWriter/
├── src/
│   └── worker.js        # Cloudflare Worker and complete web app
├── docs/
│   └── TESTING.md       # Manual QA checklist
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
2. Fill the court and case-title fields.
3. Add the actual absent accused/applicant name or names.
4. Fill FIR details, subject, prayer, filing details, and counsel.
5. Add or reorder factual statement clauses.
6. Review the legal-size preview.
7. Click **Download Legal PDF**.

## Template placeholder

Subject and clause text may use this placeholder:

```text
{{names}}
```

It is replaced with the absent accused/applicant names. Example: `Sandeep Singh`, `Sandeep Singh and Kuljeet Singh`, or `A, B and C`.

## Templates included

- Application for exemption of personal appearance
- Bail bond/surety amount modification application
- Blank standard legal application form

## Quality notes

PdfWriter avoids screenshot-to-PDF export because it can create oversized, blurry, or blank PDFs. The updated version uses native jsPDF text commands, which keeps output selectable, small, and cleaner for printing.

## Legal disclaimer

This app formats document drafts. It does not provide legal advice. Review every generated document before filing it in court.
