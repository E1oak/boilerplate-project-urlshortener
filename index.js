const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => res.sendFile(process.cwd() + '/views/index.html'));

let urls = [];

app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  try {
    const urlObj = new URL(originalUrl);
    if (!/^https?:\/\//i.test(originalUrl)) {
      return res.json({ error: 'invalid url' });
    }
    dns.lookup(urlObj.hostname, (err) => {
      if (err) return res.json({ error: 'invalid url' });
      // Evitamos duplicados para no confundir al test
      let index = urls.indexOf(originalUrl);
      if (index === -1) {
        urls.push(originalUrl);
        index = urls.length - 1;
      }
      res.json({ original_url: originalUrl, short_url: index + 1 });
    });
  } catch (e) {
    res.json({ error: 'invalid url' });
  }
});

// ESTA RUTA DEBE SER ASÍ EXACTAMENTE
app.get('/api/shorturl/:short_url', (req, res) => {
  const id = parseInt(req.params.short_url);
  const originalUrl = urls[id - 1];
  if (originalUrl) {
    return res.redirect(originalUrl); // Redirección estándar 302
  }
  res.json({ error: "No short URL found" });
});

app.listen(process.env.PORT || 3000);
