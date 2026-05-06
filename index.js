require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns'); // Necesario para la validación sugerida
const urlParser = require('url'); // Para limpiar la URL antes de validarla
const app = express();

// Configuración básica
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Almacenamiento en memoria (Nota: se borra si se reinicia el server)
const urlMap = {};
let idCounter = 1;

// --- RUTA POST PARA ACORTAR URL ---
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  // 1. Validar el formato con URL constructor (más robusto que regex simple)
  try {
    const parsedUrl = new URL(originalUrl);
    
    // 2. Validar que el protocolo sea http o https
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return res.json({ error: 'invalid url' });
    }

    // 3. Verificar que el dominio exista usando el módulo DNS
    dns.lookup(parsedUrl.hostname, (err) => {
      if (err) {
        res.json({ error: 'invalid url' });
      } else {
        // Si todo está bien, guardamos
        const shortUrl = idCounter++;
        urlMap[shortUrl] = originalUrl;
        res.json({ 
          original_url: originalUrl, 
          short_url: shortUrl 
        });
      }
    });
  } catch (err) {
    // Si el constructor de URL falla
    return res.json({ error: 'invalid url' });
  }
});

// --- RUTA GET PARA REDIRECCIÓN ---
app.get('/api/shorturl/:id', (req, res) => {
  const id = req.params.id;
  const original = urlMap[id];
  
  if (original) {
    return res.redirect(original);
  } else {
    res.json({ error: 'No short URL found' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});