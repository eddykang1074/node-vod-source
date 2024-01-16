var express = require('express');
var router = express.Router();

var moment = require('moment');

//게시글 ODM 모델참조하기 
const Article = require('../schemas/article');



//게시글정보조회 웹페이지 호출 라우팅메소드
router.get('/list', async(req, res, next)=>{
    const articles = await Article.find({});
    res.render('article/list.ejs',{articles,moment});

});

//게시글 정보조회 처리 라우팅메소드 
router.post('/list', async(req, res, next)=>{

    res.redirect('/article/list');
});



//게시글 등록 웹페이지 호출 라우팅메소드
router.get('/create', async(req, res, next)=>{

    res.render('article/create');
});

//게시글 등록 처리 라우팅메소드 
router.post('/create', async(req, res, next)=>{

    const title = req.body.title;
    const contents = req.body.contents;
    const articleTypeCode = req.body.articleTypeCode;
    const isDisplayCode = req.body.isDisplayCode;


    var articleData = {
        title,
        article_type_code:articleTypeCode,
        contents,
        view_count:0,
        is_display_code:isDisplayCode,
        ip_address:"111.111.111.111",
        edit_date:Date.now(),
        edit_member_id:1
    }

    const article = await Article.create(articleData);

    res.redirect('/article/list');
});


//게시글 삭제처리 라우팅 메소드 
router.get('/delete',async(req,res)=>{
    var articleId = req.query.aid;
    const result = await Article.deleteOne({article_id:articleId});
    res.redirect('/article/list');
})



//게시글 정보확인 및 수정페이지 호출 라우팅메소드
//localhost:3000/article/modify/1
router.get('/modify/:aid', async(req, res, next)=>{

    var articleId = req.params.aid;

    const articles = await Article.find({article_id:articleId});
    var article = {};

    if(articles.length > 0){
        article = articles[0];
    }

    res.render('article/modify',{article,moment});
});

//게시글 정보 수정처리 라우팅메소드 
router.post('/modify/:aid', async(req, res, next)=>{

    var articleId = req.params.aid;

    const title = req.body.title;
    const contents = req.body.contents;
    const articleTypeCode = req.body.articleTypeCode;
    const isDisplayCode = req.body.isDisplayCode;


    var articleData ={
        title,
        article_type_code:articleTypeCode,
        contents,
        is_display_code:isDisplayCode,
        edit_date:Date.now(),
        edit_member_id:1,

    }

    const result = await Article.updateOne({article_id:articleId},articleData);

    res.redirect("/article/list");
});



module.exports = router;