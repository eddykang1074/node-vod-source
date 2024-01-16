var express = require('express');
const bcrypt = require('bcryptjs');
const AES = require("mysql-aes");


//권한 미들웨어 참조 
// const { isLoggedIn, isNotLoggedIn } = require('./sessionMiddleware');


const { isLoggedIn, isNotLoggedIn } = require('./passportMiddleware');


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


//S3 업로드 처리 객체 생성
//const { upload } = require("../common/aws_s3");




//Express 객체에서 제공하는 Router메소드를 호출해서 사용자 웹페이지에 대한 요청과 응답을 제어하는
//라우터 객체를  먼저 정의 합니다. 
var router = express.Router();

//ORM db객체 참조하기 
var db = require('../models/index.js');


/*
- 회원정보 신규 등록을 위한 웹페이지 요청 라우팅 메소드
- 요청방식 :Get-클라이언트(웹브라우저)에서 링크나 URL방식을 통해 특정 웹페이지를 요청합니다.
- 호출주소: http://localhost:3000/member/entry
- 응답결과: entry.ejs의 안에 있는 웹페이지 소스를 웹브라우저로 전달한다. 
*/
router.get('/entry',isLoggedIn,function(req,res){

    //res.render('특정 웹페이지 html소스가 담겨있는 뷰영역에 뷰파일의 경로를 지정합니다.')
    res.render('member/entry.ejs');
});


/* 
- 이미 로딩된 회원가입페이지에서 사용자가 입력한 회원가입정보를 받아서 정보를 추출해 DB에 반영처리하는-비동기 라우팅 메소드 
- 요청방식:Post
- 호출주소: http://localhost:3000/member/entry 
- 응답결과: 메인페이지로 이동시킨다.
- 업로드시 upload.single('file') 업로드 파일의 name속성값을 지정해줍니다.
*/
router.post('/entry',isLoggedIn,upload.single('file'),async(req,res,next)=>{

    //STEP1: 사용자가 입력한 폼태그내의 입력요소의 name특성에 정의된 키명으로 req.body.키명 정보를 추출한다.
    var email = req.body.email;

    //사용자가 입력한 암호화되지 않은 암호문자열:1234
    var memberPassword = req.body.password;

    //단방향 암호화(해시알고리즘)이 적용된 암호화된 문자열 생성하기 
    const encryptedPassword = await bcrypt.hash(memberPassword,12);

    var memberName = req.body.name;

    //사용자 전화번호를 양방향 암호화(AES 알고리즘)를 이용해 암호화된 문자열 만든다.
    var encryptMobileNo = AES.encrypt(req.body.telephone, process.env.MYSQL_AES_KEY);

    //업로드 완료된 파일정보 추출하기
    const uploadFile = req.file;

    var filePath ="/upload/profile/"+uploadFile.filename; //서버에 저장된 파일이름
    var fileName = uploadFile.filename;
    var fileOrignalName = uploadFile.originalname; //사용자가 업로드한 오리지널 파일이름
    var fileSize = uploadFile.size; //업로드된 파일 사이즈
    var fileType=uploadFile.mimetype; //업로드된 파일형식




    //STEP2:추출된 정보를 기반으로 DB에저장할 데이터 객체(JSON)을 생성한다.
    var member = {
        email:email,
        member_password:encryptedPassword,
        name:memberName,
        profile_img_path:filePath,
        telephone:encryptMobileNo,
        entry_type_code:req.body.entryTypeCode,
        use_state_code:req.body.entryStateCode,
        reg_date:Date.now(),
        reg_member_id:0,
        edit_date:Date.now(),
        edit_member_id:0
    };

    //STEP3: 회원정보 JSON데이터를 DB에 회원테이블에 저장처리한다.(ORM을 통해)

    //TASK1: 신규회원정보를 등록하고 등록된 회원정보를 반환받는다.
    var registedMemberData = await db.Member.create(member);

    //orm프레임워크에서 의해서 db.Member.create(member)는
    //INSERT INTO members(email)VALUES('test@test.co.kr');


    //TASK2: 등록된 신규회원정보의 메일정보를 수정한다.
    // var updateCnt = await db.Member.update(
    //     {email:"test888@test.co.kr"},
    //     {where:{member_id : registedMemberData.member_id}}
    //     );


    //STEP4: DB저장을 완료하고 회원가입이 완료되었다고 가정하고 현재 사용자의 웹브라우저 페이지를 메인 페이지로 이동시킨다.
    //res.redirect('이동주소')메소드는 특정url 주소로 사용자 웹브라우저의 주소를 이동시켜준다.
    //현재 프로젝트의 메인 페이지로 이동시킴(http://localhost:3000/)
    res.redirect('/member/list');
});


