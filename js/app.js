function tplawesome(e,t){res=e;for(var n=0;n<t.length;n++){res=res.replace(/\{\{(.*?)\}\}/g,function(e,r){return t[n][r]})}return res}


$(function() {
  // When logo is clicked, render "Tour de France Videos(10)"
  $("#NewLogo").on("click", function(e) {
    e.preventDefault();
    var request = gapi.client.youtube.search.list({
      part: "snippet",
      type: "video",
      q: "Tour de France",
      // q: encodeURIComponent($("#search").val()).replace(/%20/g, "+"),
      maxResults: 10,
      order: "date",
      // order: "viewCount",
      publishedAfter: "2015-01-01T00:00:00Z"
    });

    // execute the request
    request.execute(function(response) {
      // console.log(response);
      var results = response.result;
        $("#results").html("");
        $.each(results.items, function(index, item) {
          $.get("item.html", function(data) {
            $("#results").append(tplawesome(data, [{"title":item.snippet.title, "videoid":item.id.videoId}]));
          });
        });
        resetVideoHeight();
      });
  });

  //When search is submitted, render videos with the keyword by date
  $("form").on("submit", function(e) {
    e.preventDefault();
    // prepare the request
    var request = gapi.client.youtube.search.list({
      part: "snippet",
      type: "video",
      // q: "Tour de France",
      q: encodeURIComponent($("#search").val()).replace(/%20/g, "+"),
      maxResults: 10,
      order: "date",
      // order: "viewCount",
      publishedAfter: "2015-01-01T00:00:00Z"
    });
    // execute the request
    request.execute(function(response) {
      // console.log(response);
      var results = response.result;
        $("#results").html("");
        $.each(results.items, function(index, item) {
          $.get("item.html", function(data) {
            $("#results").append(tplawesome(data, [{"title":item.snippet.title, "videoid":item.id.videoId}]));
          });
        });
        resetVideoHeight();
    });
  });
  $(window).on("resize", resetVideoHeight);
});



function resetVideoHeight() {
  $(".video").css("height", $("#results").width() * 9/16)
}

function init() {
    gapi.client.setApiKey("AIzaSyDAPShIt5LqMJq6FjwxUKiPADBzeN15ck8");
    gapi.client.load("youtube", "v3", function() {
      // YouTube api is ready
});
}
