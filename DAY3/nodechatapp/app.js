var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//시퀄라이즈 ORM 참조하기 
var sequelize = require('./models/index.js').sequelize;

//dotenv 어플리케이션 환경설정관리 팩키지 참조 및 구성하기 
require('dotenv').config();

//CORS 패키지 참조하기 
const cors = require("cors");


var expressLayouts = require('express-ejs-layouts');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var chatRouter = require('./routes/chat');
var memberRouter = require('./routes/member');


//회원정보 데이터 처리 전용 RESTAPI 라우터 참조
var memberAPIRouter = require('./routes/memberAPI');


var app = express();

//MYSQL과 자동 연결 처리 및 모델 기반 물리 테이블 생성 처리 제공
sequelize.sync(); 


//모든 호출 허락
app.use(cors());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//레이아웃 설정
app.set('layout', 'baseLayout');
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);
app.set("layout extractMetas", true); 
app.use(expressLayouts);



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/chat', chatRouter);
app.use('/member', memberRouter);

//회원정보처리 전용 RESTAPI라우터의 기본호출주소 체계 정의 
//http://localhost:3000/api/member
app.use('/api/member', memberAPIRouter);



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
