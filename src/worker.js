export default {
  async fetch(request, env, ctx) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>LADC Legal Drafting Engine</title>
    
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <style>
        /* Pure Minimalist Black & White Theme */
        body {
            font-family: 'Inter', sans-serif;
            background-color: #ffffff;
            color: #000000;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }

        /* Brutalist Inputs */
        .form-label {
            font-size: 0.65rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #000000;
            margin-bottom: 0.4rem;
            display: block;
        }
        .form-input {
            width: 100%;
            background-color: #fcfcfc;
            border: 1px solid #d1d5db;
            color: #000000;
            border-radius: 4px;
            padding: 0.75rem 0.85rem;
            font-size: 0.875rem;
            transition: all 0.2s;
        }
        .form-input:focus {
            outline: none;
            border-color: #000000;
            background-color: #ffffff;
            box-shadow: 4px 4px 0px #000000;
        }

        /* Solid Action Buttons */
        .btn-add {
            background-color: #ffffff;
            color: #000000;
            border: 1px solid #000000;
            font-size: 0.7rem;
            font-weight: 600;
            padding: 0.3rem 0.6rem;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .btn-add:hover {
            background-color: #f3f4f6;
        }
        .btn-download {
            background-color: #000000;
            color: #ffffff;
            font-weight: 600;
            width: 100%;
            padding: 1.1rem;
            border-radius: 4px;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            cursor: pointer;
            transition: transform 0.1s, box-shadow 0.1s;
        }
        .btn-download:active {
            transform: translateY(2px);
        }

        /* Web Preview Container */
        .preview-scroll-area {
            background-color: #f3f4f6;
            overflow-x: auto;
            overflow-y: auto;
            padding: 2rem;
            display: flex;
            justify-content: center;
            border-left: 1px solid #e5e7eb;
        }
        
        .legal-preview-paper {
            background: #ffffff;
            color: #000000;
            width: 816px; /* Exactly 8.5in */
            min-width: 816px;
            min-height: 1344px; /* Exactly 14in */
            padding: 1.25in 1in 1in 1.25in;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
            font-family: 'Times New Roman', Times, serif;
            font-size: 13pt;
            line-height: 1.6;
            text-align: justify;
        }

        /* Custom Scrollbars */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #f3f4f6; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
    </style>
</head>
<body class="flex flex-col lg:flex-row h-screen">

    <div class="w-full lg:w-[450px] bg-white h-[50vh] lg:h-screen overflow-y-auto flex flex-col relative z-10 shadow-[4px_0_24px_rgba(0,0,0,0.04)]">
        
        <div class="p-6 border-b border-gray-200 sticky top-0 bg-white z-20">
            <h1 class="text-xl font-bold tracking-tight">LADC Engine</h1>
            <p class="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wider">Fazilka Court Format</p>
        </div>

        <div class="p-6 flex flex-col gap-5 flex-grow">
            <div>
                <label class="form-label">Application Type</label>
                <select id="templatePreset" onchange="loadPreset()" class="form-input">
                    <option value="exemption">Application for Exemption</option>
                    <option value="bail">Bail Bond Modification</option>
                    <option value="blank">Custom Blank Document</option>
                </select>
            </div>

            <div>
                <label class="form-label">In The Court Of</label>
                <select id="courtSelect" class="form-input font-medium">
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
                    <label class="form-label">Complainant</label>
                    <input type="text" id="partyOne" value="State" class="form-input">
                </div>
                <div>
                    <label class="form-label">Accused Name</label>
                    <input type="text" id="partyTwo" value="Sandeep Singh @ Budhu." class="form-input">
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="form-label">FIR Number</label>
                    <input type="text" id="firNumber" value="06" class="form-input">
                </div>
                <div>
                    <label class="form-label">FIR Date</label>
                    <input type="text" id="firDate" value="13.01.2026" class="form-input">
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="form-label">Under Section (U/s)</label>
                    <input type="text" id="lawSections" value="21, 27 NDPS Act" class="form-input">
                </div>
                <div>
                    <label class="form-label">Police Station (PS)</label>
                    <input type="text" id="policeStation" value="Amir Khas." class="form-input">
                </div>
            </div>

            <div>
                <label class="form-label">Subject Line</label>
                <textarea id="appSubject" rows="2" class="form-input resize-none"></textarea>
            </div>

            <div>
                <div class="flex justify-between items-center mb-3">
                    <label class="form-label mb-0">Factual Statements</label>
                    <button onclick="addClause('')" class="btn-add">+ Add Row</button>
                </div>
                <div id="clauseBox" class="flex flex-col gap-3">
                    </div>
            </div>

            <div>
                <label class="form-label">Prayer</label>
                <textarea id="prayerText" rows="2" class="form-input resize-none"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="form-label">Filing Place</label>
                    <input type="text" id="filingPlace" value="Fazilka" class="form-input">
                </div>
                <div>
                    <label class="form-label">Filing Date</label>
                    <input type="text" id="filingDate" value="09.04.2026." class="form-input">
                </div>
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
        
        <div class="p-6 border-t border-gray-200 bg-white sticky bottom-0 z-20">
            <button onclick="generateNativePDF()" class="btn-download">
                Download Legal PDF
            </button>
        </div>
    </div>

    <div class="flex-1 h-[50vh] lg:h-screen preview-scroll-area">
        <div id="previewCanvas" class="legal-preview-paper">
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

        window.onload = () => {
            loadPreset();
            ['courtSelect', 'partyOne', 'partyTwo', 'firNumber', 'firDate', 'lawSections', 'policeStation', 'appSubject', 'prayerText', 'filingPlace', 'filingDate', 'counselSelect'].forEach(id => {
                document.getElementById(id).addEventListener('input', updateWebPreview);
            });
        };

        function loadPreset() {
            const config = library[document.getElementById('templatePreset').value];
            document.getElementById('appSubject').value = config.subject;
            document.getElementById('prayerText').value = config.prayer;
            
            document.getElementById('clauseBox').innerHTML = '';
            config.paragraphs.forEach(text => addClause(text));
            updateWebPreview();
        }

        function addClause(text) {
            const id = 'row_' + Date.now();
            const div = document.createElement('div');
            div.id = id;
            div.className = 'flex gap-2 items-start';
            div.innerHTML = \`
                <textarea class="form-input resize-none p-2 text-sm" rows="2" oninput="updateWebPreview()">\${text}</textarea>
                <button onclick="document.getElementById('\${id}').remove(); updateWebPreview();" class="text-gray-400 hover:text-black font-bold p-2 text-lg">&times;</button>
            \`;
            document.getElementById('clauseBox').appendChild(div);
            updateWebPreview();
        }

        /* ----------------------------------------------------
           HTML PREVIEW GENERATOR (For visual feedback only)
        ---------------------------------------------------- */
        function updateWebPreview() {
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
            
            let parHTML = '';
            let idx = 1;
            document.querySelectorAll('#clauseBox textarea').forEach(n => {
                if(n.value.trim()) {
                    parHTML += \`
                    <table style="width: 100%; margin-bottom: 12px; border-collapse: collapse;">
                        <tr><td style="width: 30px; vertical-align: top;">\${idx})</td><td style="vertical-align: top; text-align: justify;">\${n.value.trim()}</td></tr>
                    </table>\`;
                    idx++;
                }
            });

            document.getElementById('previewCanvas').innerHTML = \`
                <div style="text-align: center; font-weight: bold; font-size: 14pt; text-transform: uppercase; margin-bottom: 40px; line-height: 1.4;">\${court}</div>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                    <tr><td style="width: 25%; font-weight: bold; vertical-align: top;">\${p1}</td>
                        <td style="width: 20%; font-weight: bold; vertical-align: top; text-align: center;">v/s</td>
                        <td style="width: 55%; font-weight: bold; vertical-align: top; text-align: left;">\${p2}</td></tr>
                    <tr><td></td><td></td><td style="padding-top: 15px; line-height: 1.5;">FIR No. \${firNo} dated \${firDt},<br>U/s \${sections},<br>PS \${ps}</td></tr>
                </table>
                <div style="font-weight: bold; text-decoration: underline; text-underline-offset: 4px; margin-bottom: 25px; text-align: justify;">\${subject}</div>
                <div style="margin-bottom: 15px;">Respected Sir,</div>
                <div style="margin-bottom: 15px; text-indent: 40px;">It is submitted as follows:</div>
                <div>\${parHTML}</div>
                <div style="margin-top: 25px; margin-bottom: 50px; text-indent: 40px; text-align: justify;">\${prayer}</div>
                <table style="width: 100%; margin-top: 40px;">
                    <tr><td style="vertical-align: bottom;">Place: \${place}<br>Date: \${date}</td>
                        <td style="text-align: right; vertical-align: bottom;">Submitted By<br><br><br><span style="font-weight: bold;">\${p2.replace('.', '')}</span><br>(Accused/applicant)</td></tr>
                </table>
                <div style="text-align: center; margin-top: 50px; width: 50%; margin-left: auto;">Through Counsel<br><br><br><br><span style="font-weight: bold;">\${counsel[0]}</span><br>\${counsel[1]}</div>
            \`;
        }


        /* ----------------------------------------------------
           THE BULLETPROOF NATIVE PDF ENGINE
           Writes text directly onto a digital Legal paper.
           Cannot break on mobile. Always perfect.
        ---------------------------------------------------- */
        function generateNativePDF() {
            const { jsPDF } = window.jspdf;
            // Native format: Legal (8.5 x 14), units in points
            const doc = new jsPDF({ format: 'legal', unit: 'pt' });

            const leftMargin = 90;  // 1.25 inches
            const rightMargin = 72; // 1 inch
            const topMargin = 90;   // 1.25 inches
            const pageWidth = doc.internal.pageSize.getWidth();
            const maxW = pageWidth - leftMargin - rightMargin;

            let y = topMargin;

            // Helper to get text height
            const drawWrappedText = (text, x, startY, options = {}) => {
                const lines = doc.splitTextToSize(text, options.width || maxW);
                lines.forEach(line => {
                    doc.text(line, x, startY, options);
                    startY += 18; // Line spacing
                });
                return startY;
            };

            // 1. Court Heading
            const court = document.getElementById('courtSelect').value;
            doc.setFont("times", "bold");
            doc.setFontSize(13);
            const courtLines = doc.splitTextToSize(court.toUpperCase(), maxW);
            courtLines.forEach(line => {
                let lw = doc.getTextWidth(line);
                doc.text(line, leftMargin + (maxW - lw) / 2, y);
                y += 18;
            });
            y += 20;

            // 2. Parties Header
            const p1 = document.getElementById('partyOne').value;
            const p2 = document.getElementById('partyTwo').value;
            doc.text(p1, leftMargin, y);
            
            doc.setFont("times", "italic");
            let vsW = doc.getTextWidth("v/s");
            doc.text("v/s", leftMargin + (maxW - vsW) / 2, y);
            
            doc.setFont("times", "bold");
            let p2W = doc.getTextWidth(p2);
            doc.text(p2, leftMargin + maxW, y, { align: "right" });
            y += 25;

            // 3. FIR Block (Aligned with right side)
            const firDetails = [
                \`FIR No. \${document.getElementById('firNumber').value} dated \${document.getElementById('firDate').value},\`,
                \`U/s \${document.getElementById('lawSections').value},\`,
                \`PS \${document.getElementById('policeStation').value}\`
            ];
            doc.setFont("times", "normal");
            firDetails.forEach(line => {
                doc.text(line, leftMargin + (maxW * 0.45), y);
                y += 18;
            });
            y += 20;

            // 4. Subject Line
            doc.setFont("times", "bold");
            const subj = document.getElementById('appSubject').value;
            const subjLines = doc.splitTextToSize(subj, maxW);
            subjLines.forEach(line => {
                doc.text(line, leftMargin, y);
                let lw = doc.getTextWidth(line);
                doc.line(leftMargin, y + 2, leftMargin + lw, y + 2); // Manual Underline
                y += 18;
            });
            y += 15;

            // 5. Salutation
            doc.setFont("times", "normal");
            doc.text("Respected Sir,", leftMargin, y); y += 20;
            doc.text("It is submitted as follows:", leftMargin + 30, y); y += 25;

            // 6. Paragraphs
            let idx = 1;
            document.querySelectorAll('#clauseBox textarea').forEach(n => {
                let txt = n.value.trim();
                if(txt) {
                    doc.text(\`\${idx})\`, leftMargin, y);
                    y = drawWrappedText(txt, leftMargin + 30, y, { width: maxW - 30 });
                    y += 10; // Margin below paragraph
                    idx++;
                }
            });
            y += 10;

            // 7. Prayer
            const prayer = document.getElementById('prayerText').value;
            // Indent the first line of the prayer
            doc.text(" ".repeat(15) + prayer.substring(0, 50), leftMargin, y); // Small hack for initial indent visualization
            y = drawWrappedText(prayer, leftMargin, y);
            y += 40;

            // Safety Page Break Check
            if (y > 800) { doc.addPage(); y = 90; }

            // 8. Signatures Block
            const place = document.getElementById('filingPlace').value;
            const date = document.getElementById('filingDate').value;
            
            doc.text(\`Place: \${place}\`, leftMargin, y);
            doc.text("Submitted By", leftMargin + maxW, y, { align: "right" });
            y += 18;
            doc.text(\`Date: \${date}\`, leftMargin, y);
            y += 40;

            doc.setFont("times", "bold");
            doc.text(p2.replace('.',''), leftMargin + maxW, y, { align: "right" });
            y += 15;
            doc.setFont("times", "normal");
            doc.text("(Accused/applicant)", leftMargin + maxW, y, { align: "right" });
            y += 40;

            // 9. Counsel Block
            const counsel = document.getElementById('counselSelect').value.split('|');
            const centerCounselX = leftMargin + (maxW * 0.7);
            
            doc.text("Through Counsel", centerCounselX, y, { align: "center" });
            y += 50;
            doc.setFont("times", "bold");
            doc.text(counsel[0], centerCounselX, y, { align: "center" });
            y += 15;
            doc.setFont("times", "normal");
            doc.text(counsel[1], centerCounselX, y, { align: "center" });

            // Triggers immediate download
            const safeFileName = p2.replace(/[^a-zA-Z0-9]/g, '_');
            doc.save(\`Application_\${safeFileName}.pdf\`);
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
