const express = require('express');
const { dirname } = require('path');
const path = require('path');
const { fileURLToPath } = require('url');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
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
      '/public/css/ad-card.css',
      '/public/css/ad-detail.css',
      '/public/css/carousel.css',
      '/public/css/carousel-swipe.css',
      '/public/css/sidepeek-ad.css',
      '/public/css/sidepeek-noAd.css',
      '/public/css/feedback-detail.css',
      '/public/css/random-location.css',
      '/public/css/dropdown.css',
      '/public/css/feedback-form.css',
      '/public/css/upload-file.css',
      '/public/css/maps.css',
      '/public/css/main.css'
    ],
  };
  res.render('citizens/main', { componentData });
});

app.listen(port, () => {
  console.log(`Sever is running on http://localhost:${port}`);
});

app.post('/upload', (req, res) => {
  const params = new URLSearchParams({
    secret: '6LcY8BMpAAAAAKS-tTGbTCpK3h8ygxQISlkuE0-u',
    response: req.body['g-recaptcha-response'],
    remoteip: req.ip,
  });

  fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    body: params,
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        res.json({ captchaSuccess: true });
      } else {
        res.json({ captchaSuccess: false });
      }
    });
});

app.use('/testing', express.static(path.join(__dirname, 'testing')));
app.get('/testing', (req, res) => {
  res.sendFile(__dirname + '/testing/test.html');
});
