var express = require('express');
var router = express.Router();

var db = require('../models/index');
const bcrypt = require('bcryptjs');



//관리자 계정 목록 조회 페이지 요청 라우팅 메소드
router.get('/list', async(req, res, next)=>{
  res.render('admin/list.ejs');
});


//관리자계정 등록 웹페이지 요청 라우팅 메소드
router.get('/create', async(req, res, next)=> {
    res.render('admin/create.ejs');
});

//관리자 계정 등록처리 라우팅 메소드
router.post('/create', async(req, res, next)=> {

   //step1: 관리자 정보등록 페이지에서 전달된 사용자 입력 데이터를 추출한다.
   
    //단방향 암호화(해시알고리즘)이 적용된 암호화된 문자열 생성하기 
    const encryptedPassword = await bcrypt.hash(req.body.password,12);
   
   var admin = {
      company_code:1,
      admin_id:req.body.adminId,
      admin_password: encryptedPassword,
      admin_name:req.body.name,
      email:req.body.email,
      telephone:req.body.telephone,
      dept_name:req.body.dept,
      used_yn_code:req.body.useStateCode,
      reg_date:Date.now(),
      reg_member_id:0,
      edit_date:Date.now(),
      edit_member_id:0
   };

   var registAdmin = await db.Admin.create(admin);


    res.redirect('/admin/list');
});




module.exports = router;