/*
- 채팅방(채널) 정보를 관리하는 웹페이지에 대한 라우터 파일
- 해당 라우터파일 기본주소경로: http://localhost:3000/channel/~ 
- 채팅방 생성 웹페이지, 목록 페이지,수정 페이지에 대한 웹페이지 요청 및 응답 처리담당
*/
var express = require('express');
var router = express.Router();


//개발자가 정의한 미들웨어 공용함수 모듈 파일을 참조한다.
//객체의 비구조화 할당문법을 통해 미들웨어 모듈의 함수를 변수로 받는다.
const {checkParams,checkQueryKey} = require('./middlewares');



//channel라우터 미들웨어 함수예시
router.use(function(req,res,next){
    console.log("채널 라우터 파일 미들웨어 함수1:",Date.now());
    next();
});




//채널 생성 웹페이지 요청 라우팅 메소드
//http://localhost:3000/channel/create
router.get('/create', async(req, res, next)=>{
    res.render('channel/create.ejs');
});


//채널생성 웹페이지 폼에 사용자가 입력한 데이터를 추출해서 db저장 후 지정된 페이지로 이동시킵니다. 
//http://localhost:3000/channel/create
router.post('/create', async(req, res, next)=>{
    res.redirect('/channel/list');
});


//기 생성된 채널목록을 보여주는 웹페이지 요청 라우팅 메소드
//test.co.kr/channel/list
router.get('/list', async(req, res, next)=>{

    //DB에서 모든 채널목록을 가져왔다고 가정합니다.
    var channelList = [
        {channel_id:1,channel_name:"채널1"},
        {channel_id:2,channel_name:"채널2"},
        {channel_id:3,channel_name:"채널3"},
    ];

    res.render('channel/list',{channelList});
});

//채널 목록 페이지에서 전달되는 조회옵션 정보를 이용해 DB에서 조건에 해당하는 채널데이터를 조회
//목록 뷰파일에 전달해 동적으로 서버에서 HTML을 변조해서 최종 만들어진 웹페이지를 브라우저에전달합니다.
//test.co.kr/channel/list
router.post('/list', async(req, res, next)=>{

    var channelList = [
        {channel_id:1,channel_name:"채널1"},
        {channel_id:2,channel_name:"채널2"},
        {channel_id:3,channel_name:"채널3"},
    ];

    //DB에서 조회해온 채널목록 데이터를 뷰에전달해서 뷰에서 원래있던 HTML에 데이터를 조합해 서버에서
    //동적으로 HTML코드를 생성후 최종 웹브라우저에 전달한다.
    res.render('channel/list',{ channelList });
});



//채널정보 상세보기 및 수정처리 웹페이지 제공 라우팅메소드-쿼리스트링방식 
//test.co.kr/channel/modify?cid=1&test=테스트
router.get('/modify', async(req, res, next)=>{

    //STEP1: 쿼리스트링방식으로 전달되는 키값 추출하기
    var channelId = req.query.cid;  

    //STEP2:DB에서 해당 채널번호와 동일한 단일채널정보를 조회해옵니다

    //단일채널정보를 DB에서 가져왔다고 가정하고
    var channel = {
        channel_id:channelId,
        channel_name:"채널명"
    };

    res.render('channel/modify',{channel:channel});
});



//채널정보 상세보기 및 수정처리 웹페이지 제공 라우팅메소드-파라메터방식/와일드카드방식
//와일드 카드가 적용된 라우팅 메소드는 해당 라우터 파일에 최하단에 정의해야 URL충돌 문제를 해결할수있다.
//test.co.kr/channel/modify/1
router.get('/modify/:cid',checkParams,async(req,res)=>{

    //STEP1:와일드카드 키명을 이용해 URL에서 채널고유번호를 추출한다.
    var channelId = req.params.cid;

    
    //STEP2:DB에서 해당 채널번호와 동일한 단일채널정보를 조회해옵니다

    //단일채널정보를 DB에서 가져왔다고 가정하고
    var channel = {
        channel_id:channelId,
        channel_name:"채널명"
    };

    res.render('channel/modify',{channel:channel});
});



module.exports = router;






