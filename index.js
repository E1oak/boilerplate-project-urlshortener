require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

const urls = [];

app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  try {
    const urlObj = new URL(originalUrl);
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return res.json({ error: 'invalid url' });
    }
    urls.push(originalUrl);
    const shortUrlId = urls.length; 
    return res.json({ 
      original_url: originalUrl, 
      short_url: shortUrlId 
    });
  } catch (err) {
    return res.json({ error: 'invalid url' });
  }
});

// CAMBIO AQUÍ: Cambiamos :id por :short_url para que freeCodeCamp lo encuentre
app.get('/api/shorturl/:short_url', (req, res) => {
  const id = parseInt(req.params.short_url);
  const originalUrl = urls[id - 1];

  if (originalUrl) {
    return res.redirect(originalUrl);
  } else {
    return res.json({ error: 'No short URL found' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor listo en el puerto ${port}`);
});
