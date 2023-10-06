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

    <script>

    </script>

</head>
<body>
<h2>공유 받은 입장 코드와 닉네임을 입력해주세요.</h2>
<form id ="room">
    <input type="text" id="enterRoomCode" name="roomCode" placeholder="입장코드 입력">
    <input type="text" id="enterUserName" name="userName" placeholder="이름 입력">
    <input type="button" onclick="enter()" value="확인">
</form>

</body>
</html>