/*
- 채팅방(채널) 데이터를 관리하는 RESTFulAPI 라우터 파일
- 해당 라우터파일 기본주소경로: http://localhost:3000/api/channel~ 
- 채팅방 생성 웹페이지, 목록 페이지,수정 페이지에 대한 웹페이지 요청 및 응답 처리담당
*/
var express = require('express');
var router = express.Router();


//파일 업로드 지원 노드팩키지 참조 
var multer = require('multer');

var moment = require('moment');

//파일 저장 위치 지정
var storage  = multer.diskStorage({ 
    destination(req, file, cb) {
      cb(null, 'public/upload/profile');
    },
    filename(req, file, cb) {
      cb(null, `${moment(Date.now()).format("YYYYMMDD-HHmmss")}__${file.originalname}`);
    },
  });


//일반 업로드 처리 객체 생성
var upload = multer({ storage: storage });

//S3업로드 객체 생성
//const { upload } = require("../common/aws_s3");


var db = require('../models/index');




//DB에 저장된 모든 채널목록 데이터를 제공하는 RESTAPI 라우팅메소드
//http://localhost:3000/api/channel/all
router.get('/all', async(req, res, next)=>{

    //DB에서 채널목록 정보를 모두 조회해왔다고 가정합니다.

    var channelList = [
        {channel_id:1,channel_name:"채널1"},
        {channel_id:2,channel_name:"채널2"},
        {channel_id:3,channel_name:"채널3"},
    ];

    //res.json(JSON데이터전달);
    res.json(channelList);
});


//단일 채널정보를 조회하는 RESTAPI 라우팅 메소드-쿼리스트링방식
//http://localhost:3000/api/channel?cid=1
router.get('/', async(req, res, next)=>{

    //STEP1: URL에서 채널고유번호를 추출한다.
    var channelId = req.query.cid;


    //STEP2:추출된 채널고유번호를 이용해 DB의 채널테이블에서 해당 번호와 동일한 단일건의 채널정보를 조회해옵니다.
    var channel = {
        channel_id:1,
        channel_name:"채널1"
    };

    //res.json(JSON데이터전달);
    res.json(channel);
});



//채널정보를 신규 등록하는 RESTAPI 라우팅메소드
//http://localhost:3000/api/channel/create
router.post('/create',async(req,res)=>{

    //STEP1: 프론트엔드나 클라이언트에서 JSON형태 아래와같이 데이터를 전달해준다고 가정하자
    /* 
        {
            "channel_name":"채널1",
            "channel_desc":"채널설명1"
        }

    */

    //STEP2: 프론트엔드/클라이언트에서 보내준 JSON데이터를 추출합니다.
    var channelName = req.body.channel_name;
    var channelDescription = req.body.channel_desc;


    //STEP3: DB의 채널테이블에 해당 정보를 저장하기 위한 JSON객체를 정의한다.
    var channel = {
        channel_id:1,
        channel_name:channelName,
        channel_desc:channelDescription
    };

    //STEP4: DB에 채널테이블에 프론트에서 넘어온데이터를 저장한다.


    //STEP5: 저장후 반환되는 실제 DB에 저장된 단일 채널정보를 클라이언트에 반환(응답결과물)한다.

    res.json(channel);
});



//http://localhost:3000/api/channel/search
router.get('/search', async(req, res, next)=>{

    //DB에서 채널목록 정보를 모두 조회해왔다고 가정합니다.

    var channelList = await db.Channel.findAll();

    var result = {
        channels:channelList,
        channelCount:1,
        userName:'강창훈'
    }

    //res.json(JSON데이터전달);
    res.json(result);
});


//파일 업로드 처리 API 라우팅 메소드 
//http://localhost:3000/api/channel/upload
//upload.single('files')FORM DATA에 추가한 files이름으로 정의한다.
router.post("/upload",upload.single('files'),async(req,res)=>{

    //업로드 완료된 파일정보 추출하기
    const uploadFile = req.file;

    var filePath ="/upload/profile/"+uploadFile.filename; //서버에 저장된 파일이름
    var fileName = uploadFile.filename;
    var fileOrignalName = uploadFile.originalname; //사용자가 업로드한 오리지널 파일이름
    var fileSize = uploadFile.size; //업로드된 파일 사이즈
    var fileType=uploadFile.mimetype; //업로드된 파일형식

    var result ={
        fileName,
        fileOrignalName,
        fileSize,
        fileType,
        filePath
    }

    res.json(result);
});



//S3업로드 전용 REST API 메소드
//S3버킷으로 파일이 업로드 됩니다.
//http://localhost:3000/api/channel/uploads3
// router.post("/uploads3",upload.getUpload("profile/").fields([{ name: "files", maxCount: 1 },]),async(req,res)=>{

//     //S3에 업로드된 파일정보 조회하기
//     const profileImg = req.files.files ? req.files.files[0] : null;

//     let profilePath ="";
//     if(profileImg != null){
//       profilePath = process.env.S3_IMG_DOMAIN + "/" + profileImg.key;
//     }

//     var result ={
//         filePath:profilePath
//     }

//     res.json(result);
// });





//단일 채널정보를 조회하는 RESTAPI 라우팅 메소드-파라메터방식-와일드카드정의방식
//파라메터방식/와일드카드방식으로 정의된 라우팅 메소드는 라우터파일의 최하단에 정의한다.
//왜나면 이런경우  http://localhost:3000/api/channel/test 주소체계를 사용하는 라우팅메소드와 충돌이 난다.
//http://localhost:3000/api/channel/1
router.get('/:id', async(req, res, next)=>{

    //STEP1: URL에서 채널고유번호를 추출한다.
    var channelId = req.params.id;


    //STEP2:추출된 채널고유번호를 이용해 DB의 채널테이블에서 해당 번호와 동일한 단일건의 채널정보를 조회해옵니다.
    var channel = {
        channel_id:1,
        channel_name:"채널1"
    };

    //res.json(JSON데이터전달);
    res.json(channel);
});





module.exports = router;