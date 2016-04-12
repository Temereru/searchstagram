var tag = "coffee";
var client_id = "de353841667d47e48108c135c29beb36";
var redirect_uri = 'http://localhost:4000/';
var authURL = 'https://instagram.com/oauth/authorize/?client_id=' + client_id + '&redirect_uri=' + redirect_uri + '&response_type=token';
var access_token = null;


if (window.location.hash) {
  access_token = window.location.hash.split('=')[1];
}

if (!access_token) {
  $('.auth-container').addClass('show');
} else {
  $('.search-container').addClass('show');
}

var fetch = function (url) {
  $.ajax({
    method: "GET",
    url: url,
    dataType: "jsonp",
    jsonp: "callback",
    success: function(response) {
      for(var i = 0; i < response.data.length; i++){
        display(response.data[i].images.low_resolution.url);
      }
      $('.overlay').toggleClass('show');
      $('.modale').toggleClass('show');
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  }); 
}

var source   = $("#img").html();
var template = Handlebars.compile(source);
var source2   = $("#tag").html();
var template2 = Handlebars.compile(source2);

function display(url){
  var obj = {url: url, tag: tag};
  $('.all-pics').append(template(obj));
}

function removeByTag(tag){
  console.log(tag);
  var arr = $('.all-pics').children('[data-tag='+ tag +']');
  for(var i = 0; i < arr.length; i++){
      $(arr[i]).remove();
  }
}

$('.search').on('click', function(e){
  e.preventDefault();
  $('.overlay').toggleClass('show');
  $('.modale').toggleClass('show');
  if($('.kind').val() === 'hashtag'){
    var url = 'https://api.instagram.com/v1/tags/' + tag + '/media/recent?access_token=' + access_token;
    tag = $('.search-input').val();
    fetch(url);
    var obj2 = {tag: tag, hash: true};
    $('.tags').append(template2(obj2));
  }else{
    var url = 'https://api.instagram.com/v1/users/self/media/recent?access_token=' + access_token;
    tag = 'self';
    fetch(url);
    var obj2 = {tag: tag, hash: false};
    $('.tags').append(template2(obj2));
  }  
});

$('.auth').on('click', function () {
  window.location = authURL;
});

$('.tags').on('click','.fa-times', function(e){
  e.preventDefault();
  var tag = $(this).parent().data().tag;
  removeByTag(tag);
  $('.tags').children('[data-tag='+ tag +']').remove();
})

// fetch();
