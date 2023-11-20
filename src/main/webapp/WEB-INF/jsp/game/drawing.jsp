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

        // 메인 editor -> 미리보기
        // function previewDrawing() {
        //     let jsonData = JSON.stringify(canvas.toDatalessJSON());
        //     let activePreviewId = document.querySelector('.pagination-box .pagination-area.active').querySelector('canvas').getAttribute("id");
        //     const previewWidth = document.querySelector('.pagination-area').clientWidth;
        //     const mag = (previewWidth / canvas.width);
        //
        //     let activePreview = new fabric.Canvas(activePreviewId);
        //
        //     activePreview.clear();
        //     activePreview.setZoom(mag);
        //
        //     if (jsonData) {
        //         activePreview.loadFromJSON(jsonData, activePreview.renderAll.bind(activePreview));
        //         activePreview._objects.forEach(obj => {
        //             obj.selectable= false;
        //         });
        //     }
        // }

        function sendDrawingData(){
            let jsonData = JSON.stringify(canvas.toDatalessJSON());
            const roomCode = document.getElementById('roomCode').value;

            const message = {
                roomId: roomCode,
                type: "sendDrawingData",
                data: jsonData
            }

            stomp.send('/pub/game', {}, JSON.stringify(message));


        }

        function searchShape() {
            canvas.isDrawingMode = false;
            /*        canvas.discardActiveObject().renderAll();*/
            let slideClassList = document.querySelectorAll(".slide-func");
            slideClassList.forEach((element) => {
                element.classList.remove("active")
            })
            this.classList.add("active");
            let shape = this.dataset.shape;

            canvas.getObjects().forEach(function (object) {
                object.selectable = false;
                object.evented = false;
            });

            switch (shape) {
                //그리기 관련
                case "rect" :
                    draw.createRect();
                    break;
                case "diamond" :
                    draw.createDiamond();
                    break;
                case "circle" :
                    draw.createCircle();
                    break;
                case "triangle" :
                    draw.createTriangle();
                    break;
                case "iText" :
                    draw.createItext();
                    break;
                case "lines" :
                    draw.createLines();
                    break;
                case "arrowLine" :
                    draw.createArrowLine();
                    break;
                case "bothArrowLine" :
                    draw.createBothArrowLine();
                    break;
                case "rightTriangle" :
                    draw.createRightTriangle();
                    break;
                case "parallelogram" :
                    draw.createParallelogram();
                    break;
                case "pentagon" :
                    draw.createPentagon();
                    break;
                case "hexagon" :
                    draw.createHexagon();
                    break;
                case "freeDrawing" :
                    draw.freeDrawing();
                    break;
                case "table" :
                    draw.createTable();
                    break;
                case "trapezoid" :
                    draw.createTrapezoid();
                    break;
                case "cross" :
                    draw.createCross();
                    break;
                case "octagon" :
                    draw.createOctagon();
                    break;
                case "star" :
                    let starId = this.getAttribute("id");
                    draw.createStar(starId);
                    break;
                case "squareBubble" :
                    draw.createSquareBubble();
                    break;

                case "mathExpression" :
                    draw.mathExpression();
                    break;

                //기능 관련 차후에 따로 뺼꺼임
                case "itemGrouping" :
                    eventFunction.itemGrouping()
                    break
                case "itemUnGrouping" :
                    eventFunction.itemUnGrouping()
                    break;
                case "pdfDownload":
                    eventFunction.pdfDownload();

                case "appendFile": $(".file-box").show()
                    break;
                //정렬 관련
                case "sort" :
                    eventFunction.shapeSort(this.getAttribute("id"));
                    break;
                case "svg" :
                    eventFunction.loadSvg(this.getAttribute("id"));
                    break;
                case "preview" :
                    eventFunction.popupPreview();
                    break;
                case "bring" :
                    eventFunction.bring(this.getAttribute("id"));
                    break;
                case "convertSvg" :
                    eventFunction.convertSvg();
                    break;
                case "convertJson":
                    eventFunction.convertJson();
                    break;
                case "convertObject":
                    eventFunction.convertObject();
                    break;
                case "leftRightToggle" :
                    eventFunction.leftRightToggle();
                    break;
                case "topBottomToggle" :
                    eventFunction.topBottomToggle();
                    break;
                case "cone" : draw.createCone();
                    break;
                case "pyramid" : draw.createPyramid();
                    break;
                case "cylinder" : draw.createCylinder();
                    break;

            }
            //TODO 캔버스 도형 전부 load 시키기
            state = JSON.stringify(canvas.toDatalessJSON(['shapeType', 'class', 'customContents']));
            saveObject();

        }

    </script>
</head>
<body>

<div class="left slide-wrap">
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

<div id="answerView" hidden>
    <h2> 정답 : <span id="answer">${question.question}</span></h2>
</div>

<div class="slide-area" style="border-width: 5px; border-color: black" >
    <canvas id="canvas" width="640" height="500">
    </canvas>

</div>


</body>
</html>