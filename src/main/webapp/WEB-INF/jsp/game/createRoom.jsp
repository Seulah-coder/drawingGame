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

        window.createRoom = function () {
            const userName = document.getElementById('userName').value;

            $.ajax({
                type: 'POST',
                url: '/createRoom/' + userName,
                processData: false,
                contentType: false,
                success: function (res) {
                    console.log(res);

                }
            })

        }
    </script>
</head>
<body>

<h2>방장 이름을 입력해 주세요.</h2>
    <input type="text" id="userName" name="userName" placeholder="이름 입력">
    <input type="button" onclick="createRoom()" value="게임 만들기">
</body>
</html>