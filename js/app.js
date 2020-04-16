const base_keyword = "Tour+de+France+";
var $videoSrc;

$(document).ready(function() {
  initLoad();

// When logo is clicked, render dummy "Tour de France Videos(10)" creatded from the json object made by response_sample.json file.
  // $("#NewLogo").on("click", function(e) {
  //   e.preventDefault();
    $(".welcome-msg").html("");
      $.getJSON("response_sample20.json", function(json) {
        var results_data = json;
      resultsLoop(results_data);
      });
    // });

// When search is submitted, render "Tour de France" videos with the keyword ordered by date
  $("form").on("submit", function(e) {
    e.preventDefault();
    $(".welcome-msg").html("");
    let keyword = base_keyword + encodeURIComponent($("#search").val()).replace(/%20/g, "+");
    let request = gapi.client.youtube.search.list({
      part: "snippet",
      type: "video",
      q: keyword,
      maxResults: 20,
      order: "date",// "rating" "relevance" "title" "videoCount" "viewCount",
      publishedAfter: "2015-01-01T00:00:00Z"
    });
    request.execute(function(response) {
      var results = response.result;
        $("#results").html("");
        resultsLoop(results);
        resetVideoHeight();
    });
  });

  $(window).on("resize", resetVideoHeight);//work later

  $("#bydate").on("click", function(e) {
    e.preventDefault();
    $(".welcome-msg").html("");
    sortByDate(copyKeyword());
  });

  $("#byviewcount").on("click", function(e) {
    e.preventDefault();
    $(".welcome-msg").html("");
    sortByViewCount(copyKeyword());
  });

  $("#byrating").on("click", function(e) {
    e.preventDefault();
    $(".welcome-msg").html("");
    sortByRating(copyKeyword());
  });

  $("#byrelevance").on("click", function(e) {
    e.preventDefault();
    $(".welcome-msg").html("");
    sortByRelevance(copyKeyword());
  });

  // when the modal is opened autoplay it
  $('#myModal').on('shown.bs.modal', function (e) {
    // set the video src to autoplay and not to show related video. Youtube related video is like a box of chocolates... you never know what you're gonna get
    $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0" );
  })

  // stop playing the youtube video when I close the modal
  $('#myModal').on('hide.bs.modal', function (e) {
    $("#video").attr('src',$videoSrc);// remove "?autoplay" parameter from link.
  })
});

// copy keyword in the search box.
function copyKeyword() {
  let search_keyword = encodeURIComponent($("#search").val()).replace(/%20/g, "+");
  return search_keyword;
}

// send search by base_keyword + keyword and get result in specified sort order.
function sortByDate(keyword) {
    if (!keyword) {
      keyword = "";
    }
    let api_keyword = base_keyword + keyword;
    let request = gapi.client.youtube.search.list({
      part: "snippet",
      type: "video",
      q: api_keyword,
      maxResults: 20,
      order: "date", //"date", "rating", "relevance", "title", "videoCount", "viewCount",
      publishedAfter: "2015-01-01T00:00:00Z"
    });
    request.execute(function(response) {
      var results = response.result;
        $("#results").html("");
        resultsLoop(results);
        resetVideoHeight();
    });
}

function sortByViewCount(keyword) {
    if (!keyword) {
      keyword = "";
    }
    let api_keyword = base_keyword + keyword;
    let request = gapi.client.youtube.search.list({
      part: "snippet",
      type: "video",
      q: api_keyword,
      maxResults: 20,
      order: "viewCount", //"date", "rating", "relevance", "title", "videoCount", "viewCount",
      publishedAfter: "2015-01-01T00:00:00Z"
    });
    request.execute(function(response) {
      var results = response.result;
        $("#results").html("");
        resultsLoop(results);
        resetVideoHeight();
    });
}

function sortByRating(keyword) {
    if (!keyword) {
      keyword = "";
    }
    let api_keyword = base_keyword + keyword;
    let request = gapi.client.youtube.search.list({
      part: "snippet",
      type: "video",
      q: api_keyword,
      maxResults: 20,
      order: "rating", //"date", "rating", "relevance", "title", "videoCount", "viewCount",
      publishedAfter: "2015-01-01T00:00:00Z"
    });
    request.execute(function(response) {
      var results = response.result;
        $("#results").html("");
        resultsLoop(results);
        resetVideoHeight();
    });
}

function sortByRelevance(keyword) {
    if (!keyword) {
      keyword = "";
    }
    let api_keyword = base_keyword + keyword;
    let request = gapi.client.youtube.search.list({
      part: "snippet",
      type: "video",
      q: api_keyword,
      maxResults: 20,
      order: "relevance", //"date", "rating", "relevance", "title", "videoCount", "viewCount",
      publishedAfter: "2015-01-01T00:00:00Z"
    });
    request.execute(function(response) {
      var results = response.result;
        $("#results").html("");
        resultsLoop(results);
        resetVideoHeight();
    });
}

function resultsLoop(data){
  $("#results").html("");
  $.each(data.items, function(i, item) {
    let thumb = item.snippet.thumbnails.medium.url;
    let channel_title = item.snippet.channelTitle.substring(0,45);
    let title = item.snippet.title.substring(0,45);
    let desc = item.snippet.description.substring(0,45);
    let pdate = new Date(item.snippet.publishedAt);
    let date = (pdate.getMonth() + 1)+ "/" + pdate.getDate()  + "/" + pdate.getFullYear();
    let videoid = item.id.videoId;
    let time = new Date($.now());

    $("#results").append(`
      <li>
        <button type="button" class="btn btn-primary video-btn" data-toggle="modal" data-src="http://www.youtube.com/embed/${videoid}" data-target="#myModal">
          <img src="${thumb}" alt="thumbnail image" class="thumb-btn">
        </button>
        <div class= "details">
          <h4>${channel_title}</h4>
          <h4>${title}</h4>
          <p>${desc}</p>
          <p>Published Date: ${date}</p>
        </div>
      </li>
    `);

    $("#footer-modify").html(`<p>Last Updated: ${time}`);

// Get video link every time #result is rendered.
    $('.video-btn').on('click', function() {
      $videoSrc = $(this).data("src");
    });
  });
}

function init() {
  gapi.client.setApiKey("AIzaSyDAPShIt5LqMJq6FjwxUKiPADBzeN15ck8");
  gapi.client.load("youtube", "v3", function() {
  });
}

// for mobile.
function resetVideoHeight() {
  $(".video").css("height", $("#results").width() * 9/16)
}

function initLoad() {
  $(".welcome-msg").html("");
  $.getJSON("response_sample20.json", function(json) {
    var results_data = json;
    resultsLoop(results_data);
  });
}
