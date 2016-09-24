var scrabbleWord  = "";
var deletedText   = '<span id="message">start typing...</span>';
var letterButtons = '<div class="letter-buttons"><button class="letter-2x">2X</button><button class="letter-3x">3X</button></div>';
var multiplier    = 1;
var letterMultipliers = [];

var hiddenTextBox = document.getElementById("invisibleInput");

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
  document.getElementById("message").innerHTML = "tap anywhere and start typing...";
  document.getElementById("container").className = "mobile";
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
        
        container.innerHTML += '<span class="letter-container"><span class="letter">' + charStr + '</span><span class="letter-score">' + getScore(charStr[0]) + '</span>' + letterButtons + '</span>';
      }
      
      renderScore(scrabbleWord);
      
      return true;
    }
    
    if (charCode == 8) { // Delete letter element
      removeMultiplier(getNodeIndex(document.getElementById("text").lastChild));
      container.removeChild(document.getElementById("text").lastChild);
      scrabbleWord = scrabbleWord.substring(0, scrabbleWord.length - 1);
    }
    
    if (document.querySelectorAll("#text > .letter-container").length == 0) { // no letters, go back to starting configuration
      container.innerHTML = deletedText;
    }
    
    renderScore(scrabbleWord);
};

document.onclick = function(evt) { // return focus to MHTB (Massive Hidden Text Box)
  hiddenTextBox.focus();
}
// Button event handler
document.querySelector('body').addEventListener('click', function(event) {
  if (event.target.tagName.toLowerCase() === 'button') { // only look at button clicks
    if (event.target.id == "M2x" || event.target.id == "M3x") { // one of the big buttons
      if (event.target.className != "active") {
        if (event.target.id == "M2x") {multiplier = 2; document.getElementById("M3x").className = ""} else {multiplier = 3; document.getElementById("M2x").className = ""}
        event.target.className = "active"
      }
      else {
        multiplier = 1;
        event.target.className = "";
      }
    }
    else { // letter multiplier button
      if (event.target.className.indexOf("active") == -1) { // if not active
        if (event.target.className.indexOf("letter-2x") != -1) { // if we're in the letter-2x element...
          multiplyLetter(2, getNodeIndex(event.target.parentElement.parentElement));
          event.target.parentElement.lastChild.className = event.target.parentElement.lastChild.className.replace(/(?:^|\s)active(?!\S)/g , ''); // remove active class from 3x element
        }
        else { // we're in the letter-3x element
          multiplyLetter(3, getNodeIndex(event.target.parentElement.parentElement));
          event.target.parentElement.firstChild.className = event.target.parentElement.firstChild.className.replace(/(?:^|\s)active(?!\S)/g , ''); // remove active class from 2x element
        }
        
        event.target.className += " active" // add active class to current element
      }
      else {
        event.target.className = event.target.className.replace(/(?:^|\s)active(?!\S)/g , '');
        multiplyLetter(1, getNodeIndex(event.target.parentElement.parentElement));
      }
    }
    
    renderScore(scrabbleWord);
  }
});

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
    if (letterMultipliers.find(x => x.position === i) != undefined) {var letterMultiplier = letterMultipliers.find(x => x.position === i).multiplier;} else {var letterMultiplier = 1;}
    sum += alphabetScore[word.charAt(i)] * letterMultiplier;
  }
  
  return sum;
}

function multiplyLetter(multiplier, position) {
  if (letterMultipliers.find(x => x.position === position) != undefined || multiplier == 1) {
    removeMultiplier(position);
    if (multiplier == 1) {return true;}
  }
  letterMultipliers.push({position: position, multiplier: multiplier}); 
}

function removeMultiplier(position) {
  console.log("Remove");
  if (letterMultipliers.find(x => x.position === position) != undefined) {
    letterMultipliers.splice(letterMultipliers.indexOf(letterMultipliers.find(x => x.position === position)), 1);
  }
  return true;
}

function getNodeIndex(node) { // Thanks http://stackoverflow.com/a/11762728
  var index = 0;
  while ( (node = node.previousSibling) ) {
      if (node.nodeType != 3 || !/^\s*$/.test(node.data)) {
          index++;
      }
  }
  return index;
}
