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
          $("<a class='btn btn-danger delete'><i class='far fa-trash-alt'></i></a>"),
          $("<a class='btn btn-success note' data-toggle='modal' data-target='.notesModal'><i class='fas fa-comment-alt'></i></a>")
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

  $(document).on("click", ".btn.note", function(){
      var article = $(this).parents(".card").data();
      $("#note").empty();

      $.ajax({
          method: "GET",
          url: "/notes/" + article._id
      }).then(function(data){
        $("#note").append("<h3 class='modal-title'> Notes for \"" + data.title + "\"</h1>");
        console.log(data);
        data.note.forEach(note => {
            $("#note").append("<h5>" + note.body + "</h5>");
            $("#note").append("<button data-id='" + note._id + "' id='deleteNote'>Delete Note</button>");
        })
        $("#note").append("<textarea id='bodyinput' name='body'>Note...</textarea>");
        $("#note").append("<button data-id='" + article._id + "' id='savenote'>Save Note</button>");
  
      })
      
  });

  $(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "POST",
      url: "/notes/" + thisId,
      data: {
        body: $("#bodyinput").val()
      }
    });
  
    $("#bodyinput").val("");
  });

  $(document).on("click", "#deleteNote", function(){
      var thisId = $(this).attr("data-id");

      console.log(thisId);

      $.ajax({
          method: "DELETE",
          url: "/notes/" + thisId
      })
  })