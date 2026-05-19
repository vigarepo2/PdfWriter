export default {
  async fetch(request, env, ctx) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>LADC Drafting Suite | Fazilka</title>
    
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <style>
        /* Minimalist Foundation */
        body {
            font-family: 'Inter', sans-serif;
            background-color: #fafafa;
            color: #000000;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
        }

        /* Brutalist / Minimal Inputs */
        .form-label {
            font-size: 0.65rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #404040;
            margin-bottom: 0.4rem;
            display: block;
        }
        .form-input {
            width: 100%;
            background-color: #ffffff;
            border: 1px solid #d4d4d4;
            color: #000000;
            border-radius: 6px;
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            transition: all 0.2s;
            box-shadow: 0 1px 2px rgba(0,0,0,0.02);
            -webkit-appearance: none;
        }
        .form-input:focus {
            outline: none;
            border-color: #000000;
            box-shadow: 0 0 0 1px #000000;
        }

        /* Buttons */
        .btn-primary {
            background-color: #000000;
            color: #ffffff;
            font-weight: 600;
            width: 100%;
            padding: 1rem;
            border-radius: 6px;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 0.02em;
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        .btn-primary:active { background-color: #333333; }
        
        .btn-secondary {
            background-color: #ffffff;
            color: #000000;
            border: 1px solid #d4d4d4;
            font-size: 0.75rem;
            font-weight: 600;
            padding: 0.4rem 0.8rem;
            border-radius: 4px;
            transition: all 0.2s;
        }
        .btn-secondary:active { background-color: #f5f5f5; border-color: #000000; }

        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d4d4d4; border-radius: 10px; }

        /* THE RESPONSIVE PREVIEW PAPER */
        .preview-wrapper {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            overflow: hidden; /* Stops mobile horizontal scrolling */
        }
        
        .legal-paper {
            background: #ffffff;
            color: #000000;
            width: 816px; /* 8.5in physical size */
            height: 1344px; /* 14in physical size */
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            border: 1px solid #e5e5e5;
            transform-origin: top center;
            /* Padding and fonts are inline so PDF captures them perfectly */
        }

        /* Mobile Tab System */
        .tab-btn {
            flex: 1;
            text-align: center;
            padding: 1rem;
            font-weight: 600;
            font-size: 0.875rem;
            color: #737373;
            border-bottom: 2px solid transparent;
            transition: all 0.2s;
        }
        .tab-btn.active {
            color: #000000;
            border-bottom-color: #000000;
        }
        
        /* Hide logic for tabs */
        @media (max-width: 1023px) {
            .desktop-only { display: none !important; }
            .mobile-view { display: flex; flex-direction: column; height: 100vh; }
        }
        @media (min-width: 1024px) {
            .mobile-tabs { display: none !important; }
        }
    </style>
</head>
<body class="lg:flex lg:h-screen lg:overflow-hidden bg-neutral-100">

    <div class="mobile-tabs flex bg-white border-b border-neutral-200 sticky top-0 z-50">
        <button id="tab-editor" onclick="switchTab('editor')" class="tab-btn active">📝 Editor</button>
        <button id="tab-preview" onclick="switchTab('preview')" class="tab-btn">📄 Preview</button>
    </div>

    <div id="panel-editor" class="w-full lg:w-[450px] bg-white lg:h-screen overflow-y-auto flex flex-col border-r border-neutral-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        
        <div class="p-6 border-b border-neutral-100 desktop-only bg-white sticky top-0 z-20">
            <h1 class="text-xl font-bold tracking-tight text-black">LADC Engine</h1>
            <p class="text-xs text-neutral-500 font-medium mt-1 uppercase tracking-wider">Fazilka Court Format</p>
        </div>

        <div class="p-5 lg:p-6 flex flex-col gap-5 flex-grow">
            <div>
                <label class="form-label">Application Type</label>
                <select id="templatePreset" onchange="loadPreset()" class="form-input bg-neutral-50 font-medium">
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

            <div class="grid grid-cols-2 gap-4">
                <div><label class="form-label">Complainant</label><input type="text" id="partyOne" value="State" class="form-input"></div>
                <div><label class="form-label">Accused Name</label><input type="text" id="partyTwo" value="Sandeep Singh @ Budhu." class="form-input"></div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div><label class="form-label">FIR Number</label><input type="text" id="firNumber" value="06" class="form-input"></div>
                <div><label class="form-label">FIR Date</label><input type="text" id="firDate" value="13.01.2026" class="form-input"></div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div><label class="form-label">Under Section</label><input type="text" id="lawSections" value="21, 27 NDPS Act" class="form-input"></div>
                <div><label class="form-label">Police Station</label><input type="text" id="policeStation" value="Amir Khas." class="form-input"></div>
            </div>

            <div>
                <label class="form-label">Subject Heading</label>
                <textarea id="appSubject" rows="2" class="form-input resize-none"></textarea>
            </div>

            <div>
                <div class="flex justify-between items-center mb-2">
                    <label class="form-label mb-0">Factual Statements</label>
                    <button onclick="addClause('')" class="btn-secondary">+ Add Row</button>
                </div>
                <div id="clauseBox" class="flex flex-col gap-3"></div>
            </div>

            <div>
                <label class="form-label">Prayer</label>
                <textarea id="prayerText" rows="2" class="form-input resize-none"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div><label class="form-label">Place</label><input type="text" id="filingPlace" value="Fazilka" class="form-input"></div>
                <div><label class="form-label">Date</label><input type="text" id="filingDate" value="09.04.2026." class="form-input"></div>
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
        
        <div class="p-5 lg:p-6 border-t border-neutral-200 bg-white sticky bottom-0 z-20">
            <button onclick="downloadCleanPDF()" class="btn-primary">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download Legal PDF
            </button>
        </div>
    </div>

    <div id="panel-preview" class="flex-1 bg-neutral-100 lg:h-screen overflow-y-auto hidden lg:block p-4 lg:p-8">
        <div id="previewContainer" class="preview-wrapper">
            <div id="previewPaper" class="legal-paper">
                </div>
        </div>
        <div class="mt-8 lg:hidden pb-10">
            <button onclick="downloadCleanPDF()" class="btn-primary shadow-lg">Download Legal PDF</button>
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

        // Mobile Tab Logic
        function switchTab(tab) {
            const editor = document.getElementById('panel-editor');
            const preview = document.getElementById('panel-preview');
            const btnEditor = document.getElementById('tab-editor');
            const btnPreview = document.getElementById('tab-preview');

            if(tab === 'editor') {
                editor.classList.remove('hidden');
                editor.classList.add('flex');
                preview.classList.add('hidden');
                preview.classList.remove('block');
                btnEditor.classList.add('active');
                btnPreview.classList.remove('active');
            } else {
                editor.classList.add('hidden');
                editor.classList.remove('flex');
                preview.classList.remove('hidden');
                preview.classList.add('block');
                btnPreview.classList.add('active');
                btnEditor.classList.remove('active');
                scaleMobilePaper(); // Adjust scale when tab is shown
            }
        }

        // Initialize App
        window.onload = () => {
            loadPreset();
            ['courtSelect', 'partyOne', 'partyTwo', 'firNumber', 'firDate', 'lawSections', 'policeStation', 'appSubject', 'prayerText', 'filingPlace', 'filingDate', 'counselSelect'].forEach(id => {
                document.getElementById(id).addEventListener('input', updatePaper);
                document.getElementById(id).addEventListener('change', updatePaper);
            });
            window.addEventListener('resize', scaleMobilePaper);
            scaleMobilePaper();
        };

        // Shrinks the document preview to fit perfectly on your mobile screen!
        function scaleMobilePaper() {
            const container = document.getElementById('previewContainer');
            const paper = document.getElementById('previewPaper');
            if (!container || !paper) return;
            
            // Calculate screen width vs document width (816px)
            const availableWidth = container.clientWidth;
            if (availableWidth < 816) {
                const scale = availableWidth / 816;
                paper.style.transform = \`scale(\${scale})\`;
                // Adjust container height so it doesn't leave massive blank space
                container.style.height = \`\${1344 * scale}px\`;
            } else {
                paper.style.transform = 'scale(1)';
                container.style.height = 'auto';
            }
        }

        function loadPreset() {
            const config = library[document.getElementById('templatePreset').value];
            document.getElementById('appSubject').value = config.subject;
            document.getElementById('prayerText').value = config.prayer;
            
            document.getElementById('clauseBox').innerHTML = '';
            config.paragraphs.forEach(text => addClause(text));
            updatePaper();
        }

        function addClause(text) {
            const id = 'row_' + Date.now();
            const div = document.createElement('div');
            div.id = id;
            div.className = 'flex gap-2 items-start';
            div.innerHTML = \`
                <textarea class="form-input resize-none text-sm p-2" rows="2" oninput="updatePaper()">\${text}</textarea>
                <button onclick="document.getElementById('\${id}').remove(); updatePaper();" class="text-neutral-400 hover:text-black font-bold text-xl px-1">&times;</button>
            \`;
            document.getElementById('clauseBox').appendChild(div);
            updatePaper();
        }

        // Generates the strict HTML layout for court
        function buildDocumentHTML() {
            const getV = (id) => document.getElementById(id).value;
            const counsel = getV('counselSelect').split('|');
            
            let parHTML = '';
            let idx = 1;
            document.querySelectorAll('#clauseBox textarea').forEach(n => {
                if(n.value.trim()) {
                    parHTML += \`
                    <table style="width: 100%; margin-bottom: 15px; border-collapse: collapse;">
                        <tr><td style="width: 35px; vertical-align: top;">\${idx})</td><td style="vertical-align: top; text-align: justify;">\${n.value.trim()}</td></tr>
                    </table>\`;
                    idx++;
                }
            });

            return \`
                <div style="padding: 1.25in 1in 1in 1.25in; font-family: 'Times New Roman', Times, serif; font-size: 13pt; color: black; line-height: 1.5;">
                    <div style="text-align: center; font-weight: bold; font-size: 14pt; text-transform: uppercase; margin-bottom: 45px; line-height: 1.4;">
                        \${getV('courtSelect')}
                    </div>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 35px;">
                        <tr>
                            <td style="width: 25%; font-weight: bold; vertical-align: top;">\${getV('partyOne')}</td>
                            <td style="width: 20%; font-weight: bold; vertical-align: top; text-align: center;">v/s</td>
                            <td style="width: 55%; font-weight: bold; vertical-align: top; text-align: left;">\${getV('partyTwo')}</td>
                        </tr>
                        <tr>
                            <td></td><td></td>
                            <td style="padding-top: 20px; line-height: 1.5;">
                                FIR No. \${getV('firNumber')} dated \${getV('firDate')},<br>
                                U/s \${getV('lawSections')},<br>
                                PS \${getV('policeStation')}
                            </td>
                        </tr>
                    </table>

                    <div style="font-weight: bold; text-decoration: underline; text-underline-offset: 4px; margin-bottom: 30px; text-align: justify;">
                        \${getV('appSubject')}
                    </div>

                    <div style="margin-bottom: 20px;">Respected Sir,</div>
                    <div style="margin-bottom: 20px; text-indent: 40px;">It is submitted as follows:</div>
                    
                    <div>\${parHTML}</div>

                    <div style="margin-top: 30px; margin-bottom: 50px; text-indent: 40px; text-align: justify;">\${getV('prayerText')}</div>

                    <table style="width: 100%; margin-top: 40px;">
                        <tr>
                            <td style="vertical-align: bottom;">Place: \${getV('filingPlace')}<br>Date: \${getV('filingDate')}</td>
                            <td style="text-align: right; vertical-align: bottom;">
                                Submitted By<br><br><br>
                                <span style="font-weight: bold;">\${getV('partyTwo').replace('.', '')}</span><br>
                                (Accused/applicant)
                            </td>
                        </tr>
                    </table>

                    <div style="text-align: center; margin-top: 50px; width: 50%; margin-left: auto;">
                        Through Counsel<br><br><br><br>
                        <span style="font-weight: bold;">\${counsel[0]}</span><br>
                        \${counsel[1]}
                    </div>
                </div>
            \`;
        }

        function updatePaper() {
            document.getElementById('previewPaper').innerHTML = buildDocumentHTML();
            scaleMobilePaper();
        }

        /* BULLETPROOF PDF GENERATION FOR ANDROID 
           Passes raw HTML string directly into the engine, skipping the viewport entirely. 
           This prevents corrupted files and fixes Android Chrome blocking issues.
        */
        function downloadCleanPDF() {
            // Give user immediate feedback
            const btn = document.querySelector('.btn-primary');
            const originalText = btn.innerHTML;
            btn.innerHTML = "Processing Document...";
            
            const rawHTML = buildDocumentHTML();
            const safeName = document.getElementById('partyTwo').value.replace(/[^a-zA-Z0-9]/g, '_');

            const opt = {
                margin:       0, // Margins are hard-coded in the HTML structure
                filename:     \`Application_\${safeName}.pdf\`,
                image:        { type: 'jpeg', quality: 1.0 },
                html2canvas:  { 
                    scale: 2, // High resolution crisp text
                    useCORS: true,
                    windowWidth: 816 // Forces html2canvas to ignore your mobile screen size
                },
                jsPDF:        { unit: 'in', format: 'legal', orientation: 'portrait' }
            };

            // Using raw HTML string directly avoids all DOM corruption errors
            html2pdf().set(opt).from(rawHTML).save().then(() => {
                btn.innerHTML = originalText;
            }).catch(err => {
                alert("Error generating PDF. Please ensure you have a stable connection.");
                btn.innerHTML = originalText;
            });
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
