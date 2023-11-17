const express = require('express');
const { dirname } = require('path');
const path = require('path');
const { fileURLToPath } = require('url');
const hbs = require('express-handlebars');

const port = 3000;
const app = express();

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/partials', express.static(path.join(__dirname, 'views', 'partials')));

app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
app.set('view engine', 'hbs');
app.engine(
  'hbs',
  hbs.engine({
    layoutsDir: path.join(__dirname, 'views', 'citizens'),
    partialsDir: [path.join(__dirname, 'views', 'partials')],
    extname: 'hbs',
    defaultLayout: 'main',
  })
);

app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  let componentData = {
    cssPath: [
      '/partials/ad-card.css',
      '/partials/carousel.css',
      '/partials/sidepeek-ad.css',
      '/partials/sidepeek-noAd.css',
      '/partials/feedback-detail.css',
      '/partials/random-location.css',
      '/partials/dropdown.css',
    ],
  };
  res.render('citizens/main', { componentData });
});

app.listen(port, () => {
  console.log(`Sever is running on http://localhost:${port}`);
});

app.use('/testing', express.static(path.join(__dirname, 'testing')));
app.get('/testing', (req, res) => {
  res.sendFile(__dirname + '/testing/test.html');
});
