import express from 'express';
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const router = express.Router();

router.get('/', function (req, res) {
    res.sendFile(dirname(dirname(__dirname)) + "\\views\\login.html");
});

export default router;
