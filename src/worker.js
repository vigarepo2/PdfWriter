export default {
  async fetch(request, env, ctx) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>LADC Professional Suite</title>
    
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f4f4f5; color: #09090b; margin: 0; padding: 0; }

        /* Minimalist Input Styling */
        .form-label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #52525b; margin-bottom: 0.35rem; display: block; }
        .form-input { width: 100%; background-color: #ffffff; border: 1px solid #e4e4e7; color: #09090b; border-radius: 6px; padding: 0.65rem 0.85rem; font-size: 0.875rem; transition: all 0.2s ease; box-shadow: 0 1px 2px rgba(0,0,0,0.01); -webkit-appearance: none; }
        .form-input:focus { outline: none; border-color: #09090b; box-shadow: 0 0 0 1px #09090b; }
        
        /* Premium Buttons */
        .btn-primary { background-color: #09090b; color: #ffffff; font-weight: 600; width: 100%; padding: 1rem; border-radius: 6px; text-align: center; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem; border: 1px solid #09090b; }
        .btn-primary:active { transform: translateY(1px); background-color: #27272a; }
        .btn-secondary { background-color: #ffffff; color: #09090b; border: 1px solid #e4e4e7; font-size: 0.75rem; font-weight: 600; padding: 0.35rem 0.75rem; border-radius: 6px; transition: all 0.2s; display: flex; align-items: center; gap: 0.25rem; }
        .btn-secondary:active { background-color: #f4f4f5; border-color: #09090b; }
        .icon-btn { color: #a1a1aa; padding: 0.25rem; border-radius: 4px; transition: all 0.2s; cursor: pointer; display: flex; align-items: center; justify-content: center; border: none; background: transparent; }
        .icon-btn:hover { background-color: #e4e4e7; color: #09090b; }
        .icon-btn.danger:hover { background-color: #fee2e2; color: #ef4444; }
        .icon-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        /* Custom Clean Scrollbar */
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d4d4d8; border-radius: 10px; }

        /* SCALING FIX FOR MOBILE PREVIEW */
        .preview-wrapper { width: 100%; display: flex; justify-content: center; overflow: hidden; transform-origin: top center; }
        .legal-paper { 
            background: #ffffff; color: #000000; 
            width: 816px !important; height: 1344px !important; /* Forces physical Legal size */
            min-width: 816px; flex-shrink: 0; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.08); 
            border: 1px solid #e4e4e7; 
            transform-origin: top center; 
        }

        /* Tabs */
        .tab-btn { flex: 1; text-align: center; padding: 1rem; font-weight: 600; font-size: 0.875rem; color: #71717a; border-bottom: 2px solid transparent; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: #ffffff; border-top: none; border-left: none; border-right: none;}
        .tab-btn.active { color: #09090b; border-bottom-color: #09090b; }
        
        @media (max-width: 1023px) { .desktop-only { display: none !important; } }
        @media (min-width: 1024px) { .mobile-tabs { display: none !important; } }
    </style>
</head>
<body class="lg:flex lg:h-screen lg:overflow-hidden">

    <div class="mobile-tabs flex border-b border-zinc-200 sticky top-0 z-50 shadow-sm w-full">
        <button id="tab-editor" onclick="switchTab('editor')" class="tab-btn active">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            Editor
        </button>
        <button id="tab-preview" onclick="switchTab('preview')" class="tab-btn">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            Preview
        </button>
    </div>

    <div id="panel-editor" class="w-full lg:w-[460px] bg-white lg:h-screen overflow-y-auto flex flex-col border-r border-zinc-200 z-10 relative">
        <div class="p-5 border-b border-zinc-100 desktop-only bg-white sticky top-0 z-20">
            <h1 class="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path></svg>
                LADC Suite
            </h1>
            <p class="text-[0.65rem] text-zinc-500 font-bold mt-1 uppercase tracking-widest">Fazilka Protocol</p>
        </div>

        <div class="p-5 flex flex-col gap-5 flex-grow">
            <div>
                <label class="form-label">Application Type</label>
                <select id="templatePreset" onchange="loadPreset()" class="form-input bg-zinc-50 font-medium border-zinc-300">
                    <option value="exemption">Application for Exemption</option>
                    <option value="bail">Bail Bond Modification</option>
                    <option value="blank">Blank Standard Form</option>
                </select>
            </div>

            <div>
                <label class="form-label">In The Court Of</label>
                <select id="courtSelect" class="form-input">
                    <option value="IN THE COURT OF SH. DHARMINDER PAUL SINGLA, SESSIONS JUDGE, FAZILKA">Sh. Dharminder Paul Singla, Sessions Judge</option>
                    <option value="IN THE COURT OF SH. KRISHAN KUMAR SINGLA, ASJ, FAZILKA">Sh. Krishan Kumar Singla, ASJ</option>
                    <option value="IN THE COURT OF MRS. PAMELPREET GREWAL KAHAL, JUDGE, SPECIAL COURT, FAZILKA" selected>Mrs. Pamelpreet Grewal Kahal, Special Court</option>
                    <option value="IN THE COURT OF SH. AJIT PAL SINGH, ASJ, FAZILKA">Sh. Ajit Pal Singh, ASJ</option>
                    <option value="IN THE COURT OF SH. HARPREET SINGH, JMIC, FAZILKA">Sh. Harpreet Singh, JMIC</option>
                    <option value="IN THE COURT OF MS. KARAMWINDER KAUR, JMIC, FAZILKA">Ms. Karamwinder Kaur, JMIC</option>
                    <option value="IN THE COURT OF MS. RAVLEEN KAUR, JMIC, FAZILKA">Ms. Ravleen Kaur, JMIC</option>
                </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div><label class="form-label">Complainant</label><input type="text" id="partyOne" value="State" class="form-input"></div>
                <div><label class="form-label">Accused Name</label><input type="text" id="partyTwo" value="Sandeep Singh @ Budhu." class="form-input"></div>
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div><label class="form-label">FIR Number</label><input type="text" id="firNumber" value="06" class="form-input"></div>
                <div><label class="form-label">FIR Date</label><input type="text" id="firDate" value="13.01.2026" class="form-input"></div>
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div><label class="form-label">Under Section (U/s)</label><input type="text" id="lawSections" value="21, 27 NDPS Act" class="form-input"></div>
                <div><label class="form-label">Police Station (PS)</label><input type="text" id="policeStation" value="Amir Khas." class="form-input"></div>
            </div>

            <div>
                <label class="form-label">Subject Heading</label>
                <textarea id="appSubject" rows="2" class="form-input resize-none"></textarea>
            </div>

            <div>
                <div class="flex justify-between items-center mb-2">
                    <label class="form-label mb-0">Factual Statements</label>
                    <button onclick="addNewClause()" class="btn-secondary">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        Add Row
                    </button>
                </div>
                <div id="clauseBox" class="flex flex-col gap-2"></div>
            </div>

            <div>
                <label class="form-label">Prayer</label>
                <textarea id="prayerText" rows="2" class="form-input resize-none"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div><label class="form-label">Filing Place</label><input type="text" id="filingPlace" value="Fazilka" class="form-input"></div>
                <div><label class="form-label">Filing Date</label><input type="text" id="filingDate" value="09.04.2026." class="form-input"></div>
            </div>

            <div>
                <label class="form-label">Through Counsel</label>
                <select id="counselSelect" class="form-input">
                    <option value="Baltej Singh Brar, Advocate|Chief, LADC, Fazilka.">Baltej Singh Brar (Chief)</option>
                    <option value="Hardeep Singh Dhaliwal, Advocate|Deputy Chief, LADC, Fazilka." selected>Hardeep Singh Dhaliwal (Deputy Chief)</option>
                    <option value="Sunil Rangbulla, Advocate|Deputy Chief, LADC, Fazilka.">Sunil Rangbulla (Deputy Chief)</option>
                    <option value="Rajvinder Kaur, Advocate|Assistant, LADC, Fazilka.">Rajvinder Kaur (Assistant)</option>
                    <option value="Amisha, Advocate|Assistant, LADC, Fazilka.">Amisha (Assistant)</option>
                    <option value="Naazpreet Kaur, Advocate|Assistant, LADC, Fazilka.">Naazpreet Kaur (Assistant)</option>
                </select>
            </div>
        </div>
        
        <div class="p-5 border-t border-zinc-200 bg-white sticky bottom-0 z-20">
            <button onclick="exportPerfectPDF()" class="btn-primary shadow-xl" id="downloadBtn1">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download Legal PDF
            </button>
        </div>
    </div>

    <div id="panel-preview" class="flex-1 lg:h-screen overflow-y-auto hidden lg:block p-4 lg:p-8 relative">
        <div id="previewContainer" class="preview-wrapper">
            <div id="previewPaper" class="legal-paper">
                </div>
        </div>
        <div class="mt-8 lg:hidden pb-10">
            <button onclick="exportPerfectPDF()" class="btn-primary" id="downloadBtn2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download PDF
            </button>
        </div>
    </div>

    <script>
        const library = {
            exemption: {
                subject: "Application for exemption of personal appearance of accused/applicant Sandeep Singh @ Budhu.",
                paragraphs: [
                    "That the above noted case is pending before this Hon'ble court and same is fixed for today.",
                    "That the above noted case accused/applicant is unable to appear before this Hon'ble court due to illness. (A telephone message has been received)",
                    "That the absence of accused applicant is neither willful nor intentional but due to reason stated above."
                ],
                prayer: "It is therefore requested that in the lite of facts and circumstance mentioned above personal appearance of accused may kindly be exempted for today only."
            },
            bail: {
                subject: "Application to modify order dated 08-05-2026 to the extent of the sum of bail bonds of surety from Rs. 40,000/- to Rs. 30,000/-.",
                paragraphs: [
                    "That the above-said criminal appeal is pending in this Hon'ble Court and is fixed for 27-07-2026.",
                    "That an application for suspension of awarded sentence was decided with a direction to furnish bail bonds in the sum of Rs. 40,000/- each with one surety.",
                    "That the applicants are residents of Uttar Pradesh, so the applicants are unable to arrange local sureties of such a high amount in this area.",
                    "That earlier the applicants had furnished their respective cash surety in the sum of Rs. 30,000/- under section 437-A Cr.P.C before the Ld. trial court."
                ],
                prayer: "It is, therefore, requested that the sum of bail bonds of surety may kindly be modified from Rs. 40,000/- to Rs. 30,000/- in the interest of justice."
            },
            blank: {
                subject: "Application under section _____ for the purpose of __________________.",
                paragraphs: ["That the above titled case is pending layout adjudication parameters before this Hon'ble court."],
                prayer: "It is therefore respectfully prayed that this application may kindly be allowed in the interest of absolute equity and justice."
            }
        };

        let currentClauses = [];

        window.onload = () => {
            loadPreset();
            var inputs = ['courtSelect', 'partyOne', 'partyTwo', 'firNumber', 'firDate', 'lawSections', 'policeStation', 'appSubject', 'prayerText', 'filingPlace', 'filingDate', 'counselSelect'];
            for(var i=0; i<inputs.length; i++) {
                document.getElementById(inputs[i]).addEventListener('input', triggerRender);
                document.getElementById(inputs[i]).addEventListener('change', triggerRender);
            }
            window.addEventListener('resize', calibrateScale);
            calibrateScale();
        };

        function switchTab(tab) {
            const editor = document.getElementById('panel-editor');
            const preview = document.getElementById('panel-preview');
            const btnEd = document.getElementById('tab-editor');
            const btnPr = document.getElementById('tab-preview');

            if(tab === 'editor') {
                editor.style.display = 'flex';
                preview.style.display = 'none';
                btnEd.classList.add('active'); btnPr.classList.remove('active');
            } else {
                editor.style.display = 'none';
                preview.style.display = 'block';
                btnPr.classList.add('active'); btnEd.classList.remove('active');
                calibrateScale();
            }
        }

        function calibrateScale() {
            const wrapper = document.getElementById('previewContainer');
            const paper = document.getElementById('previewPaper');
            if (!wrapper || !paper) return;
            
            const availableWidth = wrapper.clientWidth;
            if (availableWidth < 816) {
                const scale = availableWidth / 816;
                paper.style.transform = 'scale(' + scale + ')';
                wrapper.style.height = (1344 * scale) + 'px';
            } else {
                paper.style.transform = 'scale(1)';
                wrapper.style.height = '1344px';
            }
        }

        function loadPreset() {
            const config = library[document.getElementById('templatePreset').value];
            document.getElementById('appSubject').value = config.subject;
            document.getElementById('prayerText').value = config.prayer;
            currentClauses = [];
            for(var i=0; i<config.paragraphs.length; i++) {
                currentClauses.push(config.paragraphs[i]);
            }
            drawClauseUI();
            triggerRender();
        }

        function drawClauseUI() {
            const box = document.getElementById('clauseBox');
            box.innerHTML = '';
            for(let i=0; i<currentClauses.length; i++) {
                const row = document.createElement('div');
                row.className = 'flex gap-1.5 items-start bg-zinc-50 p-2 border border-zinc-200 rounded-md';
                
                const upDisabled = i === 0 ? 'disabled' : '';
                const downDisabled = i === currentClauses.length - 1 ? 'disabled' : '';
                const textVal = currentClauses[i];
                
                row.innerHTML = 
                    '<div class="flex flex-col gap-1 mt-0.5">' +
                        '<button onclick="shiftClause(' + i + ', -1)" class="icon-btn" ' + upDisabled + '>' +
                            '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7"></path></svg>' +
                        '</button>' +
                        '<button onclick="shiftClause(' + i + ', 1)" class="icon-btn" ' + downDisabled + '>' +
                            '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>' +
                        '</button>' +
                    '</div>' +
                    '<textarea class="form-input resize-none text-sm p-2 bg-transparent border-transparent shadow-none focus:bg-white focus:border-zinc-300 focus:shadow-sm" rows="2" oninput="updateClauseText(' + i + ', this.value)">' + textVal + '</textarea>' +
                    '<button onclick="deleteClause(' + i + ')" class="icon-btn danger mt-0.5">' +
                        '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>' +
                    '</button>';
                box.appendChild(row);
            }
        }

        window.updateClauseText = function(index, val) {
            currentClauses[index] = val;
            triggerRender();
        };

        window.shiftClause = function(index, dir) {
            if (index + dir < 0 || index + dir >= currentClauses.length) return;
            const temp = currentClauses[index];
            currentClauses[index] = currentClauses[index + dir];
            currentClauses[index + dir] = temp;
            drawClauseUI();
            triggerRender();
        };

        window.deleteClause = function(index) {
            currentClauses.splice(index, 1);
            drawClauseUI();
            triggerRender();
        };

        window.addNewClause = function() {
            currentClauses.push("");
            drawClauseUI();
            triggerRender();
        };

        function formulateHTML() {
            const v = id => document.getElementById(id).value;
            const counsel = v('counselSelect').split('|');
            
            let parHTML = '';
            let idx = 1;
            for(let i=0; i<currentClauses.length; i++) {
                const text = currentClauses[i];
                if(text.trim()) {
                    parHTML += 
                    '<table style="width: 100%; margin-bottom: 12px; border-collapse: collapse;">' +
                        '<tr><td style="width: 35px; vertical-align: top;">' + idx + ')</td><td style="vertical-align: top; text-align: justify;">' + text.trim() + '</td></tr>' +
                    '</table>';
                    idx++;
                }
            }

            return '' +
                '<div style="padding: 1.1in 1in 0.8in 1.25in; font-family: \\'Times New Roman\\', Times, serif; font-size: 13pt; color: black; line-height: 1.45;">' +
                    '<div style="text-align: center; font-weight: bold; font-size: 13pt; text-transform: uppercase; margin-bottom: 30px; line-height: 1.3;">' + v('courtSelect') + '</div>' +
                    '<table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">' +
                        '<tr>' +
                            '<td style="width: 25%; font-weight: bold; vertical-align: top;">' + v('partyOne') + '</td>' +
                            '<td style="width: 20%; font-weight: bold; vertical-align: top; text-align: center;">v/s</td>' +
                            '<td style="width: 55%; font-weight: bold; vertical-align: top; text-align: left;">' + v('partyTwo') + '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td></td><td></td>' +
                            '<td style="padding-top: 15px; line-height: 1.4;">' +
                                'FIR No. ' + v('firNumber') + ' dated ' + v('firDate') + ',<br>' +
                                'U/s ' + v('lawSections') + ',<br>' +
                                'PS ' + v('policeStation') +
                            '</td>' +
                        '</tr>' +
                    '</table>' +
                    '<div style="font-weight: bold; text-decoration: underline; text-underline-offset: 4px; margin-bottom: 25px; text-align: justify;">' + v('appSubject') + '</div>' +
                    '<div style="margin-bottom: 15px;">Respected Sir,</div>' +
                    '<div style="margin-bottom: 15px; text-indent: 40px;">It is submitted as follows:</div>' +
                    '<div>' + parHTML + '</div>' +
                    '<div style="margin-top: 20px; margin-bottom: 35px; text-indent: 40px; text-align: justify;">' + v('prayerText') + '</div>' +
                    '<table style="width: 100%; margin-top: 20px;">' +
                        '<tr>' +
                            '<td style="vertical-align: bottom;">Place: ' + v('filingPlace') + '<br>Date: ' + v('filingDate') + '</td>' +
                            '<td style="text-align: right; vertical-align: bottom;">' +
                                'Submitted By<br><br><br>' +
                                '<span style="font-weight: bold;">' + v('partyTwo').replace('.', '') + '</span><br>' +
                                '(Accused/applicant)' +
                            '</td>' +
                        '</tr>' +
                    '</table>' +
                    '<div style="text-align: center; margin-top: 35px; width: 50%; margin-left: auto;">' +
                        'Through Counsel<br><br><br>' +
                        '<span style="font-weight: bold;">' + counsel[0] + '</span><br>' + counsel[1] +
                    '</div>' +
                '</div>';
        }

        function triggerRender() {
            document.getElementById('previewPaper').innerHTML = formulateHTML();
            calibrateScale();
        }

        window.exportPerfectPDF = function() {
            const btn1 = document.getElementById('downloadBtn1');
            const btn2 = document.getElementById('downloadBtn2');
            const ogText = '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> Download Legal PDF';
            const loadHTML = '<svg class="animate-spin w-5 h-5 mr-2 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing...';
            
            if (btn1) btn1.innerHTML = loadHTML;
            if (btn2) btn2.innerHTML = loadHTML;
            
            const coreHTML = formulateHTML();
            const tag = document.getElementById('partyTwo').value.replace(/[^a-zA-Z0-9]/g, '_');

            const opt = {
                margin:       0,
                filename:     'Application_' + tag + '.pdf',
                image:        { type: 'jpeg', quality: 1.0 },
                html2canvas:  { scale: 2, useCORS: true, windowWidth: 816 }, 
                jsPDF:        { unit: 'in', format: 'legal', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(coreHTML).save().then(() => {
                if (btn1) btn1.innerHTML = ogText;
                if (btn2) btn2.innerHTML = ogText;
            });
        }
    </script>
</body>
</html>
    `;
    return new Response(html, { headers: { "content-type": "text/html;charset=UTF-8" }});
  }
}
