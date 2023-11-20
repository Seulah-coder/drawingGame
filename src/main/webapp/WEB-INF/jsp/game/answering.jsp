<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<html>
<head>
    <title>Title</title>

    <script>
        //ocr 로 변환해서 정답 입력할 경우
        // var answerCanvas;
        //
        // $(function (){
        //     answerCanvas = new fabric.Canvas("writeAnswer");
        //     answerCanvas.isDrawingMode = true;
        // })
    </script>
</head>
<body>

<h2>답변을 입력해 주세요.</h2>

<%--<canvas id="writeAnswer" width="450" height="450"></canvas>--%>
<input type="text" id="writeAnswer">
<button onclick="submitAnswer()">제출</button>


</body>
</html>