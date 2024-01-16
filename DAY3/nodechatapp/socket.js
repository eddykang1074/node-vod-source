//socket.io 패키지 참조 
const SocketIO = require("socket.io");

//socket.io-redis 참조
var redis = require("socket.io-redis");




//socket.js 모듈 기능 정의 
module.exports =(server)=>{

    // const io = SocketIO(server,{path:"/socket.io"});

    //socket.js socket.io CORS 통신설정 예시 – socket cors 이슈 발생 시 사용
    const io = SocketIO(server, {
        path: "/socket.io",
        cors: {
        origin: "*",
        methods: ["GET", "POST"],
        },
    });

    //Redis Backplaine 연결 설정
    io.adapter(
        redis({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            //password:"123456"
        })
    );


    io.on("connection",(socket)=>{


        //클라이언트에서 호출하는 broadcast 이벤트 수신기 정의
        socket.on("broadcast",function(nickName,msg){

            //io.emit('클라이언트이벤트수신기명',클라이언트에 전송할 데이터)메소드는 현재 서버소켓과 연결된 모든 클라이언트(웹브라우저) 사용자에게 메시지를 전송합니다.
            //클라이언트에 정의된 receiveAll 이벤트 수신기로 메시지를 전송합니다.
            io.emit("receiveAll",nickName,msg);
   
        });


        socket.on("broadcast2",function(msg){
            io.emit("receiveAll",msg);
            //socket.broadcast.emit("receive",msg);
        });


        
        //특정 채팅방 입장처리 후 입장사실을 클라이언트에게 메시지 알림처리
        socket.on("entry",function(roomId,nickName){
            
            //채팅방 사용자 입장 처리하기 
            //socket.join('채팅방아이디'); 채팅방 입장처리
            //현재 채팅방 접속자의 고유커넥션아이디를 해당 채팅방에 접속자로 등록처리해줍니다.
            socket.join(roomId.toString());


            //현재 접속한(입장한) 사용자에게만 메시지를 전송한다.
            socket.emit("entryok",`${nickName} 님으로 채팅방에 입장했습니다.`);


            //현재 접속자를 제외한 같은 채팅방 내 모든 사용자에게 메시지 발송
            //socket.to('현재접속한채팅방아이디').emit()//해당 채팅방에 기접속자들에게 나를 제외하고 메시지를 발송함.
            socket.to(roomId).emit("entryok",`${nickName}님이 채팅방에 입장했습니다`);
 
        });


        //그룹 메시징 수신 및 발송 전용 이벤트 수신기 정의 
        //그룹채팅시 해당 채팅방에 입장한 사용자가 메시지를 보내오면
        //현재 해당 채팅방에 입장한 본인을 포함한 모든 사용자 클라이언트에게 메시지를 전송합니다.
        socket.on("groupmsg",function(roomId,nickName,msg){

            //지정한 채팅방아이디 기준 그룹 채팅방 사용자에게만 메시지를 발송한다.
            //서버에 연결된 모든 사용자가 아닌 지정 채팅방에 입장한 나를 포함한 모든 사용자에게 
            //메시지를 보낼 때는 io.to('채팅방아이디값').emit("클라이언트이벤트수긴기",보내려는 데이터)
            io.to(roomId).emit("receiveGroupMsg",nickName,msg);
        });





    });
}
