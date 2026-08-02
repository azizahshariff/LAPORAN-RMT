export default async function handler(req, res) {
  const sheetId = '1jkn6EwdZQRO3dodipb_RlWrMx5kjl579GIr7WeNS5M0';
  const logoUrl = 'https://drive.google.com/uc?export=view&id=1AQkIuFJ3g4QRrSuJVsfzaiy5TbtzXUF8';

  try {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    const response = await fetch(csvUrl);
    
    if (!response.ok) {
      throw new Error("Gagal membaca Google Sheet. Sila pastikan tetapan 'Anyone with the link' telah diaktifkan.");
    }

    const csvText = await response.text();
    const lines = csvText.split('\n');

    let tableRows = '';
    let totalRecords = 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      const clean = (val) => val ? val.replace(/^"|"$/g, '').trim() : '-';

      const tahun = clean(cols[0]);
      const sesi = clean(cols[1]);
      const tarikh = clean(cols[2]);
      const masa = clean(cols[3]);
      const guru = clean(cols[4]);
      const menu = clean(cols[5]);
      const buah = clean(cols[6]);
      
      const pdfUrl = clean(cols[cols.length - 1]);
      const hasPdf = pdfUrl.startsWith('http');

      totalRecords++;

      tableRows += `
        <tr>
          <td style="text-align:center; font-weight:bold; color:#4a5568;">${totalRecords}</td>
          <td><span class="badge-tahun">${tahun}</span></td>
          <td><span class="badge-sesi">${sesi}</span></td>
          <td>${tarikh}</td>
          <td>${masa}</td>
          <td><strong>${guru}</strong></td>
          <td>${menu}</td>
          <td>${buah}</td>
          <td style="text-align:center;">
            ${hasPdf ? `<a href="${pdfUrl}" target="_blank" class="btn-pdf">Buka PDF</a>` : '<span style="color:#e53e3e; font-size:9pt; font-weight:bold;">Belum Dijana</span>'}
          </td>
        </tr>
      `;
    }

    const html = `
      <!DOCTYPE html>
      <html lang="ms">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Dashboard RMT SK Simpang Rengam</title>
          <style>
              :root {
                  --primary: #1e3a8a;
                  --secondary: #3b82f6;
                  --success: #10b981;
                  --danger: #ef4444;
                  --background: #f8fafc;
                  --surface: #ffffff;
                  --text: #1e293b;
                  --border: #e2e8f0;
              }
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: var(--background); margin: 0; padding: 20px; color: var(--text); }
              .container { max-width: 1350px; margin: 0 auto; background: var(--surface); padding: 30px; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
              .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px double var(--primary); padding-bottom: 20px; margin-bottom: 25px; flex-wrap: wrap; gap: 20px; }
              .school-info { display: flex; align-items: center; gap: 20px; }
              .school-logo { width: 75px; height: 75px; object-fit: contain; }
              .title-group h1 { color: var(--primary); margin: 0; font-size: 22px; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px; }
              .title-group h2 { color: var(--secondary); margin: 5px 0 0; font-size: 14px; font-weight: 600; text-transform: uppercase; }
              .actions-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; flex-wrap: wrap; gap: 15px; }
              .btn-group { display: flex; gap: 10px; flex-wrap: wrap; }
              .btn { background: var(--primary); color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 10pt; border: none; cursor: pointer; transition: background 0.2s, transform 0.1s; display: inline-flex; align-items: center; gap: 8px; }
              .btn:hover { background: #1e40af; transform: translateY(-1px); }
              .btn-success { background: var(--success); }
              .btn-success:hover { background: #059669; }
              .btn-danger { background: var(--danger); }
              .btn-danger:hover { background: #dc2626; }
              .search-box { padding: 10px 15px; width: 320px; border: 1px solid var(--border); border-radius: 8px; font-size: 14px; outline: none; transition: border-color 0.2s; }
              .search-box:focus { border-color: var(--secondary); box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
              .table-container { border: 1px solid var(--border); border-radius: 12px; overflow-x: auto; background: white; }
              table { width: 100%; border-collapse: collapse; text-align: left; white-space: nowrap; }
              th, td { padding: 14px 16px; border-bottom: 1px solid var(--border); font-size: 9.5pt; }
              th { background-color: #f1f5f9; color: #475569; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; }
              tr:hover { background-color: #f8fafc; }
              .badge-tahun { background: #e0f2fe; color: #0369a1; padding: 4px 8px; border-radius: 6px; font-weight: 700; font-size: 9pt; }
              .badge-sesi { background: #fef3c7; color: #b45309; padding: 4px 8px; border-radius: 6px; font-weight: 700; font-size: 9pt; }
              .btn-pdf { background: var(--secondary); color: white; padding: 6px 12px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 9pt; display: inline-block; transition: background 0.2s; }
              .btn-pdf:hover { background: #2563eb; }
              .stats-bar { display: flex; gap: 20px; margin-bottom: 20px; flex-wrap: wrap; }
              .stat-card { background: #f1f5f9; padding: 15px 20px; border-radius: 10px; border-left: 4px solid var(--primary); min-width: 200px; }
              .stat-card h4 { margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase; }
              .stat-card p { margin: 5px 0 0; font-size: 20px; font-weight: 700; color: var(--primary); }
              @media print {
                body { background: white; padding: 0; }
                .container { box-shadow: none; padding: 0; max-width: 100%; }
                .actions-bar, .stats-bar, .btn-pdf, th:last-child, td:last-child { display: none !important; }
              }
          </style>
      </head>
      <body>
      <div class="container">
        <div class="header">
          <div class="school-info">
            <img src="${logoUrl}" alt="Logo SK Simpang Rengam" class="school-logo" onerror="this.style.display='none'">
            <div class="title-group">
              <h2>SEKOLAH KEBANGSAAN SIMPANG RENGAM, JOHOR</h2>
              <h1>DASHBOARD RASMI LAPORAN RMT (2023 - 2025)</h1>
            </div>
          </div>
          <div>
            <span class="badge-tahun" style="font-size: 11pt; padding: 8px 14px;">Sistem v9.0 Aktif</span>
          </div>
        </div>

        <div class="stats-bar">
          <div class="stat-card">
            <h4>Jumlah Rekod</h4>
            <p>${totalRecords} Laporan</p>
          </div>
          <div class="stat-card" style="border-left-color: var(--success);">
            <h4>Status Pelayan</h4>
            <p style="color: var(--success);">Online & Stabil</p>
          </div>
        </div>

        <div class="actions-bar">
          <div class="btn-group">
            <a class="btn" href="https://docs.google.com/spreadsheets/d/${sheetId}/edit" target="_blank">
              📁 Buka Google Sheet Asal
            </a>
            <button class="btn btn-danger" onclick="window.print()">
              🖨️ Cetak / Muat Turun Laporan Penuh (PDF)
            </button>
          </div>
          <input type="text" id="searchInput" class="search-box" placeholder="Cari guru, menu, tarikh, sesi..." onkeyup="searchTable()">
        </div>

        <div class="table-container">
          <table id="reportTable">
            <thead>
              <tr>
                <th>Bil</th>
                <th>Tahun</th>
                <th>Sesi</th>
                <th>Tarikh</th>
                <th>Masa</th>
                <th>Guru Bertugas</th>
                <th>Menu Makanan</th>
                <th>Buah-buahan</th>
                <th style="text-align:center;">Pautan PDF</th>
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
    res.status(500).send(`<h3 style="color:red; font-family:Arial;">Ralat Pelayan Vercel:</h3><pre>${error.message}</pre>`);
  }
}
