// Grab the articles as a json
$.getJSON("/articles?saved=true", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      var card = $("<div class='card'>");
      var cardHeader = $("<div class='card-header'>").append(
        $("<h3>").append(
          $("<a class='article-link'>")
            .attr("href", data[i].link)
            .text(data[i].title),
          $("<a class='btn btn-danger delete'><i class='far fa-trash-alt'></i></a>")
        )
      );
      card.append(cardHeader);
      card.data("_id", data[i]._id);
      $("#articles").append(card);
    }
  });

  $(document).on("click", ".btn.delete", function () {
    var articleToDelete = $(this).parents(".card").data();
    articleToDelete.saved = false;
    $.ajax({
      method: "POST",
      url: "/articles/" + articleToDelete._id,
      data: articleToDelete
    }).then(function (data) {
      location.reload();
    })
  
  });