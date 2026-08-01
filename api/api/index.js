export default async function handler(req, res) {
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="ms">
    <head>
        <meta charset="UTF-8">
        <title>Dashboard RMT SK Simpang Rengam</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f7fafc; margin: 0; padding: 20px; color: #2d3748; }
            .container { max-width: 1000px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); text-align: center; }
            h1 { color: #1a365d; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Sistem Dashboard RMT SK Simpang Rengam</h1>
            <p>Tahniah! Sambungan Vercel anda sudah berjaya diaktifkan.</p>
        </div>
    </body>
    </html>
  `);
}
