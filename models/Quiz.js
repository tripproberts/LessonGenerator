function Quiz(title, questions) {
  this.title = title;
  this.questions = questions;
};

Quiz.prototype.getTitle = function() {
  return this.title;
};

Quiz.prototype.getQuestions = function() {
  return this.questions;
};

module.exports = Quiz;
