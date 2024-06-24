<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<html>
<head>
    <title>Title</title>
    <script src="../../../js/jquery/jquery.js"></script>
    <script src="../../../js/jquery/jquery-ui.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.1.4/sockjs.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js"></script>

    <script>
        let stomp;
        $(function (){

            connectSocket();

        });


        window.connectSocket = function (){
            const URL = "/stomp/game"

            const sock = new SockJS(URL);
            stomp = Stomp.over(sock);
            stomp.connect({} , onConnected, onError);
        }

        window.onConnected = function (test){
            console.log("connected!!!!!!!!!!!!!");

        };

        window.onError = function (error){
            console.log(error);
        }

        window.create = function (){

            $.ajax({
                type: "GET",
                url: '/createRoom',
                cache: false,
                dataType: 'html',
                success:function (data){
                    $('#viewer').html(data);

                },
                error: function (jqXHR, status, error){
                    alert('에러 발생');
                }
            });

        };

        window.enterGame = function (){


            $.ajax({
                type: "GET",
                url: '/enter',
                cache: false,
                dataType: 'html',
                success:function (data){
                    $('#viewer').html(data);

                },
                error: function (jqXHR, status, error){
                    alert('에러 발생');
                }
            });


        };

        // window.enter = function () {
        //     console.log("test");
        // }

        window.startGame = function () {

            console.log(studentCount);
            if(studentCount === 0){
                alert("참여자가 아무도 없습니다.")
                return;
            }

            $('#viewer').empty();

            const userRole = document.getElementById('userRole').value;
            console.log(userRole);


            $.ajax({
                type: "GET",
                url: '/drawing',
                cache: false,
                dataType: 'html',
                success:function (data){
                    $('#viewer').html(data);
                    $('#waiting').hide();
                    $('#answerView').show();

                    const roomCode = document.getElementById('roomCode').value;

                    const message = {
                        roomId: roomCode,
                        type: "drawing",
                    }

                    stomp.send('/pub/game', {}, JSON.stringify(message));


                },
                error: function (jqXHR, status, error){
                    alert('에러 발생');
                }
            });


        }

        window.enter = function (){
            const roomCode = document.getElementById('enterRoomCode').value;
            const userName = document.getElementById('enterUserName').value;

            $.ajax({
                type: 'POST',
                url: '/enter/' +roomCode+ '/' + userName,
                processData: false,
                contentType: false,
                success: function (res) {
                    console.log(res);

                    if(!res.user){
                        alert(res.error);
                        return false;
                    } else {
                        $('#roomCode').val(res.user.roomCode);
                        $('#userName').val(res.user.userName);
                        $('#userId').val(res.user.id);
                        $('#userRole').val(res.user.userRole);
                        $('#askingYn').val(res.user.askingYn);
                        $('#viewer').empty();
                        $('#waitingMessage').show();

                    }

                    stomp.subscribe('/sub/game/' + res.user.roomCode, handler);

                    const message = {
                        roomId: res.user.roomCode,
                        userName: res.user.userName,
                        type: "enter",
                    }

                    stomp.send('/pub/game', {}, JSON.stringify(message));


                }
            })
        }

        let studentCount = 0;
        window.handler = function (payload){

            const content = JSON.parse(payload.body);

            if(content.type === "enter"){
                enterHandler(content.userName);
            } else if(content.type === 'drawing'){
                drawingHandler();
            } else if(content.type === 'sendDrawingData'){
                sendDrawingDataHandler(content.data);
            } else if(content.type === 'submitAnswer'){
                checkSubmitAnswer(content);
            } else if(content.type === 'correctAnswer'){
                correctAnswer(content);
            } else if(content.type === 'moveNextQuestion'){
                moveNextQuestion();
            } else if(content.type === 'checkUserStatus'){
                checkNextQuestionStatus();
            }

        }

        window.moveNextQuestion = function (content){

            console.log(content);

        }

        window.correctAnswer = function (content){
            const correctUser = content.userName;
            alert(correctUser + "정답! 정답은 " + content.correctAnswer);
            $('#chatting').empty();
            const askingYn = document.getElementById('askingYn').value;
            console.log(askingYn);
        }

        window.checkSubmitAnswer= function (data){
            console.log(data);
            const roomId = document.getElementById('roomCode').value;
            const userRole = document.getElementById('userRole').value;
            const askingYn = document.getElementById('askingYn').value;
            console.log(askingYn);
            if(askingYn === "Y"){
                const correctAnswer = document.getElementById('correctAnswer')
                if(correctAnswer.innerText && correctAnswer.innerText === data.writeAnswer){
                  //정답이면 alert 보내고 5초 후에 끄고 다음 화면으로 넘어가는 로직
                    const params = {
                        roomId: roomId,
                        userId: data.userId,
                        correctAnswer : correctAnswer.innerText,
                        type: "correctAnswer",
                    }
                    console.log(params);
                    sendCorrectAnswer(params)

                } else {
                    const chatSpace = document.getElementById('chatting');
                    let html = '';
                    html += '<p>'+ data.userName +' : '+ data.writeAnswer+'</p>';
                    chatSpace.innerHTML = chatSpace.innerHTML + html;
                }
            }

        }

        window.sendCorrectAnswer = function (params){
            $.ajax({
                type: "POST",
                url: '/submitAnswer',
                cache: false,
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(params),
                success:function (data){
                    console.log(data);
                    if(data.success === true){
                        const message = {
                            roomId: roomCode,
                            type: "checkUserStatus",
                        }
                        stomp.send('/pub/game', {}, JSON.stringify(message));
                    }
                },
            });
        }

        window.checkNextQuestionStatus = async function () {

            const message = {
                roomId: roomCode,
                type: "correctAnswer",
            }
            stomp.send('/pub/game', {}, JSON.stringify(message));

            const userId = document.getElementById('userId').value;
            const response = await fetch("/restful/api/user/" + userId, {
                method: "GET",
                header : {
                    "Content-Type" : "application/json",
                },
            })
            console.log(response);

        }


        window.sendDrawingDataHandler = function (data){
            const viewCanvas = document.getElementById('viewCanvas');

            let activePreview = new fabric.Canvas(viewCanvas, {
                interactive: false,
            });
            activePreview.loadFromJSON(data, activePreview.renderAll.bind(activePreview));
        }

        window.drawingHandler = function (){
            const userRole = document.getElementById('userRole').value;
            const askingYn = document.getElementById('askingYn').value;
            console.log(userRole);
            console.log(askingYn);


            if(askingYn === "N"){
                $.ajax({
                    type: "GET",
                    url: '/drawingView',
                    cache: false,
                    dataType: 'html',
                    success:function (data){
                        $('#viewer').html(data);
                        $('#waiting').hide();
                        $('#enterButton').hide();
                        $('#userInfo').show();


                        const roomCode = document.getElementById('roomCode').value;

                        const message = {
                            roomId: roomCode,
                            type: "drawingView",
                        }

                        stomp.send('/pub/game', {}, JSON.stringify(message));

                        $.ajax({
                            type: "GET",
                            url: '/answering',
                            cache: false,
                            dataType: 'html',
                            success:function (data){
                                $('#answering').html(data);
                            },
                            error: function (jqXHR, status, error){
                                alert('에러 발생');
                            }
                        });


                    },
                    error: function (jqXHR, status, error){
                        alert('에러 발생');
                    }
                });
            } else {
                console.log("문제 푸는 사람!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            }


        }

        window.enterHandler = function (userName){

            studentCount ++;
            $('#studentCount').html(studentCount+ "명");
            $('#waitingList').append(userName + "이 입장했습니다.");

        }

        let roomCode;

        window.createRoom = function () {
            const userName = document.getElementById('userName').value;

            $.ajax({
                type: 'POST',
                url: '/createRoom/' + userName,
                processData: false,
                contentType: false,
                success: function (res) {
                    console.log(res);

                    const roomInfo = res.room;
                    const userInfo = res.user;
                    $('#ownerId').val(roomInfo.roomOwnerId);
                    $('#createRoomInfo').hide();
                    $('#startGame').show();
                    roomCode = roomInfo.roomCode;
                    $('#enterButton').hide();
                    $('#createdRoomCode').html(roomCode + '를 학생들에게 공유해 주세요.');
                    $('#waitingMessage').show();

                    $('#roomCode').val(userInfo.roomCode);
                    $('#userName').val(userInfo.userName);
                    $('#userId').val(userInfo.id);
                    $('#userRole').val(userInfo.userRole);
                    $('#askingYn').val(userInfo.askingYn);

                    stomp.subscribe('/sub/game/' + roomCode, handler);

                }
            })

        }

        window.home = function (){
            location.href = "/";
        }

        window.submitAnswer = function (){
            const userId = document.getElementById('userId').value;
            const roomCode = document.getElementById('roomCode').value;
            let writeAnswer = document.getElementById('writeAnswer').value;

            const message = {
                "userId" : userId,
                "roomId" : roomCode,
                "writeAnswer" : writeAnswer,
                "type": "submitAnswer"
            }

            stomp.send('/pub/game', {}, JSON.stringify(message));

            writeAnswer = "";

            // console.log(writeAnswer);
            // console.log(correctAnswer);
            //
            // // var data =  {"writeAnswer" : writeAnswer.value ,  "roomCode": roomCode}
            //
            // $.ajax({
            //             type:"POST",
            //             url: '/submitAnswer',
            //             cache:false,
            //             contentType: "application/json",
            //             data: data,
            //             success:function (data){
            //
            //
            //             },
            //             error: function (jqXHR, status, error){
            //             }
            //         });

        }

        // 캔버스에 답변 그리고 ocr 변환해서 답변 입력 할경우
        // window.submitAnswer = function (){
        //     const roomCode = document.getElementById('roomCode').value;
        //     const writeAnswer = document.getElementById('writeAnswer');
        //     const changeToImage = writeAnswer.toDataURL();
        //
        //
        //     var data =  {"imageUrl" : changeToImage ,  "roomCode": roomCode}
        //
        //     $.ajax({
        //         type:"POST",
        //         url: '/ocrProgress',
        //         cache:false,
        //         contentType: "application/json",
        //         data: JSON.stringify(data),
        //         success:function (data){
        //
        //             const answer = "사람";
        //
        //             const correctAnswer = $('#answer').html();
        //             if(correctAnswer === answer){
        //                 alert("정답");
        //             }
        //
        //         },
        //         error: function (jqXHR, status, error){
        //         }
        //     });
        // }



    </script>
</head>
<body>


<button onclick="home()"> 홈 </button>

<div id="enterButton">
<button onclick="create()"> 게임 만들기 </button>
<button onclick="enterGame()"> 참여하기 </button>
</div>



<div id="viewer"></div>

<div id="waiting">
<p id="waitingMessage" hidden> 참여자를 기다리고 있습니다.</p>
    <div id="waitingList">

    </div>
</div>


<div id="userInfo" hidden>
<input type="hidden" id="userRole">
<input type="hidden" id="userOrder">
<input type="hidden" id="userName">
<input type="hidden" id="askingYn">
<input type="hidden" id="roomCode">
<input type="hidden" id="userId">

</div>


<div id="answering"></div>


<div id="chatting"></div>

</body>
</html>