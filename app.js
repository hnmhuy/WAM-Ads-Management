import express from "express";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use("/public", express.static(path.join(__dirname, "src", "public")));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/testmap.html");
});

app.listen(3000);
