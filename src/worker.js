export default {
  async fetch(request, env, ctx) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>LADC Fazilka - Legal Document Engine</title>
    
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <style>
        body {
            font-family: 'Montserrat', sans-serif;
            background: radial-gradient(circle at top right, #1e293b, #0f172a, #020617);
            color: #f8fafc;
            min-height: 100vh;
        }
        .glass-card {
            background: rgba(15, 23, 42, 0.75);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .form-input {
            background: rgba(30, 41, 59, 0.7);
            border: 1px solid rgba(71, 85, 105, 0.5);
            color: #ffffff;
            border-radius: 0.5rem;
            padding: 0.65rem 0.85rem;
            font-size: 0.9rem;
            transition: all 0.2s ease-in-out;
        }
        .form-input:focus {
            border-color: #3b82f6;
            outline: none;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
        }
        
        /* ----------------------------------------------------
           CRITICAL MOBILE VIEWPORT PREVIEW ENGINE
           Simulates a Legal paper on mobile without scaling bugs
        ---------------------------------------------------- */
        #preview-wrapper {
            background: #ffffff;
            color: #000000;
            width: 100%;
            max-width: 820px;
            box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7);
            padding: 1.2in 1in 1in 1.25in;
            font-family: 'Times New Roman', Times, serif;
            font-size: 13pt;
            line-height: 1.4;
            box-sizing: border-box;
        }

        /* ----------------------------------------------------
           ISOLATED NATIVE HEADLESS SANDBOX FOR PDF GENERATION
           Forces exactly 816px width (8.5 inches at 96 DPI)
           to completely bypass mobile screen scaling limits!
        ---------------------------------------------------- */
        #pdf-render-sandbox {
            position: absolute;
            left: -9999px;
            top: -9999px;
            width: 816px; /* 8.5 Inches exactly */
            min-height: 1344px; /* 14 Inches exactly */
            background: #ffffff;
            color: #000000;
            font-family: 'Times New Roman', Times, serif;
            font-size: 13pt;
            line-height: 1.4;
            padding: 1.2in 1in 1in 1.25in; /* Standard binding margin */
            box-sizing: border-box;
        }

        /* Judicial Topography Layout Rules */
        .court-header-print {
            text-align: center;
            font-weight: bold;
            font-size: 14pt;
            text-transform: uppercase;
            margin-bottom: 25px;
            line-height: 1.3;
        }
        .parties-wrapper {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            margin-bottom: 20px;
            font-weight: bold;
            align-items: center;
        }
        .case-meta-block {
            margin-left: auto;
            width: 50%;
            font-weight: bold;
            margin-bottom: 20px;
            line-height: 1.3;
            border-left: 2px solid #000000;
            padding-left: 12px;
        }
        .document-subject {
            font-weight: bold;
            margin-bottom: 20px;
            text-align: justify;
            line-height: 1.4;
            text-transform: uppercase;
            border-bottom: 1.5px solid #000;
            padding-bottom: 4px;
        }
        .paragraph-list {
            margin-bottom: 20px;
            list-style-type: none;
            padding: 0;
        }
        .paragraph-list li {
            margin-bottom: 10px;
            text-align: justify;
        }
        .prayer-block {
            margin-bottom: 30px;
            text-align: justify;
        }
        .footer-signatures {
            display: grid;
            grid-template-columns: 1fr 1fr;
            margin-top: 20px;
            align-items: end;
        }
        .counsel-stamp {
            margin-top: 25px;
            margin-left: auto;
            width: 50%;
            text-align: left;
            line-height: 1.3;
        }
        
        /* Mobile Scroll Customization */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 999px; }
    </style>
