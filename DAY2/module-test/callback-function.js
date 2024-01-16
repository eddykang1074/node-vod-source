

//1.콜백함수(=파라메터로 전달받은 함수) 존재/사용목적

////////////////////일반함수내에서 다른 함수 사용하기 ////////////////////////////
//계산함수
function fnPlus(a,b){
    let c = a+b;
    logging(c);
    return c; 
};


//터미널 로깅 전용처리 함수 
function logging(result){
    console.log(`계산 결과값은 ${result}입니다.`);
}

//계산함수 호출하기 
//var result = fnPlus(10,20);
//console.log("함수반환값:",result);


///////////////////////////////////콜백함수로 구현하기//////////////////////////////////
//자바스크립트 함수는 객체이다.
//함수도 다른 함수의 매개변수로 전달가능하다.
//매개변수로 전달된 함수는 해당 함수내에서 사용이 가능하다.
//함수를 매개변수로 전달하면 언제든지 함수를 변경할수-(인터페이스방식) 있다.(추상화개념:객체의 공통적인 속성과 기능을 추출하여 정의하는것)
//함수내에서 특정함수를 직접 호출하면 함수를 바꿔야하면 함수내에서 직접적으로 다른 함수명으로 직접변경해야한다.
//콜백함수를 이용하면 좀더 유연하게 함수의 기능구현이 가능하고 코드 가변성 및 기능 확장성을 제공한다.
//추상화: 추상클래스(abstract 자식클래스를 통해 상속을 통해 기능구현),인터페이스(interface):객체의 기능과속성등 구조만 정의하고 실제 코드는 구현하지 않는것..
//OOP:추상화, 상속, 다형성, 캡슐화

//책추천: 모던자바스크립트-기본문법서-자바스크립트
//https://www.yes24.com/Product/Goods/92742567
//https://www.yes24.com/Product/Goods/120193259

//계산함수 호출하기 
function fnPlus1(a,b,callBack){
    let c = a+b;
    callBack(c);
    return c; 
}

function logging2(result){
    console.log(`계산 결과값2은 ${result}입니다.`);
}


//계산함수 호출하기 
var result1 = fnPlus1(20,30,logging);
var result2 = fnPlus1(20,30,logging2);
console.log("함수반환값2:",result1,result2);




















