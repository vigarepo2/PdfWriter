export const APP_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#0f172a">
  <title>PdfWriter</title>
  <link rel="stylesheet" href="/assets/app.css">
  <script defer src="/assets/app.js"></script>
</head>
<body>
  <header class="topbar">
    <div class="topbar-inner">
      <div class="brand"><span class="brand-mark">PW</span><div><strong>PdfWriter</strong><small>Legal PDF Studio</small></div></div>
      <nav class="tabs"><button data-view="draft" class="is-active">Draft</button><button data-view="preview">Preview</button><button data-action="open-tools">Tools</button></nav>
    </div>
  </header>
  <main class="workspace">
    <aside class="steps"><div class="step active">1 Case</div><div class="step">2 People</div><div class="step">3 Text</div><div class="step">4 Export</div></aside>
    <section id="draftPanel" class="panel draft-panel">
      <div class="panel-head"><div><p>Exemption Application</p><h1>Draft details</h1></div><button id="templateToggle" class="btn ghost">Hidden tools</button></div>
      <div id="templateTools" class="tools-drawer" hidden><button id="exportTemplate" class="btn soft">Export template</button><button id="importTemplate" class="btn soft">Import template</button><button id="saveDraft" class="btn soft">Save draft</button><button id="loadDraft" class="btn soft">Load draft</button><button id="downloadRawPdf2" class="btn soft">Download raw PDF</button><button id="downloadScannedPdf2" class="btn soft">Download scanned PDF</button><input id="templateFile" type="file" hidden></div>
      <form id="draftForm" class="form" onsubmit="return false;"></form>
    </section>
    <section id="previewPanel" class="panel preview-panel"><div class="preview-head"><div><p>Legal size</p><h2>Live preview</h2><span id="statusText">Ready</span></div><div><button id="fitPreview" class="btn ghost">Fit</button><button id="zoomOut" class="btn ghost">−</button><button id="zoomIn" class="btn ghost">+</button></div></div><div class="paper-scroll"><div class="paper-stage"><article id="paper" class="paper"></article></div></div></section>
  </main>
  <footer class="actionbar"><button id="previewButton" class="btn ghost">Preview</button><button id="rebuildPreview" class="btn ghost">Rebuild</button><button id="downloadRawPdf" class="btn primary">Raw PDF</button><button id="downloadScannedPdf" class="btn dark">Scanned PDF</button></footer>
</body>
</html>`;
