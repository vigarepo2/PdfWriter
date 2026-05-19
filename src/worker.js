export default {
  async fetch(request, env, ctx) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>LADC Fazilka - Professional Legal Engine</title>
    
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <style>
        body {
            font-family: 'Montserrat', sans-serif;
            background: #0f172a;
            background-image: radial-gradient(circle at top right, #1e293b, #020617);
            color: #f8fafc;
            min-height: 100vh;
        }
        
        /* Figma-like Glassmorphism */
        .glass-card {
            background: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        
        .form-input {
            background: rgba(2, 6, 23, 0.5);
            border: 1px solid rgba(51, 65, 85, 0.6);
            color: #ffffff;
            border-radius: 0.5rem;
            padding: 0.7rem 0.85rem;
            font-size: 0.875rem;
            transition: all 0.2s ease-in-out;
            width: 100%;
        }
        .form-input:focus {
            border-color: #3b82f6;
            outline: none;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
        }

        /* ----------------------------------------------------
           LIVE PREVIEW SCREEN
           Visually represents Legal size for mobile scrolling
        ---------------------------------------------------- */
        .preview-wrapper {
            background: #ffffff;
            color: #000000;
            width: 816px; /* Exactly 8.5 inches */
            min-height: 1344px; /* Exactly 14 inches (Legal) */
            padding: 1.25in 1in 1in 1.25in; /* Legal binding margins */
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
            font-family: 'Times New Roman', Times, serif;
            font-size: 13pt;
            line-height: 1.5;
            box-sizing: border-box;
            text-align: justify;
        }

        /* Scrollbar styling for touch/mouse */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
        ::-webkit-scrollbar-track { background: transparent; }
    </style>
</head>
<body class="p-4 md:p-6 flex flex-col xl:flex-row gap-6">

    <div class="glass-card rounded-2xl p-5 w-full xl:w-[35%] flex flex-col gap-4 h-fit xl:sticky xl:top-6 max-h-[95vh] overflow-y-auto">
        <div class="pb-2 border-b border-slate-800">
            <h1 class="text-xl font-bold text-white flex items-center gap-2">
                <span class="bg-blue-500 w-2 h-6 rounded-full inline-block"></span>
                LADC Drafting Engine
            </h1>
            <p class="text-xs text-slate-400 mt-1">Professional Court Formatter | Fazilka</p>
        </div>

        <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold uppercase tracking-wider text-slate-400">Application Type</label>
            <select id="templatePreset" onchange="loadPresetTemplate()" class="form-input text-blue-300 font-medium border-slate-700">
                <option value="exemption">Application for Exemption of Personal Appearance</option>
                <option value="bail_modification">Application for Bail Bond Modification</option>
                <option value="blank">Custom / Blank Application</option>
            </select>
        </div>

        <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold uppercase tracking-wider text-slate-400">Court Name</label>
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
            <div class="flex flex-col gap-1.5">
                <label class="text-xs text-slate-400 font-medium">State / Complainant</label>
                <input type="text" id="partyOne" value="State" class="form-input">
            </div>
            <div class="flex flex-col gap-1.5">
                <label class="text-xs text-slate-400 font-medium">Accused Name</label>
                <input type="text" id="partyTwo" value="Sandeep Singh @ Budhu." class="form-input">
            </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col gap-1.5">
                <label class="text-xs text-slate-400 font-medium">FIR Number</label>
                <input type="text" id="firNumber" value="06" class="form-input">
            </div>
            <div class="flex flex-col gap-1.5">
                <label class="text-xs text-slate-400 font-medium">Dated</label>
                <input type="text" id="firDate" value="13.01.2026" class="form-input">
            </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col gap-1.5">
                <label class="text-xs text-slate-400 font-medium">Under Section (U/s)</label>
                <input type="text" id="lawSections" value="21, 27 NDPS Act" class="form-input">
            </div>
            <div class="flex flex-col gap-1.5">
                <label class="text-xs text-slate-400 font-medium">Police Station (PS)</label>
                <input type="text" id="policeStation" value="Amir Khas." class="form-input">
            </div>
        </div>

        <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold uppercase tracking-wider text-slate-400">Subject Heading</label>
            <textarea id="appSubject" rows="2" class="form-input resize-none"></textarea>
        </div>

        <div class="flex flex-col gap-1.5">
            <div class="flex justify-between items-center">
                <label class="text-xs font-semibold uppercase tracking-wider text-slate-400">Factual Paragraphs</label>
                <button onclick="addParagraphClause('')" class="text-[10px] uppercase font-bold tracking-wider bg-slate-800 hover:bg-slate-700 text-blue-400 px-2 py-1 rounded border border-slate-700 transition">
                    + Add Row
                </button>
            </div>
            <div id="dynamicClausesBox" class="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-2">
                </div>
        </div>

        <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold uppercase tracking-wider text-slate-400">Prayer Block</label>
            <textarea id="prayerText" rows="2" class="form-input resize-none"></textarea>
        </div>

        <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col gap-1.5">
                <label class="text-xs text-slate-400 font-medium">Place</label>
                <input type="text" id="filingPlace" value="Fazilka" class="form-input">
            </div>
            <div class="flex flex-col gap-1.5">
                <label class="text-xs text-slate-400 font-medium">Date</label>
                <input type="text" id="filingDate" value="09.04.2026." class="form-input">
            </div>
        </div>

        <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold uppercase tracking-wider text-slate-400">Through Counsel</label>
            <select id="counselSelect" class="form-input">
                <option value="Baltej Singh Brar, Advocate|Chief, LADC, Fazilka.">Baltej Singh Brar (Chief)</option>
                <option value="Hardeep Singh Dhaliwal, Advocate|Deputy Chief, LADC, Fazilka." selected>Hardeep Singh Dhaliwal (Deputy Chief)</option>
                <option value="Sunil Rangbulla, Advocate|Deputy Chief, LADC, Fazilka.">Sunil Rangbulla (Deputy Chief)</option>
                <option value="Rajvinder Kaur, Advocate|Assistant, LADC, Fazilka.">Rajvinder Kaur (Assistant)</option>
                <option value="Amisha, Advocate|Assistant, LADC, Fazilka.">Amisha (Assistant)</option>
                <option value="Naazpreet Kaur, Advocate|Assistant, LADC, Fazilka.">Naazpreet Kaur (Assistant)</option>
            </select>
        </div>

        <button onclick="generateCleanPDF()" class="mt-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Download Legal PDF
        </button>
    </div>

    <div class="w-full xl:w-[65%] overflow-x-auto bg-slate-950/50 rounded-2xl p-4 border border-slate-800 shadow-inner flex justify-center items-start">
        <div id="live-preview-container" class="preview-wrapper">
            </div>
    </div>

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
            setupLiveSync();
        });

        function loadPresetTemplate() {
            const key = document.getElementById('templatePreset').value;
            const config = presets[key];
            
            document.getElementById('appSubject').value = config.subject;
            document.getElementById('prayerText').value = config.prayer;
            
            const box = document.getElementById('dynamicClausesBox');
            box.innerHTML = '';
            config.paragraphs.forEach(text => addParagraphClause(text));
            
            updateLivePreview();
        }

        function addParagraphClause(textValue) {
            const box = document.getElementById('dynamicClausesBox');
            const rowId = 'row_' + Date.now();
            
            const div = document.createElement('div');
            div.id = rowId;
            div.className = 'flex gap-2 items-start bg-slate-900 rounded-lg border border-slate-700 p-1.5';
            div.innerHTML = \`
                <textarea class="form-input w-full bg-slate-950 border-none text-xs p-2 resize-none" rows="2" oninput="updateLivePreview()">\${textValue}</textarea>
                <button onclick="document.getElementById('\${rowId}').remove(); updateLivePreview();" class="text-red-500 hover:text-red-400 p-1 font-bold text-lg leading-none">&times;</button>
            \`;
            box.appendChild(div);
            updateLivePreview();
        }

        function setupLiveSync() {
            const inputs = ['courtSelect', 'partyOne', 'partyTwo', 'firNumber', 'firDate', 'lawSections', 'policeStation', 'appSubject', 'prayerText', 'filingPlace', 'filingDate', 'counselSelect'];
            inputs.forEach(id => {
                document.getElementById(id).addEventListener('input', updateLivePreview);
                document.getElementById(id).addEventListener('change', updateLivePreview);
            });
        }

        /* This function perfectly replicates the table layout 
           seen in the actual physical court documents you uploaded.
        */
        function generateCoreHTML() {
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
                    <div style="display: flex; margin-bottom: 12px; text-align: justify;">
                        <div style="min-width: 25px;">\${index})</div>
                        <div>\${text}</div>
                    </div>\`;
                    index++;
                }
            });

            return \`
                <div style="text-align: center; font-weight: bold; font-size: 14pt; text-transform: uppercase; margin-bottom: 40px; line-height: 1.3;">
                    \${court}
                </div>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                    <tr>
                        <td style="width: 25%; font-weight: bold; vertical-align: top;">\${p1}</td>
                        <td style="width: 20%; font-weight: bold; vertical-align: top; text-align: center;">v/s</td>
                        <td style="width: 55%; font-weight: bold; vertical-align: top; text-align: left;">\${p2}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td style="padding-top: 15px; line-height: 1.5;">
                            FIR No. \${firNo} dated \${firDt},<br>
                            U/s \${sections},<br>
                            PS \${ps}
                        </td>
                    </tr>
                </table>

                <div style="font-weight: bold; text-decoration: underline; text-underline-offset: 4px; margin-bottom: 25px; text-align: justify;">
                    \${subject}
                </div>

                <div style="margin-bottom: 15px;">Respected Sir,</div>
                <div style="margin-bottom: 15px; padding-left: 25px;">It is submitted as follows:</div>
                
                <div style="padding-left: 25px;">
                    \${parHTML}
                </div>

                <div style="margin-top: 25px; margin-bottom: 50px; text-indent: 40px; text-align: justify;">
                    \${prayer}
                </div>

                <table style="width: 100%; margin-top: 30px;">
                    <tr>
                        <td style="vertical-align: bottom;">
                            Place: \${place}<br>
                            Date: \${date}
                        </td>
                        <td style="text-align: right; vertical-align: bottom;">
                            Submitted By<br><br>
                            <span style="font-weight: bold;">\${p2.replace('.', '')}</span><br>
                            (Accused/applicant)
                        </td>
                    </tr>
                </table>

                <div style="text-align: center; margin-top: 50px; width: 50%; margin-left: auto;">
                    Through Counsel<br><br><br>
                    <span style="font-weight: bold;">\${counsel[0]}</span><br>
                    \${counsel[1]}
                </div>
            \`;
        }

        function updateLivePreview() {
            document.getElementById('live-preview-container').innerHTML = generateCoreHTML();
        }

        /* CRITICAL FIX: 
           Instead of relying on an off-screen HTML element (which breaks on mobile),
           we dynamically wrap the HTML string in an isolated container directly in the PDF generator.
           This guarantees an uncorrupted Legal 1-Page PDF every time.
        */
        function generateCleanPDF() {
            const fileNameId = document.getElementById('partyTwo').value.replace(/[^a-zA-Z0-9]/g, '_');
            const finalHTML = generateCoreHTML();

            // Create a temporary container exclusively for PDF processing
            const printWrapper = document.createElement('div');
            printWrapper.innerHTML = finalHTML;
            printWrapper.style.fontFamily = "'Times New Roman', Times, serif";
            printWrapper.style.fontSize = "13pt";
            printWrapper.style.lineHeight = "1.5";
            printWrapper.style.color = "black";
            printWrapper.style.textAlign = "justify";

            const opt = {
                margin:       [1, 1, 1, 1.25], // Top, Right, Bottom, Left (Inches)
                filename:     \`Application_\${fileNameId}.pdf\`,
                image:        { type: 'jpeg', quality: 1.0 },
                html2canvas:  { 
                    scale: 2, // High resolution for professional print
                    useCORS: true,
                    letterRendering: true
                },
                jsPDF:        { unit: 'in', format: 'legal', orientation: 'portrait' }
            };

            // Process directly from element block, bypassing viewport completely
            html2pdf().set(opt).from(printWrapper).save();
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
