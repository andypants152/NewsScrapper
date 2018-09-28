var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");
var request = require("request");

//Creating or express instance
var app = express();

// If deployed, use env port. Otherwise use 8080
var PORT = process.env.PORT || 8080;

// set handlebars as our view engine for express
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// setup express to use bodyParser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// serving our public folder as a static directory
app.use(express.static("public"));

//Routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  