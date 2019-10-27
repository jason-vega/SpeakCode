var hints = ["Say \"start\" to begin coding", "First time? Say \"teach me\" to learn!"];
var key = "1cb33c6058174b61ba2cdd6352995c62";
var region = "westus";
var language = "en-US";
var SpeechSDK;
var recognizer;
var reco;

var soundContext = undefined;

try {
  var AudioContext = window.AudioContext || window.webkitAudioContext || false;

  if (AudioContext) {
    soundContext = new AudioContext();
  } 
  else {
    console.log("Audio context not supported!");
  }
}
catch (e) {
    console.log("No audio context found: " + e);
}

function Initialize(onComplete) {
  if (!!window.SpeechSDK) {
      onComplete(window.SpeechSDK);
  }
}

function startAudioContext() {
  var audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
  var speechConfig = SpeechSDK.SpeechConfig.fromSubscription(key, region);

  speechConfig.speechRecognitionLanguage = language;
  reco = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

  reco.recognized = function(s, e) {
    if (e.result.text !== "") {
      $("#console").html($("#console").html() + e.result.text + "<br>");

      document.getElementById("console").scrollTop =
        document.getElementById("console").scrollHeight;
    }
  }

  reco.startContinuousRecognitionAsync();

  Initialize(function(speechSdk) {
    SpeechSDK = speechSdk;

    if (typeof RequestAuthorizationToken === "function") {
      RequestAuthorizationToken();
    }
  });
}

//startAudioContext();

document.querySelector('body').addEventListener('click', function() {
  if (soundContext.state != "running") {
    soundContext.resume().then(() => {
      startAudioContext();
    });
  }
});

function start() {
  $("#welcome").fadeOut(1000, function() {
    $("#ide").fadeIn(1000);
    addLine(1, "");
  });
}

function help() {
  $("#welcome").fadeOut(1000, function() {
    $("#help").fadeIn(1000);
  });
}

function transitionHint(index) {
  var nextIndex = index + 1 < hints.length ? index + 1 : 0;

  $("#hint").text(hints[index]).fadeTo(1000, 1).delay(3000).fadeTo(1000, 0, function() {
    transitionHint(nextIndex);
  }); 
}

function addLine(lineNumber, text) {
  var newLine = '<div class="row"><div class="col-1 text-center ' + 
    'lineNumber"></div><div class="col px-2"><input type="text" ' + 
    'class="editTextLine"></div></div>';

  if (parseInt(lineNumber) == 1) {
    $("#edit").prepend(newLine);
  }
  else {
    $(newLine).insertAfter($("#line" + (parseInt(lineNumber) - 1))
      .parent().parent());
  }

  updateLineNumbers();
  $("#line" + lineNumber).focus().val(text).caret(0);
}

function removeLine(lineNumber, remainder) {
  $("#line" + lineNumber).parent().parent().remove();

  if (parseInt(lineNumber) > 1) {
    var len = $("#line" + parseInt(lineNumber - 1)).val().length; 

    $("#line" + parseInt(lineNumber - 1)).focus()
      .val($("#line" + parseInt(lineNumber - 1)).val() + remainder);
    $("#line" + parseInt(lineNumber - 1)).caret(len);
  }

  updateLineNumbers();
}

function updateLineNumbers() {
  $(".editTextLine").each(function(i, obj) {
    obj.id = "line" + (i + 1);
  });

  $(".lineNumber").each(function(i, obj) {
    obj.innerHTML = (i + 1);
  });
}

function getCode() {
  var result = 'var consoleLog = []; ';

  $(".editTextLine").each(function(i, obj) {
    result += obj.value.replace("\t", "")
      .replace(/console.log/i, "consoleLog.push") + " ";
  });

  result += "return consoleLog;";

  return result;
}

function run() {
  var code = getCode();

  try {
    var conLog = (new Function("return function() {" + code + "};"))()();

    for (var i = 0; i < conLog.length; i++) {
      $("#textOutputText").html($("#textOutputText").html() + 
        "<div class='outputLineBackground'><div class='" + 
        "outputLineInnerBackground ml-1 pl-2 py-1'>" + conLog[i] + "</div></div>\n");
    }
  }
  catch(e) {
    $("#textOutputText").html($("#textOutputText").html() + 
      "<div class='outputLineBackground' style='color: red;'><div class='" + 
      "outputLineInnerBackground ml-1 pl-2 py-1'>" + e + "</div></div>\n");
  }

  document.getElementById("textOutput").scrollTop = 
    document.getElementById("textOutput").scrollHeight;
}

$(document).delegate('.editTextLine', 'focus', function(e) {
  var element = e.target;

  if (element.classList.contains("editTextLine")) {
    $("#" + element.id).addClass("active");
    $("#" + element.id).parent().parent().addClass("active");
  }
});

$(document).delegate('.editTextLine', 'blur', function(e) {
  var element = e.target;

  if (element.classList.contains("editTextLine")) {
    $("#" + element.id).removeClass("active");
    $("#" + element.id).parent().parent().removeClass("active");
  }
});

$(".nav-item").mouseover(function() {
  $(this).animate({
    backgroundColor: '#d9d9d9'
  }, 200);
}).mouseout(function() {
  $(this).animate({
    backgroundColor: '#f8f9fa'
  }, 200);
});

$(document).delegate('.editTextLine', 'keydown', function(e) {
  var keyCode = e.keyCode || e.which;

  if (keyCode == 9) { // Tab
    e.preventDefault();
    var start = this.selectionStart;
    var end = this.selectionEnd;

    $(this).val($(this).val().substring(0, start) + "\t" + 
      $(this).val().substring(end));
    
    this.selectionStart = this.selectionEnd = start + 1;
  }
  else if (keyCode == 13) { // Enter
    e.preventDefault();
    var inputElement = e.target;
    var lineNumber = inputElement.id.replace("line", "");
    var caret = $("#line" + lineNumber).caret();
    var remainder = $("#line" + lineNumber).val().substring(caret);
    $("#line" + lineNumber).val($("#line" + lineNumber).val()
      .substring(0, caret));
    inputElement.blur();
    addLine(parseInt(lineNumber) + 1, remainder);
  }
  else if (keyCode == 38) { // Arrow up
    e.preventDefault();
    var inputElement = e.target;
    var lineNumber = inputElement.id.replace("line", "");
    var caret = $("#line" + lineNumber).caret();

    if (parseInt(lineNumber) > 1) {
      $("#line" + (parseInt(lineNumber) - 1)).focus().caret(caret);
    }
  }
  else if (keyCode == 40) { // Arrow down
    e.preventDefault();
    var inputElement = e.target;
    var lineNumber = inputElement.id.replace("line", "");

    if (parseInt(lineNumber) < $(".editTextLine").length) {
      $("#line" + (parseInt(lineNumber) + 1)).focus();
    }
  }
  else if (keyCode == 8) { // Backspace
    var inputElement = e.target;
    var lineNumber = inputElement.id.replace("line", "");
    
    if ($("#line" + lineNumber).caret() == 0 && lineNumber > 1) {
      e.preventDefault();
      var remainder = e.target.value;
      removeLine(lineNumber, remainder);
    }
  }
});
      
$(document).ready(function () {
  $("#title").fadeTo(1250, 1, function() {
    transitionHint(0);
    start();
  });

  $.get('/upload', function(data) {
    console.log(data);
  });
});
