
//require 예약어를 통해 설치된 moment와 dotenv 팩키지를 참조한다.
const moment = require('moment');
const env = require('dotenv');

//환경설정 파일의 정보를 불러오기 위해 구성을 초기화한다.
env.config();


console.log("현재 날짜시간정보를 출력합니다:",Date.now());

console.log("모멘트 팩키지를 이용한 날짜포맷 변경하기:",moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"));


console.log("파일업로드 기본 경로를 출력해보자.",process.env.UPLOAD_PATH);

console.log("환경설정 파일에 저장된 회사명을 출력해보자.",process.env.COMPANY_NAME);


//노드기반 로깅정보를 콘솔객체를 이용해 출력합니다.
console.log("인덱스 모듈이 호출되었습니다.");





