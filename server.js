import express from "express";
import session from "express-session";
import flash from "express-flash";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes.js";
import passport from "passport";
import { initialize } from "./config/passportConfig.js";
import { sessionStore } from "./config/dbConfig.js";
import https from "https";
import fs from "fs";
import fileUpload from "express-fileupload";

const app = express();
const PORT = process.env.PORT || 443;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  key: fs.readFileSync('config/ssl/server.key'), //Change Private Key Path here
  cert: fs.readFileSync('config/ssl/4779dbccdf63510b.crt'), //Change Main Certificate Path here
  ca: fs.readFileSync('config/ssl/gd_bundle-g2-g1.crt') //Change Intermediate Certificate Path here
};

initialize(passport);

/** MIDDLEWARES */
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'your_session_secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.json());
app.use(fileUpload());
app.use('/', router);

https.createServer(options, app).listen(PORT, () => {
    console.log(`✅ Server running at https://localhost:${PORT}`);
});