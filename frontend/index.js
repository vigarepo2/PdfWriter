export const FRONTEND_JS = String.raw`
// ============================================================================
// PDFWRITER LEGAL v4.0 — PROFESSIONAL EXEMPTION APPLICATION GENERATOR
// Architected for Cloudflare Workers | Vanilla JS | Zero Dependencies
// ============================================================================
(function () {
  'use strict';

  // ── CONFIG ─────────────────────────────────────────────────────────────────
  const CONFIG = Object.freeze({
    courts: [
      'IN THE COURT OF SH. DHARMINDER PAUL SINGLA, SESSIONS JUDGE, FAZILKA',
      'IN THE COURT OF SH. KRISHAN KUMAR SINGLA, ASJ, FAZILKA',
      'IN THE COURT OF MRS. PAMELPREET GREWAL KAHAL, ASJ, FAZILKA',
      'IN THE COURT OF MRS. PAMELPREET GREWAL KAHAL, JUDGE, SPECIAL COURT, FAZILKA',
      'IN THE COURT OF SH. AJIT PAL SINGH, ASJ, FAZILKA',
      'IN THE COURT OF SH. ATUL KAMBOJ, ASJ, FAZILKA',
      'IN THE COURT OF SH. HARPREET SINGH, JMIC, FAZILKA',
      'IN THE COURT OF MS. KARAMWINDER KAUR, JMIC, FAZILKA'
    ],
    counsels: [
      'Baltej Singh Brar, Advocate|Chief, LADC, Fazilka.',
      'Hardeep Singh Dhaliwal, Advocate|Deputy Chief, LADC, Fazilka.',
      'Sunil Rangbulla, Advocate|Deputy Chief, LADC, Fazilka.',
      'Rajvinder Kaur, Advocate|Assistant, LADC, Fazilka.',
      'Amisha, Advocate|Assistant, LADC, Fazilka.',
      'Naazpreet Kaur, Advocate|Assistant, LADC, Fazilka.'
    ],
    proformas: [
      { id: 'original',    name: 'Standard Exemption',  reason: 'illness',                        stage: 'the purpose fixed' },
      { id: 'medical',     name: 'Medical Emergency',   reason: 'a sudden medical emergency',     stage: 'the purpose fixed' },
      { id: 'hospital',    name: 'Hospitalization',     reason: 'hospitalization',                stage: 'the purpose fixed' },
      { id: 'bereavement', name: 'Bereavement',         reason: 'a bereavement in the family',    stage: 'the purpose fixed' },
      { id: 'elderly',     name: 'Senior Citizen',      reason: 'age-related health constraints', stage: 'the purpose fixed' }
    ]
  });

  // ── STATE ──────────────────────────────────────────────────────────────────
  let state = {
    zoom: 0.5,
    people: [{ name: '', role: 'Accused/applicant' }],
    clauses: [],
    exporting: false
  };

  // ── UTILITIES ──────────────────────────────────────────────────────────────
  const $  = (id) => document.getElementById(id);
  const $$ = (sel, ctx = document) => ctx.querySelector(sel);

  /** Read field value WITHOUT stripping mid-type spaces (bug fix) */
  const fv = (id) => { const e = $(id); return e ? e.value.trim() : ''; };

  /** Normalize stored/generated text */
  const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

  /** HTML-escape for innerHTML injection */
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );

  /** Textarea-safe value (no HTML entities in editable fields) */
  const escAttr = (s) => String(s ?? '').replace(/"/g, '&quot;');

  let _resizeTimer;
  const debounce = (fn, ms) => (...a) => { clearTimeout(_resizeTimer); _resizeTimer = setTimeout(() => fn(...a), ms); };

  // ── TEXT GENERATION ────────────────────────────────────────────────────────
  function getNames() {
    const a = state.people.map(p => clean(p.name)).filter(Boolean);
    if (!a.length) return '';
    if (a.length === 1) return a[0];
    if (a.length === 2) return a[0] + ' and ' + a[1];
    return a.slice(0, -1).join(', ') + ', and ' + a[a.length - 1];
  }

  const isPlural       = () => state.people.filter(p => clean(p.name)).length > 1;
  const applicantText  = () => getNames() || fv('rightParty') || 'Accused/applicant';
  const accusedLabel   = () => isPlural() ? 'Accused/applicants' : 'Accused/applicant';

  function generateSubject() {
    const n = getNames();
    return 'Subject: Application for exemption of personal appearance' + (n ? ' of ' + n : '') + '.';
  }

  function generatePrayer() {
    return 'It is, therefore, most respectfully prayed that in light of the facts and circumstances stated above, the personal appearance of the ' +
      (isPlural() ? 'above-named accused/applicants' : 'above-named accused/applicant') +
      ' may kindly be exempted for today only. Any other order(s) that this Hon\'ble Court deems fit and proper may also be passed.';
  }

  function generateDefaultClauses() {
    const stage = fv('caseStage') || 'the purpose fixed';
    const n     = getNames();
    const r     = fv('reason') || 'illness';
    const subj  = n
      ? (isPlural()
        ? 'That the accused/applicants, namely ' + n + ', are'
        : 'That the accused/applicant, ' + n + ', is')
      : 'That the accused/applicant is';
    return [
      "That the above-noted case is pending before this Hon'ble Court and the same is fixed for today for " + stage + '.',
      subj + " unable to appear before this Hon'ble Court today due to " + r + '.',
      'That the absence of the accused/applicant is neither willful nor intentional, but is solely on account of the aforesaid reason.',
      'That no prejudice shall be caused to the opposite party by the grant of this exemption.'
    ];
  }

  // ── CSS ────────────────────────────────────────────────────────────────────
  function getCSS() {
    return `
