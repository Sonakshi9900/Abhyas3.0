const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('../server/config/db');

dotenv.config({ path: path.join(__dirname, '../server/.env') });

const app = express();

// Connect DB (graceful fallback if MONGO_URI is missing or offline)
connectDB();

app.use(cors());
app.use(express.json());

// Serve static notes listing
app.get(['/notes', '/notes/'], (req, res) => {
  const notesPath = path.join(__dirname, '../server/public/notes');
  fs.readdir(notesPath, (err, files) => {
    if (err) return res.status(500).send('Error reading notes directory.');
    const pdfFiles = (files || []).filter(f => f.endsWith('.pdf')).sort();
    const items = pdfFiles.map(file => {
      const url = `/notes/${encodeURIComponent(file)}`;
      return `<li style="margin-bottom: 8px; padding: 10px 14px; background: #f1f5f9; border-radius: 6px;">
        <a href="${url}" target="_blank" style="color: #2b6cb0; font-weight: 600; text-decoration: none; font-size: 14.5px;">
          📄 ${file}
        </a>
      </li>`;
    }).join('\n');

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>AbhyasTRE - D.El.Ed PDF Notes Directory</title>
        <meta charset="utf-8">
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background: #f8fafc; color: #1e293b; padding: 40px 20px; margin: 0; }
          .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
          h1 { color: #1c2541; font-size: 22px; margin-top: 0; }
          ul { list-style: none; padding: 0; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>📚 AbhyasTRE D.El.Ed PDF Notes Directory</h1>
          <p style="color: #64748b; font-size: 14px;">Select any PDF note below to view or download:</p>
          <ul>${items}</ul>
        </div>
      </body>
      </html>
    `);
  });
});

app.use('/notes', express.static(path.join(__dirname, '../server/public/notes')));

// API Routes
app.use('/api/questions', require('../server/routes/api/questions'));
app.use('/api/papers', require('../server/routes/api/papers'));
app.use('/api/attempts', require('../server/routes/api/attempts'));
app.use('/api/stats', require('../server/routes/api/stats'));
app.use('/api/notes', require('../server/routes/api/notes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AbhyasTRE Backend Server is running successfully on Vercel!' });
});

module.exports = app;
