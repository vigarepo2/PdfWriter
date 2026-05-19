export default {
  async fetch(request, env, ctx) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>LADC Application Protocol</title>
    
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    
    <style>
        /* Minimalist Typography & Reset */
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f8f9fa; /* Extremely soft gray/white */
            color: #111111;
            margin: 0;
            padding: 0;
        }

        /* Sleek Input Fields */
        .ui-input {
            width: 100%;
            background-color: #ffffff;
            border: 1px solid #e5e5e5;
            color: #000000;
            border-radius: 6px;
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            transition: all 0.2s ease;
            box-shadow: 0 1px 2px rgba(0,0,0,0.02);
        }
        .ui-input:focus {
            outline: none;
            border-color: #000000;
            box-shadow: 0 0 0 1px #000000;
        }
        .ui-label {
            font-size: 0.65rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #555555;
            margin-bottom: 0.35rem;
            display: block;
        }

        /* Solid Black Action Button */
        .btn-primary {
            background-color: #000000;
            color: #ffffff;
            font-weight: 500;
            width: 100%;
            padding: 1rem;
            border-radius: 6px;
            text-align: center;
            transition: background-color 0.2s;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        .btn-primary:hover {
            background-color: #222222;
        }
        .btn-secondary {
            background-color: #ffffff;
            color: #000000;
            border: 1px solid #e5e5e5;
            font-size: 0.75rem;
            font-weight: 500;
            padding: 0.25rem 0.75rem;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .btn-secondary:hover {
            border-color: #000000;
        }

        /* THE DOCUMENT PREVIEW WINDOW 
           Hardcoded Legal dimensions wrapped in a scrollable mobile container
        */
        .preview-container-scroll {
            width: 100%;
            overflow-x: auto;
            background: #e5e5e5;
            padding: 2rem;
            display: flex;
            justify-content: center;
        }
        
        .legal-document-canvas {
            background: #ffffff;
            color: #000000;
            width: 816px;          /* 8.5in exactly */
            min-height: 1344px;    /* 14in exactly */
            min-width: 816px;      /* Prevents shrinking on mobile */
            padding: 1.25in 1in 1in 1.25in; 
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            font-family: 'Times New Roman', Times, serif;
            font-size: 13pt;
            line-height: 1.5;
            box-sizing: border-box;
            text-align: justify;
        }

        /* Custom minimal scrollbar */
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cccccc; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #999999; }
    </style>
</head>
<body class="flex flex-col lg:flex-row h-screen overflow-hidden">

    <div class="w-full lg:w-[420px] xl:w-[480px] bg-white h-[50vh] lg:h-screen overflow-y-auto border-b lg:border-b-0 lg:border-r border-neutral-200 z-10 flex flex-col">
        
        <div class="p-6 border-b border-neutral-100 sticky top-0 bg-white/90 backdrop-blur-md z-20">
            <h1 class="text-lg font-semibold tracking-tight text-black">LADC Drafting Suite</h1>
            <p class="text-xs text-neutral-500">Fazilka Jurisdiction · Production V2</p>
        </div>

        <div class="p-6 flex flex-col gap-6 flex-grow">
            <div>
                <label class="ui-label">Application Type</label>
                <select id="templatePreset" onchange="loadPresetTemplate()" class="ui-input font-medium bg-neutral-50">
                    <option value="exemption">Application for Exemption of Appearance</option>
                    <option value="bail_modification">Application for Bail Bond Modification</option>
                    <option value="blank">Blank Standard Application</option>
                </select>
            </div>

            <div>
                <label class="ui-label">Judicial Court Name</label>
                <select id="courtSelect" class="ui-input">
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
                <div>
                    <label class="ui-label">Complainant</label>
                    <input type="text" id="partyOne" value="State" class="ui-input">
                </div>
                <div>
                    <label class="ui-label">Accused Name</label>
                    <input type="text" id="partyTwo" value="Sandeep Singh @ Budhu." class="ui-input">
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="ui-label">FIR Number</label>
                    <input type="text" id="firNumber" value="06" class="ui-input">
                </div>
                <div>
                    <label class="ui-label">FIR Date</label>
                    <input type="text" id="firDate" value="13.01.2026" class="ui-input">
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="ui-label">Under Section (U/s)</label>
                    <input type="text" id="lawSections" value="21, 27 NDPS Act" class="ui-input">
                </div>
                <div>
                    <label class="ui-label">Police Station</label>
                    <input type="text" id="policeStation" value="Amir Khas." class="ui-input">
                </div>
            </div>

            <div>
                <label class="ui-label">Subject Line</label>
                <textarea id="appSubject" rows="2" class="ui-input resize-none"></textarea>
            </div>

            <div>
                <div class="flex justify-between items-center mb-2">
                    <label class="ui-label mb-0">Factual Statements</label>
                    <button onclick="addParagraphClause('')" class="btn-secondary">+ Add Clause</button>
                </div>
                <div id="dynamicClausesBox" class="flex flex-col gap-3">
                    </div>
            </div>

            <div>
                <label class="ui-label">Prayer</label>
                <textarea id="prayerText" rows="2" class="ui-input resize-none"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="ui-label">Place</label>
                    <input type="text" id="filingPlace" value="Fazilka" class="ui-input">
                </div>
                <div>
                    <label class="ui-label">Date</label>
                    <input type="text" id="filingDate" value="09.04.2026." class="ui-input">
                </div>
            </div>

            <div>
                <label class="ui-label">Through Counsel</label>
                <select id="counselSelect" class="ui-input">
                    <option value="Baltej Singh Brar, Advocate|Chief, LADC, Fazilka.">Baltej Singh Brar (Chief)</option>
                    <option value="Hardeep Singh Dhaliwal, Advocate|Deputy Chief, LADC, Fazilka." selected>Hardeep Singh Dhaliwal (Deputy Chief)</option>
                    <option value="Sunil Rangbulla, Advocate|Deputy Chief, LADC, Fazilka.">Sunil Rangbulla (Deputy Chief)</option>
                    <option value="Rajvinder Kaur, Advocate|Assistant, LADC, Fazilka.">Rajvinder Kaur (Assistant)</option>
                    <option value="Amisha, Advocate|Assistant, LADC, Fazilka.">Amisha (Assistant)</option>
                    <option value="Naazpreet Kaur, Advocate|Assistant, LADC, Fazilka.">Naazpreet Kaur (Assistant)</option>
                </select>
            </div>
        </div>
        
        <div class="p-6 border-t border-neutral-100 bg-white mt-auto sticky bottom-0 z-20">
            <button onclick="executePDFBuild()" class="btn-primary shadow-lg shadow-black/10">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Export Legal PDF
            </button>
        </div>
    </div>

    <div class="flex-1 bg-neutral-100 h-[50vh] lg:h-screen preview-container-scroll">
        <div id="live-document-canvas" class="legal-document-canvas">
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
            bail_modification: {
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
                paragraphs: [
                    "That the above titled case is pending layout adjudication parameters before this Hon'ble court."
                ],
                prayer: "It is therefore respectfully prayed that this application may kindly be allowed in the interest of absolute equity and justice."
            }
        };

        window.addEventListener('DOMContentLoaded', () => {
            loadPresetTemplate();
            attachLiveSyncHooks();
        });

        function loadPresetTemplate() {
            const key = document.getElementById('templatePreset').value;
            const config = library[key];
            
            document.getElementById('appSubject').value = config.subject;
            document.getElementById('prayerText').value = config.prayer;
            
            const box = document.getElementById('dynamicClausesBox');
            box.innerHTML = '';
            config.paragraphs.forEach(text => addParagraphClause(text));
            
            refreshCanvas();
        }

        function addParagraphClause(textValue) {
            const box = document.getElementById('dynamicClausesBox');
            const rowId = 'row_' + Date.now();
            
            const div = document.createElement('div');
            div.id = rowId;
            div.className = 'flex gap-2 items-start';
            div.innerHTML = \`
                <textarea class="ui-input resize-none text-sm p-2" rows="2" oninput="refreshCanvas()">\${textValue}</textarea>
                <button onclick="document.getElementById('\${rowId}').remove(); refreshCanvas();" class="text-neutral-400 hover:text-black font-bold p-2 transition-colors">&times;</button>
            \`;
            box.appendChild(div);
            refreshCanvas();
        }

        function attachLiveSyncHooks() {
            const inputs = ['courtSelect', 'partyOne', 'partyTwo', 'firNumber', 'firDate', 'lawSections', 'policeStation', 'appSubject', 'prayerText', 'filingPlace', 'filingDate', 'counselSelect'];
            inputs.forEach(id => {
                document.getElementById(id).addEventListener('input', refreshCanvas);
                document.getElementById(id).addEventListener('change', refreshCanvas);
            });
        }

        /* Highly structured table-based layout to match professional court formats perfectly */
        function compileJudicialHTML() {
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
            const counsel = document.getElementById('counselSelect').value.split('|');
            
            const textNodes = document.querySelectorAll('#dynamicClausesBox textarea');
            let parHTML = '';
            let index = 1;
            textNodes.forEach(node => {
                const text = node.value.trim();
                if(text) {
                    parHTML += \`
                    <table style="width: 100%; margin-bottom: 15px; border-collapse: collapse;">
                        <tr>
                            <td style="width: 30px; vertical-align: top; text-align: left;">\${index})</td>
                            <td style="vertical-align: top; text-align: justify;">\${text}</td>
                        </tr>
                    </table>\`;
                    index++;
                }
            });

            return \`
                <div style="text-align: center; font-weight: bold; font-size: 14pt; text-transform: uppercase; margin-bottom: 45px; line-height: 1.4;">
                    \${court}
                </div>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 35px;">
                    <tr>
                        <td style="width: 25%; font-weight: bold; vertical-align: top;">\${p1}</td>
                        <td style="width: 20%; font-weight: bold; vertical-align: top; text-align: center;">v/s</td>
                        <td style="width: 55%; font-weight: bold; vertical-align: top; text-align: left;">\${p2}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td style="padding-top: 20px; line-height: 1.5;">
                            FIR No. \${firNo} dated \${firDt},<br>
                            U/s \${sections},<br>
                            PS \${ps}
                        </td>
                    </tr>
                </table>

                <div style="font-weight: bold; text-decoration: underline; text-underline-offset: 4px; margin-bottom: 30px; text-align: justify; line-height: 1.5;">
                    \${subject}
                </div>

                <div style="margin-bottom: 20px;">Respected Sir,</div>
                <div style="margin-bottom: 20px; text-indent: 40px;">It is submitted as follows:</div>
                
                <div>
                    \${parHTML}
                </div>

                <div style="margin-top: 30px; margin-bottom: 50px; text-indent: 40px; text-align: justify;">
                    \${prayer}
                </div>

                <table style="width: 100%; margin-top: 40px;">
                    <tr>
                        <td style="vertical-align: bottom;">
                            Place: \${place}<br>
                            Date: \${date}
                        </td>
                        <td style="text-align: right; vertical-align: bottom;">
                            Submitted By<br><br><br>
                            <span style="font-weight: bold;">\${p2.replace('.', '')}</span><br>
                            (Accused/applicant)
                        </td>
                    </tr>
                </table>

                <div style="text-align: center; margin-top: 50px; width: 50%; margin-left: auto;">
                    Through Counsel<br><br><br><br>
                    <span style="font-weight: bold;">\${counsel[0]}</span><br>
                    \${counsel[1]}
                </div>
            \`;
        }

        function refreshCanvas() {
            document.getElementById('live-document-canvas').innerHTML = compileJudicialHTML();
        }

        /* BULLETPROOF PDF GENERATOR
           Constructs a detached, completely clean HTML environment in the background 
           ensuring zero mobile scaling interference or blank pages.
        */
        function executePDFBuild() {
            const safeName = document.getElementById('partyTwo').value.replace(/[^a-zA-Z0-9]/g, '_');
            const targetHTML = compileJudicialHTML();

            // Create temporary rendering container appended to body (solves blank screen bug)
            const sandbox = document.createElement('div');
            sandbox.innerHTML = targetHTML;
            Object.assign(sandbox.style, {
                position: 'fixed', // Prevents layout shift
                top: '-10000px',   // Completely hidden from user view
                left: '0',
                width: '8.5in',    // Enforces strict Legal dimensions natively
                padding: '1in 1in 1in 1.25in', // Margins rendered internally to element
                fontFamily: '"Times New Roman", Times, serif',
                fontSize: '13pt',
                lineHeight: '1.5',
                color: '#000000',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box'
            });
            document.body.appendChild(sandbox);

            const opt = {
                margin:       0, // Zero because we applied padding explicitly inside the sandbox
                filename:     \`Application_\${safeName}.pdf\`,
                image:        { type: 'jpeg', quality: 1.0 },
                html2canvas:  { 
                    scale: 2, 
                    useCORS: true,
                    letterRendering: true,
                    windowWidth: 816 // Force strict rendering width
                },
                jsPDF:        { unit: 'in', format: 'legal', orientation: 'portrait' }
            };

            // Generate and immediately clean up the sandbox
            html2pdf().set(opt).from(sandbox).save().then(() => {
                document.body.removeChild(sandbox);
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
