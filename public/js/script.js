var hints = ["Say \"start\" to begin coding", "First time? Say \"teach me\" to learn!"];

function transitionHint(index) {
  var nextIndex = index + 1 < hints.length ? index + 1 : 0;

  $("#hint").text(hints[index]).fadeTo(1000, 1).delay(3000).fadeTo(1000, 0, function() {
    transitionHint(nextIndex);
  }); 
}

$(document).ready(function () {
  $("#title").fadeTo(1250, 1, function() {
    transitionHint(0);
  });

  $.get('/upload', function(data) {
    console.log(data);
  };
});
