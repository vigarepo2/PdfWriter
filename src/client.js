export const CLIENT_JS = `
(function(){
  'use strict';

  const state = {
    people: [{ name: '', role: 'Accused/applicant' }],
    clauses: [],
    editMode: false,
    manualDirty: false,
    zoom: 0.44,
    lastSelection: null
  };

  const ids = ['court','caseLeft','caseRight','fir','firDate','sections','policeStation','subject','prayer','place','date','counsel','duty'];
  const $ = (id) => document.getElementById(id);
  const value = (id) => ($(id)?.value || '').trim();
  const escapeHtml = (text) => String(text || '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const clean = (text) => String(text || '').replace(/[.\\s]+$/g, '').trim();

  function namesArray(){ return state.people.map((p) => clean(p.name)).filter(Boolean); }
  function isPlural(){ return namesArray().length > 1; }
  function namesText(){
    const arr = namesArray();
    if (!arr.length) return '';
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return arr[0] + ' and ' + arr[1];
    return arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];
  }
  function applicantLabel(){ return namesText() || clean(value('caseRight')) || 'Accused/applicant'; }
  function defaultSubject(){
    const n = namesText();
    return 'Application for exemption of personal appearance' + (n ? ' of ' + n : '') + '.';
  }
  function defaultPrayer(){
    return 'It is therefore respectfully prayed that, in view of the facts and circumstances stated above, the personal appearance of the ' + (isPlural() ? 'above-named accused/applicants' : 'accused/applicant') + ' may kindly be exempted for today only.';
  }
  function attendanceClause(){
    const n = namesText();
    if (!n) return "That the accused/applicant is unable to appear before this Hon'ble Court due to illness.";
    return 'That ' + (isPlural() ? 'the accused/applicants, namely ' + n + ', are' : 'the accused/applicant ' + n + ' is') + " unable to appear before this Hon'ble Court due to illness.";
  }
  function defaultClauses(){
    return [
      "That the above noted case is pending before this Hon'ble Court and is fixed for today.",
      attendanceClause(),
      'That the absence is neither willful nor intentional, but due to the reason stated above.'
    ];
  }

  function setStatus(text){ const el = $('statusText'); if (el) el.textContent = text; }
  function fitZoom(){
    state.zoom = Math.min(1, Math.max(0.34, (window.innerWidth - 28) / 816));
    document.documentElement.style.setProperty('--zoom', state.zoom.toFixed(3));
  }
  function zoom(delta){
    state.zoom = Math.min(1.35, Math.max(0.30, state.zoom + delta));
    document.documentElement.style.setProperty('--zoom', state.zoom.toFixed(3));
  }
  function showView(view){
    document.body.classList.toggle('view-editor', view === 'editor');
    document.body.classList.toggle('view-preview', view === 'preview');
    $('tabEditor')?.classList.toggle('active', view === 'editor');
    $('tabPreview')?.classList.toggle('active', view === 'preview');
    fitZoom();
  }

  function renderPeople(){
    const box = $('peopleBox');
    box.innerHTML = '';
    state.people.forEach((person, index) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = '<div class="grid two"><div><label>Name ' + (index + 1) + '</label><input class="field person-name" data-index="' + index + '" placeholder="Accused/applicant name" value="' + escapeHtml(person.name) + '"></div><div><label>Role</label><input class="field person-role" data-index="' + index + '" value="' + escapeHtml(person.role || 'Accused/applicant') + '"></div></div><div class="card-actions"><button class="btn secondary person-up" data-index="' + index + '">Up</button><button class="btn secondary person-down" data-index="' + index + '">Down</button><button class="btn danger person-delete" data-index="' + index + '">Delete</button></div>';
      box.appendChild(card);
    });
  }

  function renderClauses(){
    const box = $('clauseBox');
    box.innerHTML = '';
    state.clauses.forEach((clause, index) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = '<textarea class="field area clause-text" data-index="' + index + '">' + escapeHtml(clause) + '</textarea><div class="card-actions"><button class="btn secondary clause-up" data-index="' + index + '">Up</button><button class="btn secondary clause-down" data-index="' + index + '">Down</button><button class="btn danger clause-delete" data-index="' + index + '">Delete</button></div>';
      box.appendChild(card);
    });
  }

  function resetText(){
    $('subject').value = defaultSubject();
    $('prayer').value = defaultPrayer();
    state.clauses = defaultClauses();
    renderClauses();
    renderDocument(true);
  }

  function counselParts(){
    const parts = value('counsel').split('|');
    let line = parts[1] || '';
    if ($('duty').checked) line = line.replace(/\\.?$/,'') + ' (Duty).';
    return { name: parts[0] || '', line };
  }

  function firHtml(){
    const parts = [];
    if (value('fir') || value('firDate')) parts.push('FIR No. ' + escapeHtml(value('fir') || '_____') + (value('firDate') ? ' dated ' + escapeHtml(value('firDate')) : ''));
    if (value('sections')) parts.push('U/s ' + escapeHtml(value('sections')));
    if (value('policeStation')) parts.push('PS ' + escapeHtml(value('policeStation')));
    return parts.join(',<br>');
  }

  function clausesHtml(){
    let count = 1;
    return state.clauses.filter((c) => clean(c)).map((clause) => '<table class="clause-table"><tr><td>' + (count++) + ')</td><td>' + escapeHtml(clause) + '</td></tr></table>').join('');
  }

  function renderDocument(force = false){
    if (state.manualDirty && !force) {
      setStatus('Manual edit active. Use Rebuild preview to overwrite manual changes.');
      return;
    }
    const counsel = counselParts();
    const pluralLabel = isPlural() ? 'Accused/applicants' : 'Accused/applicant';
    $('paper').innerHTML = '<div class="paper-inner"><div class="court">' + escapeHtml(value('court')) + '</div><div class="stamp"></div><table class="case-table"><tr><td class="case-left">' + escapeHtml(value('caseLeft') || 'State') + '</td><td class="case-mid">v/s</td><td class="case-right">' + escapeHtml(value('caseRight') || 'Accused') + '</td></tr><tr><td></td><td></td><td class="fir-block">' + firHtml() + '</td></tr></table><div class="subject">' + escapeHtml(value('subject') || defaultSubject()) + '</div><div style="margin-bottom:14px">Respected Sir,</div><div style="margin-bottom:15px;text-indent:38px">It is submitted as follows:</div>' + clausesHtml() + '<div class="prayer">' + escapeHtml(value('prayer') || defaultPrayer()) + '</div><table class="signature-table"><tr><td>Place: ' + escapeHtml(value('place') || '_____') + '<br>Date: ' + escapeHtml(value('date') || '_____') + '</td><td class="signature-right">Submitted By<br><br><br><span class="signature-name"><b>' + escapeHtml(applicantLabel()) + '</b><br>(' + pluralLabel + ')</span></td></tr></table><div class="counsel-block">Through Counsel<br><br><br><b>' + escapeHtml(counsel.name) + '</b><br>' + escapeHtml(counsel.line) + '</div></div>';
    state.manualDirty = false;
    setStatus('Preview generated. PDF export matches this page.');
  }

  function addPerson(){ state.people.push({ name: '', role: 'Accused/applicant' }); renderPeople(); resetText(); }
  function deletePerson(index){ state.people.splice(index, 1); if (!state.people.length) state.people.push({ name: '', role: 'Accused/applicant' }); renderPeople(); resetText(); }
  function movePerson(index, delta){ const next = index + delta; if (next < 0 || next >= state.people.length) return; [state.people[index], state.people[next]] = [state.people[next], state.people[index]]; renderPeople(); resetText(); }
  function addClause(){ state.clauses.push(''); renderClauses(); renderDocument(); }
  function deleteClause(index){ state.clauses.splice(index, 1); renderClauses(); renderDocument(); }
  function moveClause(index, delta){ const next = index + delta; if (next < 0 || next >= state.clauses.length) return; [state.clauses[index], state.clauses[next]] = [state.clauses[next], state.clauses[index]]; renderClauses(); renderDocument(); }

  function saveSelection(){ const sel = window.getSelection(); if (sel && sel.rangeCount) state.lastSelection = sel.getRangeAt(0); }
  function restoreSelection(){ if (!state.lastSelection) return; const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(state.lastSelection); }
  function exec(command, value = null){ restoreSelection(); document.execCommand(command, false, value); state.manualDirty = true; $('paper').focus(); saveSelection(); }
  function toggleEditMode(){
    state.editMode = !state.editMode;
    const paper = $('paper');
    paper.contentEditable = state.editMode ? 'true' : 'false';
    paper.classList.toggle('editing', state.editMode);
    $('editToggle').classList.toggle('active', state.editMode);
    showView('preview');
    if (state.editMode) { paper.focus(); setStatus('Manual edit mode: select text and use toolbar.'); }
    else setStatus('Manual edit mode off.');
  }

  function insertHtml(html){ restoreSelection(); document.execCommand('insertHTML', false, html); state.manualDirty = true; saveSelection(); }
  function insertPageBreak(){ insertHtml('<div style="page-break-after:always;height:24px;border-top:1px dashed #999;margin:24px 0"></div>'); }
  function insertSignatureLine(){ insertHtml('<div style="margin-top:24px;border-bottom:1px solid #000;width:220px;height:22px"></div>'); }
  function markdownToHtml(md){
    return escapeHtml(md).split(/\n{2,}/).map((block) => '<p>' + block.replace(/^### (.*)$/gm,'<b>$1</b>').replace(/^## (.*)$/gm,'<b>$1</b>').replace(/^# (.*)$/gm,'<b>$1</b>').replace(/\*\*(.*?)\*\*/g,'<b>$1</b>').replace(/\*(.*?)\*/g,'<i>$1</i>').replace(/__(.*?)__/g,'<u>$1</u>').replace(/\n/g,'<br>') + '</p>').join('');
  }
  function applyMarkdown(replace){
    const html = markdownToHtml($('markdownText').value);
    if (replace) $('paper').innerHTML = '<div class="paper-inner">' + html + '</div>';
    else insertHtml(html);
    state.manualDirty = true;
  }
  function findReplace(){
    const find = $('findText').value;
    if (!find) return;
    const replace = $('replaceText').value;
    $('paper').innerHTML = $('paper').innerHTML.split(find).join(replace);
    state.manualDirty = true;
  }

  async function exportPdf(){
    if (!window.jspdf || !window.html2canvas) { alert('PDF engine is loading. Try again.'); return; }
    const button = $('downloadPdf');
    button.disabled = true;
    button.textContent = 'Preparing PDF...';
    const paper = $('paper');
    const oldTransform = paper.style.transform;
    const oldShadow = paper.style.boxShadow;
    document.body.classList.add('exporting');
    paper.style.transform = 'none';
    paper.style.boxShadow = 'none';
    await new Promise((resolve) => setTimeout(resolve, 120));
    try {
      const canvas = await html2canvas(paper, { scale: 3, backgroundColor: '#ffffff', useCORS: true, logging: false });
      const pdf = new jspdf.jsPDF({ orientation: 'portrait', unit: 'in', format: 'legal' });
      const pageW = 8.5, pageH = 14;
      const pagePxH = Math.floor(canvas.width * pageH / pageW);
      const pageCanvas = document.createElement('canvas');
      const ctx = pageCanvas.getContext('2d');
      pageCanvas.width = canvas.width;
      pageCanvas.height = pagePxH;
      let y = 0, page = 0;
      while (y < canvas.height) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0,0,pageCanvas.width,pageCanvas.height);
        ctx.drawImage(canvas,0,y,canvas.width,pagePxH,0,0,canvas.width,pagePxH);
        if (page) pdf.addPage('legal','portrait');
        pdf.addImage(pageCanvas.toDataURL('image/jpeg', .98), 'JPEG', 0, 0, pageW, pageH);
        y += pagePxH; page++;
      }
      pdf.save('Application_' + applicantLabel().replace(/[^a-z0-9]+/gi,'_').replace(/^_+|_+$/g,'') + '.pdf');
    } catch (error) {
      alert('PDF could not be generated: ' + error.message);
    } finally {
      paper.style.transform = oldTransform;
      paper.style.boxShadow = oldShadow;
      document.body.classList.remove('exporting');
      button.disabled = false;
      button.textContent = 'Download PDF';
    }
  }

  function collectState(){
    const fields = {};
    ids.forEach((id) => { const el = $(id); fields[id] = el.type === 'checkbox' ? el.checked : el.value; });
    return { format:'PdfWriterTemplate', version:5, fields, people: state.people, clauses: state.clauses, paperHTML: $('paper').innerHTML, manualDirty: state.manualDirty };
  }
  function applyState(data){
    if (!data || data.format !== 'PdfWriterTemplate') throw new Error('Invalid template file.');
    state.people = Array.isArray(data.people) ? data.people : [{ name:'', role:'Accused/applicant' }];
    state.clauses = Array.isArray(data.clauses) ? data.clauses : [];
    renderPeople(); renderClauses();
    Object.entries(data.fields || {}).forEach(([id, val]) => { const el = $(id); if (!el) return; if (el.type === 'checkbox') el.checked = !!val; else el.value = val; });
    if (data.paperHTML) { $('paper').innerHTML = data.paperHTML; state.manualDirty = !!data.manualDirty; }
    else renderDocument(true);
    setStatus('Template imported.');
  }
  function exportTemplate(){
    const blob = new Blob([JSON.stringify(collectState(), null, 2)], { type:'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'pdfwriter-template.pwt.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }
  function importTemplate(file){
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { try { applyState(JSON.parse(reader.result)); } catch (error) { alert(error.message); } };
    reader.readAsText(file);
  }
  function saveLocal(){ localStorage.setItem('pdfwriter.autosave', JSON.stringify(collectState())); setStatus('Draft saved in this browser.'); }
  function loadLocal(){ const raw = localStorage.getItem('pdfwriter.autosave'); if (!raw) return alert('No local saved draft found.'); applyState(JSON.parse(raw)); }

  function bindEvents(){
    $('tabEditor').onclick = () => showView('editor');
    $('tabPreview').onclick = () => showView('preview');
    $('previewButton').onclick = () => showView('preview');
    $('optionsButton').onclick = () => $('templateTools').classList.toggle('hidden');
    $('addPerson').onclick = addPerson;
    $('addClause').onclick = addClause;
    $('resetText').onclick = resetText;
    $('rebuildPreview').onclick = () => renderDocument(true);
    $('downloadPdf').onclick = exportPdf;
    $('previewPdf').onclick = exportPdf;
    $('fitZoom').onclick = fitZoom;
    $('zoomIn').onclick = () => zoom(.06);
    $('zoomOut').onclick = () => zoom(-.06);
    $('editToggle').onclick = toggleEditMode;
    $('exportTemplate').onclick = exportTemplate;
    $('importTemplate').onclick = () => $('templateFile').click();
    $('templateFile').onchange = (e) => importTemplate(e.target.files[0]);
    $('saveLocal').onclick = saveLocal;
    $('loadLocal').onclick = loadLocal;
    $('pageBreak').onclick = insertPageBreak;
    $('signatureLine').onclick = insertSignatureLine;
    $('applyMarkdown').onclick = () => applyMarkdown(false);
    $('replaceMarkdown').onclick = () => applyMarkdown(true);
    $('findReplace').onclick = findReplace;

    document.querySelectorAll('[data-command]').forEach((button) => button.onclick = () => exec(button.dataset.command));
    document.querySelectorAll('[data-command-value]').forEach((control) => control.onchange = () => exec(control.dataset.commandValue, control.value));
    $('textColor').onchange = (e) => exec('foreColor', e.target.value);
    $('highlightColor').onchange = (e) => exec('hiliteColor', e.target.value);
    $('paper').addEventListener('keyup', saveSelection);
    $('paper').addEventListener('mouseup', saveSelection);
    $('paper').addEventListener('input', () => { state.manualDirty = true; setStatus('Manual preview edits saved.'); });

    ids.forEach((id) => {
      const el = $(id);
      el.addEventListener('input', () => renderDocument());
      el.addEventListener('change', () => renderDocument());
    });

    $('peopleBox').addEventListener('input', (e) => {
      const index = Number(e.target.dataset.index);
      if (e.target.classList.contains('person-name')) { state.people[index].name = e.target.value; resetText(); }
      if (e.target.classList.contains('person-role')) { state.people[index].role = e.target.value; renderDocument(); }
    });
    $('peopleBox').addEventListener('click', (e) => {
      const index = Number(e.target.dataset.index);
      if (e.target.classList.contains('person-delete')) deletePerson(index);
      if (e.target.classList.contains('person-up')) movePerson(index, -1);
      if (e.target.classList.contains('person-down')) movePerson(index, 1);
    });
    $('clauseBox').addEventListener('input', (e) => {
      if (e.target.classList.contains('clause-text')) { state.clauses[Number(e.target.dataset.index)] = e.target.value; renderDocument(); }
    });
    $('clauseBox').addEventListener('click', (e) => {
      const index = Number(e.target.dataset.index);
      if (e.target.classList.contains('clause-delete')) deleteClause(index);
      if (e.target.classList.contains('clause-up')) moveClause(index, -1);
      if (e.target.classList.contains('clause-down')) moveClause(index, 1);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderPeople();
    resetText();
    bindEvents();
    fitZoom();
    window.addEventListener('resize', fitZoom);
  });
})();
`;
