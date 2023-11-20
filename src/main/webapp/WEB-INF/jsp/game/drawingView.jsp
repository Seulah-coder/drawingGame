<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<html>
<head>
    <title>Title</title>
    <script src="../../../js/jquery/jquery.js"></script>

    <script type="javascript" src="https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js@3.0/dist/svg.min.js"></script>
    <script src="/js/html2canvas/html2canvas.js"></script>

    <script src="../../../js/jquery/jquery-ui.js"></script>
    <script type="text/javascript" src="/js/fabric/fabric.js"></script>
    <script src="/js/fabric/svgPath.js"></script>
    <script src="/js/fabric/snappy.js"></script>
    <script>
        const userInfo = document.getElementById('userRole');
        console.log(userInfo.value);

    </script>
</head>
<body>

<canvas id="viewCanvas" width="640" height="500" aria-disabled="true" style="border: 5px solid black;"></canvas>

</body>
</html>