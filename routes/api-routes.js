var request = require("request");
var cheerio = require("cheerio");

module.exports = function (app, db) {

    app.get("/api/scrape", function (req, res) {
        request("https://www.theverge.com/", function (error, response, html) {

            var $ = cheerio.load(html);
            $("h2.c-entry-box--compact__title").each(function (i, element) {
                var result = {};

                result.link = $(element).children().attr("href");
                result.title = $(element).children().text();

                //push to database, add logic for duplicates here...
                db.Article.create(result)
                    .catch(function (err) {
                        return res.json(err);
                    });

            })

            res.redirect("/");

        })

    })

    app.get("/api/clear", function (req, res) {

    })

    app.get("/articles", function(req, res) {
        // TODO: Finish the route so it grabs all of the articles
        db.Article.find({}).then(function(dbArticle){
          res.json(dbArticle);
        }).catch(function(err){
          res.json(err);
        })
      });
      
}