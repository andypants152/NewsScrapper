// Grab the articles as a json
$.getJSON("/articles?saved=false", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    var card = $("<div class='card'>");
    var cardHeader = $("<div class='card-header'>").append(
      $("<h3>").append(
        $("<a class='article-link'>")
          .attr("href", data[i].link)
          .text(data[i].title),
        $("<a class='btn btn-success save'><i class='far fa-save'></i></a>")
      )
    );
    card.append(cardHeader);
    card.data("_id", data[i]._id);
    $("#articles").append(card);
  }
});

$(document).on("click", ".btn.save", function () {
  var articleToSave = $(this).parents(".card").data();
  articleToSave.saved = true;
  $.ajax({
    method: "POST",
    url: "/articles/" + articleToSave._id,
    data: articleToSave
  }).then(function (data) {
    location.reload();
  })

});
