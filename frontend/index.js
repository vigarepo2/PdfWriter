export const FRONTEND_JS = String.raw`
(function() {
  'use strict';

  var PAGE = { w: 612, h: 1008, ml: 72, mr: 72, mt: 72, mb: 72 };

  var CONFIG = {
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
      { id: 'standard', name: 'Standard Exemption', reason: 'illness', stage: 'the purpose fixed' },
      { id: 'medical', name: 'Medical Emergency', reason: 'a sudden medical emergency', stage: 'the purpose fixed' },
      { id: 'hospital', name: 'Hospitalization', reason: 'hospitalization and medical treatment', stage: 'the purpose fixed' },
      { id: 'bereavement', name: 'Bereavement', reason: 'a bereavement in the family', stage: 'the purpose fixed' },
      { id: 'senior', name: 'Senior Citizen Health Constraint', reason: 'age-related health constraints', stage: 'the purpose fixed' },
      { id: 'travel', name: 'Unavoidable Travel Constraint', reason: 'unavoidable circumstances beyond control', stage: 'the purpose fixed' }
    ]
  };

  var ICON_PATHS = {
    logo: '<path d="M12 3l7 4v10l-7 4-7-4V7l7-4z"></path><path d="M9 9h6M9 13h6M9 17h3"></path>',
    settings: '<path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5z"></path><path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.05.05a2.18 2.18 0 1 1-3.08 3.08l-.05-.05a1.8 1.8 0 0 0-1.98-.36 1.8 1.8 0 0 0-1.1 1.66V21a2.18 2.18 0 1 1-4.36 0v-.08a1.8 1.8 0 0 0-1.1-1.66 1.8 1.8 0 0 0-1.98.36l-.05.05a2.18 2.18 0 1 1-3.08-3.08l.05-.05A1.8 1.8 0 0 0 3.4 15a1.8 1.8 0 0 0-1.66-1.1H1.7a2.18 2.18 0 1 1 0-4.36h.08A1.8 1.8 0 0 0 3.4 8a1.8 1.8 0 0 0-.36-1.98l-.05-.05A2.18 2.18 0 1 1 6.07 2.9l.05.05A1.8 1.8 0 0 0 8.1 3.3a1.8 1.8 0 0 0 1.1-1.66V1.6a2.18 2.18 0 1 1 4.36 0v.08a1.8 1.8 0 0 0 1.1 1.66 1.8 1.8 0 0 0 1.98-.36l.05-.05a2.18 2.18 0 1 1 3.08 3.08l-.05.05A1.8 1.8 0 0 0 20.6 8a1.8 1.8 0 0 0 1.66 1.1h.08a2.18 2.18 0 1 1 0 4.36h-.08A1.8 1.8 0 0 0 19.4 15z"></path>',
    case: '<path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H9l1.5 2H18a2 2 0 0 1 2 2v8.5A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5z"></path><path d="M4 10h16"></path>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
    text: '<path d="M5 4h14"></path><path d="M12 4v16"></path><path d="M8 20h8"></path>',
    sign: '<path d="M3 20h18"></path><path d="M7 16c3-7 5-10 6-9 1 .8-.5 4.4-1.5 6.2 2.8-3.1 5.1-4.4 6.2-3.4 1.2 1.1-.4 3.5-2.7 6.2"></path>',
    plus: '<path d="M12 5v14M5 12h14"></path>',
    trash: '<path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="M19 6l-1 15H6L5 6"></path><path d="M10 11v6M14 11v6"></path>',
    download: '<path d="M12 3v12"></path><path d="M7 10l5 5 5-5"></path><path d="M5 21h14"></path>',
    scan: '<path d="M4 7V5a1 1 0 0 1 1-1h3"></path><path d="M16 4h3a1 1 0 0 1 1 1v2"></path><path d="M20 17v2a1 1 0 0 1-1 1h-3"></path><path d="M8 20H5a1 1 0 0 1-1-1v-2"></path><path d="M7 12h10"></path>',
    refresh: '<path d="M21 12a9 9 0 0 1-15.4 6.4L3 16"></path><path d="M3 16h6"></path><path d="M3 12A9 9 0 0 1 18.4 5.6L21 8"></path><path d="M15 8h6"></path>',
    check: '<path d="M20 6L9 17l-5-5"></path>',
    alert: '<path d="M12 9v4"></path><path d="M12 17h.01"></path><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"></path>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"></path><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>',
    edit: '<path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path>'
  };

  var state = {
    zoom: 0.5,
    view: 'editor',
    people: [{ name: '', role: 'Accused/applicant' }],
    clauses: [],
    manual: { subject: false, prayer: false, clauses: false },
    busy: false,
    toastTimer: null,
    fitTimer: null
  };

  function $(id) {
    return document.getElementById(id);
  }

  function icon(name) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (ICON_PATHS[name] || ICON_PATHS.check) + '</svg>';
  }

  function cleanText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function esc(value) {
    var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(value == null ? '' : value).replace(/[&<>"']/g, function(c) { return map[c]; });
  }

  function val(id) {
    var el = $(id);
    return el ? cleanText(el.value) : '';
  }

  function setVal(id, value) {
    var el = $(id);
    if (el) el.value = value == null ? '' : String(value);
  }

  function formatDate(date) {
    var d = String(date.getDate()).padStart(2, '0');
    var m = String(date.getMonth() + 1).padStart(2, '0');
    return d + '.' + m + '.' + date.getFullYear();
  }

  function joinNames(names) {
    var list = names.map(cleanText).filter(Boolean);
    if (!list.length) return '';
    if (list.length === 1) return list[0];
    if (list.length === 2) return list[0] + ' and ' + list[1];
    return list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1];
  }

  function applicantNames() {
    return state.people.map(function(p) { return cleanText(p.name); }).filter(Boolean);
  }

  function isPlural() {
    return applicantNames().length > 1;
  }

  function getApplicantText() {
    return joinNames(applicantNames()) || val('rightParty') || 'Accused/applicant';
  }

  function getRoleText() {
    if (isPlural()) return 'Accused/applicants';
    var first = state.people[0] || {};
    return cleanText(first.role) || 'Accused/applicant';
  }

  function generateSubject() {
    var name = joinNames(applicantNames()) || val('rightParty');
    return 'Subject: Application for exemption from personal appearance' + (name ? ' of ' + name : '') + '.';
  }

  function generatePrayer() {
    return 'It is, therefore, respectfully prayed that in view of the facts and circumstances mentioned above, the personal appearance of the ' + (isPlural() ? 'above-said accused/applicants' : 'above-said accused/applicant') + ' may kindly be exempted for today only in the interest of justice.';
  }

  function generateDefaultClauses() {
    var stage = val('caseStage') || 'the purpose fixed';
    var reason = val('reason') || 'illness';
    var names = joinNames(applicantNames());
    var plural = isPlural();
    var attendance = names
      ? (plural ? 'the accused/applicants, namely ' + names + ', are unable' : 'the accused/applicant ' + names + ' is unable')
      : 'the accused/applicant is unable';
    var undertaking = plural ? 'the accused/applicants undertake' : 'the accused/applicant undertakes';

    return [
      'That the above-noted case is pending before this Hon\'ble Court and is fixed for today for ' + stage + '.',
      'That ' + attendance + ' to appear before this Hon\'ble Court due to ' + reason + '.',
      'That such absence is neither willful nor intentional, but occasioned solely by the reason stated above.',
      'That no prejudice shall be caused to the opposite party, and ' + undertaking + ' to appear before this Hon\'ble Court on the next date of hearing unless otherwise directed.'
    ];
  }

  function getCaseLines() {
    var lines = [];
    if (val('caseMode') === 'appeal') {
      if (val('caseType')) lines.push(val('caseType'));
      if (val('caseNumber')) lines.push(val('caseNumber'));
      return lines;
    }

    if (val('firNumber') || val('firDate')) {
      lines.push('FIR No. ' + (val('firNumber') || '_____') + (val('firDate') ? ' dated ' + val('firDate') : ''));
    }
    if (val('sections')) lines.push('U/s ' + val('sections'));
    if (val('policeStation')) lines.push('Police Station ' + val('policeStation'));
    return lines;
  }

  function getDocData() {
    var counselParts = (val('counsel') || '').split('|');
    var counselName = cleanText(counselParts[0]);
    var counselTitle = cleanText(counselParts[1]);
    if ($('duty') && $('duty').checked) counselTitle = counselTitle.replace(/\.?\s*$/, '') + ' (Duty).';

    var compact = val('layoutStyle') === 'compact';

    return {
      court: val('court') || CONFIG.courts[0],
      leftParty: val('leftParty') || 'State/Complainant',
      rightParty: val('rightParty') || 'Accused/Respondent',
      caseLines: getCaseLines(),
      subject: val('subject') || generateSubject(),
      salutation: val('salutation') || 'Respected Sir,',
      clauses: state.clauses.map(cleanText).filter(Boolean),
      prayer: val('prayer') || generatePrayer(),
      place: val('place') || '_____',
      date: val('date') || '_____',
      applicantText: getApplicantText(),
      roleText: getRoleText(),
      counselName: counselName,
      counselTitle: counselTitle,
      showStamp: !!($('stampSpace') && $('stampSpace').checked),
      fontSize: compact ? 12 : 13,
      lineHeight: compact ? 17 : 20,
      compact: compact,
      applicantNames: applicantNames()
    };
  }

  function injectStyle() {
    if ($('pdfwriter-style')) return;
    var style = document.createElement('style');
    style.id = 'pdfwriter-style';
    style.textContent = getCSS();
    document.head.appendChild(style);
  }

  function init() {
    injectStyle();
    document.body.classList.add('view-editor');
    $('app').innerHTML = getHTML();
    populateSelects();
    setVal('date', formatDate(new Date()));
    renderApplicants();
    applyProforma(true);
    bindEvents();
    updatePreview();
    requestAnimationFrame(fitPreview);
  }

  function populateSelects() {
    $('proforma').innerHTML = CONFIG.proformas.map(function(item) {
      return '<option value="' + esc(item.id) + '">' + esc(item.name) + '</option>';
    }).join('');

    $('court').innerHTML = CONFIG.courts.map(function(court) {
      return '<option value="' + esc(court) + '">' + esc(court.replace('IN THE COURT OF ', '')) + '</option>';
    }).join('');

    $('counsel').innerHTML = CONFIG.counsels.map(function(counsel) {
      var parts = counsel.split('|');
      var label = parts[0] + ' — ' + (parts[1] || '').replace(', Fazilka.', '');
      return '<option value="' + esc(counsel) + '">' + esc(label) + '</option>';
    }).join('');
  }

  function renderApplicants() {
    $('applicantBox').innerHTML = state.people.map(function(person, index) {
      return [
        '<div class="mini-row person-row">',
        '<div class="row-number">' + (index + 1) + '</div>',
        '<div class="row-fields">',
        '<div><label>Applicant Name</label><input class="field person-name" data-index="' + index + '" value="' + esc(person.name) + '" placeholder="Enter full name" autocomplete="off"></div>',
        '<div><label>Role</label><input class="field person-role" data-index="' + index + '" value="' + esc(person.role) + '" placeholder="Accused/applicant"></div>',
        '</div>',
        '<button type="button" class="icon-button danger delApplicant" data-index="' + index + '" aria-label="Remove applicant">' + icon('trash') + '</button>',
        '</div>'
      ].join('');
    }).join('');
  }

  function renderClauses() {
    $('clauseBox').innerHTML = state.clauses.map(function(clause, index) {
      return [
        '<div class="mini-row clause-row">',
        '<div class="row-number">' + (index + 1) + '</div>',
        '<textarea class="field clause-text" data-index="' + index + '" rows="3">' + esc(clause) + '</textarea>',
        '<button type="button" class="icon-button danger delClause" data-index="' + index + '" aria-label="Remove clause">' + icon('trash') + '</button>',
        '</div>'
      ].join('');
    }).join('');

    if (!state.clauses.length) {
      $('clauseBox').innerHTML = '<div class="empty-state">No clauses added yet. Use the template generator or add a custom clause.</div>';
    }
  }

  function findProforma() {
    var selected = val('proforma');
    return CONFIG.proformas.find(function(item) { return item.id === selected; }) || CONFIG.proformas[0];
  }

  function applyProforma(silent) {
    var p = findProforma();
    setVal('reason', p.reason);
    setVal('caseStage', p.stage);
    regenerateDraft(true);
    if (!silent) showToast('success', 'Template applied and draft refreshed.');
  }

  function regenerateDraft(force) {
    if (force) state.manual = { subject: false, prayer: false, clauses: false };

    if (force || !state.manual.subject) setVal('subject', generateSubject());
    if (force || !state.manual.prayer) setVal('prayer', generatePrayer());

    if (force || !state.manual.clauses) {
      state.clauses = generateDefaultClauses();
      renderClauses();
    }

    updatePreview();
  }

  var measureCanvas = null;
  var measureCtx = null;

  function measureText(text, size, bold) {
    if (!measureCanvas) {
      measureCanvas = document.createElement('canvas');
      measureCtx = measureCanvas.getContext('2d');
    }
    measureCtx.font = (bold ? '700 ' : '400 ') + size + 'px "Times New Roman", Times, serif';
    return measureCtx.measureText(String(text || '')).width;
  }

  function splitLongWord(word, maxWidth, size, bold) {
    var parts = [];
    var current = '';
    for (var i = 0; i < word.length; i += 1) {
      var next = current + word[i];
      if (current && measureText(next, size, bold) > maxWidth) {
        parts.push(current);
        current = word[i];
      } else {
        current = next;
      }
    }
    if (current) parts.push(current);
    return parts;
  }

  function wrapText(text, maxWidth, size, bold) {
    var clean = cleanText(text);
    if (!clean) return [];

    var words = clean.split(' ');
    var lines = [];
    var line = '';

    words.forEach(function(word) {
      if (!line) {
        if (measureText(word, size, bold) > maxWidth) {
          var pieces = splitLongWord(word, maxWidth, size, bold);
          lines = lines.concat(pieces.slice(0, -1));
          line = pieces[pieces.length - 1] || '';
        } else {
          line = word;
        }
        return;
      }

      var candidate = line + ' ' + word;
      if (measureText(candidate, size, bold) <= maxWidth) {
        line = candidate;
      } else {
        lines.push(line);
        if (measureText(word, size, bold) > maxWidth) {
          var more = splitLongWord(word, maxWidth, size, bold);
          lines = lines.concat(more.slice(0, -1));
          line = more[more.length - 1] || '';
        } else {
          line = word;
        }
      }
    });

    if (line) lines.push(line);
    return lines;
  }

  function createLayout() {
    var data = getDocData();
    var pages = [];
    var y = PAGE.mt;

    function current() {
      return pages[pages.length - 1];
    }

    function addTextTo(page, text, anchorX, top, options) {
      var opt = options || {};
      var size = opt.size || data.fontSize;
      var bold = !!opt.bold;
      var align = opt.align || 'left';
      var safe = cleanText(text);
      if (!safe) return;
      var width = measureText(safe, size, bold);
      var left = anchorX;
      if (align === 'center') left -= width / 2;
      if (align === 'right') left -= width;
      page.items.push({ type: 'text', text: safe, x: left, y: top, size: size, bold: bold });
      if (opt.underline) {
        page.items.push({ type: 'line', x1: left, y1: top + size + 2, x2: left + width, y2: top + size + 2, width: 0.75 });
      }
    }

    function addText(text, anchorX, top, options) {
      addTextTo(current(), text, anchorX, top, options);
    }

    function addLine(x1, y1, x2, y2, width) {
      current().items.push({ type: 'line', x1: x1, y1: y1, x2: x2, y2: y2, width: width || 0.75 });
    }

    function addRect(x, top, w, h, width) {
      current().items.push({ type: 'rect', x: x, y: top, w: w, h: h, width: width || 0.75 });
    }

    function addStamp(page) {
      page.items.push({ type: 'rect', x: 484, y: 34, w: 84, h: 72, width: 0.75 });
      addTextTo(page, 'Court Fee', 526, 57, { size: 9, bold: true, align: 'center' });
      addTextTo(page, 'Ticket', 526, 70, { size: 9, bold: true, align: 'center' });
    }

    function newPage() {
      var page = { items: [] };
      pages.push(page);
      y = PAGE.mt;
      if (pages.length === 1 && data.showStamp) addStamp(page);
    }

    function ensure(height) {
      if (y + height > PAGE.h - PAGE.mb && current().items.length) newPage();
    }

    function writeLine(text, options) {
      var opt = options || {};
      var lh = opt.lh || data.lineHeight;
      ensure(lh);
      addText(text, opt.x == null ? PAGE.ml : opt.x, y, opt);
      y += lh;
    }

    function writeWrapped(text, anchorX, maxWidth, options) {
      var opt = options || {};
      var size = opt.size || data.fontSize;
      var bold = !!opt.bold;
      var lh = opt.lh || data.lineHeight;
      var lines = wrapText(text, maxWidth, size, bold);
      lines.forEach(function(line) {
        ensure(lh);
        addText(line, anchorX, y, opt);
        y += lh;
      });
      return lines.length;
    }

    newPage();

    var courtSize = data.fontSize + 0.5;
    var courtWidth = data.showStamp ? 382 : 468;
    data.court.split(/\n/).forEach(function(part) {
      wrapText(part.toUpperCase(), courtWidth, courtSize, true).forEach(function(line) {
        writeLine(line, { x: PAGE.w / 2, align: 'center', bold: true, size: courtSize, lh: data.lineHeight });
      });
    });

    y += 18;

    var leftLines = wrapText(data.leftParty, 200, data.fontSize, true);
    var rightLines = wrapText(data.rightParty, 200, data.fontSize, true);
    var partyRows = Math.max(leftLines.length, rightLines.length, 1);
    ensure(partyRows * data.lineHeight + 12);

    for (var i = 0; i < partyRows; i += 1) {
      if (leftLines[i]) addText(leftLines[i], PAGE.ml, y + i * data.lineHeight, { bold: true });
      if (i === 0) addText('v/s', PAGE.w / 2, y, { bold: true, align: 'center' });
      if (rightLines[i]) addText(rightLines[i], PAGE.w - PAGE.mr, y + i * data.lineHeight, { bold: true, align: 'right' });
    }

    y += partyRows * data.lineHeight + 12;

    data.caseLines.forEach(function(line) {
      writeWrapped(line, PAGE.w / 2, 420, { align: 'center', lh: data.lineHeight - 1 });
    });

    y += data.caseLines.length ? 10 : 6;

    writeWrapped(data.subject, PAGE.ml, PAGE.w - PAGE.ml - PAGE.mr, { bold: true, underline: true });
    y += 12;

    writeLine(data.salutation, { x: PAGE.ml });
    writeLine('It is most respectfully submitted as follows:', { x: PAGE.ml + 36 });
    y += 4;

    data.clauses.forEach(function(clause, index) {
      var lines = wrapText(clause, PAGE.w - 100 - PAGE.mr, data.fontSize, false);
      lines.forEach(function(line, lineIndex) {
        ensure(data.lineHeight);
        if (lineIndex === 0) addText((index + 1) + ')', PAGE.ml, y, {});
        addText(line, 100, y, {});
        y += data.lineHeight;
      });
      y += 4;
    });

    y += 6;

    writeWrapped(data.prayer, PAGE.ml + 36, PAGE.w - PAGE.ml - PAGE.mr - 36, {});
    y += 28;

    ensure(178);

    addText('Place: ' + data.place, PAGE.ml, y, {});
    addText('Submitted By,', PAGE.w - PAGE.mr, y, { bold: true, align: 'right' });
    y += data.lineHeight;

    addText('Date: ' + data.date, PAGE.ml, y, {});
    y += data.lineHeight * 2.5;

    addText(data.applicantText, PAGE.w - PAGE.mr, y, { bold: true, align: 'right' });
    y += data.lineHeight;
    addText('(' + data.roleText + ')', PAGE.w - PAGE.mr, y, { align: 'right' });
    y += data.lineHeight * 2;

    addText('Through Counsel', PAGE.w / 2, y, { align: 'center' });
    y += data.lineHeight * 1.45;

    addText(data.counselName, PAGE.w / 2, y, { bold: true, align: 'center' });
    y += data.lineHeight;
    addText(data.counselTitle, PAGE.w / 2, y, { align: 'center' });

    return { pages: pages, data: data };
  }

  function fmt(num) {
    return String(Math.round(num * 100) / 100);
  }

  function renderPaper(layout) {
    var stage = $('paperStage');
    stage.className = 'paper-stage' + (layout.pages.length > 1 ? ' multi-page' : '');
    stage.innerHTML = layout.pages.map(function(page, pageIndex) {
      var items = page.items.map(function(item) {
        if (item.type === 'text') {
          return '<div class="pdf-text" style="left:' + fmt(item.x) + 'px;top:' + fmt(item.y) + 'px;font-size:' + fmt(item.size) + 'px;font-weight:' + (item.bold ? '700' : '400') + ';">' + esc(item.text) + '</div>';
        }
        if (item.type === 'line') {
          var width = Math.max(0, item.x2 - item.x1);
          return '<div class="pdf-line" style="left:' + fmt(item.x1) + 'px;top:' + fmt(item.y1) + 'px;width:' + fmt(width) + 'px;border-top-width:' + fmt(item.width) + 'px;"></div>';
        }
        if (item.type === 'rect') {
          return '<div class="pdf-rect" style="left:' + fmt(item.x) + 'px;top:' + fmt(item.y) + 'px;width:' + fmt(item.w) + 'px;height:' + fmt(item.h) + 'px;border-width:' + fmt(item.width) + 'px;"></div>';
        }
        return '';
      }).join('');

      return '<div class="paper-shell" aria-label="Legal page ' + (pageIndex + 1) + '"><div class="paper">' + items + '</div></div>';
    }).join('');
  }

  function validationMessages(data, layout) {
    var messages = [];
    if (!data.applicantNames.length && !val('rightParty')) messages.push('Add an applicant name or accused/respondent name before final filing.');
    if (!data.caseLines.length) messages.push('Add FIR or case particulars for a complete court heading.');
    if (!data.clauses.length) messages.push('Add at least one body clause.');
    if (layout.pages.length > 1) messages.push('Draft spans ' + layout.pages.length + ' legal-size pages.');
    return messages;
  }

  function updateValidation(data, layout) {
    var messages = validationMessages(data, layout);
    var box = $('validationBox');
    var hint = $('previewHint');
    var ok = !messages.length;

    box.className = 'notice ' + (ok ? 'success' : 'warning');
    box.innerHTML = [
      '<div class="notice-icon">' + icon(ok ? 'check' : 'alert') + '</div>',
      '<div><strong>' + (ok ? 'Ready to export' : 'Review before export') + '</strong>',
      '<p>' + esc(ok ? 'The draft has the required structure and is ready for legal-size PDF export.' : messages.join(' ')) + '</p></div>'
    ].join('');

    if (hint) hint.textContent = ok ? 'Preview is generated from the same layout engine used for PDF export.' : messages[0];
  }

  function updatePreview() {
    if (!$('paperStage')) return;
    var layout = createLayout();
    renderPaper(layout);
    updateValidation(layout.data, layout);
    $('pagePill').textContent = layout.pages.length + (layout.pages.length === 1 ? ' page' : ' pages');
    scheduleFit();
  }

  function scheduleFit() {
    clearTimeout(state.fitTimer);
    state.fitTimer = setTimeout(fitPreview, 20);
  }

  function fitPreview() {
    var viewport = $('previewViewport');
    if (!viewport) return;

    var mobile = window.matchMedia('(max-width: 899px)').matches;
    var availW = Math.max(240, viewport.clientWidth - (mobile ? 24 : 56));
    var availH = Math.max(320, viewport.clientHeight - (mobile ? 24 : 56));
    var zoom = mobile && state.view === 'preview'
      ? Math.min(availW / PAGE.w, availH / PAGE.h, 1)
      : Math.min(availW / PAGE.w, 0.96);

    if (!Number.isFinite(zoom) || zoom <= 0) zoom = 0.5;
    zoom = Math.max(0.22, zoom);

    state.zoom = zoom;
    document.documentElement.style.setProperty('--z', String(zoom));
    document.documentElement.style.setProperty('--paper-view-w', Math.round(PAGE.w * zoom) + 'px');
    document.documentElement.style.setProperty('--paper-view-h', Math.round(PAGE.h * zoom) + 'px');

    if ($('zoomPill')) $('zoomPill').textContent = Math.round(zoom * 100) + '%';
  }

  function toWinAnsi(value) {
    var s = cleanText(value)
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/[\u2013\u2014]/g, '-')
      .replace(/\u00a0/g, ' ');
    var out = '';
    for (var i = 0; i < s.length; i += 1) {
      var code = s.charCodeAt(i);
      out += code <= 255 ? s[i] : '?';
    }
    return out;
  }

  function pdfEscape(value) {
    return toWinAnsi(value).replace(/[\\()]/g, function(c) { return '\\' + c; });
  }

  function bytesFromString(str) {
    var out = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i += 1) out[i] = str.charCodeAt(i) & 255;
    return out;
  }

  function concatBytes(chunks) {
    var total = 0;
    chunks.forEach(function(chunk) { total += chunk.length; });
    var out = new Uint8Array(total);
    var offset = 0;
    chunks.forEach(function(chunk) {
      out.set(chunk, offset);
      offset += chunk.length;
    });
    return out;
  }

  function streamObject(content) {
    var bytes = typeof content === 'string' ? bytesFromString(content) : content;
    return ['<< /Length ' + bytes.length + ' >>\nstream\n', bytes, '\nendstream'];
  }

  function PdfBuilder() {
    this.objects = [];
  }

  PdfBuilder.prototype.reserve = function() {
    this.objects.push(null);
    return this.objects.length;
  };

  PdfBuilder.prototype.add = function(parts) {
    this.objects.push(parts);
    return this.objects.length;
  };

  PdfBuilder.prototype.set = function(id, parts) {
    this.objects[id - 1] = parts;
  };

  PdfBuilder.prototype.output = function(rootId) {
    var chunks = [];
    var offsets = [0];
    var position = 0;

    function push(part) {
      var bytes = typeof part === 'string' ? bytesFromString(part) : part;
      chunks.push(bytes);
      position += bytes.length;
    }

    push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');

    for (var i = 0; i < this.objects.length; i += 1) {
      if (this.objects[i] == null) throw new Error('PDF object ' + (i + 1) + ' was not assigned.');
      offsets[i + 1] = position;
      push((i + 1) + ' 0 obj\n');
      var parts = Array.isArray(this.objects[i]) ? this.objects[i] : [this.objects[i]];
      parts.forEach(push);
      push('\nendobj\n');
    }

    var xrefStart = position;
    push('xref\n0 ' + (this.objects.length + 1) + '\n0000000000 65535 f \n');
    for (var j = 1; j <= this.objects.length; j += 1) {
      push(String(offsets[j]).padStart(10, '0') + ' 00000 n \n');
    }
    push('trailer << /Size ' + (this.objects.length + 1) + ' /Root ' + rootId + ' 0 R >>\nstartxref\n' + xrefStart + '\n%%EOF');

    return concatBytes(chunks);
  };

  function buildPageContent(page) {
    var content = 'q\n0 0 0 rg\n0 0 0 RG\n';
    page.items.forEach(function(item) {
      if (item.type === 'text') {
        var baseline = PAGE.h - item.y - item.size * 0.82;
        content += 'BT /F' + (item.bold ? '2' : '1') + ' ' + fmt(item.size) + ' Tf 1 0 0 1 ' + fmt(item.x) + ' ' + fmt(baseline) + ' Tm (' + pdfEscape(item.text) + ') Tj ET\n';
      } else if (item.type === 'line') {
        content += 'q ' + fmt(item.width || 0.75) + ' w ' + fmt(item.x1) + ' ' + fmt(PAGE.h - item.y1) + ' m ' + fmt(item.x2) + ' ' + fmt(PAGE.h - item.y2) + ' l S Q\n';
      } else if (item.type === 'rect') {
        content += 'q ' + fmt(item.width || 0.75) + ' w ' + fmt(item.x) + ' ' + fmt(PAGE.h - item.y - item.h) + ' ' + fmt(item.w) + ' ' + fmt(item.h) + ' re S Q\n';
      }
    });
    return content + 'Q\n';
  }

  function buildTextPdf(layout) {
    var pdf = new PdfBuilder();
    var catalogId = pdf.reserve();
    var pagesId = pdf.reserve();
    var f1Id = pdf.add('<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>');
    var f2Id = pdf.add('<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>');
    var pageIds = [];

    layout.pages.forEach(function(page) {
      var contentId = pdf.add(streamObject(buildPageContent(page)));
      var pageId = pdf.reserve();
      pageIds.push(pageId);
      pdf.set(pageId, '<< /Type /Page /Parent ' + pagesId + ' 0 R /MediaBox [0 0 612 1008] /Resources << /Font << /F1 ' + f1Id + ' 0 R /F2 ' + f2Id + ' 0 R >> >> /Contents ' + contentId + ' 0 R >>');
    });

    pdf.set(pagesId, '<< /Type /Pages /Kids [' + pageIds.map(function(id) { return id + ' 0 R'; }).join(' ') + '] /Count ' + pageIds.length + ' >>');
    pdf.set(catalogId, '<< /Type /Catalog /Pages ' + pagesId + ' 0 R >>');

    return pdf.output(catalogId);
  }

  function drawPageToCanvas(ctx, page) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, PAGE.w, PAGE.h);
    ctx.strokeStyle = '#050505';
    ctx.fillStyle = '#050505';
    ctx.lineCap = 'square';
    ctx.textBaseline = 'top';

    page.items.forEach(function(item) {
      if (item.type === 'text') {
        ctx.font = (item.bold ? '700 ' : '400 ') + item.size + 'px "Times New Roman", Times, serif';
        ctx.fillText(item.text, item.x, item.y);
      } else if (item.type === 'line') {
        ctx.beginPath();
        ctx.lineWidth = item.width || 0.75;
        ctx.moveTo(item.x1, item.y1);
        ctx.lineTo(item.x2, item.y2);
        ctx.stroke();
      } else if (item.type === 'rect') {
        ctx.lineWidth = item.width || 0.75;
        ctx.strokeRect(item.x, item.y, item.w, item.h);
      }
    });
  }

  function dataUrlToBytes(dataUrl) {
    var base64 = dataUrl.split(',')[1] || '';
    var binary = atob(base64);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  function buildImagePdf(images) {
    var pdf = new PdfBuilder();
    var catalogId = pdf.reserve();
    var pagesId = pdf.reserve();
    var pageIds = [];

    images.forEach(function(image, index) {
      var imageName = 'Im' + (index + 1);
      var imageId = pdf.add([
        '<< /Type /XObject /Subtype /Image /Width ' + image.width + ' /Height ' + image.height + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + image.bytes.length + ' >>\nstream\n',
        image.bytes,
        '\nendstream'
      ]);

      var contentId = pdf.add(streamObject('q 612 0 0 1008 0 0 cm /' + imageName + ' Do Q\n'));
      var pageId = pdf.reserve();
      pageIds.push(pageId);

      pdf.set(pageId, '<< /Type /Page /Parent ' + pagesId + ' 0 R /MediaBox [0 0 612 1008] /Resources << /XObject << /' + imageName + ' ' + imageId + ' 0 R >> >> /Contents ' + contentId + ' 0 R >>');
    });

    pdf.set(pagesId, '<< /Type /Pages /Kids [' + pageIds.map(function(id) { return id + ' 0 R'; }).join(' ') + '] /Count ' + pageIds.length + ' >>');
    pdf.set(catalogId, '<< /Type /Catalog /Pages ' + pagesId + ' 0 R >>');

    return pdf.output(catalogId);
  }

  function delay(ms) {
    return new Promise(function(resolve) { setTimeout(resolve, ms); });
  }

  async function buildScannedPdf(layout) {
    var images = [];
    var scale = 2;

    for (var i = 0; i < layout.pages.length; i += 1) {
      var canvas = document.createElement('canvas');
      canvas.width = PAGE.w * scale;
      canvas.height = PAGE.h * scale;
      var ctx = canvas.getContext('2d');
      ctx.scale(scale, scale);
      drawPageToCanvas(ctx, layout.pages[i]);
      images.push({
        width: canvas.width,
        height: canvas.height,
        bytes: dataUrlToBytes(canvas.toDataURL('image/jpeg', 0.94))
      });
      await delay(0);
    }

    return buildImagePdf(images);
  }

  function downloadBytes(bytes, filename) {
    var blob = new Blob([bytes], { type: 'application/pdf' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(function() {
      URL.revokeObjectURL(url);
      link.remove();
    }, 1000);
  }

  function setBusy(busy, message) {
    state.busy = busy;
    document.body.classList.toggle('is-busy', busy);

    var buttons = document.querySelectorAll('[data-export]');
    buttons.forEach(function(button) { button.disabled = busy; });

    if ($('statusText')) $('statusText').textContent = message || (busy ? 'Working...' : 'Ready');
  }

  function showToast(type, message) {
    var toast = $('toast');
    if (!toast) return;
    clearTimeout(state.toastTimer);
    toast.className = 'toast show ' + type;
    toast.innerHTML = '<div class="toast-icon">' + icon(type === 'error' ? 'alert' : 'check') + '</div><span>' + esc(message) + '</span>';
    state.toastTimer = setTimeout(function() {
      toast.className = 'toast';
    }, 3200);
  }

  async function exportPdf(mode) {
    if (state.busy) return;

    try {
      setBusy(true, mode === 'scan' ? 'Rendering scanned PDF...' : 'Preparing text PDF...');
      await delay(50);

      var layout = createLayout();
      var bytes = mode === 'scan' ? await buildScannedPdf(layout) : buildTextPdf(layout);
      downloadBytes(bytes, mode === 'scan' ? 'Exemption_Application_Scanned.pdf' : 'Exemption_Application.pdf');

      showToast('success', mode === 'scan' ? 'Scanned PDF downloaded.' : 'Text PDF downloaded.');
    } catch (err) {
      showToast('error', 'Export failed. Please refresh and try again.');
    } finally {
      setBusy(false, 'Ready');
    }
  }

  function syncCaseFields() {
    var isFir = val('caseMode') !== 'appeal';
    $('firFields').classList.toggle('hidden', !isFir);
    $('appealFields').classList.toggle('hidden', isFir);
  }

  function toggleView(view) {
    state.view = view;
    document.body.classList.toggle('view-preview', view === 'preview');
    document.body.classList.toggle('view-editor', view !== 'preview');

    $('editorTab').classList.toggle('active', view !== 'preview');
    $('previewTab').classList.toggle('active', view === 'preview');

    requestAnimationFrame(fitPreview);
  }

  function bindEvents() {
    document.body.addEventListener('input', function(event) {
      var el = event.target;

      if (el.classList.contains('person-name')) {
        state.people[Number(el.dataset.index)].name = el.value;
        regenerateDraft(false);
        return;
      }

      if (el.classList.contains('person-role')) {
        state.people[Number(el.dataset.index)].role = el.value;
        updatePreview();
        return;
      }

      if (el.classList.contains('clause-text')) {
        state.clauses[Number(el.dataset.index)] = el.value;
        state.manual.clauses = true;
        updatePreview();
        return;
      }

      if (el.id === 'subject') {
        state.manual.subject = true;
        updatePreview();
        return;
      }

      if (el.id === 'prayer') {
        state.manual.prayer = true;
        updatePreview();
        return;
      }

      if (el.id === 'reason' || el.id === 'caseStage' || el.id === 'rightParty') {
        regenerateDraft(false);
        return;
      }

      updatePreview();
    });

    document.body.addEventListener('change', function(event) {
      if (event.target.id === 'proforma') {
        applyProforma(false);
        return;
      }

      if (event.target.id === 'caseMode') syncCaseFields();
      updatePreview();
    });

    document.body.addEventListener('click', function(event) {
      var el = event.target;
      if (!el || !el.closest) return;

      if (el.closest('#editorTab')) {
        toggleView('editor');
        return;
      }

      if (el.closest('#previewTab')) {
        toggleView('preview');
        return;
      }

      if (el.closest('#addApplicant')) {
        state.people.push({ name: '', role: 'Accused/applicant' });
        renderApplicants();
        regenerateDraft(false);
        showToast('success', 'Applicant row added.');
        return;
      }

      var delApplicant = el.closest('.delApplicant');
      if (delApplicant) {
        state.people.splice(Number(delApplicant.dataset.index), 1);
        if (!state.people.length) state.people.push({ name: '', role: 'Accused/applicant' });
        renderApplicants();
        regenerateDraft(false);
        showToast('success', 'Applicant removed.');
        return;
      }

      if (el.closest('#addClause')) {
        state.manual.clauses = true;
        state.clauses.push('');
        renderClauses();
        updatePreview();
        var next = document.querySelector('.clause-text[data-index="' + (state.clauses.length - 1) + '"]');
        if (next) next.focus();
        return;
      }

      var delClause = el.closest('.delClause');
      if (delClause) {
        state.manual.clauses = true;
        state.clauses.splice(Number(delClause.dataset.index), 1);
        renderClauses();
        updatePreview();
        showToast('success', 'Clause removed.');
        return;
      }

      if (el.closest('#regenerateDraftBtn')) {
        regenerateDraft(true);
        showToast('success', 'Draft text regenerated.');
        return;
      }

      if (el.closest('#rawPdfBtn')) {
        exportPdf('raw');
        return;
      }

      if (el.closest('#scanPdfBtn')) {
        exportPdf('scan');
      }
    });

    window.addEventListener('resize', scheduleFit);
  }

  function card(title, subtitle, iconName, body) {
    return [
      '<section class="card">',
      '<div class="card-head">',
      '<div class="card-icon">' + icon(iconName) + '</div>',
      '<div><h2>' + esc(title) + '</h2><p>' + esc(subtitle) + '</p></div>',
      '</div>',
      body,
      '</section>'
    ].join('');
  }

  function getHTML() {
    return [
      '<div class="ambient ambient-one"></div>',
      '<div class="ambient ambient-two"></div>',

      '<header class="topbar">',
      '<div class="brand">',
      '<div class="brand-mark">' + icon('logo') + '</div>',
      '<div><div class="brand-title">PDFWriter <span>Legal</span></div><div class="brand-subtitle">Exemption application generator</div></div>',
      '</div>',
      '<div class="top-meta"><span class="live-dot"></span><span>Cloudflare Worker App</span></div>',
      '<div class="mobile-tabs" aria-label="Editor and preview switch">',
      '<button type="button" id="editorTab" class="active">' + icon('edit') + '<span>Editor</span></button>',
      '<button type="button" id="previewTab">' + icon('eye') + '<span>Preview</span></button>',
      '</div>',
      '</header>',

      '<main class="workspace">',
      '<section class="editor-panel" aria-label="Document editor">',
      '<div class="editor-scroll">',
      '<div id="validationBox" class="notice success"></div>',

      card('Document Setup', 'Choose the drafting template, density, and stamp placeholder.', 'settings', [
        '<div class="grid two">',
        '<div><label>Template Proforma</label><select id="proforma" class="field"></select></div>',
        '<div><label>Document Density</label><select id="layoutStyle" class="field"><option value="standard">Standard legal · 13 pt</option><option value="compact">Compact · 12 pt</option></select></div>',
        '</div>',
        '<label class="check-row"><input id="stampSpace" type="checkbox" checked><span>Show court fee ticket placeholder</span></label>'
      ].join('')),

      card('Case Information', 'Court, parties, and FIR or case particulars.', 'case', [
        '<label>Court / Presiding Officer</label>',
        '<select id="court" class="field"></select>',
        '<div class="grid two">',
        '<div><label>State / Complainant</label><input id="leftParty" class="field" placeholder="State"></div>',
        '<div><label>Accused / Respondent</label><input id="rightParty" class="field" placeholder="Accused name"></div>',
        '</div>',
        '<label>Proceeding Type</label>',
        '<select id="caseMode" class="field"><option value="fir">FIR / State Case</option><option value="appeal">Complaint / Appeal</option></select>',
        '<div id="firFields" class="grid two field-group">',
        '<div><label>FIR No.</label><input id="firNumber" class="field" placeholder="e.g. 123"></div>',
        '<div><label>FIR Date</label><input id="firDate" class="field" placeholder="DD.MM.YYYY"></div>',
        '<div><label>Sections</label><input id="sections" class="field" placeholder="e.g. 420 IPC"></div>',
        '<div><label>Police Station</label><input id="policeStation" class="field" placeholder="Police Station"></div>',
        '</div>',
        '<div id="appealFields" class="grid two field-group hidden">',
        '<div><label>Case Type</label><input id="caseType" class="field" placeholder="e.g. NACT"></div>',
        '<div><label>Number / Year</label><input id="caseNumber" class="field" placeholder="e.g. 123/2024"></div>',
        '</div>'
      ].join('')),

      card('Applicants', 'Add one or more applicants for today-only exemption.', 'users', [
        '<div class="section-action"><button type="button" id="addApplicant" class="soft-button">' + icon('plus') + '<span>Add person</span></button></div>',
        '<div id="applicantBox" class="stack"></div>'
      ].join('')),

      card('Draft Body', 'Edit the legal subject, clauses, and prayer.', 'text', [
        '<div class="grid two">',
        '<div><label>Reason for Absence</label><input id="reason" class="field" placeholder="illness"></div>',
        '<div><label>Stage of Case</label><input id="caseStage" class="field" placeholder="evidence"></div>',
        '</div>',
        '<div class="section-action"><button type="button" id="regenerateDraftBtn" class="soft-button">' + icon('refresh') + '<span>Regenerate draft</span></button></div>',
        '<label>Subject</label>',
        '<textarea id="subject" class="field" rows="2"></textarea>',
        '<label>Clauses</label>',
        '<div id="clauseBox" class="stack"></div>',
        '<button type="button" id="addClause" class="outline-button">' + icon('plus') + '<span>Add custom clause</span></button>',
        '<label>Prayer</label>',
        '<textarea id="prayer" class="field" rows="3"></textarea>'
      ].join('')),

      card('Signatures & Counsel', 'Execution details and filing counsel.', 'sign', [
        '<div class="grid two">',
        '<div><label>Place</label><input id="place" class="field" value="Fazilka" placeholder="Fazilka"></div>',
        '<div><label>Date</label><input id="date" class="field" placeholder="DD.MM.YYYY"></div>',
        '<div><label>Salutation</label><select id="salutation" class="field"><option>Respected Sir,</option><option>Respected Madam,</option></select></div>',
        '<div><label>Filing Counsel</label><select id="counsel" class="field"></select></div>',
        '</div>',
        '<label class="check-row"><input id="duty" type="checkbox"><span>Append (Duty) to counsel title</span></label>'
      ].join('')),

      '</div>',
      '</section>',

      '<section class="preview-panel" id="previewPanel" aria-label="Legal-size preview">',
      '<div class="preview-top">',
      '<div><div class="eyebrow">Live legal preview</div><h1>Legal-size court document</h1><p id="previewHint">Preview is generated from the same layout engine used for PDF export.</p></div>',
      '<div class="preview-pills"><span id="pagePill">1 page</span><span id="zoomPill">50%</span></div>',
      '</div>',
      '<div id="previewViewport" class="preview-viewport"><div id="paperStage" class="paper-stage"></div></div>',
      '</section>',
      '</main>',

      '<footer class="export-bar">',
      '<div class="export-status"><span class="status-dot"></span><span id="statusText">Ready</span></div>',
      '<div class="export-actions">',
      '<button type="button" id="scanPdfBtn" data-export class="button secondary">' + icon('scan') + '<span>Scanned PDF</span></button>',
      '<button type="button" id="rawPdfBtn" data-export class="button primary">' + icon('download') + '<span>Export PDF</span></button>',
      '</div>',
      '</footer>',

      '<div id="toast" class="toast" role="status" aria-live="polite"></div>'
    ].join('');
  }

  function getCSS() {
    return [
      ':root{--bg:#f7f8fb;--panel:#ffffff;--panel-soft:rgba(255,255,255,.82);--ink:#0f172a;--muted:#64748b;--subtle:#94a3b8;--border:rgba(15,23,42,.1);--border-strong:rgba(15,23,42,.16);--accent:#635bff;--accent-dark:#4f46e5;--accent-soft:rgba(99,91,255,.1);--success:#10b981;--warning:#f59e0b;--danger:#ef4444;--shadow:0 24px 70px rgba(15,23,42,.13);--shadow-soft:0 12px 36px rgba(15,23,42,.08);--radius:22px;--z:.5;--paper-view-w:306px;--paper-view-h:504px}',
      '*{box-sizing:border-box}',
      'html,body{margin:0;min-height:100%;height:100%}',
      'body{height:100dvh;overflow:hidden;display:flex;flex-direction:column;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--ink);background:radial-gradient(circle at top left,#eef2ff 0,#f8fafc 34%,#f7f8fb 100%);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}',
      'button,input,select,textarea{font:inherit}',
      'button{border:0}',
      'svg{width:18px;height:18px;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;fill:none;flex:0 0 auto}',
      '.ambient{position:fixed;pointer-events:none;border-radius:999px;filter:blur(18px);opacity:.75;z-index:-1}',
      '.ambient-one{width:360px;height:360px;right:-120px;top:-110px;background:linear-gradient(135deg,rgba(99,91,255,.25),rgba(14,165,233,.12))}',
      '.ambient-two{width:280px;height:280px;left:-100px;bottom:80px;background:linear-gradient(135deg,rgba(16,185,129,.16),rgba(99,91,255,.1))}',
      '.topbar{height:68px;flex:0 0 auto;padding:0 18px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(15,23,42,.08);background:rgba(255,255,255,.74);backdrop-filter:blur(18px);position:relative;z-index:10}',
      '.brand{display:flex;align-items:center;gap:12px;min-width:0}',
      '.brand-mark{width:42px;height:42px;border-radius:14px;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,var(--accent),#14b8a6);box-shadow:0 14px 34px rgba(99,91,255,.35)}',
      '.brand-title{font-size:16px;font-weight:800;letter-spacing:-.04em;line-height:1}',
      '.brand-title span{font-weight:650;color:var(--muted)}',
      '.brand-subtitle{margin-top:4px;font-size:12px;color:var(--muted);white-space:nowrap}',
      '.top-meta{display:none;align-items:center;gap:8px;color:var(--muted);font-size:12px;font-weight:650;padding:8px 12px;border:1px solid var(--border);border-radius:999px;background:rgba(255,255,255,.6)}',
      '.live-dot{width:8px;height:8px;border-radius:999px;background:var(--success);box-shadow:0 0 0 5px rgba(16,185,129,.12)}',
      '.mobile-tabs{display:flex;gap:6px;padding:4px;border:1px solid var(--border);border-radius:999px;background:rgba(255,255,255,.72);box-shadow:0 8px 24px rgba(15,23,42,.06)}',
      '.mobile-tabs button{height:36px;padding:0 12px;border-radius:999px;background:transparent;color:var(--muted);display:flex;align-items:center;gap:7px;font-size:13px;font-weight:750;transition:.18s ease}',
      '.mobile-tabs button.active{background:#fff;color:var(--ink);box-shadow:0 8px 18px rgba(15,23,42,.1)}',
      '.workspace{flex:1;min-height:0;display:grid;grid-template-columns:1fr}',
      '.editor-panel,.preview-panel{min-width:0;min-height:0}',
      '.editor-panel{display:flex;flex-direction:column;background:rgba(255,255,255,.52);border-right:1px solid rgba(15,23,42,.08)}',
      '.editor-scroll{overflow:auto;min-height:0;padding:16px 14px 24px}',
      '.preview-panel{display:flex;flex-direction:column;background:linear-gradient(135deg,#d8deea,#eef2f7)}',
      '.preview-top{flex:0 0 auto;display:flex;justify-content:space-between;gap:16px;align-items:flex-start;padding:16px 18px;border-bottom:1px solid rgba(15,23,42,.09);background:rgba(255,255,255,.55);backdrop-filter:blur(18px)}',
      '.eyebrow{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);font-weight:800;margin-bottom:5px}',
      '.preview-top h1{font-size:18px;line-height:1.1;margin:0;letter-spacing:-.04em}',
      '.preview-top p{margin:7px 0 0;color:var(--muted);font-size:12px;max-width:520px}',
      '.preview-pills{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}',
      '.preview-pills span{font-size:12px;font-weight:750;color:#334155;border:1px solid rgba(15,23,42,.1);background:rgba(255,255,255,.72);padding:7px 10px;border-radius:999px;box-shadow:0 6px 16px rgba(15,23,42,.05)}',
      '.preview-viewport{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain}',
      '.paper-stage{min-height:100%;padding:24px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:24px}',
      '.paper-stage.multi-page{justify-content:flex-start}',
      '.paper-shell{width:var(--paper-view-w);height:var(--paper-view-h);flex:0 0 auto;filter:drop-shadow(0 22px 44px rgba(15,23,42,.22));transition:width .2s ease,height .2s ease,filter .2s ease}',
      '.paper{width:612px;height:1008px;background:#fff;position:relative;overflow:hidden;transform:scale(var(--z));transform-origin:top left}',
      '.pdf-text{position:absolute;font-family:"Times New Roman",Times,serif;line-height:1;white-space:pre;color:#000}',
      '.pdf-line{position:absolute;height:0;border-top:1px solid #000}',
      '.pdf-rect{position:absolute;border-style:solid;border-color:#000}',
      '.card{background:var(--panel-soft);border:1px solid var(--border);box-shadow:var(--shadow-soft);border-radius:var(--radius);padding:16px;margin-bottom:14px;animation:fadeUp .34s ease both;backdrop-filter:blur(18px)}',
      '.card-head{display:flex;gap:12px;align-items:flex-start;margin-bottom:15px}',
      '.card-icon{width:38px;height:38px;border-radius:14px;background:linear-gradient(135deg,rgba(99,91,255,.12),rgba(20,184,166,.1));color:var(--accent);display:grid;place-items:center;border:1px solid rgba(99,91,255,.14)}',
      '.card h2{margin:0;font-size:15px;letter-spacing:-.03em}',
      '.card p{margin:4px 0 0;color:var(--muted);font-size:12.5px;line-height:1.45}',
      '.grid{display:grid;gap:12px}',
      '.grid.two{grid-template-columns:1fr}',
      '.field-group{margin-top:12px}',
      '.stack{display:flex;flex-direction:column;gap:10px}',
      'label{display:block;margin:12px 0 6px;font-size:12px;font-weight:750;color:#334155}',
      '.field{width:100%;border:1px solid var(--border-strong);background:rgba(255,255,255,.82);color:var(--ink);border-radius:14px;min-height:42px;padding:10px 12px;outline:0;box-shadow:inset 0 1px 0 rgba(255,255,255,.7);transition:border-color .16s ease,box-shadow .16s ease,background .16s ease,transform .16s ease}',
      'textarea.field{resize:vertical;min-height:76px;line-height:1.45}',
      'select.field{appearance:none;background-image:linear-gradient(45deg,transparent 50%,#64748b 50%),linear-gradient(135deg,#64748b 50%,transparent 50%);background-position:calc(100% - 17px) 18px,calc(100% - 12px) 18px;background-size:5px 5px,5px 5px;background-repeat:no-repeat;padding-right:34px}',
      '.field:hover{border-color:rgba(99,91,255,.32);background:#fff}',
      '.field:focus{border-color:var(--accent);background:#fff;box-shadow:0 0 0 4px rgba(99,91,255,.13)}',
      '.check-row{margin-top:13px;display:flex;align-items:center;gap:10px;color:#334155;font-size:13px;font-weight:650;cursor:pointer}',
      '.check-row input{width:17px;height:17px;accent-color:var(--accent)}',
      '.section-action{display:flex;justify-content:flex-end;margin:-2px 0 10px}',
      '.soft-button,.outline-button,.button,.icon-button{cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;font-weight:800;transition:transform .16s ease,box-shadow .16s ease,background .16s ease,border-color .16s ease,color .16s ease}',
      '.soft-button{height:36px;padding:0 12px;border-radius:999px;background:var(--accent-soft);color:var(--accent);border:1px solid rgba(99,91,255,.13)}',
      '.soft-button:hover{background:rgba(99,91,255,.15);transform:translateY(-1px)}',
      '.outline-button{width:100%;height:42px;border-radius:14px;background:rgba(255,255,255,.5);border:1px dashed rgba(99,91,255,.34);color:var(--accent);margin:10px 0 4px}',
      '.outline-button:hover{background:rgba(99,91,255,.08);transform:translateY(-1px)}',
      '.mini-row{display:flex;align-items:flex-start;gap:10px;background:rgba(248,250,252,.86);border:1px solid rgba(15,23,42,.08);border-radius:18px;padding:10px;transition:.16s ease}',
      '.mini-row:hover{border-color:rgba(99,91,255,.2);background:#fff;box-shadow:0 12px 28px rgba(15,23,42,.06)}',
      '.row-number{width:28px;height:28px;border-radius:10px;background:#fff;border:1px solid var(--border);display:grid;place-items:center;font-size:12px;font-weight:850;color:var(--muted);flex:0 0 auto;margin-top:5px}',
      '.row-fields{display:grid;grid-template-columns:1fr;gap:10px;flex:1}',
      '.row-fields label,.mini-row label{margin-top:0}',
      '.clause-row textarea{flex:1;min-height:96px}',
      '.icon-button{width:38px;height:38px;border-radius:13px;background:#fff;border:1px solid var(--border);color:var(--muted);flex:0 0 auto;margin-top:5px}',
      '.icon-button:hover{transform:translateY(-1px);box-shadow:0 10px 22px rgba(15,23,42,.08)}',
      '.icon-button.danger:hover{color:var(--danger);border-color:rgba(239,68,68,.24);background:rgba(239,68,68,.07)}',
      '.empty-state{border:1px dashed rgba(15,23,42,.16);border-radius:16px;padding:14px;color:var(--muted);font-size:13px;background:rgba(255,255,255,.46);text-align:center}',
      '.notice{display:flex;gap:12px;align-items:flex-start;border-radius:20px;padding:14px;margin-bottom:14px;border:1px solid var(--border);background:rgba(255,255,255,.76);box-shadow:var(--shadow-soft);animation:fadeUp .28s ease both}',
      '.notice-icon{width:34px;height:34px;border-radius:13px;display:grid;place-items:center;flex:0 0 auto}',
      '.notice.success .notice-icon{background:rgba(16,185,129,.11);color:var(--success)}',
      '.notice.warning .notice-icon{background:rgba(245,158,11,.12);color:var(--warning)}',
      '.notice strong{display:block;font-size:13px;margin-top:1px}',
      '.notice p{margin:4px 0 0;color:var(--muted);font-size:12.5px;line-height:1.45}',
      '.export-bar{height:76px;flex:0 0 auto;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;border-top:1px solid rgba(15,23,42,.09);background:rgba(255,255,255,.82);backdrop-filter:blur(18px);z-index:12}',
      '.export-status{display:flex;align-items:center;gap:9px;color:var(--muted);font-size:13px;font-weight:750;min-width:0}',
      '.status-dot{width:9px;height:9px;border-radius:999px;background:var(--success);box-shadow:0 0 0 5px rgba(16,185,129,.1)}',
      '.export-actions{display:flex;gap:10px;align-items:center}',
      '.button{height:48px;padding:0 16px;border-radius:16px;font-size:14px}',
      '.button.primary{color:#fff;background:linear-gradient(135deg,var(--accent),#14b8a6);box-shadow:0 16px 36px rgba(99,91,255,.28)}',
      '.button.secondary{color:#334155;background:#fff;border:1px solid var(--border-strong);box-shadow:0 10px 24px rgba(15,23,42,.07)}',
      '.button:hover{transform:translateY(-1px)}',
      '.button:active,.soft-button:active,.outline-button:active,.icon-button:active{transform:translateY(0) scale(.99)}',
      '.button:disabled{opacity:.62;cursor:not-allowed;transform:none}',
      '.is-busy .status-dot{background:var(--warning);box-shadow:0 0 0 5px rgba(245,158,11,.12);animation:pulse 1s ease-in-out infinite}',
      '.is-busy .button.primary svg{animation:spin 1s linear infinite}',
      '.toast{position:fixed;left:50%;bottom:92px;transform:translate(-50%,18px) scale(.98);opacity:0;pointer-events:none;z-index:50;display:flex;align-items:center;gap:10px;max-width:min(92vw,460px);padding:12px 14px;border-radius:18px;background:rgba(15,23,42,.92);color:#fff;box-shadow:0 22px 50px rgba(15,23,42,.25);transition:.2s ease;font-size:13px;font-weight:700}',
      '.toast.show{opacity:1;transform:translate(-50%,0) scale(1)}',
      '.toast-icon{width:28px;height:28px;border-radius:10px;display:grid;place-items:center;background:rgba(255,255,255,.12)}',
      '.toast.error .toast-icon{color:#fecaca}',
      '.hidden{display:none!important}',
      '@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}',
      '@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(.72)}}',
      '@keyframes spin{to{transform:rotate(360deg)}}',
      '@media (max-width:899px){.topbar{height:64px;padding:0 12px}.brand-subtitle,.top-meta{display:none}.brand-mark{width:38px;height:38px;border-radius:13px}.brand-title{font-size:15px}.workspace{min-height:0}.view-editor .preview-panel{display:none}.view-preview .editor-panel{display:none}.preview-panel{height:100%}.preview-top{padding:12px 14px}.preview-top h1{font-size:16px}.preview-top p{display:none}.preview-pills span{font-size:11px;padding:6px 9px}.paper-stage{padding:12px;justify-content:center}.paper-stage.multi-page{justify-content:flex-start}.export-bar{height:72px;padding:10px 12px}.export-status{display:none}.export-actions{width:100%}.button{flex:1;height:50px;padding:0 10px}.button span{white-space:nowrap}.editor-scroll{padding:12px 12px 18px}.card{border-radius:20px;padding:14px}.toast{bottom:84px}}',
      '@media (min-width:640px){.grid.two{grid-template-columns:1fr 1fr}.row-fields{grid-template-columns:1fr 1fr}}',
      '@media (min-width:900px){.workspace{grid-template-columns:minmax(420px,480px) minmax(0,1fr)}.mobile-tabs{display:none}.top-meta{display:flex}.editor-scroll{padding:20px 18px 28px}.view-editor .preview-panel,.view-preview .editor-panel{display:flex}.paper-stage{padding:32px}.export-bar{padding:12px 20px}.button{min-width:150px}}',
      '@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}'
    ].join('\n');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
`;
