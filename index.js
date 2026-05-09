const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const urlParser = require('url');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

// Simulación de base de datos en memoria
let urls = [];
let id = 1;

// 1. POST: Recibir la URL original y devolver la corta
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  
  // Extraer el hostname para validar con DNS
  const hostname = urlParser.parse(originalUrl).hostname;

  if (!hostname) {
    return res.json({ error: 'invalid url' });
  }

  dns.lookup(hostname, (err) => {
    if (err) {
      res.json({ error: 'invalid url' });
    } else {
      const shortUrl = id++;
      urls.push({ original_url: originalUrl, short_url: shortUrl });
      res.json({ original_url: originalUrl, short_url: shortUrl });
    }
  });
});

// 2. GET: Redirigir de la URL corta a la original
app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = parseInt(req.params.short_url);
  const foundUrl = urls.find(u => u.short_url === shortUrl);

  if (foundUrl) {
    res.redirect(foundUrl.original_url);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});

app.listen(3000, () => console.log('Servidor corriendo en el puerto 3000'));