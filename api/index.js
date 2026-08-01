const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

export default async function handler(req, res) {
  try {
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    let tableRows = '';
    rows.forEach((row, index) => {
      const rowNum = index + 1;
      const rowData = row._rawData || [];
      
      const tahun = rowData[0] || '-';
      const tarikh = rowData[1] || '-';
      const sesi = rowData[2] || '-';
      const guru = rowData[3] || '-';
      
      const pdfUrl = rowData[rowData.length - 1] && rowData[rowData.length - 1].toString().startsWith('http') 
                     ? rowData[rowData.length - 1] 
                     : '';

      tableRows += `
        <tr>
          <td style="text-align:center;">${rowNum}</td>
          <td><strong>${tahun}</strong></td>
          <td>${tarikh}</td>
          <td>${sesi}</td>
          <td>${guru}</td>
          <td style="text-align:center;">
            ${pdfUrl ? `<a href="${pdfUrl}" target="_blank" class="btn-pdf">Buka / Muat Turun PDF</a>` : '<span style="color:#e53e3e; font-size:9.5pt;">Belum Dijana</span>'}
          </td>
        </tr>
      `;
    });

    const html = `
      <!DOCTYPE html>
      <html lang="ms">
      <head>
          <meta charset="UTF-8">
          <title>Dashboard RMT SK Simpang Rengam</title>
          <style>
              body { font-family: Arial, sans-serif; background-color: #f7fafc; margin: 0; padding: 20px; color: #2d3748; }
              .container { max-width: 1100px; margin: 0 auto; background: #ffffff; padding: 25px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
              .header { text-align: center; border-bottom: 3px double #1a365d; padding-bottom: 15px; margin-bottom: 20px; }
              .header h1 { color: #1a365d; margin: 5px 0; font-size: 20px; text-transform: uppercase; }
              .header h2 { color: #2b6cb0; margin: 0; font-size: 14px; }
              .actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px; }
              .btn-sheet { background: #38a169; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 10pt; }
              .btn-sheet:hover { background: #2f855a; }
              .search-box { padding: 10px; width: 300px; border: 1px solid #cbd5e0; border-radius: 6px; font-size: 14px; }
              .table-wrapper { border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden; }
              table { width: 100%; border-collapse: collapse; }
              th, td { padding: 12px 15px; border-bottom: 1px solid #e2e8f0; text-align: left; font-size: 10pt; }
              th { background-color: #edf2f7; color: #2d3748; text-transform: uppercase; }
              tr:nth-child(even) { background-color: #f8fafc; }
              .btn-pdf { background: #3182ce; color: white; padding: 6px 14px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 9.5pt; display: inline-block; }
              .btn-pdf:hover { background: #2b6cb0; }
          </style>
      </head>
      <body>
      <div class="container">
        <div class="header">
          <h2>SEKOLAH KEBANGSAAN SIMPANG RENGAM</h2>
          <h1>DASHBOARD LAPORAN RMT</h1>
        </div>
        <div class="actions">
          <a class="btn-sheet" href="https://docs.google.com/spreadsheets/d/19fh2btp6AVkJbzMajeFq6e9FFFBMxv0brGiUb6oezMo/edit" target="_blank">Buka Google Sheet RMT</a>
          <input type="text" id="searchInput" class="search-box" placeholder="Cari rekod..." onkeyup="searchTable()">
        </div>
        <div class="table-wrapper">
          <table id="reportTable">
            <thead>
              <tr>
                <th>Bil</th>
                <th>Tahun</th>
                <th>Tarikh</th>
                <th>Sesi</th>
                <th>Guru Bertugas</th>
                <th style="text-align:center;">Laporan PDF</th>
              </tr>
            </thead>
            <tbody id="tableBody">
              ${tableRows}
            </tbody>
          </table>
        </div>
      </div>
      <script>
        function searchTable() {
          let input = document.getElementById("searchInput").value.toLowerCase();
          let rows = document.getElementById("tableBody").getElementsByTagName("tr");
          for (let i = 0; i < rows.length; i++) {
            let text = rows[i].textContent.toLowerCase();
            rows[i].style.display = text.includes(input) ? "" : "none";
          }
        }
      </script>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send(`<h3 style="color:red; font-family:Arial;">Ralat Sambungan Vercel ke Google Sheet:</h3><pre>${error.message}</pre>`);
  }
}
