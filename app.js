var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    LessonGenerator = require('./models/LessonGenerator'),
    app = express();

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
  var query = req.query.q;
  new LessonGenerator().getText(query).then(content => {
    res.render('lesson', {
      topic: query,
      lessonHtml: content,
      videoLink: "https://www.youtube.com/embed/ZK3O402wf1c"
    });
  });
});

app.get('/quiz', function(req, res, next) {
  var questions = [{
    question: "Linear algebra is the branch of _______ concerning vector spaces and linear mappings between such spaces.",
    options: ["Mathematics", "History", "Art", "Physics"]
  }, {
    question: "Linear algebra is the branch of _______ concerning vector spaces and linear mappings between such spaces.",
    options: ["Mathematics", "History", "Art", "Physics"]
  }, {
    question: "Linear algebra is the branch of _______ concerning vector spaces and linear mappings between such spaces.",
    options: ["Mathematics", "History", "Art", "Physics"]
  }, {
    question: "Linear algebra is the branch of _______ concerning vector spaces and linear mappings between such spaces.",
    options: ["Mathematics", "History", "Art", "Physics"]
  }, {
    question: "Linear algebra is the branch of _______ concerning vector spaces and linear mappings between such spaces.",
    options: ["Mathematics", "History", "Art", "Physics"]
  }, {
    question: "The set of points with coordinates that satisfy a linear equation forms a hyperplane in an n-dimensional space.",
    options: ["True", "False"]
  }, {
    question: "The set of points with coordinates that satisfy a linear equation forms a hyperplane in an n-dimensional space.",
    options: ["True", "False"]
  }, {
    question: "The set of points with coordinates that satisfy a linear equation forms a hyperplane in an n-dimensional space.",
    options: ["True", "False"]
  }, {
    question: "The set of points with coordinates that satisfy a linear equation forms a hyperplane in an n-dimensional space.",
    options: ["True", "False"]
  }, {
    question: "The set of points with coordinates that satisfy a linear equation forms a hyperplane in an n-dimensional space.",
    options: ["True", "False"]
  }];
  res.render('quiz', {
    quizTitle: req.query.q + ' Quiz',
    questions: questions
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
