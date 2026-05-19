# PdfWriter Testing Checklist

Use this checklist after every change.

## Static checks

```bash
npm run check
```

Expected result: `node --check src/worker.js` exits without syntax errors.

## Manual browser test

1. Run `npm run dev`.
2. Open the Wrangler local URL.
3. Confirm the page loads without console errors.
4. Change each main input field and confirm preview updates.
5. Switch templates and confirm subject, prayer, and clauses update.
6. Add a clause.
7. Move a clause up and down.
8. Delete a clause.
9. Switch mobile preview/editor tabs using browser responsive mode.
10. Click **Download Legal PDF**.
11. Open the downloaded PDF and confirm:
    - legal-size page,
    - clean court heading,
    - preserved stamp gap,
    - properly aligned parties and FIR block,
    - no blank first page,
    - no clipped signature or counsel block.

## Endpoint test

```bash
curl http://localhost:8787/health
```

Expected response:

```json
{"ok":true,"app":"PdfWriter","version":"2.0.0"}
```