:root {
  --z: 0.5;
  /* Palette */
  --col-bg:         #f0f2f5;
  --col-surface:    #ffffff;
  --col-surface-2:  #f8f9fc;
  --col-border:     #d8dce6;
  --col-border-2:   #eaecf2;
  --col-text:       #111827;
  --col-text-2:     #4b5563;
  --col-text-3:     #9ca3af;
  --col-accent:     #3b6fce;
  --col-accent-h:   #2f5db5;
  --col-accent-s:   rgba(59,111,206,.12);
  --col-danger:     #dc2626;
  --col-danger-s:   rgba(220,38,38,.08);
  --col-success:    #16a34a;
  --col-warn:       #d97706;
  /* Shadows */
  --shadow-sm:  0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04);
  --shadow-md:  0 4px 12px rgba(0,0,0,.08), 0 2px 4px rgba(0,0,0,.04);
  --shadow-lg:  0 10px 30px rgba(0,0,0,.12), 0 4px 8px rgba(0,0,0,.06);
  --shadow-paper: 0 4px 24px rgba(0,0,0,.18), 0 1px 4px rgba(0,0,0,.1);
  /* Radius */
  --r-sm: 4px;
  --r-md: 8px;
  --r-lg: 12px;
  /* Type */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --font-serif: 'Times New Roman', Times, Georgia, serif;
  /* Transitions */
  --tr-fast: 120ms ease;
  --tr-base: 200ms ease;
}

*,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 14px; -webkit-text-size-adjust: 100%; }
body {
  font-family: var(--font-sans);
  background: var(--col-bg);
  color: var(--col-text);
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  line-height: 1.5;
}
body.view-form   { --active-panel: form; }
body.view-preview{ --active-panel: preview; }

/* ── SCROLLBAR ── */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--col-border); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--col-text-3); }

