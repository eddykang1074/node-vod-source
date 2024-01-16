var express = require('express');
var router = express.Router();


/* 
- 사용자 웹사이트에서의 신규회원 가입 웹페이지 요청 라우팅메소드
- localhost:3000/member/signup
*/
router.get('/signup', function(req, res, next) {
  res.render('member/signup',{layout:'memberLayout.ejs'});
});




module.exports = router;