//S3 스토리지로 파일을 업로드하고 회원정보를 등록하는 라우팅 메소드
// router.post('/entrys3',upload.getUpload("profile/").fields([{ name: "file", maxCount: 1 },]),async(req,res,next)=>{

//     //STEP1: 사용자가 입력한 폼태그내의 입력요소의 name특성에 정의된 키명으로 req.body.키명 정보를 추출한다.
//     var email = req.body.email;

//     //사용자가 입력한 암호화되지 않은 암호문자열:1234
//     var memberPassword = req.body.password;

//     //단방향 암호화(해시알고리즘)이 적용된 암호화된 문자열 생성하기 
//     const encryptedPassword = await bcrypt.hash(memberPassword,12);

//     var memberName = req.body.name;

//     //사용자 전화번호를 양방향 암호화(AES 알고리즘)를 이용해 암호화된 문자열 만든다.
//     var encryptMobileNo = AES.encrypt(req.body.telephone, process.env.MYSQL_AES_KEY);

//     //업로드 완료된 파일정보 추출하기
//     // const uploadFile = req.file;

//     // var filePath ="/upload/profile/"+uploadFile.filename; //서버에 저장된 파일이름
//     // var fileName = uploadFile.filename;
//     // var fileOrignalName = uploadFile.originalname; //사용자가 업로드한 오리지널 파일이름
//     // var fileSize = uploadFile.size; //업로드된 파일 사이즈
//     // var fileType=uploadFile.mimetype; //업로드된 파일형식

//     //S3에 업로드된 파일정보 조회하기
//     const profileImg = req.files.file ? req.files.file[0] : null;

//     let profilePath ="";
//     if(profileImg != null){
//       profilePath = process.env.S3_IMG_DOMAIN + "/" + profileImg.key;
//   }





//     //STEP2:추출된 정보를 기반으로 DB에저장할 데이터 객체(JSON)을 생성한다.
//     var member = {
//         email:email,
//         member_password:encryptedPassword,
//         name:memberName,
//         profile_img_path:profilePath,
//         telephone:encryptMobileNo,
//         entry_type_code:req.body.entryTypeCode,
//         use_state_code:req.body.entryStateCode,
//         reg_date:Date.now(),
//         reg_member_id:0,
//         edit_date:Date.now(),
//         edit_member_id:0
//     };

//     //STEP3: 회원정보 JSON데이터를 DB에 회원테이블에 저장처리한다.(ORM을 통해)

//     //TASK1: 신규회원정보를 등록하고 등록된 회원정보를 반환받는다.
//     var registedMemberData = await db.Member.create(member);

//     //orm프레임워크에서 의해서 db.Member.create(member)는
//     //INSERT INTO members(email)VALUES('test@test.co.kr');


//     //TASK2: 등록된 신규회원정보의 메일정보를 수정한다.
//     // var updateCnt = await db.Member.update(
//     //     {email:"test888@test.co.kr"},
//     //     {where:{member_id : registedMemberData.member_id}}
//     //     );


