require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

const urlMap = {};
let idCounter = 1;

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;
  const regex = /^https?:\/\/(www\.)?.+/;
  if (!regex.test(url)) return res.json({ error: 'invalid url' });

  const short = idCounter++;
  urlMap[short] = url;
  res.json({ original_url: url, short_url: short });
});

app.get('/api/shorturl/:id', (req, res) => {
  const id = req.params.id;
  const original = urlMap[id] || urlMap[parseInt(id)];
  if (original) return res.redirect(original);
  res.json({ error: 'No short URL found' });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port 3000');
});
