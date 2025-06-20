const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // <--- Tambahkan ini

const app = express();
const PORT = 4000;

// Aktifkan CORS
app.use(cors()); // <--- Tambahkan ini

// Endpoint untuk stream file PDF
app.get('/pdf', (req, res) => {
  const filePath = path.join(__dirname, 'pdf', 'file.pdf');

  const range = req.headers.range;
  if (!range) {
    return res.status(400).send("Range header dibutuhkan untuk streaming PDF.");
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;

  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

  const chunkSize = (end - start) + 1;
  const file = fs.createReadStream(filePath, { start, end });

  const head = {
    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunkSize,
    'Content-Type': 'application/pdf',
  };

  res.writeHead(206, head);
  file.pipe(res);
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
