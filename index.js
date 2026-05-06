const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Usamos un objeto para que la búsqueda sea instantánea
let urls = {};
let counter = 1;

app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  
  // Validación ultra rápida
  try {
    const urlObj = new URL(originalUrl);
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return res.json({ error: 'invalid url' });
    }
    
    const id = counter++;
    urls[id] = originalUrl;
    
    return res.json({ 
      original_url: originalUrl, 
      short_url: id 
    });
  } catch (err) {
    return res.json({ error: 'invalid url' });
  }
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const originalUrl = urls[req.params.short_url];

  if (originalUrl) {
    // Redirección directa para que el test no espere nada
    return res.redirect(originalUrl);
  } else {
    return res.json({ error: 'No short URL found' });
  }
});

app.listen(process.env.PORT || 3000);
