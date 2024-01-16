var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


//일회성(휘발성) 데이터를 특정 페이지(뷰)에 전달하는 방식제공 플래시 팩키지참조하기
var flash = require('connect-flash');

//express기반 서버세션 관리 팩키지 참조하기 
var session = require('express-session');


const passport = require('passport');


//CORS 지원위해 패키지참조 
const cors = require("cors");

//dotenv 어플리케이션 환경설정관리 팩키지 참조 및 구성하기 
require('dotenv').config();


//노드 어플리케이션의 레이아웃 페이지 기능을 제공하기 위해 express-ejs-layouts 참조하기 
var expressLayouts = require('express-ejs-layouts');


var sequelize = require('./models/index.js').sequelize;


//기본 노드프로젝트 템플리에서 제공하는 기본라우터 파일 참조영역 
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


//개발자 정의 라우터 파일 참조영역
var memberRouter = require('./routes/member.js');
var channelRouter = require('./routes/channel');
var articleRouter = require('./routes/article');

var adminRouter = require('./routes/admin');



//RESTAPI 전용 라우터 파일 참조영역 
var channelAPIRouter = require('./routes/channel-API');


var app = express();




//flash 메시지 사용 활성화: cookie-parser와 express-session을 사용하므로 이들보다는 뒤로 위치
app.use(flash());



//MYSQL과 자동 연결 처리 및 모델 기반 물리 테이블 생성 처리 제공
sequelize.sync(); 

//인증관련 패스포트 개발자 정의 모듈참조, 로컬 로그인 전략 적용
const passportConfig = require('./passport/index.js');

//패스포트 설정처리
passportConfig(passport);



//CORS 도메인 지정 허용하기 
// app.use(
//   cors({
//     methods: ["GET", "POST", "DELETE", "OPTIONS"],
//     origin: ["http://localhost:3000", "https://beginmate.com"],
//   })
// );


//모든 호출 허락
app.use(cors());


//express-session기반 서버세션 설정 구성하기 
app.use(
  session({
    resave: false,//매번 세션 강제 저장
    saveUninitialized: true, 
    secret: "testsecret", //암호화할떄 사용하는 salt값
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge:1000 * 60 * 5 //5분동안 서버세션을 유지하겠다.(1000은 1초)
    },
  }),
);



//패스포트-세션 초기화 : express session 뒤에 설정
app.use(passport.initialize());
app.use(passport.session());



//어플리케이션 미들웨어 함수 샘플1
//현재 노드 어플리케이션 모든 요청이 발생하면 무조건 하기 함수가 실행되고 터미널 콘솔에 로그를 출력하고
//원래 요청했던 라우터를 찾아 라우팅 메소드가 실행됩니다.
app.use(function(req,res,next){
  console.log('어플리케이션 미들웨어 함수1 호출:',Date.now());
  next();
});




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



//상단에서 참조한 기본 라우터파일들의 디폴트 URL호출주소 정의영역 
//http://localhost:3000/
app.use('/', indexRouter);

//http://localhost:3000/users
app.use('/users', usersRouter);

//개발자가 정의한 라우터 파일의 디폴트 URL주소 정의영역 
//http://localhost:3000/member
app.use('/member', memberRouter);


//채널정보 라우터 파일의 디폴트 URL호출주소를 정의합니다.
//test.co.kr/channel
app.use('/channel', channelRouter);

//게시글 정보 라우터 파일의 기본호출 URL주소 정의 
//test.co.kr/article
app.use('/article', articleRouter);


//채널정보 전용관리 RESTAPI 라우터 파일의 디폴트 URL호출주소를 정의합니다.
//test.co.kr/api/channel
app.use('/api/channel', channelAPIRouter);


//관리자계정 웹페이지 관리 라우터 기본주소 세팅
app.use('/admin', adminRouter);



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
