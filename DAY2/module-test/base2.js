

const {odd,even,test} = require('./base1.js');


//숫자를 전달받아 홀수/짝수 여부를 문자열로 반환받는 함수
function checkOddOrEven(num){
    if(num%2){
        // 5/2=나머지가 1이 반환되고 1은 true의미하기 때문에 odd라는 문자열이 반환됩니다.
        return odd;
    }
    //상단에 if구문조건에 해당되지 않으면 아래 even 짝수입니다. 문자열이 반환됩니다.
    return even;
}


module.exports = checkOddOrEven;