import express from 'express';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import hbs from 'express-handlebars';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Set up Handlebars as the view engine
app.engine(
  'hbs',
  hbs.engine({
    extname: 'hbs',
    partialsDir: path.join(__dirname, 'src', 'view', 'partial'), // Specify the correct partials directory
    layoutsDir: path.join(__dirname, 'src', 'view', 'citizens'), // Specify the correct layouts directory
    defaultLayout: 'main', // Disable the default layout
  })
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src', 'view')); // Specify the correct views directory

// Define a route to render your ad-card.hbs file inside the "partial" directory
app.get('/ad-card', function (req, res) {
  let componentData = {
    cssPath: ['/partial/ad-card.css', '/partial/carousel.css'],
  };
  res.render('partial/ad-card', { componentData }); // Specify the correct path to the view
});

app.get('/ad-detail', function (req, res) {
  let componentData = {
    cssPath: ['/partial/ad-detail.css', '/partial/carousel-swipe.css'],
  };
  res.render('partial/ad-detail', componentData); // Specify the correct path to the view
});

app.use(
  '/partial',
  express.static(path.join(__dirname, 'src', 'view', 'partial'))
);

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
