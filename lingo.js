var WORD_LIST = [
  'LINGO',
  'PIZZA',
  'SHOES',
  'TREES',
  'LEMON',
  'BOOKS',
  'CHAIR',
  'LIGHT'
];
var WORD_LENGTH = 5;
var round = new Round();
var gameWon = false;

$(document).ready(function() {
  round.start();
  hintToCells(round.hint);

  $(document).on('keydown', function(e) {
    if (e.which === 8) { //backspace
      e.preventDefault();
      backspace(e);
    } else if (e.which >= 65 && e.which <= 90) { //alpha keys 
      inputAlpha(e.which);
    } else if (e.which === 13 && ($('.blank').length === 0)) { //enter key (only if complete)
      submitGuess(); 
    } else { //any other key      
      //do nothing
    }
  });
});

function backspace() {
  var targetInputBox = $('.guessInputContainer').children('.filled').last();
  targetInputBox.html('&nbsp');
  targetInputBox.removeClass('filled');
  targetInputBox.addClass('blank');
}

function inputAlpha(key) {
  var character = String.fromCharCode(key);
  var targetInputBox = $('.guessInputContainer').children('.blank').first();
  targetInputBox.html(character);
  targetInputBox.removeClass('blank');
  targetInputBox.addClass('filled');
}

function submitGuess() {
    var guess = getGuessString(); 
    gameWon = round.guess(guess);
    if (gameWon) {
      guessToCells(guess);
      $('.guessRow').last().children().css('background-color', 'green');
      $('.guessInputContainer').hide();
      alert('WINNER!');
    } else {
      var newHint = round.hint;
      hintToCells(newHint); 
      guessToCells(guess);
      $('.guessInput').html('&nbsp');
      $('.guessInput').removeClass('filled');
      $('.guessInput').addClass('blank');
    }
}

function getGuessString() {
  var string = '';
  $('.guessInput').each(function() {
    string += $(this).text();
  });
  return string;
}

function hintToCells(hint) {
  var row = '<tr class="guessRow"></tr>';
  $('.guessTable').append(row);
  for (var i = 0; i < WORD_LENGTH; i++) {
    var statusClass = '';
    if (hint[i].inWord) {
      statusClass = ' inWord';
    }
    if (hint[i].inPosition) {
      statusClass = ' inPosition';
    }
    $('.guessRow').last().append('<td class="guessCell' + statusClass + '">' + hint[i].character  + '</td>');
  }
}


function guessToCells(guess) {
  var i = 0;
  $('.guessRow').last().children().each(function() {
    $(this).text(guess.charAt(i));
   i++; 
  });
}

function Round() {
  this.word = '';
  this.hint = [];
  this.guesses = [];
  this.guessCount = 0;
}

Round.prototype.start = function() {
  this.word = getNewWord();
  this.hint = getFirstHint(this.word);
  
  function getNewWord() {
    return WORD_LIST[Math.floor((Math.random() * WORD_LIST.length))];
  }

  function getFirstHint(word) {
    var hint = new Hint();
    for (var i = 0; i < 5; i++) {
      if (i === 0) {
        hint[i] = new Letter(word.charAt(i), true, true);
      } else {
        hint[i] = new Letter();  
      }
    }   
    return hint;
  }
};

Round.prototype.guess = function(guessedWord) {
  guessedWord = guessedWord.toUpperCase();
  this.guesses[this.guessCount] = guessedWord;
  if (guessedWord === this.word) {
    return true;
  }
  this.hint = getNextHint(guessedWord, this.word);
  return false;

  function getNextHint(guessedWord, word) {
    var hint = new Hint();
    for (var i = 0; i < WORD_LENGTH; i++) {
      if (i === 0) {
        hint[0] = new Letter(word.charAt(0), true, true);
      } else {
        hint[i] = compare(guessedWord, word, i);
      }
    }
    return hint;
  }

  function compare(guessedWord, word, i) {
    if (word.charAt(i) === guessedWord.charAt(i)) {
      return new Letter(word.charAt(i), true, true);
    }
    if (word.indexOf(guessedWord.charAt(i)) != -1) {
      return new Letter(guessedWord.charAt(i), true, false); 
    }
    return new Letter();
  }
};

function Hint() {}

Hint.prototype.toString = function() {
  string = '';
  for (var i = 0; i < WORD_LENGTH; i++) {
    if (this[i].character && this[i].inPosition) {
      string += this[i].character; 
    } else if (this[i].character) {
      string += (this[i].character).toLowerCase();
    } else {
      string += '_';
    }
  }
  return string;
};

function Letter(character, inWord, inPosition) {
  this.character = character || '';
  this.inWord = inWord || false;
  this.inPosition = inPosition || false;
}
