let events = {
    object : ["modified", "moving", "scaling", "rotating", "skewing", "resizing", "added", "removed"],
    mouse: ["down", "up", "move", "over", "out", "wheel", "dblclick"]
}

function bindEvent (){
    //키보드 이벤트 (복사, 붙여넣기, 삭제, 되돌리기, 되돌리기 취소)
    $(document).on("keydown", onKeydownKeyup)
    $(document).on("keyup", onKeydownKeyup)

    events.object.forEach((evt) => {
        //무빙/
        if(evt === "moving"){ //object 무빙
            canvas.on("object:moving", objectMoving);
        }else if(evt === "modified") { //object 변화 후 (ex)mouseUp했을때 object최종변화된 evt)
            canvas.on("object:modified", objectModify);
        }else if(evt === "rotating") { //object 회전
            canvas.on("object:rotating", objectRotating);
        }else if (evt === "added"){
            canvas.on("object:added", objectAdd);
        }
        //필요한거 쓰기 (http://fabricjs.com/events)
    })

    //마우스이벤트
    events.mouse.forEach((evt) => {
        if(evt === "down") {
            canvas.on("mouse:down", onMouseDown);
        } else if(evt === "move"){
            canvas.on("mouse:move", onMouseMove);
        } else if(evt === "up") {
            canvas.on("mouse:up", onMouseUp);
        } else if(evt === "wheel"){
            canvas.on("mouse:wheel", onMouseWheel);
        } else if(evt === "out") {
            canvas.on("mouse:out", onMouseOut);
        } else if(evt === "over") {
            canvas.on("mouse:over", onMouseOver);
        } else if(evt === "dblclick") {
            canvas.on("mouse:dblclick", onDoubleClick)
        }

    });
/*    canvas.on({
        "selection:created": objectSelection,
/!*        "selection:updated": objectSelection*!/
    })*/



}
/* =================== 마우스 이벤트 START =================*/
//객체 여기서 불러와.
function onMouseDown(e) {

    if (e.target) {
        if (e.target.type === 'image') {
            $(".filter-box").show()
        } else if(e.target.type === 'group') {
            // for(var i=0; i<e.target._objects.length; i++){
            //     //그룹 안에 각각 오브젝트 찾아오기
            // }
        } else {
            //스타일 div 불러오기
            showStyleDiv(e.target);
            $(".filter-box").hide()
        }
    } else {
        $(".file-box").hide()
        $(".filter-box").hide()
    }

    canvas.getObjects().forEach(function (object){
        object.selectable = true;
        object.evented = true;
    });
}

function onMouseMove() {
    canvas.selection = true;
}

function onMouseUp(e) {
    $('.rotate-angle').hide();

    // 메인 editor -> 미리보기 그리기
    // previewDrawing();
    sendDrawingData();
}

function onMouseWheel(opt){
    const zoomBox = $('.zoom-ratio');
    const leftPosition = (document.getElementById('canvas').getBoundingClientRect().left)
    const topPosition = (document.getElementById('canvas').getBoundingClientRect().top)
    zoomBox.css('margin-left', leftPosition);
    zoomBox.css('margin-top', topPosition);
    if (isCtrlKey) {
        zoomBox.show();
        const delta = opt.e.deltaY;
        let zoom = canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20.11;
        if (zoom < 0.1) zoom = 0.1;
        canvas.setZoom(zoom);
        zoomBox.html((zoom * 100).toFixed(1) + "%");
        opt.e.preventDefault();
        opt.e.stopPropagation();
    }
}

function onMouseOut (){
}

function onMouseOver() {

}

function objectSelected(e) {

}

function onDoubleClick() {
    let type = canvas.getActiveObject().shapeType || ""
    switch (type) {
        case "image": eventFunction.activeImageCrop(canvas.getActiveObject()); break;
    }
}


/* =================== 마우스 이벤트 END =================*/

