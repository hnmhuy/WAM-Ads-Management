import express from 'express';
import { dirname } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';
import hbs from 'express-handlebars';
const __dirname = dirname(fileURLToPath(import.meta.url));

const port = 3000;
const app = express();

app.use('/public', express.static(path.join(__dirname, 'src', 'public')));
app.use(
  '/partials',
  express.static(path.join(__dirname, 'src', 'views', 'partials'))
);

app.use(
  '/images',
  express.static(path.join(__dirname, 'src', 'public', 'images'))
);
app.set('view engine', 'hbs');
app.engine(
  'hbs',
  hbs.engine({
    layoutsDir: path.join(__dirname, 'src', 'views', 'citizens'),
    partialsDir: [path.join(__dirname, 'src', 'views', 'partials')],
    extname: 'hbs',
    defaultLayout: 'main',
  })
);

app.set('views', path.join(__dirname, 'src', 'views'));

app.get('/', (req, res) => {
  let componentData = {
    cssPath: [
      '/partials/ad-card.css',
      '/partials/carousel.css',
      '/partials/sidepeek-ad.css',
    ],
  };
  res.render('citizens/main', { componentData });
});

app.listen(port, () => {
  console.log(`Sever is running on http://localhost:${port}`);
});
