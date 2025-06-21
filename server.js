const express = require('express');
const path = require('path');

const app = express();
const PORT = 5000;

// Serve static files from public directory
app.use(express.static('public'));

// Serve index.html for all non-file routes (SPA)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Construction Budget Manager running at http://localhost:${PORT}`);
});