/* =================== 키보드 이벤트 START =================*/
function onKeydownKeyup(e) {


    //ctrl 눌렀을때
    if (e.which === 17) {
        isCtrlKey = e.type === 'keydown' ? true : false;

    }

    if (e.which === 67 && e.ctrlKey) {               //ctrl + c
        if (e.type === 'keydown') {
            saveObject();
            eventFunction.copy();
        }
    } else if (e.which === 86 && e.ctrlKey) {        //ctrl + v
        if (e.type === 'keydown') {
            saveObject();
            eventFunction.paste();
        }
    } else if (e.which === 90 && e.ctrlKey) {        //ctrl + z
        if (e.type === 'keydown'){
            if(undo.length){
                e.preventDefault();
                replay(undo, redo, '#redo', document.getElementById('undo'));
            } else {
                return false; //리턴문제?
            }
        }

    } else if (e.which === 88 && e.ctrlKey) {         //ctrl + x
        if (e.type === 'keydown'){
            if(redo.length){
                replay(redo, undo, '#undo', document.getElementById('redo'));
            } else {
                return false;//리턴문제?
            }
        }

    } else if (e.which === 46) {                     //delete
        if (e.type === 'keydown') {
            eventFunction.delete();
        }
    } else if (canvas.getActiveObject() && canvas.getActiveObject().shapeType === 'mask') {
        if (e.keyCode === 27 && e.type === 'keyup') {
            canvas.remove(canvas.getActiveObject())
            canvas.discardActiveObject()
        } else if (e.keyCode === 13 && e.type === 'keyup') {
            let image = canvas.getObjects().filter((item) => {
                return item.id === canvas.getActiveObject().parentImage
            })[0]
            doCrop(canvas.getActiveObject(), image)
        }
    }



}
/* =================== 키보드 이벤트 END =================*/

