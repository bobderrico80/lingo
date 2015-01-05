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

module.exports = Round;
