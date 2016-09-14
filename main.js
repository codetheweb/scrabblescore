var scrabbleWord = "";
var deletedText = '<span id="message">start typing...</span>';
var multiplier = 1;

var hiddenTextBox = document.getElementById("invisibleInput");

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
  document.getElementById("message").innerHTML = "tap anywhere and start typing...";
}

// make sure we use landscape on mobile
if (window.matchMedia("(orientation: portrait)").matches) {
  document.getElementById("rotateScreen").className = "show";
}
window.addEventListener("orientationchange", function() { // add listener in case device is rotated in use
  if (screen.orientation.angle == 0) {
    document.getElementById("rotateScreen").className = "show";
  }
  else {
    document.getElementById("rotateScreen").className = "";
  }
}, false);

document.getElementById("invisibleInput").onkeyup = function(evt) {
  evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    console.log(charCode);
}

hiddenTextBox.onkeyup = function(evt) {
    evt.preventDefault();
    
    var container = document.getElementById("text");
    
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    
    if (charCode != 8 && charCode != 46) {    
      var charStr = String.fromCharCode(charCode);
      
      charStr = charStr.toLowerCase().match(/[a-z]/i); // convert to lowercase and only accept letters
      
      if (charStr != null & document.querySelectorAll("#text > .letter-container").length < 10) { // Add letter element
        if (scrabbleWord == "") {
          container.innerHTML = ""; // remove instructions
        }
        
        scrabbleWord += charStr;
        
        container.innerHTML += '<span class="letter-container" onclick="multiplyLetter(this, ' + scrabbleWord.length + ')"><span class="letter">' + charStr + '</span><span class="letter-score">' + getScore(charStr[0]) + '</span></span>';
      }
      
      renderScore(scrabbleWord);
      
      return true;
    }
    
    if (charCode == 8) { // Delete letter element
      container.removeChild(document.getElementById("text").lastChild);
      scrabbleWord = scrabbleWord.substring(0, scrabbleWord.length - 1);
    }
    
    if (document.querySelectorAll("#text > .letter-container").length == 0) { // no letters, go back to starting configuration
      container.innerHTML = deletedText;
    }
    
    renderScore(scrabbleWord);
};

document.getElementById("M2x").onclick = function(evt) { // Changes multiplier by 2x
  evt.preventDefault();
  
  if (this.className != "active") {
    multiplier = 2;
    this.className = "active"
    document.getElementById("M3x").className = "";
  }
  else {
    multiplier = 1;
    this.className = "";
  }
  
  renderScore(scrabbleWord);
};

document.getElementById("M3x").onclick = function(evt) { // Almost same as above. Possible to combine?
  evt.preventDefault();
  
  if (this.className != "active") {
    multiplier = 3;
    this.className = "active"
    document.getElementById("M2x").className = "";
  }
  else {
    multiplier = 1;
    this.className = "";
  }
  
  renderScore(scrabbleWord);
};

document.onclick = function(evt) { // return focus to MHTB (Massive Hidden Text Box)
  hiddenTextBox.focus();
}

function renderScore(word) {
  if (getScore(word) == 0) {
    document.getElementById("score").innerHTML = "";
  }
  else {
    document.getElementById("score").innerHTML = getScore(word) * multiplier;
  }
}

function getScore(word) {
  var alphabetScore = {'a': 1, 'b': 3, 'c': 3, 'd': 2, 'e': 1, 'f': 4, 'g': 2, 'h': 4, 'i': 1, 'j': 8, 'k': 5, 'l': 1, 'm': 3, 'n': 1, 'o': 1, 'p': 3, 'q': 10, 'r': 1, 's': 1, 't': 1, 'u': 1, 'v': 4, 'w': 4 , 'x': 8, 'y': 4, 'z': 10};
  
  var sum = 0;
  for (var i = 0; i < word.length; ++i) {
    sum += alphabetScore[word.charAt(i)] || 0;
  }
  
  return sum;
}

function multiplyLetter(letterElement, position) {
  console.log(letterElement.innerHTML);
  console.log(position);
}
