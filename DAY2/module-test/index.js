
const {odd,even} = require('./base1.js');
const checkOddOrEven = require('./base2');


function checkStringOddOrEven(str){
    if(str.length % 2){
        return odd;//홀수입니다.
    }else{
        return even; //짝수입니다.
    }
}

console.log('숫자에 대해 홀수짝수를 분석해보자.',checkOddOrEven(5));

console.log('문자열값을 전달해 문자열길이를 홀짝 분석해보자.',checkStringOddOrEven('thisistest'));



