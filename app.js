var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    QuizGenerator = require('./models/QuizGenerator'),
    LessonGenerator = require('./models/LessonGenerator'),
    app = express();

process.on('unhandledRejection', console.log.bind(console))
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

app.get('/lesson', function(req, res, next) {
  var query = req.query.q,
      lessonGenerator = new LessonGenerator(query);
  if (!query.trim().length) {
    res.redirect("/");
  }
  lessonGenerator.getVideoUrl(function(url) {
    lessonGenerator.getText().then(content => {
      res.render('lesson', {
        topic: query,
        lessonHtml: content,
        videoLink: url
      });
    });
  });
});

app.get('/quiz', function(req, res, next) {
  var q = req.query.q;
  new LessonGenerator(q).getText().then(content => {
    var qg = new QuizGenerator(q, content),
        quiz = qg.getQuiz();
    res.render('quiz', {
      quizTitle: quiz.title,
      questions: quiz.questions
    });
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