</head>
<body class="p-3 md:p-6 flex flex-col xl:flex-row gap-6">

    <div class="glass-card rounded-2xl p-5 w-full xl:w-[35%] flex flex-col gap-4 h-fit xl:sticky xl:top-6 max-h-[95vh] overflow-y-auto shadow-2xl">
        <div>
            <h1 class="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span class="bg-blue-600 w-2.5 h-6 rounded-full inline-block"></span>
                LADC Application Hub
            </h1>
            <p class="text-xs text-gray-400 mt-0.5">Fazilka Subordinate Courts Production Standard</p>
        </div>

        <hr class="border-slate-800" />

        <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold uppercase tracking-wider text-gray-400">Application Presets</label>
            <select id="templatePreset" onchange="loadPresetTemplate()" class="form-input bg-slate-900 border-slate-700 text-blue-400 font-medium">
                <option value="exemption">Application for Exemption of Personal Appearance</option>
                <option value="bail_modification">Application for Bail Bond Modification</option>
                <option value="blank">Custom Universal Blank Application</option>
            </select>
        </div>

        <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold uppercase tracking-wider text-gray-400">Judicial Court Name</label>
            <select id="courtSelect" class="form-input text-xs">
                <option value="IN THE COURT OF SH. DHARMINDER PAUL SINGLA, SESSIONS JUDGE, FAZILKA.">Sh. Dharminder Paul Singla, Sessions Judge</option>
                <option value="IN THE COURT OF SH. KRISHAN KUMAR SINGLA, ASJ, FAZILKA.">Sh. Krishan Kumar Singla, ASJ</option>
                <option value="IN THE COURT OF MRS. PAMELPREET GREWAL KAHAL, JUDGE, SPECIAL COURT, FAZILKA." selected>Mrs. Pamelpreet Grewal Kahal, Special Court</option>
                <option value="IN THE COURT OF SH. AJIT PAL SINGH, ASJ, FAZILKA.">Sh. Ajit Pal Singh, ASJ</option>
                <option value="IN THE COURT OF SH. HARPREET SINGH, JMIC, FAZILKA.">Sh. Harpreet Singh, JMIC</option>
                <option value="IN THE COURT OF MS. KARAMWINDER KAUR, JMIC, FAZILKA.">Ms. Karamwinder Kaur, JMIC</option>
                <option value="IN THE COURT OF MS. RAVLEEN KAUR, JMIC, FAZILKA.">Ms. Ravleen Kaur, JMIC</option>
            </select>
        </div>

        <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col gap-1">
                <label class="text-xs text-gray-400 font-medium">First Party (Complainant)</label>
                <input type="text" id="partyOne" value="State" class="form-input">
            </div>
            <div class="flex flex-col gap-1">
                <label class="text-xs text-gray-400 font-medium">Second Party (Accused)</label>
                <input type="text" id="partyTwo" value="Sandeep Singh @ Budhu" class="form-input">
            </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col gap-1">
                <label class="text-xs text-gray-400 font-medium">FIR Number</label>
                <input type="text" id="firNumber" value="06" class="form-input">
            </div>
            <div class="flex flex-col gap-1">
                <label class="text-xs text-gray-400 font-medium">FIR Dated</label>
                <input type="text" id="firDate" value="13.01.2026" class="form-input">
            </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col gap-1">
                <label class="text-xs text-gray-400 font-medium">Under Section (U/s)</label>
                <input type="text" id="lawSections" value="21, 27 NDPS Act" class="form-input">
            </div>
            <div class="flex flex-col gap-1">
                <label class="text-xs text-gray-400 font-medium">Police Station (PS)</label>
                <input type="text" id="policeStation" value="Amir Khas" class="form-input">
            </div>
        </div>

        <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold uppercase tracking-wider text-gray-400">Application Subject Line</label>
            <textarea id="appSubject" rows="2" class="form-input resize-none text-xs leading-relaxed"></textarea>
        </div>

        <div class="flex flex-col gap-1.5">
            <div class="flex justify-between items-center">
                <label class="text-xs font-semibold uppercase tracking-wider text-gray-400">Factual Paragraph Clauses</label>
                <button onclick="addParagraphClause('')" class="text-xs bg-slate-800 hover:bg-slate-700 text-blue-400 px-2 py-0.5 rounded border border-slate-700 transition">
                    + Add Row
                </button>
            </div>
            <div id="dynamicClausesBox" class="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
                </div>
        </div>

        <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold uppercase tracking-wider text-gray-400">Prayer / Requested Relief</label>
            <textarea id="prayerText" rows="2" class="form-input resize-none text-xs leading-relaxed"></textarea>
        </div>

        <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col gap-1">
                <label class="text-xs text-gray-400 font-medium">Filing Place</label>
                <input type="text" id="filingPlace" value="Fazilka" class="form-input">
            </div>
            <div class="flex flex-col gap-1">
                <label class="text-xs text-gray-400 font-medium">Filing Date</label>
                <input type="text" id="filingDate" value="19-05-2026" class="form-input">
            </div>
        </div>

        <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold uppercase tracking-wider text-gray-400">Assign LADC Counsel Officer</label>
            <select id="counselSelect" class="form-input text-xs">
                <option value="Baltej Singh Brar, Advocate|Chief, LADC, Fazilka.">Baltej Singh Brar, Advocate (Chief)</option>
                <option value="Hardeep Singh Dhaliwal, Advocate|Deputy Chief, LADC, Fazilka." selected>Hardeep Singh Dhaliwal, Advocate (Deputy Chief)</option>
                <option value="Sunil Rangbulla, Advocate|Deputy Chief, LADC, Fazilka.">Sunil Rangbulla, Advocate (Deputy Chief)</option>
                <option value="Rajvinder Kaur, Advocate|Assistant, LADC, Fazilka.">Rajvinder Kaur, Advocate (Assistant)</option>
                <option value="Amisha, Advocate|Assistant, LADC, Fazilka.">Amisha, Advocate (Assistant)</option>
                <option value="Naazpreet Kaur, Advocate|Assistant, LADC, Fazilka.">Naazpreet Kaur, Advocate (Assistant)</option>
            </select>
        </div>

        <button onclick="compileAndDownloadPDF()" class="mt-1 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Download Legal PDF
        </button>
    </div>

    <div class="w-full xl:w-[65%] overflow-x-auto flex justify-center items-start bg-slate-950/40 rounded-2xl p-3 md:p-6 border border-slate-900">
        <div id="preview-wrapper">
            </div>
    </div>

    <div id="pdf-render-sandbox"></div>

    <script>
        const presets = {
            exemption: {
                subject: "Application for exemption of personal appearance of accused/applicant Sandeep Singh @ Budhu.",
                paragraphs: [
                    "That the above noted case is pending before this Hon'ble court and same is fixed for today.",
                    "That the above noted case accused/applicant is unable to appear before this Hon'ble court due to illness. (A telephone message has been received)",
                    "That the absence of accused applicant is neither willful nor intentional but due to reason stated above."
                ],
                prayer: "It is therefore requested that in the lite of facts and circumstance mentioned above personal appearance of accused may kindly be exempted for today only."
            },
            bail_modification: {
                subject: "Application to modify order dated 08-05-2026 to the extent of the sum of bail bonds of surety from Rs. 40,000/- to Rs. 30,000/- and to consider the earlier bail bonds.",
                paragraphs: [
                    "That the above-said criminal appeal is pending in this Hon'ble Court and is fixed for 27-07-2026.",
                    "That an application for suspension of awarded sentence was decided by this Hon'ble Court with a direction to furnish bail bonds in the sum of Rs. 40,000/- each with one surety.",
                    "That the applicants are residents of Uttar Pradesh, so the applicants are unable to arrange local sureties of such a high amount in this area.",
                    "That earlier the applicants had furnished their respective cash surety in the sum of Rs. 30,000/- under section 437-A Cr.P.C before the Ld. trial court."
                ],
                prayer: "It is, therefore, requested that the sum of bail bonds of surety may kindly be modified from Rs. 40,000/- to Rs. 30,000/- in the interest of justice."
            },
            blank: {
                subject: "Application under section _____ for the purpose of __________________.",
                paragraphs: [
                    "That the above titled case is pending layout adjudication parameters before this Hon'ble court.",
                    "That the context of the factual presentation is explicitly specified here."
                ],
                prayer: "It is therefore respectfully prayed that this application may kindly be allowed in the interest of absolute equity and justice."
            }
        };

        window.addEventListener('DOMContentLoaded', () => {
            loadPresetTemplate();
            setupCoreHooks();
        });

        function loadPresetTemplate() {
            const key = document.getElementById('templatePreset').value;
            const config = presets[key];
            
            document.getElementById('appSubject').value = config.subject;
            document.getElementById('prayerText').value = config.prayer;
            
            const box = document.getElementById('dynamicClausesBox');
            box.innerHTML = '';
            config.paragraphs.forEach(text => addParagraphClause(text));
            
            synchronizeDocuments();
        }

        function addParagraphClause(textValue) {
            const box = document.getElementById('dynamicClausesBox');
            const rowId = 'row_' + Date.now() + Math.floor(Math.random() * 100);
            
            const div = document.createElement('div');
            div.id = rowId;
            div.className = 'flex gap-2 items-start bg-slate-900/50 p-1.5 rounded-lg border border-slate-800';
            div.innerHTML = \`
                <textarea class="clause-text-item form-input w-full bg-slate-950 border-slate-800 text-gray-200 text-xs p-2 leading-normal" rows="2" oninput="synchronizeDocuments()">\${textValue}</textarea>
                <button onclick="document.getElementById('\${rowId}').remove(); synchronizeDocuments();" class="text-red-400 hover:text-red-300 p-1 text-base font-bold">×</button>
            \`;
            box.appendChild(div);
            synchronizeDocuments();
        }

        function setupCoreHooks() {
            const inputs = ['courtSelect', 'partyOne', 'partyTwo', 'firNumber', 'firDate', 'lawSections', 'policeStation', 'appSubject', 'prayerText', 'filingPlace', 'filingDate', 'counselSelect'];
            inputs.forEach(id => {
                document.getElementById(id).addEventListener('input', synchronizeDocuments);
                document.getElementById(id).addEventListener('change', synchronizeDocuments);
            });
        }

        function buildStructuralHTML() {
            const court = document.getElementById('courtSelect').value;
            const p1 = document.getElementById('partyOne').value;
            const p2 = document.getElementById('partyTwo').value;
            const firNo = document.getElementById('firNumber').value;
            const firDt = document.getElementById('firDate').value;
            const sections = document.getElementById('lawSections').value;
            const ps = document.getElementById('policeStation').value;
            const subject = document.getElementById('appSubject').value;
            const prayer = document.getElementById('prayerText').value;
            const place = document.getElementById('filingPlace').value;
            const date = document.getElementById('filingDate').value;
            const counselRaw = document.getElementById('counselSelect').value.split('|');
            
            const textNodes = document.querySelectorAll('.clause-text-item');
            let parHTML = '<ol class="paragraph-list">';
            let index = 1;
            textNodes.forEach(node => {
                const text = node.value.trim();
                if(text.length > 0) {
                    parHTML += \`<li style="text-indent: 40px; margin-bottom: 10px; text-align: justify;"><span style="display:inline-block; text-indent:0; width:25px;">\${index})</span>\${text}</li>\`;
                    index++;
                }
            });
            parHTML += '</ol>';

            return \`
                <div class="court-header-print">\${court}</div>
                
                <div class="parties-wrapper">
                    <div style="text-align: left;">\${p1}</div>
                    <div style="text-align: center; font-style: italic; font-weight: normal; font-size:11pt; border: 1px solid #000; padding: 1px 6px; border-radius:6px;">v/s</div>
                    <div style="text-align: right;">\${p2}.</div>
                </div>

                <div class="case-meta-block">
                    <div>FIR No. \th\th: \${firNo} dated \${firDt},</div>
                    <div>U/s \th\th\th: \${sections},</div>
                    <div>PS \th\th\th: \${ps}.</div>
                </div>

                <div class="document-subject">
                    <strong>SUBJECT:</strong> \${subject}
                </div>

                <div style="margin-bottom: 8px; font-weight: bold;">Respected Sir,</div>
                <div style="margin-bottom: 10px; text-indent: 40px;">It is submitted as follows:</div>
                
                \${parHTML}

                <div class="prayer-block">
                    It is therefore requested that \${prayer}
                </div>

                <div class="footer-signatures">
                    <div>
                        <div>Place: \${place}</div>
                        <div>Date: \${date}.</div>
                    </div>
                    <div style="text-align: right; line-height: 1.3;">
                        <span>Submitted By</span><br><br>
                        <span style="font-weight: bold;">\${p2}</span><br>
                        <span style="font-size: 11pt;">(Accused/applicant)</span>
                    </div>
                </div>

                <div class="counsel-stamp">
                    <div style="text-align: center; width: 100%; margin-bottom: 20px;">Through Counsel</div>
                    <span style="font-weight: bold;">\${counselRaw[0]}</span><br>
                    <span>\${counselRaw[1]}</span>
                </div>
            \`;
        }

        function synchronizeDocuments() {
            const htmlContent = buildStructuralHTML();
            document.getElementById('preview-wrapper').innerHTML = htmlContent;
            document.getElementById('pdf-render-sandbox').innerHTML = htmlContent;
        }

        function compileAndDownloadPDF() {
            const sandboxElement = document.getElementById('pdf-render-sandbox');
            const fileIdentity = document.getElementById('partyTwo').value.replace(/[^a-zA-Z0-9]/g, '_');
            
            const pdfConfig = {
                margin:       0, // Embedded natively in sandbox padding safely
                filename:     \`Application_\${fileIdentity}.pdf\`,
                image:        { type: 'jpeg', quality: 1.0 },
                html2canvas:  { 
                    scale: 3, // Ultra-high resolution crisp text clarity
                    useCORS: true, 
                    logging: false,
                    letterRendering: true
                },
                jsPDF:        { unit: 'in', format: 'legal', orientation: 'portrait' }
            };

            html2pdf().set(pdfConfig).from(sandboxElement).save();
        }
    </script>
</body>
</html>
    `;

    return new Response(html, {
      headers: { "content-type": "text/html;charset=UTF-8" }
    });
  }
}
