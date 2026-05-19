export default {
  async fetch(request, env, ctx) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LADC Exemption Application Generator</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Montserrat', sans-serif; background: linear-gradient(135deg, #1e293b, #0f172a); color: #f8fafc; min-height: 100vh; }
        .glass-panel { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 1rem; }
        
        /* Document Preview Styles */
        #document-preview { background: white; color: black; font-family: 'Calibri', Arial, sans-serif; width: 100%; max-width: 8.5in; margin: 0 auto; padding: 1in; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); border-radius: 4px; font-size: 14pt; line-height: 1.8; text-align: justify; }
        .doc-header { text-align: center; font-weight: bold; font-size: 15pt; text-transform: uppercase; margin-bottom: 40px; }
        .doc-parties { display: flex; justify-content: space-between; margin-bottom: 30px; font-weight: bold; }
        .doc-vs { text-align: center; font-weight: bold; margin: 0 20px; }
        .doc-fir-details { margin-left: auto; width: 50%; text-align: left; margin-bottom: 40px; font-weight: bold; line-height: 1.5; }
        .doc-title { font-weight: bold; text-align: justify; margin-bottom: 30px; text-decoration: underline; text-underline-offset: 4px;}
        .doc-salutation { margin-bottom: 20px; }
        .doc-list { margin-top: 15px; margin-bottom: 30px; padding-left: 20px; list-style-type: none;}
        .doc-list li { margin-bottom: 15px; text-indent: -20px;}
        .doc-prayer { text-indent: 50px; margin-bottom: 50px; line-height: 1.8; }
        .doc-footer { display: flex; justify-content: space-between; margin-top: 40px; }
        .doc-signatures { text-align: right; line-height: 1.5; }
        .doc-counsel { margin-top: 60px; text-align: center; width: 50%; margin-left: auto; line-height: 1.5; }
        
        /* Hide scrollbar for aesthetics but allow scrolling */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
    </style>
</head>
<body class="p-4 md:p-8 flex flex-col lg:flex-row gap-8">

    <div class="glass-panel p-6 w-full lg:w-1/3 flex flex-col gap-5 h-fit sticky top-8">
        <h2 class="text-2xl font-bold tracking-wide text-white mb-2">Exemption Generator</h2>
        
        <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-300 font-medium">Select Court</label>
            <select id="courtName" class="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                <option value="IN THE COURT OF SH. DHARMINDER PAUL SINGLA, SESSIONS JUDGE, FAZILKA">Sh. Dharminder Paul Singla, Sessions Judge</option>
                <option value="IN THE COURT OF SH. KRISHAN KUMAR SINGLA, ASJ, FAZILKA">Sh. Krishan Kumar Singla, ASJ</option>
                <option value="IN THE COURT OF MRS. PAMELPREET GREWAL KAHAL, JUDGE, SPECIAL COURT, FAZILKA" selected>Mrs. Pamelpreet Grewal Kahal, Special Court</option>
                <option value="IN THE COURT OF SH. AJIT PAL SINGH, ASJ, FAZILKA">Sh. Ajit Pal Singh, ASJ</option>
                <option value="IN THE COURT OF SH. HARPREET SINGH, JMIC, FAZILKA">Sh. Harpreet Singh, JMIC</option>
                <option value="IN THE COURT OF MS. KARAMWINDER KAUR, JMIC, FAZILKA">Ms. Karamwinder Kaur, JMIC</option>
                <option value="IN THE COURT OF MS. RAVLEEN KAUR, JMIC, FAZILKA">Ms. Ravleen Kaur, JMIC</option>
            </select>
        </div>

        <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-300 font-medium">Accused Name (e.g., Sandeep Singh @ Budhu)</label>
            <input type="text" id="accusedName" value="Sandeep Singh @ Budhu" class="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none">
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
                <label class="text-sm text-gray-300 font-medium">FIR No.</label>
                <input type="text" id="firNo" value="06" class="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none">
            </div>
            <div class="flex flex-col gap-1">
                <label class="text-sm text-gray-300 font-medium">FIR Date</label>
                <input type="text" id="firDate" value="13.01.2026" class="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none">
            </div>
        </div>

        <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-300 font-medium">Under Section (U/s)</label>
            <input type="text" id="usSection" value="21, 27 NDPS Act" class="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none">
        </div>

        <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-300 font-medium">Police Station (PS)</label>
            <input type="text" id="psName" value="Amir Khas" class="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none">
        </div>

        <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-300 font-medium">Application Date</label>
            <input type="text" id="appDate" value="09.04.2026" class="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none">
        </div>

        <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-300 font-medium">Through Counsel</label>
            <select id="counselDetails" class="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                <option value="Baltej Singh Brar, Advocate|Chief, LADC, Fazilka.">Baltej Singh Brar (Chief)</option>
                <option value="Hardeep Singh Dhaliwal, Advocate|Deputy Chief, LADC, Fazilka." selected>Hardeep Singh Dhaliwal (Deputy Chief)</option>
                <option value="Sunil Rangbulla, Advocate|Deputy Chief, LADC, Fazilka.">Sunil Rangbulla (Deputy Chief)</option>
                <option value="Rajvinder Kaur, Advocate|Assistant, LADC, Fazilka.">Rajvinder Kaur (Assistant)</option>
                <option value="Amisha, Advocate|Assistant, LADC, Fazilka.">Amisha (Assistant)</option>
                <option value="Naazpreet Kaur, Advocate|Assistant, LADC, Fazilka.">Naazpreet Kaur (Assistant)</option>
            </select>
        </div>

        <button onclick="generatePDF()" class="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Generate PDF
        </button>
    </div>

    <div class="w-full lg:w-2/3 overflow-x-auto pb-10">
        <div id="document-preview">
            <div class="doc-header" id="out-court">IN THE COURT OF MRS. PAMELPREET GREWAL KAHAL, JUDGE, SPECIAL COURT, FAZILKA</div>
            
            <div class="doc-parties">
                <div>State</div>
                <div class="doc-vs">v/s</div>
                <div id="out-accused-top">Sandeep Singh @ Budhu.</div>
            </div>

            <div class="doc-fir-details">
                <div>FIR No. <span id="out-fir">06</span> dated <span id="out-fir-date">13.01.2026</span>,</div>
                <div>U/s <span id="out-us">21, 27 NDPS Act</span>,</div>
                <div>PS <span id="out-ps">Amir Khas</span>.</div>
            </div>

            <div class="doc-title">
                Application for exemption of personal appearance of accused/applicant <span id="out-accused-title">Sandeep Singh @ Budhu</span>.
            </div>

            <div class="doc-salutation">Respected Sir,</div>
            <div>It is submitted as follows:</div>

            <ul class="doc-list">
                <li>1) That the above noted case is pending before this Hon'ble court and same is fixed for today.</li>
                <li>2) That the above noted case accused/applicant is unable to appear before this Hon'ble court due to illness. (A telephone message has been received)</li>
                <li>3) That the absence of accused applicant is neither willful nor intentional but due to reason stated above.</li>
            </ul>

            <div class="doc-prayer">
                It is therefore requested that in the lite of facts and circumstance mentioned above personal appearance of accused may kindly be exempted for today only.
            </div>

            <div class="doc-footer">
                <div>
                    <div>Place: Fazilka</div>
                    <div>Date: <span id="out-app-date">09.04.2026</span>.</div>
                </div>
                <div class="doc-signatures">
                    <div>Submitted By</div>
                    <div id="out-accused-sign">Sandeep Singh @ Budhu</div>
                    <div>(Accused/applicant)</div>
                </div>
            </div>

            <div class="doc-counsel">
                <div>Through Counsel</div>
                <br><br><br>
                <div id="out-counsel-name" style="font-weight: bold;">Hardeep Singh Dhaliwal, Advocate</div>
                <div id="out-counsel-designation">Deputy Chief, LADC, Fazilka.</div>
            </div>
        </div>
    </div>

    <script>
        // Live Preview Update Logic
        const inputs = ['courtName', 'accusedName', 'firNo', 'firDate', 'usSection', 'psName', 'appDate', 'counselDetails'];
        
        inputs.forEach(id => {
            document.getElementById(id).addEventListener('input', updatePreview);
            document.getElementById(id).addEventListener('change', updatePreview);
        });

        function updatePreview() {
            document.getElementById('out-court').innerText = document.getElementById('courtName').value;
            
            const accused = document.getElementById('accusedName').value;
            document.getElementById('out-accused-top').innerText = accused + ".";
            document.getElementById('out-accused-title').innerText = accused;
            document.getElementById('out-accused-sign').innerText = accused;
            
            document.getElementById('out-fir').innerText = document.getElementById('firNo').value;
            document.getElementById('out-fir-date').innerText = document.getElementById('firDate').value;
            document.getElementById('out-us').innerText = document.getElementById('usSection').value;
            document.getElementById('out-ps').innerText = document.getElementById('psName').value;
            document.getElementById('out-app-date').innerText = document.getElementById('appDate').value;

            const counsel = document.getElementById('counselDetails').value.split('|');
            document.getElementById('out-counsel-name').innerText = counsel[0];
            document.getElementById('out-counsel-designation').innerText = counsel[1];
        }

        // PDF Generation via html2pdf
        function generatePDF() {
            const element = document.getElementById('document-preview');
            const accusedName = document.getElementById('accusedName').value.replace(/[^a-zA-Z0-9]/g, '_');
            const date = document.getElementById('appDate').value.replace(/\\./g, '-');
            
            const opt = {
                margin:       [1, 1, 1, 1], // Top, Left, Bottom, Right in inches
                filename:     \`Exemption_\${accusedName}_\${date}.pdf\`,
                image:        { type: 'jpeg', quality: 1 },
                html2canvas:  { scale: 2, useCORS: true, logging: false },
                jsPDF:        { unit: 'in', format: 'legal', orientation: 'portrait' }
            };

            // Temporarily adjust box shadow for clean print
            element.style.boxShadow = 'none';
            
            html2pdf().set(opt).from(element).save().then(() => {
                // Restore shadow after saving
                element.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.5)';
            });
        }
    </script>
</body>
</html>
    `;

    return new Response(html, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    });
  },
};
