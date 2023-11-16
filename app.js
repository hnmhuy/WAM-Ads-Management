import express from "express";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import hbs from 'express-handlebars';

// Import router for district
import homeRouterDistrict from './src/routes/district/home.route.js';
import locationRouterDistrict from './src/routes/district/location.route.js';
import loginRouterDistrict from './src/routes/district/login.route.js';
import permissionRouterDistrict from './src/routes/district/permission.route.js';
import reportsRouterDistrict from './src/routes/district/reports.route.js';

// Configuration
const config = {
    port: process.env.PORT || 3000,
    viewEngine: 'hbs',
};

const app = express();

app.use("/public", express.static(path.join(__dirname, "src", "public")));

app.engine(config.viewEngine, hbs.engine({
    extname: config.viewEngine,
    defaultLayout: 'layout',
    layoutsDir: config.layoutsDir,
    partialsDir: config.partialsDir
}));
app.set('view engine', config.viewEngine);

// Routes
app.use('/', homeRouterDistrict)
app.use('/location', locationRouterDistrict)
app.use('/login', loginRouterDistrict)
app.use('/permission', permissionRouterDistrict)
app.use('/reports', reportsRouterDistrict)



// Error handling
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});
