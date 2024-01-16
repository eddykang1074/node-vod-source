var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


//노드 어플리케이션의 레이아웃 페이지 기능을 제공하기 위해 express-ejs-layouts 참조하기 
var expressLayouts = require('express-ejs-layouts');




var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var articleRouter = require('./routes/article');

var memberAPIRouter = require('./routes/memberAPI');


//몽고DB서버에 연결합니다.
const connect = require('./schemas/');
connect();


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//레이아웃 설정
app.set('layout', 'layout'); //노드앱의 기본 레이아웃 ejs파일을 views\layout.ejs로 지정함
app.set("layout extractScripts", true); //컨텐츠 페이지내 <script>태그가 레이아웃 페이지에 통합할것인지에 대한 설정
app.set("layout extractStyles", true); //컨텐츠 페이지내 <style>태그가 레이아웃 페이지에 통합할것인지에 대한 설정
app.set("layout extractMetas", true); //컨텐츠 페이지내 <meta>태그가 레이아웃 페이지에 통합할것인지에 대한 설정
app.use(expressLayouts);



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/article', articleRouter);

app.use('/member', memberAPIRouter);




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

module.exports = app;
