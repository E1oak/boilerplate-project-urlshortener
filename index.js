const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const urlParser = require('url');
const app = express();

// Configuración básica y Middlewares
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

// Servir archivos estáticos (CSS/Imágenes) desde la carpeta 'public'
app.use('/public', express.static(`${process.cwd()}/public`));

// Simulación de base de datos en memoria
let urls = [];
let id = 1;

// --- RUTAS DE NAVEGACIÓN ---

// Ruta principal: envía el archivo HTML al navegador
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// --- RUTAS DE LA API ---

// 1. POST: Recibir la URL original y devolver la corta
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  
  // Extraer el hostname para validar con DNS (ej: google.com)
  const hostname = urlParser.parse(originalUrl).hostname;

  // Si no hay hostname (URL mal formateada), responder error
  if (!hostname) {
    return res.json({ error: 'invalid url' });
  }

  // Verificar si el dominio existe realmente
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

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});