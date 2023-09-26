<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<html>
<head>
    <title>Title</title>
    <script>
        function enter() {
            const roomId = $('#code').val();
            if (roomId === "") {
                alert("입장코드를 입력해 주세요.")
                return false;
            }
            location.href = "enter/" + roomId

        }
    </script>
</head>
<body>
<h2>공유 받은 입장 코드를 입력해주세요.</h2>
<input type="text" id="roomCode" name="roomCode" placeholder="입장코드 입력">
<input type="text" id="userName" name="userName" placeholder="이름 입력">
<input type="button" onclick="enter()" value="확인">

</body>
</html>