/* =================== OBJECT 이벤트 START =================*/
function objectMoving(targetObj){

    //오브젝트 캔버스 탈출 막는 로직 start
    var obj = targetObj.target;
    // if object is too big ignore
    if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
        return;
    }
    obj.setCoords();
    // top-left  corner
    if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
        obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
        obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
    }
    // bottom-right corner
    if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width){
        obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
        obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
    }
    //오브젝트 캔버스 탈출 막는 로직 end

    if (targetObj.target.type === 'image') {
        const offset = {
            left: document.getElementById('canvas').getBoundingClientRect().left + window.scrollX,
            top: document.getElementById('canvas').getBoundingClientRect().top + window.scrollY,
        }
        $("#playBtn").css("left", offset.left + obj.aCoords.tl.x + 10)
        $("#playBtn").css("top", offset.top + obj.aCoords.tl.y + 10)
    }

    switch (targetObj.target.shapeType) {
        // 말풍선
        case "bubble" : {
            let groupId = targetObj.target.groupId;
            let groupObj = canvas.getObjects().filter(obj => obj.groupId === groupId);

            let bubbleGroupObj = groupObj.filter(obj => obj.type === 'group')[0];
            let handle = groupObj.filter(obj => obj.type === 'ellipse')[0];
            let textBox = groupObj.filter(obj => obj.type === 'i-text')[0];
            let rect = bubbleGroupObj._objects.filter(obj => obj.type === 'rect')[0];
            let tail1 = bubbleGroupObj._objects.filter(obj => obj.type === 'polygon')[0];
            let tail2 = bubbleGroupObj._objects.filter(obj => obj.type === 'polygon')[1];

            let boxPadding = rect.width * 10 / 100;

            textBox.left = textBox.left - targetObj.target.left;
            textBox.setCoords();

            rect.left = (targetObj.target.left + rect.left) - targetObj.target.left;
            rect.top = (targetObj.target.top + rect.top) - targetObj.target.top;
            rect.setCoords();

            textBox.left = rect.left + targetObj.target.left + boxPadding / 2 + textBox.width / 2 + boxPadding / 2;
            textBox.top = rect.top + targetObj.target.top + boxPadding / 2 + textBox.height - boxPadding / 2;
            textBox.setCoords();

            tail1.left = (targetObj.target.left + tail1.left) - targetObj.target.left;
            tail1.top = (targetObj.target.top + tail1.top) - targetObj.target.top;
            tail1.setCoords();

            handle.left = tail1.left + targetObj.target.left + 0.5 + textBox.width / 2 + boxPadding / 2;
            handle.top = tail1.top + targetObj.target.top + tail1.height + 0.5 + textBox.height - boxPadding / 2;
            handle.setCoords();

            break;
        }

        // 말꼬리
        case "handle": {
            let groupId = targetObj.target.groupId;
            let groupObj = canvas.getObjects().filter(obj => obj.groupId === groupId);
            let bubbleGroupObj = groupObj.filter(obj => obj.type === "group")[0];
            let rect = bubbleGroupObj._objects.filter(obj => obj.type === "rect")[0];
            let textBox = canvas.getObjects().filter(obj => obj.type === "i-text")[0];

            let tail1 = bubbleGroupObj._objects.filter(obj => obj.type === 'polygon')[0];
            let tail2 = bubbleGroupObj._objects.filter(obj => obj.type === 'polygon')[1];

            let angleRadians = Math.atan2(targetObj.target.top - textBox.top, targetObj.target.left - textBox.left);
            let halfPi = Math.PI / 2;
            let offsetX = Math.cos(angleRadians + halfPi);
            let offsetY = Math.sin(angleRadians + halfPi);
            let arrowWidth = rect.width * 10 / 100;

            let boxPadding = rect.width * 10 / 100;

            let point = [
                {x: (targetObj.target.left), y: (targetObj.target.top)},
                {x: (textBox.left + (textBox.width/2 + boxPadding) + (offsetX * arrowWidth)), y: (textBox.top + (offsetY * arrowWidth)) + boxPadding},
                {x: (textBox.left + (textBox.width/2 + boxPadding) - (offsetX * arrowWidth)), y: (textBox.top - (offsetY * arrowWidth)) + boxPadding},
            ];

            tail1 = new fabric.Polygon(point, {
                fill: 'white',
                stroke: 'black',
                strokeWidth: 3,
                groupId: 'group-1',
                class:'group',
            });

            let point2 = [
                {x: (targetObj.target.left), y: (targetObj.target.top)},
                {x: textBox.left + (textBox.width/2 + boxPadding) - offsetX * (arrowWidth - 1.5), y: textBox.top - offsetY * (arrowWidth - 1.5) + boxPadding},
                {x: textBox.left + (textBox.width/2 + boxPadding) + offsetX * (arrowWidth - 1.5), y: textBox.top + offsetY * (arrowWidth - 1.5) + boxPadding},
            ];

            tail2 = new fabric.Polygon(point2, {
                fill: 'white',
                bubbleGroupId: '1',
                groupId: 'group-1',
                class:'group',
            });

            let textBoxPadding = (rect.width - textBox.width) / 2;

            rect.set({
                left: textBox.left - textBoxPadding,
                top: textBox.top - textBoxPadding,
            });

            rect.setCoords();

            let bubbleGroup = new fabric.Group([tail1, rect, tail2], {
                canvas: canvas,
                groupId: 'group-1',
                shapeType: 'bubble',
                class:'group',
            });

            canvas.remove(bubbleGroupObj);
            canvas.add(bubbleGroup);
            canvas.setActiveObject(bubbleGroup);

            canvas.sendToBack(bubbleGroup);
            canvas.renderAll();

            break;
        }

        // 말풍선 텍스트 박스
        case "bubbleTextBox": {
            let groupId = targetObj.target.groupId;
            let groupObj = canvas.getObjects().filter(obj => obj.groupId === groupId);

            let bubbleGroupObj = groupObj.filter(obj => obj.type === 'group')[0];
            let handle = groupObj.filter(obj => obj.type === 'ellipse')[0];
            let textBox = groupObj.filter(obj => obj.type === 'i-text')[0];

            let rect = bubbleGroupObj._objects.filter(obj => obj.type === 'rect')[0];
            let tail1 = bubbleGroupObj._objects.filter(obj => obj.type === 'polygon')[0];
            let tail2 = bubbleGroupObj._objects.filter(obj => obj.type === 'polygon')[1];

            let boxPadding = rect.width * 10 / 100;

            let angleRadians = Math.atan2(targetObj.target.top - textBox.top, targetObj.target.left - textBox.left);
            let halfPi = Math.PI / 2;
            let offsetX = Math.cos(angleRadians + halfPi);
            let offsetY = Math.sin(angleRadians + halfPi);
            let arrowWidth = rect.width * 10 / 100;

            let point = [
                {x: (handle.left), y: (handle.top)},
                {
                    x: (textBox.left + (textBox.width / 2 + boxPadding) + (offsetX * arrowWidth)),
                    y: (textBox.top + (offsetY * arrowWidth)) + boxPadding
                },
                {
                    x: (textBox.left + (textBox.width / 2 + boxPadding) - (offsetX * arrowWidth)),
                    y: (textBox.top - (offsetY * arrowWidth)) + boxPadding
                },
            ];

            tail1 = new fabric.Polygon(point, {
                fill: 'white',
                stroke: 'black',
                strokeWidth: 3,
                groupId: 'group-1',
                class:'group',
            });

            let point2 = [
                {x: (handle.left), y: (handle.top)},
                {
                    x: textBox.left + (textBox.width / 2 + boxPadding) - offsetX * (arrowWidth - 1.5),
                    y: textBox.top - offsetY * (arrowWidth - 1.5) + boxPadding
                },
                {
                    x: textBox.left + (textBox.width / 2 + boxPadding) + offsetX * (arrowWidth - 1.5),
                    y: textBox.top + offsetY * (arrowWidth - 1.5) + boxPadding
                },
            ];

            tail2 = new fabric.Polygon(point2, {
                fill: 'white',
                groupId: 'group-1',
                class:'group',
            });

            rect.set({
                left: textBox.left - boxPadding / 2,
                top: textBox.top - boxPadding / 2,
            });

            rect.setCoords();

            canvas.remove(bubbleGroupObj);

            let bubbleGroup = new fabric.Group([tail1, rect, tail2], {
                canvas: canvas,
                groupId: 'group-1',
                shapeType: 'bubble',
                class:'group',
            });

            canvas.add(bubbleGroup);

            canvas.sendToBack(bubbleGroup);

            // canvas.setActiveObject(bubbleGroup);

            canvas.renderAll();

            break;
        }

        // 비디오 재생버튼
        case "video" : {
            const offset = {
                left: document.getElementById('canvas').getBoundingClientRect().left + window.scrollX,
                top: document.getElementById('canvas').getBoundingClientRect().top + window.scrollY,
            }
            $("#playBtn").css("left", offset.left + targetObj.target.aCoords.tl.x + 10)
            $("#playBtn").css("top", offset.top + targetObj.target.aCoords.tl.y + 10)
        }
    }


}

