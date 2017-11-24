var natural = require('natural'),
    Question = require('./Question'),
    TfIdf = natural.TfIdf,
    path = require("path"),
    base_folder = path.join(path.dirname(require.resolve("natural")), "brill_pos_tagger"),
    rulesFilename = base_folder + "/data/English/tr_from_posjs.txt",
    lexiconFilename = base_folder + "/data/English/lexicon_from_posjs.json",
    defaultCategory = 'N',
    lexicon = new natural.Lexicon(lexiconFilename, defaultCategory),
    rules = new natural.RuleSet(rulesFilename),
    tagger = new natural.BrillPOSTagger(lexicon, rules);

function QuestionGenerator(query, lessonContent) {
  this.query = query;
  this.lessonContent = lessonContent;
};

QuestionGenerator.WORD_BLACKLIST = ['displaystyle'];

QuestionGenerator.prototype.getMultipleChoiceQuestions = function(limit) {
  var self = this,
      words = this._getImportantWords(),
      questions = [];
  for (var i = 0; i < limit; i++) {
    var word = words[Math.floor(Math.random() * 10)].term,
        sentence = self._getSentenceWithWord(word),
        sentence = sentence.replace(word, '________'),
        options = [],
        answerIndex = Math.floor(Math.random() * 4),
        attempts = 0;

    while (options.length < 4 && attempts < 100) {
      if (options.length == answerIndex) {
        options.push(word);
      } else {
        var option = words[Math.floor(Math.random() * words.length)].term;
        if (self._isValidOption(word, option) && options.indexOf(option) == -1) {
          options.push(option);
        }
      }
      attempts = attempts + 1;
    }
    questions.push(new Question(sentence, options, answerIndex));
  }
  return questions;
};

QuestionGenerator.prototype._isValidOption = function(word, option) {
  return !option.includes(word) && !word.includes(option) && tagger.tag([option])[0][1] == tagger.tag([word])[0][1];
};

QuestionGenerator.prototype.getTrueFalseQuestions = function(limit) {
  var self = this,
      words = this._getImportantWords(),
      questions = [];
  for (var i = 0; i < limit; i++) {
    var word = words[Math.floor(Math.random() * 10)].term,
        sentence = self._getSentenceWithWord(word),
        options = ['True', 'False'],
        answerIndex = Math.floor(Math.random() * 2);
    if (answerIndex === 1) {
      var option = word;
      while (option === word && !self._isValidOption(word, option)) {
        option = words[Math.floor(Math.random() * words.length)].term;
      }
      sentence = sentence.replace(word, option);
    }
    questions.push(new Question(sentence, options, answerIndex));
  }
  return questions;
};

QuestionGenerator.prototype._getSentenceWithWord = function(word) {
  var sentences = this.lessonContent.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|"),
      options = [];
  sentences.forEach(function(sentence) {
    if (sentence.includes(word) && !QuestionGenerator.WORD_BLACKLIST.some(function(w) { return sentence.includes(w) })) {
      options.push(sentence);
    }
  });
  return options[Math.floor(Math.random() * options.length)].trim();
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
