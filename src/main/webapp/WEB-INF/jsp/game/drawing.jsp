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
    <script src="/js/fabric/fabricDraw.js"></script>
    <script type="text/javascript" src="/js/fabric/fabric.js"></script>
    <script src="/js/fabric/svgPath.js"></script>
    <script src="/js/fabric/snappy.js"></script>
    <script src="/js/fabric/fabricFunction.js"></script>
    <script src="/js/fabric/fabricMovement.js"></script>

    <script>
        let canvas;
        let isDrawing;

        $(function () {
           canvas = new fabric.Canvas("canvas");

            let slideTargetShape = document.querySelectorAll(".slide-func");
            slideTargetShape.forEach((target) => target.addEventListener("click", searchShape));
        });

    </script>
</head>
<body>

<div>
    <button data-shape="selection" type="button" class="btn-tool btn-tool-a slide-func selection"
            style="background-color: mediumpurple">
        선택
    </button>
    <!-- ------------------도형만들기 START------------------------- -->
    <button data-shape="circle" type="button" class="btn-tool btn-tool-a slide-func circle">
        원
    </button>

    <button data-shape="rect" type="button" class="btn-tool btn-tool-a slide-func square">
        사각형
    </button>

    <button data-shape="diamond" type="button" class="btn-tool btn-tool-a slide-func diamond">
        마름모
    </button>

    <button data-shape="parallelogram" type="button" class="btn-tool btn-tool-a slide-func parallelogram">
        평행사변형
    </button>

    <button data-shape="triangle" type="button" class="btn-tool btn-tool-a slide-func triangle">
        삼각형
    </button>

    <button data-shape="rightTriangle" type="button" class="btn-tool btn-tool-a slide-func rightTriangle">
        직삼각형
    </button>

    <button data-shape="lines" type="button" class="btn-tool btn-tool-a slide-func lines">
        선
    </button>

    <button data-shape="arrowLine" type="button" class="btn-tool btn-tool-a slide-func arrowLine">
        화살표선
    </button>

    <button data-shape="bothArrowLine" type="button" class="btn-tool btn-tool-a slide-func bothArrowLine">
        양쪽 화살표선
    </button>

    <button data-shape="iText" type="button" class="btn-tool btn-tool-a slide-func iText">
        텍스트
    </button>

    <button data-shape="pentagon" type="button" class="btn-tool btn-tool-a slide-func pentagon">
        오각형
    </button>

    <button data-shape="hexagon" type="button" class="btn-tool btn-tool-a slide-func hexagon">
        육각형
    </button>

    <button data-shape="freeDrawing" type="button" class="btn-tool btn-tool-a slide-func freeDrawing">
        펜
    </button>

    <button data-shape="trapezoid" type="button" class="btn-tool btn-tool-a slide-func trapezoid">
        사다리꼴
    </button>

    <button data-shape="cross" type="button" class="btn-tool btn-tool-a slide-func cross">
        십자형
    </button>

    <button data-shape="octagon" type="button" class="btn-tool btn-tool-a slide-func octagon">
        팔각형
    </button>

    <button data-shape="star" id="basicStar" type="button" class="btn-tool btn-tool-a slide-func basicStar">
        오각별
    </button>

    <button data-shape="star" id="specialStar" type="button" class="btn-tool btn-tool-a slide-func specialStar">
        십각별
    </button>

    <button data-shape="squareBubble" type="button" class="btn-tool btn-tool-a slide-func squareBubble">
        사각 말풍선
    </button>
</div>

<div class="slide-area">
    <canvas id="canvas" width="640" height="885">
    </canvas>

</div>


</body>
</html>