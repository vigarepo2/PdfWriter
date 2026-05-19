import { CSS } from './styles.js';
import { CLIENT_JS } from './client.js';

const HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#0b3d91">
  <title>PdfWriter</title>
  <link rel="stylesheet" href="/style.css">
  <script defer src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script defer src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
  <script defer src="/app.js"></script>
</head>
<body class="view-editor">
  <header class="app-header">
    <div class="brand-row">
      <div class="emblem">PW</div>
      <div>
        <div class="brand-title">PdfWriter</div>
        <div class="brand-subtitle">Exemption Application</div>
      </div>
    </div>
    <div class="mobile-tabs">
      <button id="tabEditor" class="active">Editor</button>
      <button id="tabPreview">Preview</button>
    </div>
  </header>

  <main class="shell">
    <section id="editorPanel" class="panel editor-panel">
      <div class="desktop-brand">
        <div class="brand-row">
          <div class="emblem">PW</div>
          <div>
            <div class="brand-title">PdfWriter</div>
            <div class="brand-subtitle">Professional Legal Drafting</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">
          <h2>Court and Case Title</h2>
          <button id="optionsButton" class="btn secondary">Options</button>
        </div>
        <label>Court name</label>
        <select id="court" class="field">
          <option value="IN THE COURT OF SH. DHARMINDER PAUL SINGLA, SESSIONS JUDGE, FAZILKA">Sh. Dharminder Paul Singla, Sessions Judge, Fazilka</option>
          <option value="IN THE COURT OF SH. KRISHAN KUMAR SINGLA, ASJ, FAZILKA">Sh. Krishan Kumar Singla, ASJ, Fazilka</option>
          <option value="IN THE COURT OF MRS. PAMELPREET GREWAL KAHAL, ASJ, FAZILKA">Mrs. Pamelpreet Grewal Kahal, ASJ, Fazilka</option>
          <option value="IN THE COURT OF MRS. PAMELPREET GREWAL KAHAL, JUDGE, SPECIAL COURT, FAZILKA">Mrs. Pamelpreet Grewal Kahal, Special Court, Fazilka</option>
          <option selected value="IN THE COURT OF SH. AJIT PAL SINGH, ASJ, FAZILKA">Sh. Ajit Pal Singh, ASJ, Fazilka</option>
          <option value="IN THE COURT OF SH. ATUL KAMBOJ, ASJ, FAZILKA">Sh. Atul Kamboj, ASJ, Fazilka</option>
          <option value="IN THE COURT OF SH. HARPREET SINGH, JMIC, FAZILKA">Sh. Harpreet Singh, JMIC, Fazilka</option>
          <option value="IN THE COURT OF MS. KARAMWINDER KAUR, JMIC, FAZILKA">Ms. Karamwinder Kaur, JMIC, Fazilka</option>
        </select>
        <div class="grid two">
          <div><label>Case title left</label><input id="caseLeft" class="field" placeholder="State / Complainant"></div>
          <div><label>Case title right</label><input id="caseRight" class="field" placeholder="Accused / Respondent"></div>
        </div>
      </div>

      <div id="templateTools" class="section hidden">
        <div class="section-title"><h2>Template Tools</h2><span>.pwt.json</span></div>
        <p class="hint">Saves all form fields, clauses, accused rows, duty status, and manual preview edits.</p>
        <div class="wrap-actions">
          <button id="exportTemplate" class="btn secondary">Export Template</button>
          <button id="importTemplate" class="btn secondary">Import Template</button>
          <button id="saveLocal" class="btn secondary">Save Draft</button>
          <button id="loadLocal" class="btn secondary">Load Draft</button>
          <input id="templateFile" type="file" accept=".json,.pwt.json,application/json" hidden>
        </div>
      </div>

      <div class="section">
        <div class="section-title"><h2>FIR Details</h2><span>Optional</span></div>
        <div class="grid two">
          <div><label>FIR number</label><input id="fir" class="field" placeholder="FIR No."></div>
          <div><label>FIR date</label><input id="firDate" class="field" placeholder="DD.MM.YYYY"></div>
          <div><label>Sections</label><input id="sections" class="field" placeholder="Sections / Act"></div>
          <div><label>Police Station</label><input id="policeStation" class="field" placeholder="Police Station"></div>
        </div>
      </div>

      <div class="section">
        <div class="section-title"><h2>Absent Accused / Applicants</h2><button id="addPerson" class="btn secondary">Add Person</button></div>
        <div id="peopleBox" class="stack"></div>
      </div>

      <div class="section">
        <div class="section-title"><h2>Application Text</h2><button id="resetText" class="btn secondary">Reset Text</button></div>
        <label>Subject</label><textarea id="subject" class="field area"></textarea>
        <label>Prayer</label><textarea id="prayer" class="field area"></textarea>
      </div>

      <div class="section">
        <div class="section-title"><h2>Factual Statements</h2><button id="addClause" class="btn secondary">Add Clause</button></div>
        <div id="clauseBox" class="stack"></div>
      </div>

      <div class="section">
        <div class="section-title"><h2>Filing and Counsel</h2></div>
        <div class="grid two">
          <div><label>Place</label><input id="place" class="field" placeholder="Place"></div>
          <div><label>Date</label><input id="date" class="field" placeholder="DD.MM.YYYY"></div>
        </div>
        <label>Through Counsel</label>
        <select id="counsel" class="field">
          <option value="Baltej Singh Brar, Advocate|Chief, LADC, Fazilka.">Baltej Singh Brar - Chief</option>
          <option value="Hardeep Singh Dhaliwal, Advocate|Deputy Chief, LADC, Fazilka.">Hardeep Singh Dhaliwal - Deputy Chief</option>
          <option value="Sunil Rangbulla, Advocate|Deputy Chief, LADC, Fazilka.">Sunil Rangbulla - Deputy Chief</option>
          <option value="Rajvinder Kaur, Advocate|Assistant, LADC, Fazilka.">Rajvinder Kaur - Assistant</option>
          <option value="Amisha, Advocate|Assistant, LADC, Fazilka.">Amisha - Assistant</option>
          <option selected value="Naazpreet Kaur, Advocate|Assistant, LADC, Fazilka.">Naazpreet Kaur - Assistant</option>
        </select>
        <label class="checkbox-line"><input id="duty" type="checkbox"> Add (Duty) after counsel designation</label>
      </div>

      <div class="sticky-actions">
        <button id="downloadPdf" class="btn primary">Download PDF</button>
        <button id="previewButton" class="btn secondary">Preview</button>
        <button id="rebuildPreview" class="btn secondary">Rebuild Preview</button>
      </div>
    </section>

    <section id="previewPanel" class="panel preview-panel">
      <div class="preview-top">
        <div><strong>Legal-size Preview</strong><span id="statusText">Ready</span></div>
        <div class="preview-actions">
          <button id="fitZoom" class="btn secondary">Fit</button>
          <button id="zoomOut" class="btn secondary">−</button>
          <button id="zoomIn" class="btn secondary">+</button>
          <button id="previewPdf" class="btn primary">PDF</button>
        </div>
      </div>

      <div class="toolbar">
        <button id="editToggle" class="tool">✎ Edit</button>
        <button class="tool" data-command="bold"><b>B</b></button>
        <button class="tool" data-command="italic"><i>I</i></button>
        <button class="tool" data-command="underline"><u>U</u></button>
        <button class="tool" data-command="strikeThrough">S</button>
        <button class="tool" data-command="insertUnorderedList">• List</button>
        <button class="tool" data-command="insertOrderedList">1. List</button>
        <button class="tool" data-command="justifyLeft">Left</button>
        <button class="tool" data-command="justifyCenter">Center</button>
        <button class="tool" data-command="justifyRight">Right</button>
        <button class="tool" data-command="justifyFull">Justify</button>
        <button class="tool" data-command="undo">Undo</button>
        <button class="tool" data-command="redo">Redo</button>
        <select class="tool-select" data-command-value="fontName">
          <option value="Times New Roman">Times</option>
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Courier New">Courier</option>
        </select>
        <select class="tool-select" data-command-value="fontSize">
          <option value="2">Small</option>
          <option selected value="3">Normal</option>
          <option value="4">Large</option>
          <option value="5">XL</option>
        </select>
        <input id="textColor" class="color" type="color" title="Text color">
        <input id="highlightColor" class="color" type="color" value="#ffff00" title="Highlight">
        <button id="pageBreak" class="tool">Page Break</button>
        <button id="signatureLine" class="tool">Sign Line</button>
      </div>

      <div class="section">
        <div class="section-title"><h2>Markdown / Find Replace</h2><span>Advanced tools</span></div>
        <textarea id="markdownText" class="field area" placeholder="Markdown: **bold**, *italic*, new paragraphs..."></textarea>
        <div class="wrap-actions" style="margin-top:8px">
          <button id="applyMarkdown" class="btn secondary">Insert Markdown</button>
          <button id="replaceMarkdown" class="btn secondary">Replace Document</button>
        </div>
        <div class="grid two" style="margin-top:8px">
          <input id="findText" class="field" placeholder="Find text">
          <input id="replaceText" class="field" placeholder="Replace with">
        </div>
        <button id="findReplace" class="btn secondary" style="margin-top:8px">Find and Replace</button>
      </div>

      <div class="preview-scroll">
        <div class="paper-stage"><div id="paper" class="paper"></div></div>
      </div>
    </section>
  </main>
</body>
</html>`;

function textResponse(body, type) {
  return new Response(body, {
    headers: {
      'content-type': type,
      'cache-control': 'public, max-age=120',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'strict-origin-when-cross-origin'
    }
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/health') return Response.json({ ok: true, app: 'PdfWriter', version: '3.5.0' });
    if (url.pathname === '/style.css') return textResponse(CSS, 'text/css; charset=utf-8');
    if (url.pathname === '/app.js') return textResponse(CLIENT_JS, 'application/javascript; charset=utf-8');
    if (url.pathname === '/') return textResponse(HTML, 'text/html; charset=utf-8');
    return new Response('Not found', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8' } });
  }
};
