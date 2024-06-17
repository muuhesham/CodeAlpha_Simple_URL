//TASK 01//
const express = require("express");
const app = express();
const shortid = require("shortid");
const mysql = require("mysql");
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Connect to DB
const con = mysql.createConnection({
host: "localhost",
database: "task01",
user: "root",
password: ""
});

con.connect((err) => {
    if (err) {
    throw err
    return;
    }
console.log("Connected to DB!");
});

// Routes
app.get("/", (req , res) => {
    res.render('index.ejs', { shortUrl: null });
});

app.post("/shorturl", (req, res) => {
    const {originalUrl} = req.body;
    const sql = "SELECT * FROM url WHERE originalurl = ?";
    con.query(sql, [originalUrl], (err, result) => {
        if (err) {
        throw err
        return;
        }
    if (result.length > 0) {
        res.render('index.ejs', { shortUrl: `${req.headers.host}/${result[0].shorturl}` });
    } else {
        const shortUrl = shortid.generate();
        const sql2 = 'INSERT INTO url (originalurl, shorturl) VALUES (?, ?)';
        con.query(sql2, [originalUrl, shortUrl], (err, result) => {
            if (err) {
            throw err
            return;
            }
        res.status(201).render('index.ejs', { shortUrl: `${req.headers.host}/${shortUrl}` });
            });
        }
    });
});

app.get("/:shorturl", (req, res) => {
    const {shorturl} = req.params;
    const sql3 = "SELECT originalurl FROM url WHERE shorturl = ?";
    con.query(sql3, [shorturl], (err, result) => {
        if (err) {
        throw err
        return;
        }
    if (result.length > 0) {
        const originalUrl = result[0].originalurl;
        res.redirect(originalUrl);
    } else {
        res.status(404).send("SHORT URL NOT FOUND!!!!");
        }
    });
});

// server port
app.listen(port, () => {
console.log("NOW ON PORT 3000");
});
