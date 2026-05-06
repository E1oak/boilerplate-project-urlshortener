javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); // Añadido para procesar correctamente si FCC envía JSON
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Usar un array es la forma más segura de garantizar IDs numéricos automáticos
const urls = [];

// --------------------------------------------------------
// Ruta POST: Crear URL corta
// --------------------------------------------------------
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  try {
    // 1. Validamos la estructura de la URL de forma sincrónica
    const urlObj = new URL(originalUrl);

    // 2. Verificamos que sea un protocolo web válido
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return res.json({ error: 'invalid url' });
    }

    // 3. Guardamos directamente en el array. 
    urls.push(originalUrl);
    
    // El ID será la longitud actual del array (ej: el primer registro será el ID 1)
    const shortUrlId = urls.length; 
    
    return res.json({ 
      original_url: originalUrl, 
      short_url: shortUrlId 
    });

  } catch (err) {
    // Si new URL() falla, significa que el texto enviado no tiene formato de enlace
    return res.json({ error: 'invalid url' });
  }
});

// --------------------------------------------------------
// Ruta GET: Redirigir
// --------------------------------------------------------
app.get('/api/shorturl/:id', (req, res) => {
  // Convertimos el ID de la URL a un número entero
  const id = parseInt(req.params.id);
  
  // Extraemos la URL del array. 
  // (Restamos 1 porque los arrays empiezan en 0, pero nuestro primer ID es 1)
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
