var hints = ["Say \"start\" to begin coding", "First time? Say \"teach me\" to learn!"];

// AWS
var AWS = require('aws-sdk');
var uuid = require('node-uuid');
var s3 = new AWS.S3();
var bucketName = 'elasticbeanstalk-us-west-1-116601934919';
var keyName = 'input/sup.txt';
var bodyText = "woah";
var params = {
  ACL: "authenticated-read",
  Body: bodyText,
  Bucket: bucketName,
  Key: keyName
};

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

  s3.putObject(params, function(err, data) {
    if (err) { 
      console.log(err);
    }
    else {
      console.log("SUCCESS");
    }
  });
});