//     //STEP4: DB저장을 완료하고 회원가입이 완료되었다고 가정하고 현재 사용자의 웹브라우저 페이지를 메인 페이지로 이동시킨다.
//     //res.redirect('이동주소')메소드는 특정url 주소로 사용자 웹브라우저의 주소를 이동시켜준다.
//     //현재 프로젝트의 메인 페이지로 이동시킴(http://localhost:3000/)
//     res.redirect('/member/list');
// });


/* 
- 이미 로딩된 회원가입페이지에서 사용자가 입력한 회원가입정보를 받아서 정보를 추출해 DB에 반영처리하는-동기방식 라우팅 메소드 
- 요청방식:Post
- 호출주소: http://localhost:3000/member/syncentry 
- 응답결과: 메인페이지로 이동시킨다.
*/
router.post('/syncentry',isLoggedIn,function(req,res,next){

    //STEP1: 사용자가 입력한 폼태그내의 입력요소의 name특성에 정의된 키명으로 req.body.키명 정보를 추출한다.
    var email = req.body.email;
    var memberPassword = req.body.password;
    var memberName = req.body.name;

    //STEP2:추출된 정보를 기반으로 DB에저장할 데이터 객체(JSON)을 생성한다.
    var member = {
        email:email
    };

    //STEP3: 회원정보 JSON데이터를 DB에 회원테이블에 저장처리한다.(ORM을 통해)

    //TASK1: 신규 사용자 정보를 등록하고 등록이 완료되는 콜백함수에 두번쨰 태스크를 호출합니다.
    db.Member.create(member).then(function(createResult){

        console.log("신규 회원등록 정보:",createResult);

        //TASK2: 기등록된 사용자 정보를 수정처리하는 두번쨰 테스트시작
        db.Member.update(
            {email:"test99@test.co.kr"},
            {where:{member_id:createResult.member_id}}
        ).then(function(updateResult){
            console.log("신규회원 정보 수정결과 적용건수:",updateResult);
            //TASK3: 최종처리 후 페이지로 이동시켜준다.
            res.redirect('/member/list');
        })

    });

    //orm프레임워크에서 의해서 db.Member.create(member)는
    //INSERT INTO members(email)VALUES('test@test.co.kr');


    //STEP4: DB저장을 완료하고 회원가입이 완료되었다고 가정하고 현재 사용자의 웹브라우저 페이지를 메인 페이지로 이동시킨다.
    //res.redirect('이동주소')메소드는 특정url 주소로 사용자 웹브라우저의 주소를 이동시켜준다.
    //현재 프로젝트의 메인 페이지로 이동시킴(http://localhost:3000/)
    //res.redirect('/member/list');
});



//회원목록 웹 페이지 요청 라우팅메소드
router.get('/list',isLoggedIn,async(req,res,next)=>{

    var members = await db.Member.findAll();

    res.render('member/list.ejs',{members});
});

//회원정보조회 처리 라우팅 메소드
router.post('/list',isLoggedIn,function(req,res,next){
    res.render('member/list.ejs');
});




//회원정보 확인 및 수정 웹페이지 요청 라우팅메소드
//localhost:3000/member/modify/1
router.get('/modify/:mid',isLoggedIn,async(req,res,next)=>{

    var memberId = req.params.mid;

    var member = await db.Member.findOne({
        where:{member_id:memberId}
    });

    //양방향 암호화를 통해 암호화된 문자열을 다시 복호화한다.
    var decryptedMobileNo = AES.decrypt(member.telephone, process.env.MYSQL_AES_KEY)
    member.telephone = decryptedMobileNo;

    res.render('member/modify',{member});
});

//회원정보 수정처리 라우팅메소드 
router.post('/modify',isLoggedIn,function(req,res,next){
    
    res.redirect('/member/list');
});




//라우터파일내의 라우터 객체를 반드시 모듈외부로 기능을 노출해야합니다.
module.exports = router;











