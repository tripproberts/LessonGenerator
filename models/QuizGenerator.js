var Quiz = require('./Quiz'),
    QuestionGenerator = require('./QuestionGenerator');

function QuizGenerator(query, lessonContent) {
  this.query = query;
  this.lessonContent = lessonContent;
};

QuizGenerator.prototype.getQuiz = function() {
  var qg = new QuestionGenerator(this.query, this.lessonContent);
      questions = [],
      questionCount = 5;
  if (this.lessonContent.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|").length < 10) {
    questionCount = 3;
  }
  questions = questions.concat(qg.getMultipleChoiceQuestions(questionCount));
  questions = questions.concat(qg.getTrueFalseQuestions(questionCount));
  return new Quiz(this.query + ' Quiz', questions);
};

module.exports = QuizGenerator;
