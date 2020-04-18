const base_keyword = "Cycling+Tour+de+France+";
let $videoSrc;

$(document).ready(function() {
  initDummyLoad();

// When search is submitted, render "Tour de France" videos with the keyword ordered by date.
  $("form").on("submit", function(e) {
    e.preventDefault();
    search();
  });

// When sort menu is clicked, get sort criteria and search word then create api request.
  $(".sort").on("click", function(e) {
    e.preventDefault();
    let $sortValue = $(this).attr("value");
    sortBy(copyKeyword(), $sortValue);
  });

// when the modal is opened autoplay it
  $('#myModal').on('shown.bs.modal', function (e) {
// set the video src to autoplay and not to show related video. Youtube related video is like a box of chocolates... you never know what you're gonna get
    $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0" );
  })
// stop playing the youtube video when I close the modal
  $('#myModal').on('hide.bs.modal', function (e) {
    $("#video").attr('src',$videoSrc);// removing "?autoplay" parameter from link.
  })

  $(window).on("resize", resetVideoHeight);//work later
});

// base search fn.  search by base + custom keyword and sort by date (up to 21).
function search() {
  let keyword = base_keyword + encodeURIComponent($("#search").val()).replace(/%20/g, "+");
  let request = gapi.client.youtube.search.list({
    part: "snippet",
    type: "video",
    q: keyword,
    maxResults: 21,
    order: "date",// "rating" "relevance" "title" "videoCount" "viewCount",
    publishedAfter: "2015-01-01T00:00:00Z"
  });
  request.execute(function(response) {
    var results = response.result;
      resultsLoop(results);
      resetVideoHeight();
  });
}

// fn to copy keyword in the search box.
function copyKeyword() {
  let search_keyword = encodeURIComponent($("#search").val()).replace(/%20/g, "+");
  return search_keyword;
}
// fn to sort by the menu label and custom keyword.
function sortBy(keyword, sortValue) {
  if (!keyword) {
    keyword = "";
  }
  let api_keyword = base_keyword + keyword;
  let request = gapi.client.youtube.search.list({
    part: "snippet",
    type: "video",
    q: api_keyword,
    maxResults: 24,
    order: sortValue,
    publishedAfter: "2015-01-01T00:00:00Z"
  });
  request.execute(function(response) {
    var results = response.result;
      $("#results").html("");
      resultsLoop(results);
      resetVideoHeight();
  });
}

// fn to render results in <li>
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
    <div class="col-md-4 panel">
      <li>
        <button type="button" class="btn btn-primary video-btn" data-toggle="modal" data-src="http://www.youtube.com/embed/${videoid}" data-target="#myModal">
          <img src="${thumb}" alt="thumbnail image">
        </button>
        <div class= "details">
          <p>${channel_title}</p>
          <p>${title}</p>
          <p>${desc}</p>
          <p>Published Date: ${date}</p>
        </div>
      </li>
    </div>
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
    // search();
  });
}

function initDummyLoad() {
  $.getJSON("src/response_sample.json", function(json) {
    var results_data = json;
    resultsLoop(results_data);
  });
}

// for mobile.
function resetVideoHeight() {
  $(".video").css("height", $("#results").width() * 9/16)
}
