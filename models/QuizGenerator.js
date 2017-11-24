var Quiz = require('./Quiz'),
    QuestionGenerator = require('./QuestionGenerator');

function QuizGenerator(query, lessonContent) {
  this.query = query;
  this.lessonContent = lessonContent;
};

QuizGenerator.prototype.getQuiz = function() {
  var qg = new QuestionGenerator(this.query, this.lessonContent);
      questions = [];
  questions = questions.concat(qg.getMultipleChoiceQuestions(5));
  questions = questions.concat(qg.getTrueFalseQuestions(5));
  return new Quiz(this.query + ' Quiz', questions);
};

module.exports = QuizGenerator;
