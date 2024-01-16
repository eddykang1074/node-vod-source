var express = require('express');
var router = express.Router();

/* 메인페이지 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/*
-소켓서버에 연결된 모든사용자들간 채팅하기
-http://localhost:3000/chat
*/
router.get('/chat', function(req, res, next) {
  res.render('chat', { title: 'Express' });
});


/*
-채팅방(채널)기반 사용자간 채팅하기
-http://localhost:3000/groupchat
*/
router.get('/groupchat', function(req, res, next) {
  res.render('groupchat');
});



module.exports = router;
