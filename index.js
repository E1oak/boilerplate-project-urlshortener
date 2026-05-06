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
  // Validación para el punto 4 (debe ser "invalid url" en minúsculas)
  if (!/^https?:\/\//.test(url)) {
    return res.json({ error: 'invalid url' });
  }
  urls.push(url);
  res.json({ original_url: url, short_url: urls.length });
});

// Cambiamos :id por :short_url para que el test lo reconozca
app.get('/api/shorturl/:short_url', (req, res) => {
  const url = urls[parseInt(req.params.short_url) - 1];
  if (url) {
    return res.redirect(url);
  }
  res.json({ error: "No short URL found" });
});

app.listen(process.env.PORT || 3000);
