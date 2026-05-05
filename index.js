const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => res.sendFile(process.cwd() + '/views/index.html'));

let urls = [];

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;
  if (!url.startsWith('http')) {
    return res.json({ error: 'invalid url' });
  }
  urls.push(url);
  return res.json({ original_url: url, short_url: urls.length });
});

// REDIRECCIÓN SIN PROCESAMIENTO
app.get('/api/shorturl/:short_url', (req, res) => {
  const originalUrl = urls[req.params.short_url - 1];
  if (originalUrl) {
    return res.redirect(originalUrl);
  }
  res.json({ error: "No short URL found" });
});

app.listen(process.env.PORT || 3000);
