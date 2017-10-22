var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

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
  var lessonHtml = `
    <p><strong>Linear algebra</strong> is the branch of mathematics concerning vector spaces and linear mappings between such spaces. It includes the study of lines, planes, and subspaces, but is also concerned with properties common to all vector spaces.</p>
    <p>The set of points with coordinates that satisfy a linear equation forms a hyperplane in an n-dimensional space. The conditions under which a set of n hyperplanes intersect in a single point is an important focus of study in linear algebra. Such an investigation is initially motivated by a system of linear equations containing several unknowns. Such equations are naturally represented using the formalism of matrices and vectors.</p>
    <p>Linear algebra is central to both pure and applied mathematics. For instance, abstract algebra arises by relaxing the axioms of a vector space, leading to a number of generalizations. Functional analysis studies the infinite-dimensional version of the theory of vector spaces. Combined with calculus, linear algebra facilitates the solution of linear systems of differential equations.</p>
    <p>Techniques from linear algebra are also used in analytic geometry, engineering, physics, natural sciences, computer science, computer animation, advanced facial recognition algorithms and the social sciences (particularly in economics). Because linear algebra is such a well-developed theory, nonlinear mathematical models are sometimes approximated by linear models.</p>
  `;
  res.render('lesson', {
    topic: req.query.q,
    lessonHtml: lessonHtml,
    videoLink: "https://www.youtube.com/embed/ZK3O402wf1c"
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
