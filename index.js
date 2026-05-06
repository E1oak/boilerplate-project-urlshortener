require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const { URL } = require('url');

const app = express();

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(`${process.cwd()}/public`));

// Home
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// "Base de datos" en memoria
let urlDatabase = {};
let counter = 1;

// POST - crear short URL
app.post('/api/shorturl', (req, res) => {
  const inputUrl = req.body.url;

  let hostname;
  try {
    const parsedUrl = new URL(inputUrl);
    hostname = parsedUrl.hostname;
  } catch (err) {
    return res.json({ error: 'invalid url' });
  }

  // Verificar dominio con DNS (requisito FCC)
  dns.lookup(hostname, (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    const shortUrl = counter;
    urlDatabase[shortUrl] = inputUrl;

    counter++;

    res.json({
      original_url: inputUrl,
      short_url: shortUrl
    });
  });
});

// GET - redirección
app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = req.params.short_url;

  if (urlDatabase[shortUrl]) {
    return res.redirect(urlDatabase[shortUrl]); // 🔥 clave para pasar el test
  }

  res.json({ error: 'No short URL found' });
});

// Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});