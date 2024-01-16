

//url에서특정 파라메터 와일드카드키를 추출해보고 체크하는 공용 미들웨어함수
exports.checkParams = (req,res,next)=>{

    if(req.params.cid == undefined){
        console.log("id파라메터가 전달되지 않았습니다.");
    }else{
        console.log("전달된 cid값:",req.params.cid);
    }

    next();
};


//url에서 category키가 전달되는지 여부체크 하는 미들웨어 공용함수
exports.checkQueryKey = (req,res,next)=>{
    if(req.query.category == undefined){
        console.log("category키가 전달되지 않았습니다.");
    }
};








