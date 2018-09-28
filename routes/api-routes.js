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
        else if (req.query.saved === "false") {
            db.Article.find({ "saved": false }).then(function (dbArticle) {
                res.json(dbArticle);
            }).catch(function (err) {
                res.json(err);
            })
        }
        else {
            db.Article.find({}).then(function (dbArticle) {
                res.json(dbArticle);
            }).catch(function (err) {
                res.json(err);
            })
        }

    });

    app.post("/articles/:id", function (req, res) {
        console.log(req.body);
        db.Article.updateOne({ "_id": req.params.id }, { $set: req.body }).catch(function (err) {
            res.json(err);
        })
        res.sendStatus(200);
    })

    app.get("/notes/:articleID", function(req, res) {
        db.Article.findOne({"_id": req.params.articleID}).populate("note")
        .then(function(article){
          res.json(article);
        }).catch(function(err){
          res.json(err);
        })
      })

    app.post("/notes/:articleID", function (req, res) {
        db.Note.create(req.body).then(function (dbNote) {
            return db.Article.findOneAndUpdate({ "_id": req.params.articleID }, { $push: { note: dbNote._id } }, { new: true });
        }).then(function (dbArticle) {
            res.json(dbArticle);
        }).catch(function (err) {
            res.json(err);
        })
    })

}