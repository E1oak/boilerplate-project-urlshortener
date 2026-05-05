require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// MEMORIA PARA LAS URLS
let urls = [];

// RUTA POST (PUNTOS 2 Y 4)
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  
  try {
    const urlObj = new URL(originalUrl);
    
    // Validación de formato para el punto 4
    if (!/^https?:\/\//i.test(originalUrl)) {
      return res.json({ error: 'invalid url' });
    }

    dns.lookup(urlObj.hostname, (err) => {
      if (err) {
        return res.json({ error: 'invalid url' });
      } else {
        let index = urls.indexOf(originalUrl);
        if (index === -1) {
          urls.push(originalUrl);
          index = urls.length - 1;
        }
        return res.json({ 
          original_url: originalUrl, 
          short_url: index + 1 
        });
      }
    });
  } catch (e) {
    return res.json({ error: 'invalid url' });
  }
});

// RUTA GET (EL FAMOSO PUNTO 3)
app.get('/api/shorturl/:short_url', (req, res) => {
  const id = req.params.short_url;
  const originalUrl = urls[parseInt(id) - 1];

  if (originalUrl) {
    // Esta es la forma más directa y rápida de redirigir
    res.writeHead(302, { Location: originalUrl });
    return res.end();
  } else {
    return res.json({ error: "No short URL found" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor funcionando en el puerto ${port}`);
});
