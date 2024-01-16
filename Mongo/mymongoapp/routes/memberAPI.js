var express = require('express');
var router = express.Router();


const Member = require('../schemas/member');


//회원목록조회
//http://localhost:3000/member/list
router.get('/list', async (req, res, next) => {
    try {

      const members = await Member.find({});
      res.json(members);


    } catch (err) {
      console.error(err);
      next(err);
    }
});



//회원정보등록하기
//http://localhost:3000/member/create
router.post('/create',async(req,res)=>{

    const memberid = req.body.memberid;
    const memberpwd = req.body.memberpwd;
    const membername = req.body.membername;
    const email = req.body.email;
    const age = req.body.age;
    const married = req.body.married;


    try{

        var memberData ={
            memberid,
            memberpwd,
            membername,
            email,
            age,
            married,
            createdAt:Date.now(),
        }

        const member = await Member.create(memberData);
        res.json(member);

    }catch(Err){

    }

});




//회원정보수정하기
//http://localhost:3000/member/modify
router.post('/modify',async(req,res)=>{

    const memberid = req.body.memberid;
    const memberpwd = req.body.memberpwd;
    const membername = req.body.membername;
    const email = req.body.email;
    const age = req.body.age;
    const married = req.body.married;


    try{

        var memberData ={
            memberpwd,
            membername,
            email,
            age,
            married,
            createdAt:Date.now(),
        }

        const result = await Member.updateOne({memberid:memberid},memberData);
        res.json(result);

    }catch(Err){

    }

});


//단이회원정보삭제
//http://localhost:3000/member/delete?id=eddy
router.get('/delete', async (req, res, next) => {
    try {

      //삭제대상 회원아이디 추출
      const memberId = req.query.id;

      const result = await Member.deleteOne({memberid:memberId});
      res.json(result);


    } catch (err) {
      console.error(err);
      next(err);
    }
});
  



//단일 회원정보 조회 
//http://localhost:3000/member/gabriel
router.get('/:memberid', async (req, res, next) => {

    var memberId = req.params.memberid;

    try {

      const member = await Member.find({memberid:memberId});
      res.json(member);

    } catch (err) {
      console.error(err);
      next(err);
    }
});



module.exports = router;
