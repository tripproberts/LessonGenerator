var natural = require('natural'),
    Question = require('./Question'),
    TfIdf = natural.TfIdf;

function QuestionGenerator(query, lessonContent) {
  this.query = query;
  this.lessonContent = lessonContent;
};

QuestionGenerator.WORD_BLACKLIST = ['displaystyle'];
QuestionGenerator.SENTENCE_DELIMITERS = '.';

QuestionGenerator.prototype.getMultipleChoiceQuestions = function(limit) {
  var self = this,
      words = this._getImportantWords(),
      questions = [];
  for (var i = 0; i < limit; i++) {
    var word = words[i].term,
        sentence = self._getSentenceWithWord(word),
        options = [];
    sentence = sentence.replace(word, '_____');
    answerIndex = Math.floor(Math.random() * 4);
    while (options.length < 4) {
      if (options.length == answerIndex) {
        options.push(word);
      } else {
        var option = words[Math.floor(Math.random() * words.length)].term;
        if (!option.includes(word) && !word.includes(option)) {
          options.push(option);
        }
      }
    }
    questions.push(new Question(sentence, options, answerIndex));
  }
  return questions;
};

QuestionGenerator.prototype._getSentenceWithWord = function(word) {
  var sentences = this.lessonContent.split(QuestionGenerator.SENTENCE_DELIMITERS),
      options = [];
  sentences.forEach(function(sentence) {
    if (sentence.includes(word)) {
      options.push(sentence);
    }
  });
  return options[Math.floor(Math.random() * options.length)];
};

QuestionGenerator.prototype._getImportantWords = function() {
  var self = this,
      tfidf = new TfIdf(),
      words = [];

  tfidf.addDocument(this.lessonContent);
  tfidf.listTerms(0).forEach(function(item) {
    var word = item.term;
    if (!self.query.includes(word) && !word.includes(self.query) && QuestionGenerator.WORD_BLACKLIST.indexOf(word) == -1) {
      words.push(item);
    }
  });
  return words;
};

module.exports = QuestionGenerator;