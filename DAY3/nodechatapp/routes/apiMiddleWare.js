    const jwt = require('jsonwebtoken');
   
    exports.tokenAuthChecking = (req, res, next) => {

        //발급된 토큰정보가 존재하지 않은경우 
        if(req.headers.authorization == undefined){
            var apiResult = {
                code:"400",
                result:"사용자 인증토큰이 제공되지 않았습니다.",
                data:{}
            };

            return res.json(apiResult);
        }


        //토큰에서 사용자정보 추출하기
        try{
            const token =  req.headers.authorization.split('Bearer ')[1];
            //토큰의 유효성 검증 후 토큰내 JSON데이터를 추출합니다.
            var currentUser = jwt.verify(token,process.env.JWT_SECRET);

            //정상적인 사용자 데이터가 존재하는경우 다음 프로세스로이동처리(원래 호출하려던 라우팅메소드의 콜백함수를 실행)
            if(currentUser != null){
                next();
            }
        }catch(err){

                var apiResult = {
                    code:"400",
                    result:"유효하지 않은 사용자 인증토큰입니다.",
                    data:{}
                };
                return res.json(apiResult);
        }

    };
