////////////자바스크립트 코드 실행의 특성//////////////////
//자바스크립트 코드 실행은 기본적으로 비동기방식으로 진행된다.

function fn1(){
    console.log("좋은");
    return "좋은";
};

var fn2 = function(){
    setTimeout(function(){
        console.log("아침")
        return "아침";
    }, 2000);
};

var fn3 =()=>{
    console.log("입니다.");
    return "입니다.";
};

//로직구현
// fn1();
// fn2();
// fn3();

/////////////////////자바스크립트 코드 실행 기본방식인 비동기 실행시 문제점인 순차적 프로그래밍(블록킹) 구현시
//콜백함수를 이용해 문제 개선 가능

// function fn4(){
//     console.log("fn4()실행");
//     return 4;
// };

// var fn5 = function(callback){
//     setTimeout(function(){
//         console.log("fn5()실행");
//         callback(fn7);
//         return 5;
//     }, 2000);

// };

// var fn6 =(callback)=>{
//     console.log("fn6()실행");
//     callback();
//     return 6;
// };

// var fn7 =()=>{
//     console.log("fn7()실행");
//     return 7;
// };


// fn4();
// fn5(fn6);



/////자바스크립트 코드의 비동기적 코드 실행시 순차적/비지니스 로직 구현을 위해서 사용되는 콜백함수는
//단점으로 콜백지옥 문제가 부수적으로발생한다.
//여러단계의 순차적 로직 실행시 콜백함수내에 콜백함수를 구현하고 콜백함수내 콜백을 구현해야...
//https://yeon-code.tistory.com/102


var fnHell = function(){
    console.log("로직1 완료.....");

    setTimeout(function(){
        console.log("로직2 완료.....");

        setTimeout(function(){
            console.log("로직3 완료.....");
    

            setTimeout(function(){
                console.log("로직4 완료.....");
            }, 1000);

        }, 1000);

    }, 1000);

};


fnHell();


//콜백지옥 경험하기
// step1(function (value1) {
//     step2(function (value2) {
//         step3(function (value3) {
//             step4(function (value4) {
//                 step5(function (value5) {
//                     step6(function (value6) {
//                         // Do something with value6
//                     });
//                 });
//             });
//         });
//     });
// });