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
            console.log(sock);
            stomp = Stomp.over(sock);
            stomp.connect({} , onConnected, onError);
        }

        window.onConnected = function (test){
            console.log(test);
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
                    $('#waitingMessage').hide();

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


        window.handler = function (payload){
            console.log(payload);
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
                    $('#userRole').val(userInfo.userRole);

                    stomp.subscribe('/sub/game/' + roomCode);

                }
            })

        }

        window.home = function (){
            location.href = "/";
        }


    </script>
</head>
<body>


<button onclick="home()"> 홈 </button>
<div id="enterButton">
<button onclick="create()"> 게임 만들기 </button>
<button onclick="enterGame()"> 참여하기 </button>

</div>

<p id="waitingMessage" hidden> 참여자를 기다리고 있습니다.</p>

<div id="viewer"></div>

<div id="userInfo" hidden>
<input type="hidden" id="userRole">
<input type="hidden" id="userName">
<input type="hidden" id="roomCode">
<input type="text" id="answer" placeholder="답변을 입력해 주세요.">
<button>제출</button>
</div>


</body>
</html>