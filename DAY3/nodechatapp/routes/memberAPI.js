//회원정보관리 전용 REST API 라우터파일
//라우터의 기본주소: http://localhost:3000/api/member/~~

var express = require('express');
var router = express.Router();

//단방향 암호화 패키지 참조하기 
const bcrypt = require('bcryptjs');

//jsonwebtoken 패키지 참조하기 
const jwt = require('jsonwebtoken');

//db객체는 반드시 var나 let으로 선언필요..
var db = require('../models/index');

//API라우팅 메소드 JWT토큰체크 미들웨어 참조 
const {tokenAuthChecking} = require('./apiMiddleWare');



//신규회원 가입처리 전용 REST API 메소드
//요청유형: post
//http://localhost:3000/api/member/entry
router.post('/entry', async(req, res, next)=>{

    //프론트엔드에서 호출하는 모든 REST API 메소드는 반환형식을 아래와같은 형식으로 반환합니다. 
    var apiResult ={
        code:"", //호출결과값 200(정상적인처리),400(요청리소스가 없는경우),500(서버에러)
        data:{}, //프론트엔드에 특정 값을 반환할때 해당 속성에 값을 넣어줍니다.
        result:"" //프론트엔드에게 처리결과 추가메시지를 전달하고 싶을떄 Ok,Failed
    };


    try{
        //STEP1: 프론트엔드에서 전달해주는 회원 json데이터의 속성값을 추출합니다.
        var email = req.body.email;
        var password = req.body.password;
        var name = req.body.name;
        var telephone = req.body.telephone;


        //STEP2: 사용자 암호를 해시 단방향 암호화 문자열로 변환한다.
        var encryptedPassword = await bcrypt.hash(password,12);

        //STEP3: DB에 member 테이블에 저장할 json데이터 생성
        var member = {
            email,
            member_password:encryptedPassword,
            name,
            profile_img_path:"",
            telephone,
            entry_type_code:0,
            use_state_code:1,
            reg_date:Date.now(),
            reg_member_id:0,
            edit_date:Date.now(),
            edit_member_id:0
        }

        //STEP4: DB에 member테이블에 데이터을 저장한다.
        //db.Member.create(member) 구분이 INSERT INTO SQL구문으로 변환되서 DB서버로 전달되어 데이터가 등록되고
        //등록이 완료된 실제 테이블 회원 데이터를 반환해줍니다.
        var registedMemberData = await db.Member.create(member);

        apiResult.code ="200";
        apiResult.data = registedMemberData;
        apiResult.result = "Ok";

    }catch(Err){
        apiResult.code ="500";
        apiResult.data = {};
        apiResult.result = "Failed";
    }

    

    //항상 API라우팅 메소드의 결과값은 apiResult 객체를 반환하게 설계필요..원할한 협업을 위해서..
    res.json(apiResult);
});


//회원로그인 REST API 메소드 구현
//요청유형: POST
//호출주소: localhost:3000/api/member/login
router.post('/login',async(req,res)=>{

    var apiResult ={
        code:"", 
        data:{}, 
        result:""
    };

    try{
        //STEP1:프론트엔드에서 제공되는 로그인 사용자 정보를 추출합니다.
        var email = req.body.email;
        var password = req.body.password;

        //STEP2: 메일주소 존재여부를 체크합니다.
        const member = await db.Member.findOne(
            {
                where:{ email:email,use_state_code:1 }
            });

        //동일한 메일주소가 존재하지 않은경우 
        if(member == null){
            apiResult.code ="400";
            apiResult.data = "notExistEmail";
            apiResult.result = "동일한 메일주소가 존재하지 않습니다."
        }else{

            //STEP3: 동일 메일주소의 암호값을 체크합니다.
            //사용자가 입력한 암호값과 DB에 저장된 암호화된 문자열을 비교해서 동일여부를 BOOL형으로 반환합니다.
            const result = await bcrypt.compare(password,member.member_password);

            //사용자 암호가 일치 않은경우 
            if(result == false){
                apiResult.code ="400";
                apiResult.data = "notCorrectPassword";
                apiResult.result = "암호가 일치하지 않습니다.";
            }else{
                //STEP4: 메일주소와 암호가 동일하면 사용자 정보중 주요정보를 JWT토큰으로 생성합니다.
                var tokenJsonData = {
                    member_id:member.member_id,
                    email:member.email,
                    name:member.name,
                    profile_img_path:member.profile_img_path,
                    telephone:member.telephone
                };

                //사용자 정보를 담고 있는 JWT 사용자 인증토큰 생성완료
                const token = jwt.sign(tokenJsonData,process.env.JWT_SECRET,{
                    expiresIn:'6h', // 10s,60m,24h 
                    issuer:'modulab'
                });

                //STEP5: 생성된 JWT 사용자 인증토큰을 브라우저로 전달합니다.
                apiResult.code ="200";
                apiResult.data = token;
                apiResult.result = "Ok";
            }
        }

    }catch(Err){
        console.log("서버에러발생:",Err);

        apiResult.code ="500";
        apiResult.data = null;
        apiResult.result = "failed or server error";
    }


    res.json(apiResult);
});


//로그인 완료한 사용자 개인 프로필 정보조회 API 메소드
//반드시 로그인시 서버에서 발급해준 JWT토큰값이 전달되어야함.
//호출주소: localhost:3000/api/member/profile
router.get('/profile',tokenAuthChecking,async(req,res)=>{

    var apiResult ={
        code:"", 
        data:{}, 
        result:""
    };

    try{
        //STEP1: 현재 profile api를 호출하는 사용자 요청의 
        //httpHeader영역에서 Authorization내 JWT토큰값 존재여부 확인 및 추출
        //'Bearer xdfdfdfdfdfd'
        const token = req.headers.authorization.split('Bearer ')[1];
        console.log("req헤더에 저장된 JWT 값 추출하기:",token);

        //STEP2: JWT토큰이 헤더를 통해 전달이 안된경우 결과값 반환
        // if(token == undefined){
        //     apiResult.code ="400";
        //     apiResult.data = "notprovidetoken";
        //     apiResult.result = "인증토큰이 제공되지 않았습니다.";

        //     return res.json(apiResult);
        // }


        //STEP3: 제공된 JWT토큰에서 사용자 메일주소를 추출한다.
        var tokenMember = jwt.verify(token,process.env.JWT_SECRET);
        
        console.log("JWT토큰내 저장된 사용자정보 확인하기",tokenMember);

        //STEP4: 토큰에 저장된 메일주소로 DB에서 해당 사용자 최신정보를 조회합니다.
        var member = await db.Member.findOne({where:{email:tokenMember.email}});

        //중요개인정보는 프론트엔드에 제공시 초기화해서 전달한다.
        member.member_password ="";

        apiResult.code ="200";
        apiResult.data = member;
        apiResult.result = "ok";

    }catch(Err){

        apiResult.code ="500";
        apiResult.data = null;
        apiResult.result = "failed";
    }

    res.json(apiResult);
})




  
  
module.exports = router;