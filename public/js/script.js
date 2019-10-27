var hints = ["A more accessible JavaScript IDE", "Hands-free programming experience", "Compile your voice"];
var key = "5c60501024b541cb9054d27b0f5bcebf";
var region = "westus";
var language = "en-US";
var SpeechSDK;
var recognizer;
var reco;

var hasStarted = false;

var soundContext = undefined;

function Initialize(onComplete) {
  if (!!window.SpeechSDK) {
      onComplete(window.SpeechSDK);
  }
}

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

function audioConfigStart() {
  var audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
  var speechConfig = SpeechSDK.SpeechConfig.fromSubscription(key, region);

  speechConfig.speechRecognitionLanguage = language;
  reco = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

  reco.recognized = function(s, e) {
    if (e.result.text !== "" && hasStarted) {
      $("#console").html('<span style="color: #797777;">' + 
        $("#console").text() + '</span> <span style="color: white;">' + 
        e.result.text + '</span> ');

      document.getElementById("console").scrollTop =
        document.getElementById("console").scrollHeight;

      var stripped = e.result.text.toLowerCase()
        .replace(/[,./!@#$%^&*();']/g, "").split(" ");

      if (stripped.length == 3 && stripped[0] == "delete" && // Delete line
        stripped[1] == "line" && Number.isInteger(parseInt(stripped[2]))) {
        removeLine(parseInt(stripped[2]), "");
      }
      if (stripped.length == 3 && stripped[0] == "change" && // Change line
        stripped[1] == "line" && Number.isInteger(parseInt(stripped[2]))) {
        removeLine(parseInt(stripped[2]), "");
        moveCursor(parseInt(stripped[2]) - 1, -1);
      }
      else if (stripped.length == 5 && stripped[0] == "delete" && // Delete lines
        stripped[1] == "lines" && Number.isInteger(parseInt(stripped[2])) &&
        stripped[3] == "through" && Number.isInteger(parseInt(stripped[4]))) {
        for (var i = parseInt(stripped[2]); i <= parseInt(stripped[4]); i++) {
          removeLine(stripped[2], "");
        }
      }
      else if (stripped.length == 4 && stripped[0] == "go" && /// Go to line
        stripped[1] == "to" && stripped[2] == "line" && 
        Number.isInteger(parseInt(stripped[3]))) {
        moveCursor(parseInt(stripped[3]), -1);
      }
      else if (stripped.length == 1 && stripped[0] == "run") {
        run();
      } else if (stripped.length == 2 && stripped[0] == "clear" ){
        if ( stripped[1] == 'code' || stripped[1] == 'console'){
          clearConsole($(".editTextLine").length);
        }
      } else if (stripped.length == 1 && stripped[0] == "else"){
        addElse();
      }
      else {
        writeCode(main(e.result.text));
      }
    }
  }

  reco.startContinuousRecognitionAsync();
}

document.addEventListener("DOMContentLoaded", function() {
  audioConfigStart();

  Initialize(function(speechSdk) {
    SpeechSDK = speechSdk;

    if (typeof RequestAuthorizationToken === "function") {
      RequestAuthorizationToken();
    }
  });
});

document.addEventListener('click', function() {
   if (soundContext.state != "running") {
      soundContext.resume().then(() => {
        audioConfigStart();
      });
   }

  if(!hasStarted) {
    start();
  }
});

function start() {
  $("#welcome").fadeOut(700, function() {
    $("#ide").fadeIn(300);
    addLine(1, "");
    hasStarted = true;
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
    if (!hasStarted) {
      transitionHint(nextIndex);
    }
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
  if ($(".editTextLine").length > 1) {
    $("#line" + lineNumber).parent().parent().remove();
  }

  if (parseInt(lineNumber) > 1) {
    var len = $("#line" + parseInt(lineNumber - 1)).val().length; 

    $("#line" + parseInt(lineNumber - 1)).focus()
      .val($("#line" + parseInt(lineNumber - 1)).val() + remainder);
    $("#line" + parseInt(lineNumber - 1)).caret(len);
  }
  else if (parseInt(lineNumber) == 1) {
    $("#line" + parseInt(lineNumber + 1)).focus()
  }

  updateLineNumbers();
}

function clearConsole(numLines){
  for ( var x = numLines; x > 0; x-- ){
    removeLine(x, "");
  }
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

function moveCursor(line, pos) {
  if (line >= 1 && line <= $(".editTextLine").length) {
    $("#line" + line).focus().caret(pos);
  }
}

function writeCode(data) {
  var lines = data[0];
  var finalPos = data[1];
  var startLine = $(document.activeElement);
  var baseNum = parseInt(startLine.attr('id').replace("line", ""));

  if (finalPos > 0) {
    for (var i = 0; i < lines.length; i++) {
      addLine(baseNum + i + 1, lines[i]);
    }

    moveCursor(baseNum + finalPos, -1);
  }

  insertTabs();
}

function addElse(){
  // Check current line has an if
  var current = $(document.activeElement).val();
  var totalLines = $(".editTextLine").length;
  var lineNum = parseInt($(document.activeElement).attr('id').replace("line", ""));
    if ( current.includes("if") ){

      // Iterate until finds close brace
      var numBraces = 0;
      lineNum++;

      for ( ; lineNum <= totalLines; lineNum++){
        current = $("#line" + lineNum).val();

        if ( current.includes("{") ){
          numBraces++;
        }

        if ( current.includes("}")){
          // Brace found, insert else here
          //console.log(numBraces);
          if ( numBraces == 0 ){
            $('#line' + lineNum).val(current + " else {");
            moveCursor(lineNum, -1);
            var arr = ["}", 1]
            writeCode(arr);
            break;
          } else {
            numBraces--;
          }
        }
      }

      
  }
}

function insertTabs(){
  var totalLines = $(".editTextLine").length;
  var braces = 0;
  for ( var i = 1; i < totalLines; i++ ){
    var curLine = $("#line" + i);

    var onLine = false;
    // Check if line has a { at end
    if ( curLine.val().includes("{") ){
      braces++;
      onLine = true;
    }

    if ( curLine.val().includes("}") ){
      braces--;
    }

    if ( braces > 0 ){

      // Count numbers of tabs
      var curTabs = 0;
      var chars = Array.from(curLine.val());
      //console.log(chars);
      for( var ch of chars ){
        //console.log(ch);
        if ( ch === "\t" ){
          curTabs++;
        }
      }


      var numBraces = braces;

      if ( onLine ){
        numBraces--;
      }

      for ( var x = curTabs; x < numBraces; x++ ){
        $('#line' + i).val("\t" + curLine.val());
      }
      
    }

    //console.log("Iterating");
  }
  curLine
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
    backgroundColor: 'rgb(99, 99, 99)'
  }, 200);
}).mouseout(function() {
  $(this).animate({
    backgroundColor: '#424141'
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

    moveCursor(parseInt(lineNumber) - 1, caret);
  }
  else if (keyCode == 40) { // Arrow down
    e.preventDefault();
    var inputElement = e.target;
    var lineNumber = inputElement.id.replace("line", "");

    moveCursor(parseInt(lineNumber) + 1, caret);
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
  });
});