/* ── APP HEADER ── */
.app-header {
  background: var(--col-surface);
  border-bottom: 1px solid var(--col-border);
  padding: 0 20px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
  z-index: 30;
}
.header-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.header-icon {
  width: 30px; height: 30px;
  background: linear-gradient(135deg, var(--col-accent), #6c8fd8);
  border-radius: var(--r-sm);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.header-icon svg { width: 16px; height: 16px; }
.app-title {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -.3px;
  color: var(--col-text);
}
.app-title span {
  font-weight: 400;
  color: var(--col-text-2);
  margin-left: 2px;
}
.header-badge {
  font-size: 10px;
  font-weight: 600;
  background: var(--col-accent-s);
  color: var(--col-accent);
  border-radius: 20px;
  padding: 2px 8px;
  letter-spacing: .3px;
  text-transform: uppercase;
}

/* ── MOBILE TABS ── */
.mobile-tabs {
  display: flex;
  gap: 2px;
  background: var(--col-bg);
  border-radius: var(--r-md);
  padding: 3px;
}
.mobile-tabs button {
  background: transparent;
  border: none;
  padding: 5px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--col-text-2);
  cursor: pointer;
  transition: background var(--tr-fast), color var(--tr-fast);
}
.mobile-tabs button.active {
  background: var(--col-surface);
  color: var(--col-text);
  box-shadow: var(--shadow-sm);
}

/* ── LAYOUT ── */
.layout {
  display: flex;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}
.panel {
  overflow-y: auto;
  height: 100%;
  -webkit-overflow-scrolling: touch;
}
.form-panel {
  background: var(--col-surface);
  padding: 20px 24px 100px;
  flex: 1;
  border-right: 1px solid var(--col-border);
}
.preview-panel {
  background: #c9cdd8;
  background-image:
    linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
  background-size: 20px 20px;
  flex: 1;
  position: relative;
}

/* ── SECTION TITLES ── */
.section-title {
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .7px;
  color: var(--col-text-3);
  border-bottom: 1px solid var(--col-border-2);
  padding-bottom: 8px;
  margin: 28px 0 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.section-title:first-child { margin-top: 2px; }

/* ── GRID / STACK ── */
.grid     { display: grid; gap: 12px; }
.grid.two { grid-template-columns: 1fr; }
.stack    { display: flex; flex-direction: column; gap: 8px; }

/* ── FORM LABELS & FIELDS ── */
label:not(.checkbox-label) {
  display: block;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--col-text-2);
  margin: 10px 0 4px;
  letter-spacing: .1px;
}
.field {
  width: 100%;
  background: var(--col-surface);
  border: 1.5px solid var(--col-border);
  border-radius: var(--r-sm);
  padding: 8px 11px;
  font-size: 13px;
  font-family: var(--font-sans);
  color: var(--col-text);
  outline: none;
  transition: border-color var(--tr-fast), box-shadow var(--tr-fast), background var(--tr-fast);
  line-height: 1.45;
}
.field:hover   { border-color: #b0b8cc; }
.field:focus   { border-color: var(--col-accent); box-shadow: 0 0 0 3px var(--col-accent-s); background: #fff; }
.field::placeholder { color: var(--col-text-3); }
.field:disabled { background: var(--col-surface-2); color: var(--col-text-3); cursor: not-allowed; }
.field.error   { border-color: var(--col-danger); box-shadow: 0 0 0 3px var(--col-danger-s); }

select.field {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 12px;
  padding-right: 30px;
  cursor: pointer;
}
textarea.field {
  resize: vertical;
  min-height: 52px;
  line-height: 1.5;
}

/* ── BUTTONS ── */
.btn {
  border: none;
  border-radius: var(--r-sm);
  font-size: 13px;
  font-weight: 600;
  font-family: var(--font-sans);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 36px;
  padding: 0 16px;
  transition: background var(--tr-fast), color var(--tr-fast), box-shadow var(--tr-fast), transform var(--tr-fast);
  white-space: nowrap;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
.btn:active { transform: translateY(1px); }

.btn.primary {
  background: var(--col-accent);
  color: #fff;
  box-shadow: 0 1px 3px rgba(59,111,206,.4);
}
.btn.primary:hover   { background: var(--col-accent-h); box-shadow: 0 2px 6px rgba(59,111,206,.5); }
.btn.primary:active  { background: #264e9f; }
.btn.primary:disabled {
  background: #93aed8; box-shadow: none; cursor: not-allowed; transform: none;
}

.btn.secondary {
  background: var(--col-surface-2);
  color: var(--col-text);
  border: 1.5px solid var(--col-border);
}
.btn.secondary:hover  { background: #eef0f6; border-color: #b8bfd4; }
.btn.secondary:active { background: #e4e8f0; }

.btn.outline-btn {
  background: transparent;
  border: 1.5px dashed var(--col-border);
  color: var(--col-text-2);
  font-size: 12px;
}
.btn.outline-btn:hover { background: var(--col-surface-2); border-color: #a0aabf; color: var(--col-text); }

.btn.text-btn {
  background: transparent;
  color: var(--col-accent);
  min-height: unset;
  padding: 2px 4px;
  font-size: 12px;
  border-radius: var(--r-sm);
}
.btn.text-btn:hover { background: var(--col-accent-s); }

.btn.ghost {
  background: transparent;
  color: var(--col-text-3);
  width: 32px; min-height: 32px;
  padding: 0;
  border: 1.5px solid transparent;
  border-radius: var(--r-sm);
  font-size: 13px;
}
.btn.ghost:hover {
  background: var(--col-danger-s);
  color: var(--col-danger);
  border-color: rgba(220,38,38,.2);
}

/* ── APPLICANT / CLAUSE ROWS ── */
.applicant-row, .clause-row {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  padding: 10px 12px;
  background: var(--col-surface-2);
  border: 1.5px solid var(--col-border-2);
  border-radius: var(--r-md);
  transition: border-color var(--tr-base), box-shadow var(--tr-base);
}
.applicant-row:hover, .clause-row:hover {
  border-color: var(--col-border);
  box-shadow: var(--shadow-sm);
}
.clause-row .clause-num {
  font-size: 12px;
  font-weight: 700;
  color: var(--col-accent);
  padding-top: 10px;
  width: 22px;
  text-align: right;
  flex-shrink: 0;
}

/* ── CHECKBOX ── */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--col-text-2);
  cursor: pointer;
  margin: 0;
  user-select: none;
}
.checkbox-label input[type="checkbox"] {
  width: 15px; height: 15px;
  accent-color: var(--col-accent);
  cursor: pointer;
  flex-shrink: 0;
}

/* ── PAPER STAGE ── */
.paper-stage {
  padding: 28px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  transform-origin: top center;
  min-height: 100%;
}
.paper {
  background: white;
  width: 612px;
  min-height: 1008px;
  box-shadow: var(--shadow-paper);
  transform: scale(var(--z));
  transform-origin: top center;
  border-radius: 2px;
  transition: box-shadow .2s;
}

/* ── PDF PAPER INTERNALS ── */
.paper-inner {
  padding: 72px;
  font-family: var(--font-serif);
  color: #000;
  position: relative;
  min-height: 1008px;
}
.stamp-box {
  position: absolute;
  top: 28px; right: 38px;
  width: 104px; height: 122px;
  border: 1.5px solid #555;
  display: flex; align-items: center; justify-content: center;
  text-align: center;
  font-family: var(--font-sans);
  font-size: 9.5px;
  font-weight: 700;
  color: #555;
  letter-spacing: .3px;
  text-transform: uppercase;
  background: repeating-linear-gradient(
    45deg, #fff, #fff 4px, #f5f5f5 4px, #f5f5f5 8px
  );
  border-radius: 2px;
}
.court {
  text-align: center;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 20px;
  position: relative;
  z-index: 2;
  font-size: inherit;
  line-height: 1.4;
}
.case-grid {
  margin-bottom: 20px;
  font-weight: bold;
  position: relative;
  overflow: hidden;
  line-height: 1.5;
}
.case-left  { width: 45%; float: left; }
.case-right { width: 45%; float: right; text-align: right; }
.case-vs    { position: absolute; left: 50%; transform: translateX(-50%); text-align: center; }
.case-grid::after { content: ''; display: table; clear: both; }
.fir-info, .case-info { text-align: center; font-weight: normal; margin-top: 10px; clear: both; }
.subject {
  font-weight: bold;
  text-decoration: underline;
  text-underline-offset: 3px;
  margin: 20px 0;
  text-align: justify;
}
.salutation { margin-bottom: 10px; }
.intro      { margin-bottom: 14px; margin-left: 36px; }
.clause     { display: flex; margin-bottom: 10px; }
.clause .clause-num  { width: 28px; flex-shrink: 0; font-weight: normal; }
.clause .clause-text { text-align: justify; flex: 1; }
.prayer     { margin: 20px 0 36px 36px; text-align: justify; }
.sig-grid   { display: flex; justify-content: space-between; margin-bottom: 36px; }
.sig-right  { text-align: right; }
.sig-name   { display: inline-block; font-weight: bold; text-align: center; }
.counsel-label   { text-align: center; margin-bottom: 28px; }
.counsel-details { text-align: center; }

/* ── ACTION BAR ── */
.action-bar {
  background: var(--col-surface);
  border-top: 1px solid var(--col-border);
  padding: 12px 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  z-index: 20;
  flex-shrink: 0;
  box-shadow: 0 -2px 12px rgba(0,0,0,.05);
}
.action-bar .btn { min-height: 38px; padding: 0 20px; }

/* ── SPINNER ── */
@keyframes _spin { to { transform: rotate(360deg); } }
.btn-spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: _spin .7s linear infinite;
  flex-shrink: 0;
}
.btn-spinner.dark {
  border-color: rgba(0,0,0,.15);
  border-top-color: var(--col-text-2);
}

/* ── TOAST ── */
.toast-host {
  position: fixed;
  bottom: 80px; right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}
.toast {
  background: var(--col-text);
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  padding: 10px 16px;
  border-radius: var(--r-md);
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity .25s, transform .25s;
  pointer-events: auto;
  max-width: 320px;
}
.toast.show { opacity: 1; transform: none; }
.toast.success { background: #14532d; }
.toast.error   { background: #7f1d1d; }
.toast-icon    { flex-shrink: 0; font-size: 14px; }

/* ── EXPORTING STATE ── */
.exporting .paper {
  transform: none !important;
  box-shadow: none !important;
}

/* ── HIDDEN ── */
.hidden { display: none !important; }

/* ── RESPONSIVE ── */
@media (max-width: 899px) {
  .view-preview .form-panel { display: none; }
  .view-form    .preview-panel { display: none; }
  .action-bar { justify-content: stretch; padding: 10px 14px; }
  .action-bar .btn { flex: 1; min-height: 46px; }
  .form-panel { padding: 16px 16px 120px; }
}
@media (min-width: 900px) {
  .mobile-tabs  { display: none; }
  .form-panel   { max-width: 460px; }
  .grid.two     { grid-template-columns: 1fr 1fr; }
  .preview-panel { display: flex; flex-direction: column; }
  .preview-panel .paper-stage { flex: 1; overflow-y: auto; }
}
@media (min-width: 1280px) {
  .form-panel { max-width: 500px; }
}
`.trim();
  }

  // ── HTML TEMPLATE ─────────────────────────────────────────────────────────
  function getHTML() {
    return `
<div class="app-header" role="banner">
  <div class="header-brand">
    <div class="header-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
      </svg>
    </div>
    <span class="app-title">PDFWriter <span>Legal</span></span>
    <span class="header-badge">LADC Fazilka</span>
  </div>
  <div class="mobile-tabs" role="tablist" aria-label="View panels">
    <button id="formTab"    role="tab" aria-selected="true"  aria-controls="formPanel"    class="active">Editor</button>
    <button id="previewTab" role="tab" aria-selected="false" aria-controls="previewPanel">Preview</button>
  </div>
</div>

<div class="layout">
  <div class="panel form-panel" id="formPanel" role="tabpanel" aria-labelledby="formTab">

    <div class="section-title">Document Setup</div>
    <div class="grid two">
      <div>
        <label for="proforma">Template Proforma</label>
        <select id="proforma" class="field" aria-label="Select document template"></select>
      </div>
      <div>
        <label for="layoutStyle">Line Spacing</label>
        <select id="layoutStyle" class="field" aria-label="Select line spacing">
          <option value="standard">Standard Legal (13pt)</option>
          <option value="compact">Compact (12pt)</option>
        </select>
      </div>
    </div>
    <label class="checkbox-label" style="margin-top:14px;">
      <input type="checkbox" id="stampSpace" checked aria-label="Show court fee stamp placeholder">
      Show Court Fee Stamp indicator
    </label>

    <div class="section-title">Case Information</div>
    <label for="court">Court / Presiding Officer</label>
    <select id="court" class="field" aria-label="Select presiding court officer"></select>

    <div class="grid two" style="margin-top:4px;">
      <div>
        <label for="leftParty">State / Complainant</label>
        <input id="leftParty" class="field" placeholder="State" autocomplete="off">
      </div>
      <div>
        <label for="rightParty">Accused / Respondent</label>
        <input id="rightParty" class="field" placeholder="Accused Name" autocomplete="off">
      </div>
    </div>

    <label for="caseMode">Proceeding Type</label>
    <select id="caseMode" class="field" aria-label="Select proceeding type">
      <option value="fir">FIR / State Case</option>
      <option value="appeal">Complaint / Appeal</option>
    </select>

    <div id="firFields" class="grid two" style="margin-top:4px;">
      <div>
        <label for="firNumber">FIR No.</label>
        <input id="firNumber" class="field" placeholder="e.g. 42" autocomplete="off">
      </div>
      <div>
        <label for="firDate">FIR Date</label>
        <input id="firDate" class="field" placeholder="DD.MM.YYYY" autocomplete="off">
      </div>
      <div>
        <label for="sections">Sections</label>
        <input id="sections" class="field" placeholder="e.g. 302, 34 IPC" autocomplete="off">
      </div>
      <div>
        <label for="policeStation">Police Station</label>
        <input id="policeStation" class="field" placeholder="PS Name" autocomplete="off">
      </div>
    </div>

    <div id="appealFields" class="grid two hidden" style="margin-top:4px;">
      <div>
        <label for="caseType">Case Type</label>
        <input id="caseType" class="field" placeholder="e.g. NACT" autocomplete="off">
      </div>
      <div>
        <label for="caseNumber">Number / Year</label>
        <input id="caseNumber" class="field" placeholder="e.g. 123/2024" autocomplete="off">
      </div>
    </div>

    <div class="section-title">
      Applicants
      <button id="addApplicant" class="btn text-btn" aria-label="Add applicant person">+ Add Person</button>
    </div>
    <div id="applicantBox" class="stack" role="list" aria-label="Applicants list"></div>

    <div class="section-title">Draft Body</div>
    <div class="grid two">
      <div>
        <label for="reason">Reason for Absence</label>
        <input id="reason" class="field" placeholder="illness" autocomplete="off">
      </div>
      <div>
        <label for="caseStage">Stage of Case</label>
        <input id="caseStage" class="field" placeholder="e.g. evidence" autocomplete="off">
      </div>
    </div>
    <label for="subject">Subject Line</label>
    <textarea id="subject" class="field" rows="2" aria-label="Document subject line"></textarea>

    <div class="section-title">
      Clauses
      <button id="resetClauses" class="btn text-btn" aria-label="Reset to default clauses">Reset Default</button>
    </div>
    <div id="clauseBox" class="stack" role="list" aria-label="Application clauses"></div>
    <button id="addClause" class="btn outline-btn" style="width:100%;margin-top:8px;" aria-label="Add custom clause">
      + Add Custom Clause
    </button>

    <label for="prayer" style="margin-top:18px;">Prayer</label>
    <textarea id="prayer" class="field" rows="4" aria-label="Prayer paragraph"></textarea>

    <div class="section-title">Signatures &amp; Execution</div>
    <div class="grid two">
      <div>
        <label for="place">Place</label>
        <input id="place" class="field" placeholder="Fazilka" value="Fazilka" autocomplete="off">
      </div>
      <div>
        <label for="date">Date</label>
        <input id="date" class="field" placeholder="DD.MM.YYYY" autocomplete="off">
      </div>
      <div>
        <label for="salutation">Salutation</label>
        <select id="salutation" class="field" aria-label="Select salutation">
          <option>Respected Sir,</option>
          <option>Respected Madam,</option>
        </select>
      </div>
      <div>
        <label for="counsel">Filing Counsel</label>
        <select id="counsel" class="field" aria-label="Select filing counsel"></select>
      </div>
    </div>
    <label class="checkbox-label" style="margin-top:14px;margin-bottom:32px;">
      <input id="duty" type="checkbox" aria-label="Append Duty to counsel title">
      Append (Duty) to Counsel Title
    </label>

  </div><!-- /form-panel -->

  <div class="panel preview-panel" id="previewPanel" role="tabpanel" aria-labelledby="previewTab">
    <div class="paper-stage" id="paperStage">
      <div id="paper" class="paper" role="img" aria-label="Document preview"></div>
    </div>
  </div>
</div><!-- /layout -->

<div class="action-bar" role="toolbar" aria-label="Export actions">
  <button id="scanPdfBtn" class="btn secondary" aria-label="Export as scanned-style PDF">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
    Scanned PDF
  </button>
  <button id="realPdfBtn" class="btn primary" aria-label="Export as raw text PDF">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
    Export PDF
  </button>
</div>

<div class="toast-host" id="toastHost" aria-live="polite" aria-atomic="true"></div>
`.trim();
  }

  // ── TOAST SYSTEM ───────────────────────────────────────────────────────────
  function showToast(msg, type = 'default', duration = 3500) {
    const host = $('toastHost');
    if (!host) return;
    const icons = { success: '✓', error: '✕', default: 'ℹ' };
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    t.innerHTML = `<span class="toast-icon">${icons[type] || icons.default}</span><span>${esc(msg)}</span>`;
    host.appendChild(t);
    requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 300);
    }, duration);
  }

  // ── RENDERING ─────────────────────────────────────────────────────────────
  function renderApplicants() {
    $('applicantBox').innerHTML = state.people.map((p, i) =>
      `<div class="applicant-row" role="listitem">
        <div class="grid two" style="flex:1">
          <div>
            <label for="apName${i}">Applicant ${i + 1}</label>
            <input id="apName${i}" class="field applicant" data-i="${i}"
              placeholder="Full Name" value="${escAttr(p.name)}" autocomplete="off">
          </div>
          <div>
            <label for="apRole${i}">Role</label>
            <div style="display:flex;gap:6px;align-items:flex-end">
              <input id="apRole${i}" class="field role" data-i="${i}"
                value="${escAttr(p.role)}" autocomplete="off">
              ${state.people.length > 1
                ? `<button class="btn ghost delApplicant" data-i="${i}"
                    aria-label="Remove applicant ${i + 1}" title="Remove">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>`
                : ''}
            </div>
          </div>
        </div>
      </div>`
    ).join('');
  }

  function renderClauses() {
    $('clauseBox').innerHTML = state.clauses.map((c, i) =>
      `<div class="clause-row" role="listitem">
        <div class="clause-num">${i + 1}.</div>
        <textarea class="field clauseText" data-i="${i}" rows="2"
          aria-label="Clause ${i + 1} text">${esc(c)}</textarea>
        <button class="btn ghost delClause" data-i="${i}"
          aria-label="Delete clause ${i + 1}" title="Remove">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>`
    ).join('');
  }

  function resetText() {
    // Use raw value for subject/prayer to avoid stripping spaces mid-type
    $('subject').value = generateSubject();
    $('prayer').value  = generatePrayer();
    state.clauses      = generateDefaultClauses();
    renderClauses();
    updatePreview();
  }

  function applyProforma() {
    const p = CONFIG.proformas.find(x => x.id === fv('proforma')) || CONFIG.proformas[0];
    $('reason').value    = p.reason;
    $('caseStage').value = p.stage;
    resetText();
  }

  // ── PREVIEW ───────────────────────────────────────────────────────────────
  function updatePreview() {
    const cParts   = fv('counsel').split('|');
    let   cLabel   = cParts[1] || '';
    if ($('duty') && $('duty').checked) cLabel = cLabel.replace(/\.?$/, '') + ' (Duty).';

    const layout      = fv('layoutStyle');
    const showStamp   = $('stampSpace') && $('stampSpace').checked;
    const lineSpacing = layout === 'compact' ? '1.35' : '1.6';
    const fontSize    = layout === 'compact' ? '12pt' : '13pt';

    // Build case-detail HTML
    let caseHtml = '';
    if (fv('caseMode') === 'appeal') {
      const arr = [fv('caseType'), fv('caseNumber')].filter(Boolean);
      caseHtml = arr.length
        ? `<div class="case-info">${arr.map(esc).join('<br>')}</div>`
        : '';
    } else {
      const arr = [];
      const fn = fv('firNumber'), fd = fv('firDate');
      if (fn || fd) arr.push('FIR No. ' + esc(fn || '_____') + (fd ? ' dated ' + esc(fd) : ''));
      if (fv('sections'))     arr.push('U/s ' + esc(fv('sections')));
      if (fv('policeStation')) arr.push('PS ' + esc(fv('policeStation')));
      if (arr.length) caseHtml = `<div class="fir-info">${arr.join(',<br>')}</div>`;
    }

    const clausesHtml = state.clauses
      .filter(x => clean(x))
      .map((x, i) =>
        `<div class="clause">
          <div class="clause-num">${i + 1})</div>
          <div class="clause-text">${esc(x)}</div>
        </div>`
      ).join('');

    $('paper').innerHTML =
      `<div class="paper-inner" style="font-size:${fontSize};line-height:${lineSpacing}">` +
        (showStamp ? '<div class="stamp-box">Court Fee<br>Ticket</div>' : '') +
        `<div class="court">${esc(fv('court'))}</div>` +
        `<div class="case-grid">
          <div class="case-left">${esc(fv('leftParty') || 'State/Complainant')}</div>
          <div class="case-vs">v/s</div>
          <div class="case-right">${esc(fv('rightParty') || 'Accused/Respondent')}</div>
          ${caseHtml}
        </div>` +
        `<div class="subject">${esc($('subject').value || generateSubject())}</div>` +
        `<div class="salutation">${esc(fv('salutation') || 'Respected Sir,')}</div>` +
        `<div class="intro">It is most respectfully submitted as follows:</div>` +
        clausesHtml +
        `<div class="prayer">${esc($('prayer').value || generatePrayer())}</div>` +
        `<div class="sig-grid">
          <div class="sig-left">
            <b>Place:</b> ${esc(fv('place') || '_____')}<br>
            <b>Date:</b>  ${esc(fv('date')  || '_____')}
          </div>
          <div class="sig-right">
            <b>Submitted By,</b><br><br><br>
            <span class="sig-name">
              ${esc(applicantText())}<br>
              (${esc(accusedLabel())})
            </span>
          </div>
        </div>` +
        `<div class="counsel-label">Through Counsel</div>` +
        `<div class="counsel-details"><b>${esc(cParts[0])}</b><br>${esc(cLabel)}</div>` +
      `</div>`;
  }

  // ── WORD WRAP ─────────────────────────────────────────────────────────────
  function wordWrap(text, maxChars) {
    const words = String(text || '').split(/\s+/);
    const lines = [];
    let   cur   = '';
    for (const w of words) {
      if (!w) continue;
      if (cur && (cur + ' ' + w).length > maxChars) { lines.push(cur); cur = w; }
      else cur = cur ? cur + ' ' + w : w;
    }
    if (cur) lines.push(cur);
    return lines.length ? lines : [''];
  }

  // ── TEXT-WIDTH ESTIMATION (improved) ─────────────────────────────────────
  // Uses per-character average widths for Times New Roman metrics
  function estimateWidth(text, size, bold) {
    // Average char width ratio: bold ≈ 0.50, normal ≈ 0.46 of font-size
    return text.length * size * (bold ? 0.50 : 0.46);
  }

  // ── RAW PDF GENERATION ────────────────────────────────────────────────────
  function generateRealPdf() {
    if (state.exporting) return;
    const btn = $('realPdfBtn');
    setExportState(btn, true, 'Generating…');

    // Use rAF to let UI update before synchronous PDF build
    requestAnimationFrame(() => {
      try {
        _buildRawPdf();
        showToast('PDF exported successfully!', 'success');
      } catch (err) {
        showToast('Export failed: ' + err.message, 'error');
        console.error('[PDFWriter] generateRealPdf:', err);
      } finally {
        setExportState(btn, false, null, 'Export PDF');
      }
    });
  }

  function _buildRawPdf() {
    const texts      = [];
    const isCompact  = fv('layoutStyle') === 'compact';
    const fontSize   = isCompact ? 12 : 13;
    const lh         = isCompact ? 18 : 22;
    let   y          = 72;

    const push = (t, x, bold, align) =>
      texts.push({ t: clean(t), x, y, size: fontSize, bold: !!bold, align: align || 'left' });

    const line   = (t, x = 72, b = false, a = 'left') => { push(t, x, b, a); y += lh; };
    const center = (t, b = false) => line(t, 306, b, 'center');
    const right  = (t, b = false) => line(t, 540, b, 'right');

    // Court header
    fv('court').split(/\n/).forEach(t => center(t.toUpperCase(), true));
    y += lh * 1.5;

    // Parties
    push(fv('leftParty')  || 'State/Complainant',   72,  true, 'left');
    push('v/s',                                       306, true, 'center');
    push(fv('rightParty') || 'Accused/Respondent',   540, true, 'right');
    y += lh;

    // Case reference
    if (fv('caseMode') === 'appeal') {
      if (fv('caseType'))   center(fv('caseType'),   true);
      if (fv('caseNumber')) center(fv('caseNumber'), true);
    } else {
      const fn = fv('firNumber'), fd = fv('firDate');
      if (fn || fd) center('FIR No. ' + (fn || '_____') + (fd ? ' dated ' + fd : ''));
      if (fv('sections'))     center('U/s ' + fv('sections'));
      if (fv('policeStation')) center('PS ' + fv('policeStation'));
    }
    y += lh;

    // Subject
    wordWrap($('subject').value || generateSubject(), 80).forEach(l => line(l, 72, true));
    y += lh;

    // Salutation & intro
    line(fv('salutation') || 'Respected Sir,');
    line('It is most respectfully submitted as follows:', 108);

    // Clauses
    state.clauses.filter(c => clean(c)).forEach((c, i) => {
      wordWrap(c, 75).forEach((l, idx) => {
        if (idx === 0) { push((i + 1) + ')', 72, false, 'left'); line(l, 100); }
        else line(l, 100);
      });
    });
    y += lh * 0.5;

    // Prayer
    wordWrap($('prayer').value || generatePrayer(), 75).forEach(l => line(l, 100));
    y += lh * 2;

    // Signatures
    push('Place: ' + (fv('place') || '_____'), 72, false, 'left');
    right('Submitted By,', true);
    y += lh;
    push('Date: ' + (fv('date') || '_____'), 72, false, 'left');
    y += lh * 2.5;

    right(applicantText(), true);
    y += lh;
    right('(' + accusedLabel() + ')');
    y += lh * 2;

    // Counsel
    const cp = fv('counsel').split('|');
    let cLbl = cp[1] || '';
    if ($('duty') && $('duty').checked) cLbl = cLbl.replace(/\.?$/, '') + ' (Duty).';

    center('Through Counsel');
    y += lh * 1.5;
    center(cp[0], true);
    center(cLbl);

    compilePdfOutput(texts, null, 'Exemption_Application.pdf');
  }

  // ── SCANNED PDF ───────────────────────────────────────────────────────────
  function generateScannedPdf() {
    if (state.exporting) return;
    const btn = $('scanPdfBtn');
    setExportState(btn, true, 'Scanning…', null, true);

    setTimeout(() => {
      try {
        _buildScannedPdf();
        showToast('Scanned PDF exported!', 'success');
      } catch (err) {
        showToast('Scan export failed: ' + err.message, 'error');
        console.error('[PDFWriter] generateScannedPdf:', err);
      } finally {
        setExportState(btn, false, null, 'Scanned PDF');
      }
    }, 80);
  }

  function _buildScannedPdf() {
    document.body.classList.add('exporting');
    const paper    = $('paper');
    const oldTrans = paper.style.transform;
    paper.style.transform = 'none';

    const scale  = window.devicePixelRatio > 1 ? 2 : 1.5;
    const canvas = document.createElement('canvas');
    canvas.width  = Math.round(612 * scale);
    canvas.height = Math.round(1008 * scale);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(scale, scale);
    ctx.fillStyle   = '#111111';
    ctx.textBaseline = 'top';

    const isCompact = fv('layoutStyle') === 'compact';
    const fontSize  = isCompact ? 12 : 13;
    const lh        = isCompact ? 18 : 22;
    let   y         = 72;

    const setFont = (b, s) =>
      { ctx.font = (b ? 'bold ' : '') + (s || fontSize) + 'px "Times New Roman", Times, serif'; };
    const write   = (t, x, align = 'left') =>
      { ctx.textAlign = align; ctx.fillText(String(t || ''), x, y); };

    // Court header
    setFont(true, fontSize + 1);
    fv('court').split(/\n/).forEach(t => { write(t.toUpperCase(), 306, 'center'); y += lh; });
    y += lh;

    // Parties
    setFont(true, fontSize);
    write(fv('leftParty')  || 'State/Complainant',   72);
    write('v/s',                                      306, 'center');
    write(fv('rightParty') || 'Accused/Respondent',   540, 'right');
    y += lh;

    // Case reference
    setFont(false, fontSize);
    if (fv('caseMode') === 'appeal') {
      setFont(true, fontSize);
      if (fv('caseType'))   { write(fv('caseType'),   306, 'center'); y += lh; }
      if (fv('caseNumber')) { write(fv('caseNumber'), 306, 'center'); y += lh; }
    } else {
      const fn = fv('firNumber'), fd = fv('firDate');
      if (fn || fd) { write('FIR No. ' + (fn || '_____') + (fd ? ' dated ' + fd : ''), 306, 'center'); y += lh; }
      if (fv('sections'))     { write('U/s ' + fv('sections'),     306, 'center'); y += lh; }
      if (fv('policeStation')) { write('PS ' + fv('policeStation'), 306, 'center'); y += lh; }
    }
    y += lh;

    // Subject (bold + underline emulation via 2-pass)
    setFont(true, fontSize);
    wordWrap($('subject').value || generateSubject(), 80).forEach(l => {
      const tw = ctx.measureText(l).width;
      write(l, 72);
      ctx.beginPath();
      ctx.strokeStyle = '#000';
      ctx.lineWidth   = 0.8;
      ctx.moveTo(72, y + fontSize + 2);
      ctx.lineTo(72 + tw, y + fontSize + 2);
      ctx.stroke();
      y += lh;
    });
    y += lh;

    // Salutation & intro
    setFont(false, fontSize);
    write(fv('salutation') || 'Respected Sir,', 72); y += lh;
    write('It is most respectfully submitted as follows:', 108); y += lh;

    // Clauses
    state.clauses.filter(c => clean(c)).forEach((c, i) => {
      wordWrap(c, 75).forEach((l, idx) => {
        if (idx === 0) { write((i + 1) + ')', 72); write(l, 100); }
        else write(l, 100);
        y += lh;
      });
    });
    y += lh * 0.5;

    // Prayer
    wordWrap($('prayer').value || generatePrayer(), 75).forEach(l => { write(l, 100); y += lh; });
    y += lh * 2;

    // Sig block
    write('Place: ' + (fv('place') || '_____'), 72);
    setFont(true, fontSize); write('Submitted By,', 540, 'right'); y += lh;
    setFont(false, fontSize); write('Date: ' + (fv('date') || '_____'), 72); y += lh * 2.5;

    setFont(true, fontSize); write(applicantText(), 540, 'right'); y += lh;
    setFont(false, fontSize); write('(' + accusedLabel() + ')', 540, 'right'); y += lh * 2;

    const cp = fv('counsel').split('|');
    let cLbl = cp[1] || '';
    if ($('duty') && $('duty').checked) cLbl = cLbl.replace(/\.?$/, '') + ' (Duty).';

    write('Through Counsel', 306, 'center'); y += lh * 1.5;
    setFont(true, fontSize); write(cp[0], 306, 'center'); y += lh;
    setFont(false, fontSize); write(cLbl, 306, 'center');

    const jpegData = canvas.toDataURL('image/jpeg', 0.92);

    // Restore paper transform
    paper.style.transform = oldTrans;
    document.body.classList.remove('exporting');

    compilePdfOutput([], jpegData, 'Exemption_Application_Scanned.pdf');
  }

  // ── PDF COMPILER ─────────────────────────────────────────────────────────
  function compilePdfOutput(texts, jpegData, filename) {
    const objs    = [];
    let   content = '';
    let   imgId   = null;

    if (jpegData) {
      const raw  = atob(jpegData.split(',')[1]);
      const u8   = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) u8[i] = raw.charCodeAt(i);
      const imgStream = String.fromCharCode(...u8);
      objs.push(
        '<< /Type /XObject /Subtype /Image /Width 1224 /Height 2016' +
        ' /ColorSpace /DeviceRGB /BitsPerComponent 8' +
        ' /Filter /DCTDecode /Length ' + imgStream.length + ' >>' +
        '\nstream\n' + imgStream + '\nendstream'
      );
      imgId   = objs.length;
      content = 'q 612 0 0 1008 0 0 cm /Im1 Do Q';
    } else {
      const escapePdf = (s) =>
        String(s || '')
          .replace(/\\/g, '\\\\')
          .replace(/\(/g, '\\(')
          .replace(/\)/g, '\\)')
          .replace(/[\x00-\x1f\x7f-\xff]/g, (c) => '\\' + c.charCodeAt(0).toString(8).padStart(3, '0'));

      texts.forEach(o => {
        const tw = estimateWidth(o.t, o.size, o.bold);
        let   x  = o.x;
        if (o.align === 'center') x -= tw / 2;
        if (o.align === 'right')  x -= tw;
        x = Math.max(36, Math.round(x));
        content += `BT /F${o.bold ? '2' : '1'} ${o.size} Tf ${x} ${1008 - o.y} Td (${escapePdf(o.t)}) Tj ET\n`;
      });
    }

    const contentBytes = new Uint8Array(content.length);
    for (let i = 0; i < content.length; i++) contentBytes[i] = content.charCodeAt(i) & 0xff;

    objs.push(`<< /Length ${contentBytes.length} >>\nstream\n${content}\nendstream`);

    const cId   = objs.length;
    const pId   = cId + 1;
    const psId  = cId + 2;
    const catId = cId + 3;
    const f1Id  = cId + 4;
    const f2Id  = cId + 5;

    const resDict = jpegData
      ? `<< /Font << /F1 ${f1Id} 0 R /F2 ${f2Id} 0 R >> /XObject << /Im1 ${imgId} 0 R >> >>`
      : `<< /Font << /F1 ${f1Id} 0 R /F2 ${f2Id} 0 R >> >>`;

    objs.push(`<< /Type /Page /Parent ${psId} 0 R /MediaBox [0 0 612 1008] /Resources ${resDict} /Contents ${cId} 0 R >>`);
    objs.push(`<< /Type /Pages /Kids [${pId} 0 R] /Count 1 >>`);
    objs.push(`<< /Type /Catalog /Pages ${psId} 0 R >>`);
    objs.push('<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>');
    objs.push('<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>');

    let   pdf  = '%PDF-1.4\n';
    const xref = [0];
    objs.forEach((o, i) => {
      xref.push(pdf.length);
      pdf += `${i + 1} 0 obj\n${o}\nendobj\n`;
    });
    const sxref = pdf.length;
    pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
    xref.slice(1).forEach(x => { pdf += String(x).padStart(10, '0') + ' 00000 n \n'; });
    pdf += `trailer << /Size ${objs.length + 1} /Root ${catId} 0 R >>\nstartxref\n${sxref}\n%%EOF`;

    const pdfU8 = new Uint8Array(pdf.length);
    for (let i = 0; i < pdf.length; i++) pdfU8[i] = pdf.charCodeAt(i) & 0xff;

    const blob = new Blob([pdfU8], { type: 'application/pdf' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 2000);
  }

  // ── EXPORT STATE HELPERS ──────────────────────────────────────────────────
  function setExportState(btn, loading, loadingLabel, idleLabel, dark = false) {
    state.exporting = loading;
    if (loading) {
      btn.disabled     = true;
      btn.dataset.orig = btn.innerHTML;
      btn.innerHTML    =
        `<span class="btn-spinner${dark ? ' dark' : ''}"></span> ${esc(loadingLabel)}`;
      $('realPdfBtn').disabled = true;
      $('scanPdfBtn').disabled = true;
    } else {
      btn.disabled    = false;
      btn.innerHTML   = btn.dataset.orig || idleLabel || btn.innerHTML;
      $('realPdfBtn').disabled = false;
      $('scanPdfBtn').disabled = false;
    }
  }

  // ── LAYOUT / ZOOM ─────────────────────────────────────────────────────────
  function fitPreview() {
    const isDesktop  = window.innerWidth >= 900;
    const formW      = isDesktop ? 460 : 0;
    const avail      = window.innerWidth - formW - (isDesktop ? 56 : 32);
    state.zoom       = Math.min(1, Math.max(0.15, avail / 612));
    document.documentElement.style.setProperty('--z', state.zoom.toFixed(4));
  }

  function toggleView(view) {
    document.body.className = 'view-' + view;
    $('formTab').classList.toggle('active',    view !== 'preview');
    $('previewTab').classList.toggle('active', view === 'preview');
    $('formTab').setAttribute('aria-selected',    String(view !== 'preview'));
    $('previewTab').setAttribute('aria-selected', String(view === 'preview'));
    fitPreview();
  }

  // ── EVENTS ────────────────────────────────────────────────────────────────
  function bindEvents() {
    // Input events
    document.body.addEventListener('input', (e) => {
      const el = e.target;
      if (el.classList.contains('applicant'))  { state.people[+el.dataset.i].name = el.value; resetText(); return; }
      if (el.classList.contains('role'))       { state.people[+el.dataset.i].role = el.value; updatePreview(); return; }
      if (el.classList.contains('clauseText')) { state.clauses[+el.dataset.i] = el.value; updatePreview(); return; }
      if (el.id === 'reason' || el.id === 'caseStage') { resetText(); return; }
      updatePreview();
    });

    // Change events
    document.body.addEventListener('change', (e) => {
      if (e.target.id === 'proforma') { applyProforma(); return; }
      $('firFields').classList.toggle('hidden',   fv('caseMode') !== 'fir');
      $('appealFields').classList.toggle('hidden', fv('caseMode') !== 'appeal');
      updatePreview();
    });

    // Click events
    document.body.addEventListener('click', (e) => {
      const { id, classList } = e.target;

      if (id === 'formTab')    { toggleView('form');    return; }
      if (id === 'previewTab') { toggleView('preview'); return; }

      if (id === 'addApplicant') {
        state.people.push({ name: '', role: 'Accused/applicant' });
        renderApplicants(); resetText(); return;
      }
      if (classList.contains('delApplicant')) {
        state.people.splice(+e.target.dataset.i, 1);
        if (!state.people.length) state.people = [{ name: '', role: 'Accused/applicant' }];
        renderApplicants(); resetText(); return;
      }

      if (id === 'addClause') {
        state.clauses.push(''); renderClauses(); updatePreview(); return;
      }
      if (id === 'resetClauses') {
        state.clauses = generateDefaultClauses(); renderClauses(); updatePreview(); return;
      }
      if (classList.contains('delClause')) {
        state.clauses.splice(+e.target.dataset.i, 1);
        renderClauses(); updatePreview(); return;
      }

      if (id === 'realPdfBtn') { generateRealPdf(); return; }
      if (id === 'scanPdfBtn') { generateScannedPdf(); return; }
    });

    window.addEventListener('resize', debounce(fitPreview, 150));
  }

  // ── INIT ──────────────────────────────────────────────────────────────────
  function renderApp() {
    // Inject styles
    const styleEl      = document.createElement('style');
    styleEl.id         = 'pdfwriter-styles';
    styleEl.textContent = getCSS();
    document.head.appendChild(styleEl);

    // Set initial body class
    document.body.className = 'view-form';

    // Inject HTML
    $('app').innerHTML = getHTML();

    // Populate selects
    $('proforma').innerHTML = CONFIG.proformas
      .map(p => `<option value="${escAttr(p.id)}">${esc(p.name)}</option>`)
      .join('');
    $('court').innerHTML = CONFIG.courts
      .map(c => `<option value="${escAttr(c)}">${esc(c.replace('IN THE COURT OF ', ''))}</option>`)
      .join('');
    $('counsel').innerHTML = CONFIG.counsels.map(c => {
      const parts = c.split('|');
      return `<option value="${escAttr(c)}">${esc(parts[0])} — ${esc((parts[1] || '').replace(', Fazilka.', ''))}</option>`;
    }).join('');

    // Initial render
    resetText();
    renderApplicants();
    bindEvents();
    fitPreview();

    // Remove shell loader
    const loader = document.getElementById('loader');
    if (loader) { loader.style.opacity = '0'; setTimeout(() => loader.remove(), 350); }
  }

  document.addEventListener('DOMContentLoaded', renderApp);
})();
`;
