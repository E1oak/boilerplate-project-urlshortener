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
      const shortUrl = urls.length + 1;
      urls.push(originalUrl);
      res.json({ original_url: originalUrl, short_url: shortUrl });
    });
  } catch (e) {
    res.json({ error: 'invalid url' });
  }
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const id = parseInt(req.params.short_url);
  const originalUrl = urls[id - 1];
  if (originalUrl) {
    // Redirección simple (302) que es la que prefiere el test
    return res.redirect(originalUrl);
  }
  res.json({ error: "No short URL found" });
});

app.listen(process.env.PORT || 3000);
