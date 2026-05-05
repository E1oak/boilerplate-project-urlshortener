const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => res.sendFile(process.cwd() + '/views/index.html'));

// Memoria ultra rápida
let urls = [];

app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  // Validación por Regex (más rápida que DNS)
  const regex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
  
  if (!regex.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  let index = urls.indexOf(originalUrl);
  if (index === -1) {
    urls.push(originalUrl);
    index = urls.length - 1;
  }
  return res.json({ original_url: originalUrl, short_url: index + 1 });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const id = parseInt(req.params.short_url);
  const originalUrl = urls[id - 1];
  if (originalUrl) {
    // Redirección directa y limpia
    return res.redirect(originalUrl);
  }
  return res.json({ error: "No short URL found" });
});

app.listen(process.env.PORT || 3000);
