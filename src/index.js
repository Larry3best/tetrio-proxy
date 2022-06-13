import express from "express";
import { tinyws } from "tinyws";
import proxy from "./proxy/index.js";

const app = express();

app.use(tinyws());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/** This is where we serve the TETR.IO static files. */
const public_path = new URL("../public", import.meta.url).pathname;
app.use("/", express.static(public_path));

/** Now, that's where the magic happens. */
app.use("/proxy", proxy);

const PORT = 4080;
app.listen(PORT, () => console.info(
  `[TETR.IO PROXY]: listening on port ${PORT}`
));