function objectModify(e) {


}

function objectAdd(e){

}

function objectRotating(target) {
    let obj = target.target;
    obj.snapAngle = 1;
    let angle = obj.angle % 360;
    const angleBox = $('.rotate-angle');
    const offset = {
        left: document.getElementById('canvas').getBoundingClientRect().left + window.scrollX,
        top: document.getElementById('canvas').getBoundingClientRect().top + window.scrollY,
    }
    angleBox.css('left', parseInt(obj.oCoords.mtr.x + 25) + offset.left);
    angleBox.css('top', parseInt(obj.oCoords.mtr.y + 25) + offset.top);
    angleBox.html(angle + '°');
    angleBox.show();
}

/* =================== OBJECT 이벤트 END =================*/

/*
function resetBinding() {
    canvas.off("mouse:down");
    canvas.off("mouse:up");
    canvas.off("mouse:move");
    canvas.off("mouse:dblclick");
    canvas.off("object:modified");
    canvas.off("object:moving");
    canvas.off("object:scaling");
    canvas.off("object:rotating");
    canvas.off("object:skewing");
    canvas.off("object:resizing");
    canvas.off("object:added");
    canvas.off("object:removed");
    $(document).unbind('keyup');
    $(document).unbind('keydown');
    bindEvent();
}
*/
