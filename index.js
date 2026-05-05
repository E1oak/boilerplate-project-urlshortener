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
  // El punto 4 pide validar que empiece con http o https
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return res.json({ error: 'invalid url' });
  }
  urls.push(url);
  return res.json({ original_url: url, short_url: urls.length });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const id = parseInt(req.params.short_url);
  const originalUrl = urls[id - 1];
  
  if (originalUrl) {
    // Redirección 302 estándar (la que mejor reconoce el test)
    return res.redirect(302, originalUrl);
  }
  return res.json({ error: "No short URL found" });
});

app.listen(process.env.PORT || 3000);
