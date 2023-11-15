import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import hbs from 'express-handlebars';
const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuration
const config = {
    port: 3000,
    viewEngine: 'hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials'
};

const app = express();

app.engine(config.viewEngine, hbs.engine({
    extname: config.viewEngine,
    defaultLayout: 'layout',
    layoutsDir: config.layoutsDir,
    partialsDir: config.partialsDir
}));
app.set('view engine', config.viewEngine);

// Routes
app.get("/", function (req, res) {
    res.send("Hello world");
});

// Error handling
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});
