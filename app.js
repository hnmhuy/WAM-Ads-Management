import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.get("/", function (req, res) {
    res.sendFile("Hello world");
});

app.listen(3000);
