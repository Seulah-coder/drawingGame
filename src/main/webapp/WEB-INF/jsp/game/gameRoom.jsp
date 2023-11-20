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

            $('#viewer').empty();

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

                    if(!res.user){
                        alert(res.error);
                        return false;
                    } else {
                        $('#roomCode').val(res.user.roomCode);
                        $('#userName').val(res.user.userName);
                        $('#userRole').val(res.user.userRole);
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
            }

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


            if(parseInt(userRole) === 1){
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
            }


        }

        window.enterHandler = function (userName){


            const userRole = document.getElementById('userRole').value;

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
                    $('#userRole').val(userInfo.userRole);

                    stomp.subscribe('/sub/game/' + roomCode, handler);

                }
            })

        }

        window.home = function (){
            location.href = "/";
        }

        window.submitAnswer = function (){
            const roomCode = document.getElementById('roomCode').value;
            const writeAnswer = document.getElementById('writeAnswer');
            var data =  {"writeAnswer" : writeAnswer.value ,  "roomCode": roomCode}

            console.log(data);

            $.ajax({
                        type:"POST",
                        url: '/submitAnswer',
                        cache:false,
                        contentType: "application/json",
                        data: data,
                        success:function (data){


                        },
                        error: function (jqXHR, status, error){
                        }
                    });

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
<input type="hidden" id="roomCode">

</div>

<div id="answering"></div>


</body>
</html>