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
  // Validación ultra rápida para el punto 4
  if (!/^https?:\/\//.test(url)) {
    return res.json({ error: 'invalid url' });
  }
  urls.push(url);
  res.json({ original_url: url, short_url: urls.length });
});

app.get('/api/shorturl/:id', (req, res) => {
  const url = urls[parseInt(req.params.id) - 1];
  if (url) return res.redirect(url);
  res.json({ error: "No short URL found" });
});

app.listen(process.env.PORT || 3000);
