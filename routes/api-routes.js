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

        })

        res.redirect("/");

    })

    app.get("/api/clear", function (req, res) {
        db.Article.deleteMany().catch(function (err) {
            res.json(err);
        })
        res.redirect("/");
    })

    app.get("/articles", function (req, res) {

        if (req.query.saved === "true") {
            db.Article.find({ "saved": true }).then(function (dbArticle) {
                res.json(dbArticle);
            }).catch(function (err) {
                res.json(err);
            })
        }
        else if(req.query.saved === "false"){
            db.Article.find({ "saved": false }).then(function (dbArticle) {
                res.json(dbArticle);
            }).catch(function (err) {
                res.json(err);
            })
        }
        else{
            db.Article.find({}).then(function (dbArticle) {
                res.json(dbArticle);
            }).catch(function (err) {
                res.json(err);
            })
        }

    });

    app.post("/articles/:id", function (req, res) {
        console.log(req.body);
        db.Article.updateOne({ "_id": req.params.id }, { $set: { saved: req.body.saved } }).catch(function (err) {
            res.json(err);
        })
        res.send(200);
    })

}