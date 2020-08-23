const express = require("express");
const imagesData = require("data/images.json");

console.log("Preparing to launch Express.js server");

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

function printReq(req, res, next) {
    console.log("Request query: ");
    console.log(req.query);
    console.log("Request params: ");
    console.log(req.params);
    if (req.body) {
        console.log("Request body: ");
        console.log(req.body);    
    }
    next();
}

app.get("/", printReq, (req, res) => {
    //res.send("Hello World!");
    res.render("pages/gallery", {
        "imagesData": imagesData
    });
});

app.get("/images", printReq, (req, res) => {
    res.json(imagesData);
});

app.get("/images/:id", printReq, (req, res) => {
    res.send("Here's the image you requested!");
});

app.post("/images", printReq, (req, res) => {
    console.log(req.body);
    res.status(200);
    res.send("Image created!");
});

app.listen(port, () => console.log("Express.js server is listening on port " + port));