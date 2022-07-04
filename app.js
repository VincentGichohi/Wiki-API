//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

// const mongoDB = 'mongodb://127.0.0.1/WikiDB';
//Setting up a connection to our mongodb
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });

//Create a new Schema
const articleSchema = {
    title: String,
    content: String
};
//creating a new model and linking it to the schema
const Article = mongoose.model("Article", articleSchema);

//A route handler that eliminates redundancy in calling the methods
app.route("/articles")
    .get((req, res) => {
        Article.find((err, foundArticles) => {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
            //Console logs the output to the terminal
            // console.log(foundArticles);
            //This now sends the result to the articles page in the browser
        });
    }).post((req, res) => {
        console.log(req.body.title);
        console.log(req.body.content);
        //Create a new article which will be saved by posting it.
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        //when saving, check whether there is an error and post the error if there is one.
        newArticle.save((err) => {
            if (!err) {
                res.send("Successfully added a new article.")
            } else {
                res.send(err);
            }
        });
    }).delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.send("Successfully deleted all articles")
            } else {
                res.send(err);
            }
        });
    })

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));


//A get method to retrieve data from the database
app.get("/articles");
app.delete("/articles");
app.post("/articles");
app.listen(3000, function() {
    console.log("Server started on port 3000");
});