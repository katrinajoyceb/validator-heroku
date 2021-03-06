var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");
const cors = require("cors");


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var acmfeventRouter = require("./routes/acmfevent.route");
var failureeventRouter = require("./routes/failureevent.route");
var fdeRouter = require("./routes/fde.route");
var fdeCorrelationRouter = require("./routes/fdecorrelation.route");
var parameterRouter = require("./routes/parameter.route");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.json());
app.use(cors());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/parameter", parameterRouter);
app.use("/acmfevent", acmfeventRouter);
app.use("/failureevent", failureeventRouter);
app.use("/fde", fdeRouter);
app.use("/fdecorrelation", fdeCorrelationRouter);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
 
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

app.use(express.static(path.join(__dirname, 'build')));

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  //
  app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname = 'build/index.html'));
  })
}
//build mode


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = app;
