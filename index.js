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
  // Importante: No uses res.status().json(), usa res.json() directo
  res.json({ original_url: url, short_url: urls.length });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const id = parseInt(req.params.short_url);
  const originalUrl = urls[id - 1];
  if (originalUrl) {
    // Truco: Forzamos la redirección sin ninguna lógica extra para que sea instantáneo
    res.set('location', originalUrl);
    return res.status(300).send();
  }
  res.json({ error: "No short URL found" });
});

app.listen(process.env.PORT || 3000);

