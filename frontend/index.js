export const FRONTEND_JS = String.raw`
// ============================================================================
// PDF WRITER - PROFESSIONAL LEGAL EXEMPTION GENERATOR
// ============================================================================

(function() {
    'use strict';

    // --- Configuration & Data ---
    const CONFIG = {
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
            { id: 'original', name: 'Original Exemption', reason: 'illness', stage: 'the purpose fixed' },
            { id: 'medical', name: 'Medical Emergency', reason: 'a sudden medical emergency', stage: 'the purpose fixed' },
            { id: 'hospital', name: 'Hospitalization', reason: 'hospitalization', stage: 'the purpose fixed' },
            { id: 'bereavement', name: 'Bereavement', reason: 'a bereavement in the family', stage: 'the purpose fixed' },
            { id: 'elderly', name: 'Senior Citizen', reason: 'age-related health constraints', stage: 'the purpose fixed' }
        ]
    };

    let state = {
        zoom: 0.5,
        people: [{ name: '', role: 'Accused/applicant' }],
        clauses: []
    };

    // --- Utilities ---
    const id = (x) => document.getElementById(x);
    const v = (x) => { const e = id(x); return e ? cleanText(e.value) : ''; };
    const esc = (s) => String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    
    // Auto-formats spaces and cleans string
    const cleanText = (s) => String(s || '').replace(/\s+/g, ' ').trim();

    // --- Text Generation Logic ---
    function getNames() {
        const a = state.people.map(p => cleanText(p.name)).filter(Boolean);
        if (a.length < 2) return a[0] || '';
        if (a.length === 2) return a[0] + ' and ' + a[1];
        return a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
    }
    
    function isPlural() {
        return state.people.filter(p => cleanText(p.name)).length > 1;
    }
    
    function getApplicantText() {
        return getNames() || v('rightParty') || 'Accused/applicant';
    }

    function generateSubject() {
        const n = getNames();
        return 'Subject: Application for exemption of personal appearance' + (n ? ' of ' + n : '') + '.';
    }

    function generatePrayer() {
        return 'It is, therefore, respectfully prayed that in light of the facts and circumstances mentioned above, the personal appearance of the ' + (isPlural() ? 'above-said accused/applicants' : 'above-said accused') + ' may kindly be exempted for today only.';
    }

    function generateDefaultClauses() {
        const stage = v('caseStage') || 'the purpose fixed';
        const n = getNames();
        const r = v('reason') || 'illness';
        
        const attendance = n 
            ? 'That ' + (isPlural() ? 'the accused/applicants, namely ' + n + ', are' : 'the accused/applicant ' + n + ' is') + " unable to appear before this Hon'ble Court due to " + r + '.'
            : "That the accused/applicant is unable to appear before this Hon'ble Court due to " + r + '.';

        return [
            "That the above-noted case is pending before this Hon'ble Court and the same is fixed for today for " + stage + '.',
            attendance,
            'That the absence of the accused/applicant is neither willful nor intentional, but due to the reason stated above.'
        ];
    }

    // --- UI Rendering ---
    function renderApp() {
        const style = document.createElement('style');
        style.textContent = getCSS();
        document.head.appendChild(style);
        document.body.className = 'view-form';
        id('app').innerHTML = getHTML();
        
        id('proforma').innerHTML = CONFIG.proformas.map(p => '<option value="' + p.id + '">' + esc(p.name) + '</option>').join('');
        id('court').innerHTML = CONFIG.courts.map(c => '<option value="' + esc(c) + '">' + esc(c.replace('IN THE COURT OF ', '')) + '</option>').join('');
        id('counsel').innerHTML = CONFIG.counsels.map(c => {
            const p = c.split('|');
            return '<option value="' + esc(c) + '">' + esc(p[0] + ' — ' + p[1].replace(', Fazilka.', '')) + '</option>';
        }).join('');

        resetText();
        renderApplicants();
        bindEvents();
        fitPreview();
    }

    function renderApplicants() {
        id('applicantBox').innerHTML = state.people.map((p, i) => 
            '<div class="box"><div class="grid two"><div><label>Name ' + (i + 1) + '</label><input class="field applicant" data-i="' + i + '" placeholder="Name" value="' + esc(p.name) + '"></div>' +
            '<div><label>Role</label><input class="field role" data-i="' + i + '" value="' + esc(p.role) + '"></div></div>' +
            '<div class="actions"><button class="btn danger soft delApplicant" data-i="' + i + '">Remove</button></div></div>'
        ).join('');
    }

    function renderClauses() {
        id('clauseBox').innerHTML = state.clauses.map((c, i) => 
            '<div class="box clause-box"><div class="clause-num">' + (i + 1) + '.</div><textarea class="field clauseText" data-i="' + i + '">' + esc(c) + '</textarea>' +
            '<button class="btn danger soft icon-btn delClause" data-i="' + i + '" title="Remove">×</button></div>'
        ).join('');
    }

    function resetText() {
        id('subject').value = generateSubject();
        id('prayer').value = generatePrayer();
        state.clauses = generateDefaultClauses();
        renderClauses();
        updatePreview();
    }

    function applyProforma() {
        const p = CONFIG.proformas.find(x => x.id === v('proforma')) || CONFIG.proformas[0];
        id('reason').value = p.reason;
        id('caseStage').value = p.stage;
        resetText();
    }

    // --- Dynamic Preview Generation ---
    function updatePreview() {
        const cProps = v('counsel').split('|');
        let cLine = cProps[1] || '';
        if (id('duty').checked) cLine = cLine.replace(/\.?$/, '') + ' (Duty).';
        
        const layout = v('layoutStyle');
        const showStamp = id('stampSpace').checked;
        const lineSpacing = layout === 'compact' ? '1.3' : '1.6';
        const fontSize = layout === 'compact' ? '12pt' : '13pt';

        let caseHtml = '';
        if (v('caseMode') === 'appeal') {
            const arr = [v('caseType'), v('caseNumber')].filter(Boolean);
            caseHtml = '<div class="case-info">' + esc(arr.join(' \\n ')).replace(/\\n/g, '<br>') + '</div>';
        } else {
            const arr = [];
            if (v('firNumber') || v('firDate')) arr.push('FIR No. ' + esc(v('firNumber') || '_____') + (v('firDate') ? ' dated ' + esc(v('firDate')) : ''));
            if (v('sections')) arr.push('U/s ' + esc(v('sections')));
            if (v('policeStation')) arr.push('PS ' + esc(v('policeStation')));
            caseHtml = '<div class="fir-info">' + arr.join(',<br>') + '</div>';
        }

        let clausesHtml = state.clauses.filter(x => cleanText(x)).map((x, i) => 
            '<div class="clause"><div class="clause-num">' + (i + 1) + ')</div><div class="clause-text">' + esc(x) + '</div></div>'
        ).join('');

        const innerStyles = 'font-size: ' + fontSize + '; line-height: ' + lineSpacing + ';';
        const stampHtml = showStamp ? '<div class="stamp-box">Court Fee<br>Stamp</div>' : '';

        id('paper').innerHTML = 
            '<div class="paper-inner" style="' + innerStyles + '">' +
                stampHtml +
                '<div class="court">' + esc(v('court')) + '</div>' +
                '<div class="case-grid">' +
                    '<div class="case-left">' + esc(v('leftParty') || 'State/Complainant') + '</div>' +
                    '<div class="case-vs">v/s</div>' +
                    '<div class="case-right">' + esc(v('rightParty') || 'Accused/Respondent') + '</div>' +
                    caseHtml +
                '</div>' +
                '<div class="subject">' + esc(v('subject') || generateSubject()) + '</div>' +
                '<div class="salutation">' + esc(v('salutation')) + '</div>' +
                '<div class="intro">It is most respectfully submitted as follows:</div>' +
                clausesHtml +
                '<div class="prayer">' + esc(v('prayer') || generatePrayer()) + '</div>' +
                '<div class="sig-grid">' +
                    '<div class="sig-left"><b>Place:</b> ' + esc(v('place') || '_____') + '<br><b>Date:</b> ' + esc(v('date') || '_____') + '</div>' +
                    '<div class="sig-right"><b>Submitted By,</b><br><br><br><span class="sig-name">' + esc(getApplicantText()) + '<br>(' + (isPlural() ? 'Accused/applicants' : 'Accused/applicant') + ')</span></div>' +
                '</div>' +
                '<div class="counsel-label">Through Counsel</div>' +
                '<div class="counsel-details"><b>' + esc(cProps[0]) + '</b><br>' + esc(cLine) + '</div>' +
            '</div>';
    }

    // --- Core PDF Engines ---

    function wordWrap(text, maxChars) {
        const words = text.split(/\s+/);
        const lines = [];
        let current = '';
        words.forEach(w => {
            if ((current + w).length > maxChars) {
                lines.push(current.trim());
                current = w + ' ';
            } else {
                current += w + ' ';
            }
        });
        if (current) lines.push(current.trim());
        return lines;
    }

    function generateRealPdf() {
        const texts = [];
        let y = 72; // Start from top margin
        const showStamp = id('stampSpace').checked;
        const isCompact = v('layoutStyle') === 'compact';
        const fontSize = isCompact ? 12 : 13;
        const lh = isCompact ? 18 : 22; // Line height
        
        if (showStamp) y += 50; // Push content down to leave space for stamp

        const addT = (x, t, b = false, a = 'left') => { texts.push({ x, y, t: cleanText(t), size: fontSize, bold: b, align: a }); };
        const line = (t, x = 72, b = false, a = 'left') => { addT(x, t, b, a); y += lh; };
        const center = (t, b = false) => { line(t, 306, b, 'center'); };

        // Court Header
        v('court').split(/\n/).forEach(t => center(t.toUpperCase(), true));
        y += lh * 1.5;

        // Case Details
        addT(72, v('leftParty') || 'State/Complainant', true);
        addT(306, 'v/s', true, 'center');
        addT(540, v('rightParty') || 'Accused/Respondent', true, 'right');
        y += lh;

        if (v('caseMode') === 'appeal') {
            if (v('caseType')) center(v('caseType'), true);
            if (v('caseNumber')) center(v('caseNumber'), true);
        } else {
            const arr = [];
            if (v('firNumber') || v('firDate')) arr.push('FIR No. ' + (v('firNumber') || '_____') + (v('firDate') ? ' dated ' + v('firDate') : ''));
            if (v('sections')) arr.push('U/s ' + v('sections'));
            if (v('policeStation')) arr.push('PS ' + v('policeStation'));
            arr.forEach(a => line(a, 306, false, 'center'));
        }
        y += lh;

        // Subject & Body
        const subjLines = wordWrap(v('subject') || generateSubject(), 80);
        subjLines.forEach(l => line(l, 72, true));
        y += lh;
        
        line(v('salutation') || 'Respected Sir,');
        line('It is most respectfully submitted as follows:', 108);

        // Clauses (with wrap)
        state.clauses.filter(c => cleanText(c)).forEach((c, i) => {
            const lines = wordWrap(c, 75);
            lines.forEach((l, idx) => {
                if (idx === 0) {
                    addT(72, (i + 1) + ')');
                    line(l, 100);
                } else {
                    line(l, 100);
                }
            });
        });
        y += (lh / 2);

        // Prayer
        const prayerLines = wordWrap(v('prayer') || generatePrayer(), 75);
        prayerLines.forEach(l => line(l, 100));
        y += lh * 2;

        // Signatures
        addT(72, 'Place: ' + (v('place') || '_____'));
        addT(540, 'Submitted By,', true, 'right');
        y += lh;
        addT(72, 'Date: ' + (v('date') || '_____'));
        y += lh * 2.5;

        addT(540, getApplicantText(), true, 'right');
        y += lh;
        addT(540, '(' + (isPlural() ? 'Accused/applicants' : 'Accused/applicant') + ')', false, 'right');
        y += lh * 2;

        // Counsel
        const cProps = v('counsel').split('|');
        let cLine = cProps[1] || '';
        if (id('duty').checked) cLine = cLine.replace(/\.?$/, '') + ' (Duty).';

        center('Through Counsel');
        y += lh * 1.5;
        center(cProps[0], true);
        center(cLine, false);

        compilePdfOutput(texts, null, 'Exemption_Application.pdf');
    }

    function generateScannedPdf() {
        document.body.classList.add('exporting');
        const p = id('paper');
        const oldTrans = p.style.transform;
        p.style.transform = 'none';

        setTimeout(() => {
            const c = document.createElement('canvas');
            const scale = 2; // High-res canvas
            c.width = 612 * scale;  // Legal width
            c.height = 1008 * scale; // Legal height
            const ctx = c.getContext('2d');
            
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, c.width, c.height);
            ctx.scale(scale, scale);
            
            drawCanvasContent(ctx);
            
            const jpegData = c.toDataURL('image/jpeg', 0.95);
            p.style.transform = oldTrans;
            document.body.classList.remove('exporting');
            
            compilePdfOutput([], jpegData, 'Exemption_Application_Scanned.pdf');
        }, 100);
    }

    function drawCanvasContent(ctx) {
        const isCompact = v('layoutStyle') === 'compact';
        const fontSize = isCompact ? 12 : 13;
        const lh = isCompact ? 18 : 22;
        let y = 72;
        
        ctx.fillStyle = '#111';
        ctx.textBaseline = 'top';

        const setFont = (b, s) => { ctx.font = (b ? 'bold ' : '') + (s || fontSize) + 'px "Times New Roman", Times, serif'; };
        const write = (t, x, align = 'left', maxW) => {
            ctx.textAlign = align;
            ctx.fillText(t, x, y, maxW);
        };

        if (id('stampSpace').checked) y += 50;

        setFont(true, fontSize + 1);
        v('court').split(/\n/).forEach(t => { write(t.toUpperCase(), 306, 'center', 468); y += lh; });
        y += lh;

        setFont(true, fontSize);
        write(v('leftParty') || 'State/Complainant', 72, 'left');
        write('v/s', 306, 'center');
        write(v('rightParty') || 'Accused/Respondent', 540, 'right');
        y += lh;

        setFont(false, fontSize);
        if (v('caseMode') === 'appeal') {
            setFont(true, fontSize);
            if (v('caseType')) { write(v('caseType'), 306, 'center'); y += lh; }
            if (v('caseNumber')) { write(v('caseNumber'), 306, 'center'); y += lh; }
        } else {
            const arr = [];
            if (v('firNumber') || v('firDate')) arr.push('FIR No. ' + (v('firNumber') || '_____') + (v('firDate') ? ' dated ' + v('firDate') : ''));
            if (v('sections')) arr.push('U/s ' + v('sections'));
            if (v('policeStation')) arr.push('PS ' + v('policeStation'));
            arr.forEach(a => { write(a, 306, 'center'); y += lh; });
        }
        y += lh;

        setFont(true, fontSize);
        const subjLines = wordWrap(v('subject') || generateSubject(), 80);
        subjLines.forEach(l => { write(l, 72); y += lh; });
        y += lh;

        setFont(false, fontSize);
        write(v('salutation') || 'Respected Sir,', 72); y += lh;
        write('It is most respectfully submitted as follows:', 108); y += lh;

        state.clauses.filter(c => cleanText(c)).forEach((c, i) => {
            const lines = wordWrap(c, 75);
            lines.forEach((l, idx) => {
                if (idx === 0) { write((i + 1) + ')', 72); write(l, 100); } 
                else { write(l, 100); }
                y += lh;
            });
        });
        y += lh / 2;

        const prayerLines = wordWrap(v('prayer') || generatePrayer(), 75);
        prayerLines.forEach(l => { write(l, 100); y += lh; });
        y += lh * 2;

        write('Place: ' + (v('place') || '_____'), 72);
        setFont(true, fontSize);
        write('Submitted By,', 540, 'right'); y += lh;
        setFont(false, fontSize);
        write('Date: ' + (v('date') || '_____'), 72); y += lh * 2.5;

        setFont(true, fontSize);
        write(getApplicantText(), 540, 'right'); y += lh;
        setFont(false, fontSize);
        write('(' + (isPlural() ? 'Accused/applicants' : 'Accused/applicant') + ')', 540, 'right'); y += lh * 2;

        const cProps = v('counsel').split('|');
        let cLine = cProps[1] || '';
        if (id('duty').checked) cLine = cLine.replace(/\.?$/, '') + ' (Duty).';

        write('Through Counsel', 306, 'center'); y += lh * 1.5;
        setFont(true, fontSize);
        write(cProps[0], 306, 'center'); y += lh;
        setFont(false, fontSize);
        write(cLine, 306, 'center');
    }

    // --- Core PDF Assembler (100% Valid Object Graph) ---
    function compilePdfOutput(texts, jpegData, filename) {
        const objs = [];
        let content = '';
        let imgId = null;

        if (jpegData) {
            const imgB64 = atob(jpegData.split(',')[1]);
            objs.push('<< /Type /XObject /Subtype /Image /Width 1224 /Height 2016 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + imgB64.length + ' >>\nstream\n' + imgB64 + '\nendstream');
            imgId = objs.length;
            content = 'q 612 0 0 1008 0 0 cm /Im1 Do Q';
        } else {
            const escapePdf = s => s.replace(/[\\]/g, '\\\\').replace(/[\(\)]/g, '\\$&');
            texts.forEach(o => {
                const tw = (o.t.length * o.size * 0.45); // Approximate width
                let x = o.x;
                if (o.align === 'center') x -= tw / 2;
                if (o.align === 'right') x -= tw;
                content += 'BT /F' + (o.bold ? '2' : '1') + ' ' + o.size + ' Tf ' + x + ' ' + (1008 - o.y) + ' Td (' + escapePdf(o.t) + ') Tj ET\n';
            });
        }

        const contentU8 = new Uint8Array(content.length);
        for(let i=0; i<content.length; i++) contentU8[i] = content.charCodeAt(i) & 255;

        objs.push('<< /Length ' + contentU8.length + ' >>\nstream\n' + content + '\nendstream');
        
        const cId = objs.length;
        const pId = cId + 1;
        const psId = cId + 2;
        const catId = cId + 3;
        const f1Id = cId + 4;
        const f2Id = cId + 5;

        const resDict = jpegData 
            ? '<< /Font << /F1 ' + f1Id + ' 0 R /F2 ' + f2Id + ' 0 R >> /XObject << /Im1 ' + imgId + ' 0 R >> >>'
            : '<< /Font << /F1 ' + f1Id + ' 0 R /F2 ' + f2Id + ' 0 R >> >>';

        objs.push('<< /Type /Page /Parent ' + psId + ' 0 R /MediaBox [0 0 612 1008] /Resources ' + resDict + ' /Contents ' + cId + ' 0 R >>');
        objs.push('<< /Type /Pages /Kids [' + pId + ' 0 R] /Count 1 >>');
        objs.push('<< /Type /Catalog /Pages ' + psId + ' 0 R >>');
        objs.push('<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>');
        objs.push('<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>');

        let pdfData = '%PDF-1.4\n';
        const xref = [0];

        objs.forEach((o, i) => {
            xref.push(pdfData.length);
            pdfData += (i + 1) + ' 0 obj\n' + o + '\nendobj\n';
        });

        const startXref = pdfData.length;
        pdfData += 'xref\n0 ' + (objs.length + 1) + '\n0000000000 65535 f \n';
        xref.slice(1).forEach(x => { pdfData += String(x).padStart(10, '0') + ' 00000 n \n'; });
        pdfData += 'trailer << /Size ' + (objs.length + 1) + ' /Root ' + catId + ' 0 R >>\nstartxref\n' + startXref + '\n%%EOF';

        const pdfU8 = new Uint8Array(pdfData.length);
        for(let i=0; i<pdfData.length; i++) pdfU8[i] = pdfData.charCodeAt(i) & 255;

        const blob = new Blob([pdfU8], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => { URL.revokeObjectURL(link.href); link.remove(); }, 1000);
    }

    // --- Event Bindings ---
    function bindEvents() {
        document.body.addEventListener('input', e => {
            const el = e.target;
            if (el.classList.contains('applicant')) { state.people[+el.dataset.i].name = el.value; resetText(); }
            else if (el.classList.contains('role')) { state.people[+el.dataset.i].role = el.value; updatePreview(); }
            else if (el.classList.contains('clauseText')) { state.clauses[+el.dataset.i] = el.value; updatePreview(); }
            else if (el.id === 'reason' || el.id === 'caseStage') { resetText(); }
            else { updatePreview(); }
        });

        document.body.addEventListener('change', e => {
            if (e.target.id === 'proforma') applyProforma();
            id('firFields').classList.toggle('hidden', v('caseMode') !== 'fir');
            id('appealFields').classList.toggle('hidden', v('caseMode') !== 'appeal');
            updatePreview();
        });

        document.body.addEventListener('click', e => {
            if (e.target.id === 'formTab') toggleView('form');
            if (e.target.id === 'previewTab') toggleView('preview');
            
            if (e.target.id === 'addApplicant') {
                state.people.push({ name: '', role: 'Accused/applicant' });
                renderApplicants(); resetText();
            }
            if (e.target.classList.contains('delApplicant')) {
                state.people.splice(+e.target.dataset.i, 1);
                if (!state.people.length) state.people = [{ name: '', role: 'Accused/applicant' }];
                renderApplicants(); resetText();
            }
            
            if (e.target.id === 'addClause') { state.clauses.push(''); renderClauses(); updatePreview(); }
            if (e.target.classList.contains('delClause')) {
                state.clauses.splice(+e.target.dataset.i, 1);
                renderClauses(); updatePreview();
            }

            if (e.target.id === 'realPdfBtn') generateRealPdf();
            if (e.target.id === 'scanPdfBtn') generateScannedPdf();
        });
        
        window.addEventListener('resize', fitPreview);
    }

    function toggleView(v) {
        document.body.className = v === 'preview' ? 'view-preview' : 'view-form';
        id('formTab').classList.toggle('on', v !== 'preview');
        id('previewTab').classList.toggle('on', v === 'preview');
        fitPreview();
    }

    function fitPreview() {
        const pw = window.innerWidth < 1120 ? window.innerWidth - 32 : (window.innerWidth - 480) - 64;
        state.zoom = Math.min(1, Math.max(0.3, pw / 612));
        document.documentElement.style.setProperty('--z', state.zoom);
    }

    // --- HTML Template ---
    function getHTML() {
        return `
        <header class="topbar">
            <div class="brand">
                <div class="logo">PW</div>
                <div class="brand-text">
                    <h1 class="title">PdfWriter</h1>
                    <span class="sub">Professional Legal Engine</span>
                </div>
            </div>
            <div class="tabs">
                <button id="formTab" class="on">Data Entry</button>
                <button id="previewTab">Document Preview</button>
            </div>
        </header>

        <main class="layout">
            <section class="panel form-panel">
                
                <div class="card">
                    <div class="card-header">
                        <h2><span class="badge">1</span> Document Settings</h2>
                    </div>
                    <div class="grid two">
                        <div>
                            <label>Template</label>
                            <select id="proforma" class="field"></select>
                        </div>
                        <div>
                            <label>Layout Style</label>
                            <select id="layoutStyle" class="field">
                                <option value="standard">Standard Legal (13pt, 1.5 Spacing)</option>
                                <option value="compact">Compact Mode (12pt, 1.15 Spacing)</option>
                            </select>
                        </div>
                    </div>
                    <label class="check-wrap" style="margin-top:12px;">
                        <input type="checkbox" id="stampSpace" checked> Leave top-right space for Court Fee Stamp
                    </label>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h2><span class="badge">2</span> Case Details</h2>
                    </div>
                    <label>Court Name</label>
                    <select id="court" class="field"></select>
                    
                    <div class="grid two">
                        <div><label>Complainant / State</label><input id="leftParty" class="field" placeholder="State"></div>
                        <div><label>Accused / Respondent</label><input id="rightParty" class="field" placeholder="Accused Name"></div>
                    </div>

                    <label>Case Type Category</label>
                    <select id="caseMode" class="field">
                        <option value="fir">FIR Based (State Case)</option>
                        <option value="appeal">Complaint / Appeal / NACT</option>
                    </select>

                    <div id="firFields" class="grid two">
                        <div><label>FIR Number</label><input id="firNumber" class="field" placeholder="e.g. 112"></div>
                        <div><label>Date</label><input id="firDate" class="field" placeholder="DD.MM.YYYY"></div>
                        <div><label>Sections</label><input id="sections" class="field" placeholder="e.g. 302 IPC"></div>
                        <div><label>Police Station</label><input id="policeStation" class="field" placeholder="e.g. City Fazilka"></div>
                    </div>

                    <div id="appealFields" class="grid two hidden">
                        <div><label>Type</label><input id="caseType" class="field" placeholder="e.g. NACT"></div>
                        <div><label>Number/Year</label><input id="caseNumber" class="field" placeholder="e.g. 123/2024"></div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h2><span class="badge">3</span> Applicant(s)</h2>
                        <button id="addApplicant" class="btn secondary small">+ Add Person</button>
                    </div>
                    <div id="applicantBox" class="stack"></div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h2><span class="badge">4</span> Legal Draft</h2>
                    </div>
                    <label>Absence Reason</label>
                    <input id="reason" class="field" placeholder="illness">
                    <label>Stage of Case</label>
                    <input id="caseStage" class="field" placeholder="prosecution evidence">
                    <label>Subject Line</label>
                    <textarea id="subject" class="field" rows="2"></textarea>
                    
                    <label>Draft Clauses</label>
                    <div id="clauseBox" class="stack"></div>
                    <button id="addClause" class="btn secondary dashed" style="width:100%; margin-top:8px;">+ Add Custom Clause</button>

                    <label style="margin-top:16px;">Prayer (Conclusion)</label>
                    <textarea id="prayer" class="field" rows="3"></textarea>
                </div>

                <div class="card" style="margin-bottom:80px;">
                    <div class="card-header">
                        <h2><span class="badge">5</span> Signatures & Counsel</h2>
                    </div>
                    <div class="grid two">
                        <div><label>Place</label><input id="place" class="field" placeholder="Fazilka" value="Fazilka"></div>
                        <div><label>Date</label><input id="date" class="field" placeholder="DD.MM.YYYY"></div>
                    </div>
                    <div class="grid two">
                        <div>
                            <label>Salutation</label>
                            <select id="salutation" class="field">
                                <option>Respected Sir,</option>
                                <option>Respected Madam,</option>
                            </select>
                        </div>
                        <div>
                            <label>Filing Counsel</label>
                            <select id="counsel" class="field"></select>
                        </div>
                    </div>
                    <label class="check-wrap" style="margin-top:12px;">
                        <input id="duty" type="checkbox"> Append (Duty) to Counsel Title
                    </label>
                </div>
            </section>

            <section class="panel preview-panel">
                <div class="preview-toolbar">
                    <span class="status-dot"></span> Live Preview (Legal Size)
                </div>
                <div class="paper-stage">
                    <div id="paper" class="paper"></div>
                </div>
            </section>
        </main>

        <footer class="action-bar">
            <button id="realPdfBtn" class="btn primary">Generate Raw PDF</button>
            <button id="scanPdfBtn" class="btn dark">Generate Scanned PDF</button>
        </footer>
        `;
    }

    // --- CSS Template (Modern & Minimalist) ---
    function getCSS() {
        return `
        :root { --z: 0.5; --primary: #0f172a; --bg: #f1f5f9; --border: #cbd5e1; --surface: #ffffff; }
        * { box-sizing: border-box; font-family: 'Inter', sans-serif; margin: 0; padding: 0; }
        body { background: var(--bg); color: #334155; height: 100vh; overflow: hidden; }
        
        .topbar { height: 64px; background: var(--surface); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; z-index: 10; position: relative; }
        .brand { display: flex; align-items: center; gap: 12px; }
        .logo { background: var(--primary); color: white; width: 36px; height: 36px; display: grid; place-items: center; border-radius: 8px; font-weight: 700; letter-spacing: -1px; }
        .title { font-size: 16px; font-weight: 700; color: #0f172a; }
        .sub { font-size: 12px; color: #64748b; font-weight: 500; }
        
        .tabs { display: flex; background: var(--bg); padding: 4px; border-radius: 8px; }
        .tabs button { border: none; background: transparent; padding: 6px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; color: #64748b; cursor: pointer; transition: all 0.2s; }
        .tabs button.on { background: var(--surface); color: var(--primary); box-shadow: 0 1px 3px rgba(0,0,0,0.1); }

        .layout { display: grid; grid-template-columns: 1fr; height: calc(100vh - 64px); }
        .panel { overflow-y: auto; height: 100%; }
        
        .form-panel { padding: 24px; background: #fafafa; }
        .preview-panel { background: #e2e8f0; position: relative; }
        
        .card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 1px 2px rgba(0,0,0,0.02); }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .card-header h2 { font-size: 14px; font-weight: 600; color: #0f172a; display: flex; align-items: center; gap: 8px; }
        .badge { background: #e2e8f0; color: #475569; width: 22px; height: 22px; border-radius: 6px; display: grid; place-items: center; font-size: 11px; }
        
        .grid { display: grid; gap: 12px; }
        .grid.two { grid-template-columns: 1fr; }
        .stack { display: flex; flex-direction: column; gap: 12px; }
        
        label { display: block; font-size: 12px; font-weight: 600; color: #475569; margin: 12px 0 6px 0; }
        .field { width: 100%; background: #f8fafc; border: 1px solid var(--border); border-radius: 8px; padding: 10px 12px; font-size: 13px; color: #0f172a; transition: border 0.2s; outline: none; }
        .field:focus { border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        textarea.field { resize: vertical; min-height: 40px; }
        
        .btn { border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s; display: inline-flex; align-items: center; justify-content: center; }
        .btn.primary { background: #3b82f6; color: white; padding: 12px 24px; }
        .btn.primary:hover { background: #2563eb; }
        .btn.dark { background: var(--primary); color: white; padding: 12px 24px; }
        .btn.dark:hover { background: #1e293b; }
        .btn.secondary { background: #f1f5f9; color: #334155; padding: 8px 16px; border: 1px solid var(--border); }
        .btn.secondary.dashed { border-style: dashed; background: transparent; }
        .btn.secondary:hover { background: #e2e8f0; }
        .btn.danger { color: #ef4444; }
        .btn.soft { background: #fef2f2; border: 1px solid #fecaca; }
        .btn.soft:hover { background: #fee2e2; }
        .btn.small { padding: 4px 10px; font-size: 11px; }
        .icon-btn { width: 28px; height: 28px; padding: 0; font-size: 16px; }

        .box { padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; }
        .clause-box { display: flex; gap: 8px; align-items: flex-start; }
        .clause-num { font-weight: 600; color: #64748b; font-size: 13px; padding-top: 10px; }
        
        .check-wrap { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; cursor: pointer; }
        .hidden { display: none !important; }

        .preview-toolbar { background: rgba(255,255,255,0.9); backdrop-filter: blur(8px); padding: 12px 24px; font-size: 12px; font-weight: 600; color: #475569; display: flex; align-items: center; gap: 8px; position: sticky; top: 0; z-index: 5; border-bottom: 1px solid var(--border); }
        .status-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; display: inline-block; }
        
        .paper-stage { padding: 40px; display: flex; justify-content: center; transform-origin: top center; min-height: 100%; }
        .paper { background: white; width: 612px; min-height: 1008px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); transform: scale(var(--z)); transform-origin: top center; }
        
        /* Inside Paper Styles (Legal Print Formatting) */
        .paper-inner { padding: 72px 72px 72px 72px; font-family: "Times New Roman", Times, serif; color: #000; position: relative; }
        .stamp-box { position: absolute; top: 40px; right: 40px; width: 120px; height: 120px; border: 1px dashed #94a3b8; color: #94a3b8; display: grid; place-items: center; text-align: center; font-family: sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }
        .court { text-align: center; font-weight: bold; text-transform: uppercase; margin-bottom: 24px; }
        .case-grid { margin-bottom: 24px; font-weight: bold; position: relative; }
        .case-left { width: 45%; float: left; }
        .case-right { width: 45%; float: right; text-align: right; }
        .case-vs { position: absolute; left: 50%; transform: translateX(-50%); text-align: center; }
        .case-grid::after { content: ""; display: table; clear: both; }
        .fir-info, .case-info { text-align: center; font-weight: normal; margin-top: 12px; clear: both; }
        
        .subject { font-weight: bold; text-decoration: underline; text-underline-offset: 3px; margin: 24px 0; text-align: justify; }
        .salutation { margin-bottom: 12px; }
        .intro { margin-bottom: 16px; margin-left: 36px; }
        
        .clause { display: flex; margin-bottom: 12px; }
        .clause .clause-num { width: 28px; flex-shrink: 0; padding: 0; font-weight: normal; color: #000; font-size: inherit; }
        .clause .clause-text { text-align: justify; }
        
        .prayer { margin: 24px 0 40px 36px; text-align: justify; }
        
        .sig-grid { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .sig-right { text-align: right; }
        .sig-name { display: inline-block; font-weight: bold; text-align: center; }
        
        .counsel-label { text-align: center; margin-bottom: 30px; }
        .counsel-details { text-align: center; }

        .action-bar { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(255,255,255,0.9); backdrop-filter: blur(12px); border-top: 1px solid var(--border); padding: 12px 24px; display: flex; justify-content: flex-end; gap: 12px; z-index: 20; }
        
        .exporting .paper { transform: none !important; box-shadow: none !important; }

        @media (max-width: 1119px) {
            .view-preview .form-panel { display: none; }
            .view-form .preview-panel { display: none; }
            .tabs { display: flex; }
        }
        @media (min-width: 1120px) {
            .layout { grid-template-columns: 480px 1fr; }
            .tabs { display: none; }
            .grid.two { grid-template-columns: 1fr 1fr; }
        }
        `;
    }

    // Init
    document.addEventListener('DOMContentLoaded', renderApp);
})();
`;
