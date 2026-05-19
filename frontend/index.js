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
            { id: 'original', name: 'Standard Exemption', reason: 'illness', stage: 'the purpose fixed' },
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
    const cleanText = (s) => String(s || '').replace(/\s+/g, ' ').trim();

    // --- Text Generation Logic ---
    function getNames() {
        const a = state.people.map(p => cleanText(p.name)).filter(Boolean);
        if (a.length < 2) return a[0] || '';
        if (a.length === 2) return a[0] + ' and ' + a[1];
        return a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
    }
    
    function isPlural() { return state.people.filter(p => cleanText(p.name)).length > 1; }
    function getApplicantText() { return getNames() || v('rightParty') || 'Accused/applicant'; }

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
            '<div class="applicant-row"><div class="grid two">' +
            '<div><label>Applicant Name ' + (i + 1) + '</label><input class="field applicant" data-i="' + i + '" placeholder="Name" value="' + esc(p.name) + '"></div>' +
            '<div><label>Role</label><div style="display:flex; gap:8px;"><input class="field role" data-i="' + i + '" value="' + esc(p.role) + '">' +
            '<button class="btn ghost delApplicant" data-i="' + i + '" title="Remove">✕</button></div></div>' +
            '</div></div>'
        ).join('');
    }

    function renderClauses() {
        id('clauseBox').innerHTML = state.clauses.map((c, i) => 
            '<div class="clause-row"><div class="clause-num">' + (i + 1) + '.</div><textarea class="field clauseText" data-i="' + i + '">' + esc(c) + '</textarea>' +
            '<button class="btn ghost delClause" data-i="' + i + '" title="Remove">✕</button></div>'
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
        const stampHtml = showStamp ? '<div class="stamp-box">Court Fee Ticket</div>' : '';

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
            } else { current += w + ' '; }
        });
        if (current) lines.push(current.trim());
        return lines;
    }

    function generateRealPdf() {
        const texts = [];
        let y = 72; // Strict Top Line Margin (1 inch)
        const isCompact = v('layoutStyle') === 'compact';
        const fontSize = isCompact ? 12 : 13;
        const lh = isCompact ? 18 : 22; 
        
        const addT = (x, t, b = false, a = 'left') => { texts.push({ x, y, t: cleanText(t), size: fontSize, bold: b, align: a }); };
        const line = (t, x = 72, b = false, a = 'left') => { addT(x, t, b, a); y += lh; };
        const center = (t, b = false) => { line(t, 306, b, 'center'); };

        // Court Header (Front Line)
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

        const subjLines = wordWrap(v('subject') || generateSubject(), 80);
        subjLines.forEach(l => line(l, 72, true));
        y += lh;
        
        line(v('salutation') || 'Respected Sir,');
        line('It is most respectfully submitted as follows:', 108);

        state.clauses.filter(c => cleanText(c)).forEach((c, i) => {
            const lines = wordWrap(c, 75);
            lines.forEach((l, idx) => {
                if (idx === 0) { addT(72, (i + 1) + ')'); line(l, 100); } 
                else { line(l, 100); }
            });
        });
        y += (lh / 2);

        const prayerLines = wordWrap(v('prayer') || generatePrayer(), 75);
        prayerLines.forEach(l => line(l, 100));
        y += lh * 2;

        addT(72, 'Place: ' + (v('place') || '_____'));
        addT(540, 'Submitted By,', true, 'right');
        y += lh;
        addT(72, 'Date: ' + (v('date') || '_____'));
        y += lh * 2.5;

        addT(540, getApplicantText(), true, 'right');
        y += lh;
        addT(540, '(' + (isPlural() ? 'Accused/applicants' : 'Accused/applicant') + ')', false, 'right');
        y += lh * 2;

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
            const scale = 2;
            c.width = 612 * scale;
            c.height = 1008 * scale;
            const ctx = c.getContext('2d');
            
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, c.width, c.height);
            ctx.scale(scale, scale);
            
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

            setFont(true, fontSize + 1);
            v('court').split(/\n/).forEach(t => { write(t.toUpperCase(), 306, 'center', 500); y += lh; });
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
            
            const jpegData = c.toDataURL('image/jpeg', 0.95);
            p.style.transform = oldTrans;
            document.body.classList.remove('exporting');
            
            compilePdfOutput([], jpegData, 'Exemption_Application_Scanned.pdf');
        }, 100);
    }

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
                const tw = (o.t.length * o.size * 0.45);
                let x = o.x;
                if (o.align === 'center') x -= tw / 2;
                if (o.align === 'right') x -= tw;
                content += 'BT /F' + (o.bold ? '2' : '1') + ' ' + o.size + ' Tf ' + x + ' ' + (1008 - o.y) + ' Td (' + escapePdf(o.t) + ') Tj ET\n';
            });
        }

        const contentU8 = new Uint8Array(content.length);
        for(let i=0; i<content.length; i++) contentU8[i] = content.charCodeAt(i) & 255;

        objs.push('<< /Length ' + contentU8.length + ' >>\nstream\n' + content + '\nendstream');
        
        const cId = objs.length, pId = cId + 1, psId = cId + 2, catId = cId + 3, f1Id = cId + 4, f2Id = cId + 5;
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

        objs.forEach((o, i) => { xref.push(pdfData.length); pdfData += (i + 1) + ' 0 obj\n' + o + '\nendobj\n'; });
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
        id('formTab').classList.toggle('active', v !== 'preview');
        id('previewTab').classList.toggle('active', v === 'preview');
        fitPreview();
    }

    function fitPreview() {
        const isDesktop = window.innerWidth >= 900;
        const availWidth = isDesktop ? window.innerWidth - 450 - 48 : window.innerWidth - 32;
        state.zoom = Math.min(1, Math.max(0.2, availWidth / 612));
        document.documentElement.style.setProperty('--z', state.zoom);
    }

    // --- HTML Template (Utilitarian, Professional) ---
    function getHTML() {
        return [
            '<div class="app-header">',
            '    <div class="app-title">PDFWriter <span>Legal</span></div>',
            '    <div class="mobile-tabs">',
            '        <button id="formTab" class="active">Editor</button>',
            '        <button id="previewTab">Preview</button>',
            '    </div>',
            '</div>',
            '',
            '<div class="layout">',
            '    <div class="panel form-panel">',
            '        ',
            '        <div class="section-title">Document Setup</div>',
            '        <div class="grid two">',
            '            <div>',
            '                <label>Template Proforma</label>',
            '                <select id="proforma" class="field"></select>',
            '            </div>',
            '            <div>',
            '                <label>Line Spacing</label>',
            '                <select id="layoutStyle" class="field">',
            '                    <option value="standard">Standard Legal (13pt)</option>',
            '                    <option value="compact">Compact (12pt)</option>',
            '                </select>',
            '            </div>',
            '        </div>',
            '        <label class="checkbox-label" style="margin-top:12px;">',
            '            <input type="checkbox" id="stampSpace" checked> Show Court Fee Stamp indicator',
            '        </label>',
            '',
            '        <div class="section-title">Case Information</div>',
            '        <label>Court Presiding Officer</label>',
            '        <select id="court" class="field"></select>',
            '        ',
            '        <div class="grid two">',
            '            <div><label>State / Complainant</label><input id="leftParty" class="field" placeholder="State"></div>',
            '            <div><label>Accused / Respondent</label><input id="rightParty" class="field" placeholder="Accused Name"></div>',
            '        </div>',
            '',
            '        <label>Proceeding Type</label>',
            '        <select id="caseMode" class="field">',
            '            <option value="fir">FIR / State Case</option>',
            '            <option value="appeal">Complaint / Appeal</option>',
            '        </select>',
            '',
            '        <div id="firFields" class="grid two">',
            '            <div><label>FIR No.</label><input id="firNumber" class="field"></div>',
            '            <div><label>Date</label><input id="firDate" class="field"></div>',
            '            <div><label>Sections</label><input id="sections" class="field"></div>',
            '            <div><label>Police Station</label><input id="policeStation" class="field"></div>',
            '        </div>',
            '',
            '        <div id="appealFields" class="grid two hidden">',
            '            <div><label>Case Type</label><input id="caseType" class="field" placeholder="e.g. NACT"></div>',
            '            <div><label>Number/Year</label><input id="caseNumber" class="field" placeholder="e.g. 123/2024"></div>',
            '        </div>',
            '',
            '        <div class="section-title">Applicants <button id="addApplicant" class="btn text-btn">Add Person</button></div>',
            '        <div id="applicantBox" class="stack"></div>',
            '',
            '        <div class="section-title">Draft Body</div>',
            '        <div class="grid two">',
            '            <div><label>Reason for Absence</label><input id="reason" class="field" placeholder="illness"></div>',
            '            <div><label>Stage of Case</label><input id="caseStage" class="field" placeholder="evidence"></div>',
            '        </div>',
            '        <label>Subject</label>',
            '        <textarea id="subject" class="field" rows="2"></textarea>',
            '        ',
            '        <label>Clauses</label>',
            '        <div id="clauseBox" class="stack"></div>',
            '        <button id="addClause" class="btn outline-btn" style="width:100%; margin-top:8px;">+ Add Custom Clause</button>',
            '',
            '        <label style="margin-top:16px;">Prayer</label>',
            '        <textarea id="prayer" class="field" rows="3"></textarea>',
            '',
            '        <div class="section-title">Signatures & Execution</div>',
            '        <div class="grid two">',
            '            <div><label>Place</label><input id="place" class="field" placeholder="Fazilka" value="Fazilka"></div>',
            '            <div><label>Date</label><input id="date" class="field" placeholder="DD.MM.YYYY"></div>',
            '            <div>',
            '                <label>Salutation</label>',
            '                <select id="salutation" class="field">',
            '                    <option>Respected Sir,</option>',
            '                    <option>Respected Madam,</option>',
            '                </select>',
            '            </div>',
            '            <div>',
            '                <label>Filing Counsel</label>',
            '                <select id="counsel" class="field"></select>',
            '            </div>',
            '        </div>',
            '        <label class="checkbox-label" style="margin-top:12px; margin-bottom: 30px;">',
            '            <input id="duty" type="checkbox"> Append (Duty) to Counsel Title',
            '        </label>',
            '    </div>',
            '',
            '    <div class="panel preview-panel">',
            '        <div class="paper-stage">',
            '            <div id="paper" class="paper"></div>',
            '        </div>',
            '    </div>',
            '</div>',
            '',
            '<div class="action-bar">',
            '    <button id="scanPdfBtn" class="btn secondary">Scanned PDF</button>',
            '    <button id="realPdfBtn" class="btn primary">Export Raw PDF</button>',
            '</div>'
        ].join('\n');
    }

    // --- CSS Template (Native/System UI) ---
    function getCSS() {
        return [
            ':root { --z: 0.5; --bg: #f3f3f3; --surface: #ffffff; --border: #d1d1d1; --text: #1a1a1a; --text-muted: #555555; --accent: #0060df; }',
            '* { box-sizing: border-box; margin: 0; padding: 0; }',
            'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: var(--bg); color: var(--text); overflow: hidden; height: 100dvh; display: flex; flex-direction: column; }',
            '',
            '.app-header { background: #e0e0e0; border-bottom: 1px solid var(--border); padding: 0 16px; height: 48px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }',
            '.app-title { font-weight: 700; font-size: 15px; letter-spacing: -0.3px; }',
            '.app-title span { font-weight: 400; color: var(--text-muted); }',
            '',
            '.mobile-tabs { display: flex; gap: 4px; }',
            '.mobile-tabs button { background: transparent; border: 1px solid transparent; padding: 4px 12px; border-radius: 4px; font-size: 13px; font-weight: 600; color: var(--text-muted); cursor: pointer; }',
            '.mobile-tabs button.active { background: var(--surface); border-color: var(--border); color: var(--text); box-shadow: 0 1px 2px rgba(0,0,0,0.05); }',
            '',
            '.layout { display: flex; flex: 1; overflow: hidden; }',
            '.panel { overflow-y: auto; height: 100%; -webkit-overflow-scrolling: touch; }',
            '.form-panel { background: var(--surface); padding: 16px 20px 80px 20px; flex: 1; border-right: 1px solid var(--border); }',
            '.preview-panel { background: #c8c8c8; flex: 1; position: relative; }',
            '',
            '.section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); border-bottom: 1px solid #e5e5e5; padding-bottom: 6px; margin: 24px 0 16px 0; display: flex; justify-content: space-between; align-items: center; }',
            '.section-title:first-child { margin-top: 4px; }',
            '',
            '.grid { display: grid; gap: 12px; }',
            '.grid.two { grid-template-columns: 1fr; }',
            '.stack { display: flex; flex-direction: column; gap: 12px; }',
            '',
            'label { display: block; font-size: 12px; font-weight: 600; color: var(--text); margin: 10px 0 4px 0; }',
            '.field { width: 100%; background: #ffffff; border: 1px solid #a0a0a0; border-radius: 3px; padding: 8px 10px; font-size: 13px; font-family: inherit; color: var(--text); outline: none; transition: border-color 0.1s; box-shadow: inset 0 1px 2px rgba(0,0,0,0.02); }',
            '.field:focus { border-color: var(--accent); box-shadow: 0 0 0 2px rgba(0, 96, 223, 0.2); }',
            'select.field { appearance: none; background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E"); background-repeat: no-repeat; background-position: right 10px top 50%; background-size: 10px auto; padding-right: 28px; }',
            'textarea.field { resize: vertical; min-height: 50px; line-height: 1.4; }',
            '',
            '.btn { border: none; border-radius: 4px; font-weight: 600; font-size: 13px; cursor: pointer; text-align: center; display: inline-flex; justify-content: center; align-items: center; min-height: 36px; padding: 0 16px; }',
            '.btn.primary { background: var(--accent); color: white; border: 1px solid #004ba8; }',
            '.btn.primary:active { background: #004ba8; }',
            '.btn.secondary { background: #f3f3f3; color: var(--text); border: 1px solid var(--border); }',
            '.btn.secondary:active { background: #e5e5e5; }',
            '.btn.outline-btn { background: transparent; border: 1px dashed var(--border); color: var(--text-muted); }',
            '.btn.text-btn { background: transparent; color: var(--accent); min-height: auto; padding: 0; font-size: 12px; font-weight: 600; }',
            '.btn.ghost { background: transparent; color: #d32f2f; min-height: 36px; width: 36px; padding: 0; border: 1px solid transparent; font-size: 14px; }',
            '.btn.ghost:hover { background: #ffebee; border-color: #ffcdd2; }',
            '',
            '.applicant-row, .clause-row { display: flex; gap: 8px; align-items: flex-start; padding: 10px; background: #fafafa; border: 1px solid #eaeaea; border-radius: 4px; }',
            '.clause-row .clause-num { font-weight: 600; color: var(--text-muted); padding-top: 8px; font-size: 13px; width: 20px; text-align: right; }',
            '',
            '.checkbox-label { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; cursor: pointer; margin: 0; }',
            '.hidden { display: none !important; }',
            '',
            '.paper-stage { padding: 24px; display: flex; justify-content: center; transform-origin: top center; min-height: 100%; }',
            '.paper { background: white; width: 612px; min-height: 1008px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); transform: scale(var(--z)); transform-origin: top center; }',
            '',
            '/* PDF Legal Print Formatting */',
            '.paper-inner { padding: 72px; font-family: "Times New Roman", Times, serif; color: #000; position: relative; }',
            '.stamp-box { position: absolute; top: 30px; right: 40px; width: 100px; height: 120px; border: 1px solid #000; color: #000; display: flex; align-items: center; justify-content: center; text-align: center; font-family: sans-serif; font-size: 10px; font-weight: bold; background: repeating-linear-gradient(45deg, #fff, #fff 5px, #f4f4f4 5px, #f4f4f4 10px); }',
            '.court { text-align: center; font-weight: bold; text-transform: uppercase; margin-bottom: 24px; position: relative; z-index: 2; }',
            '.case-grid { margin-bottom: 24px; font-weight: bold; position: relative; }',
            '.case-left { width: 45%; float: left; }',
            '.case-right { width: 45%; float: right; text-align: right; }',
            '.case-vs { position: absolute; left: 50%; transform: translateX(-50%); text-align: center; }',
            '.case-grid::after { content: ""; display: table; clear: both; }',
            '.fir-info, .case-info { text-align: center; font-weight: normal; margin-top: 12px; clear: both; }',
            '',
            '.subject { font-weight: bold; text-decoration: underline; text-underline-offset: 3px; margin: 24px 0; text-align: justify; }',
            '.salutation { margin-bottom: 12px; }',
            '.intro { margin-bottom: 16px; margin-left: 36px; }',
            '',
            '.clause { display: flex; margin-bottom: 12px; }',
            '.clause .clause-num { width: 28px; flex-shrink: 0; font-weight: normal; color: #000; }',
            '.clause .clause-text { text-align: justify; }',
            '',
            '.prayer { margin: 24px 0 40px 36px; text-align: justify; }',
            '',
            '.sig-grid { display: flex; justify-content: space-between; margin-bottom: 40px; }',
            '.sig-right { text-align: right; }',
            '.sig-name { display: inline-block; font-weight: bold; text-align: center; }',
            '',
            '.counsel-label { text-align: center; margin-bottom: 30px; }',
            '.counsel-details { text-align: center; }',
            '',
            '.action-bar { background: var(--surface); border-top: 1px solid var(--border); padding: 12px 16px; display: flex; justify-content: flex-end; gap: 12px; z-index: 20; flex-shrink: 0; box-shadow: 0 -2px 10px rgba(0,0,0,0.03); }',
            '',
            '.exporting .paper { transform: none !important; box-shadow: none !important; }',
            '',
            '@media (max-width: 899px) {',
            '    .view-preview .form-panel { display: none; }',
            '    .view-form .preview-panel { display: none; }',
            '    .action-bar { justify-content: space-between; padding: 12px; }',
            '    .btn { min-height: 44px; flex: 1; } /* Mobile touch target size */',
            '}',
            '@media (min-width: 900px) {',
            '    .mobile-tabs { display: none; }',
            '    .form-panel { max-width: 450px; }',
            '    .grid.two { grid-template-columns: 1fr 1fr; }',
            '}'
        ].join('\n');
    }

    // Init
    document.addEventListener('DOMContentLoaded', renderApp);
})();
`;
