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
  if (!/^https?:\/\//.test(url)) return res.json({ error: 'invalid url' });
  urls.push(url);
  res.json({ original_url: url, short_url: urls.length });
});

// REDIRECCIÓN ULTRA RÁPIDA
app.get('/api/shorturl/:short_url', (req, res) => {
  const id = parseInt(req.params.short_url);
  const originalUrl = urls[id - 1];
  if (originalUrl) {
    // Forzamos el código 302 que es el que mejor lee el test
    return res.status(302).redirect(originalUrl);
  }
  res.json({ error: "No short URL found" });
});

app.listen(process.env.PORT || 3000);
