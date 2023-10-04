let _clipboard;

let eventFunction = {
    //그룹화하기
    itemGrouping : () => {
        if(!canvas.getActiveObject()) { //아무것도 선택안됐을떄
            return;
        }
        if(canvas.getActiveObject().type !== 'activeSelection') {
            return;
        }

        canvas.getActiveObject().toGroup();
        canvas.requestRenderAll();

    },
    //그룹화 풀기
    itemUnGrouping: () => {
        if (!canvas.getActiveObject()) {
            return;
        }
        if (canvas.getActiveObject().type !== 'group') {
            return;
        }
        canvas.getActiveObject().toActiveSelection();
        canvas.requestRenderAll();
    },

    // PDF 다운로드
    pdfDownload: () => {
        if (canvas.getActiveObject()) {
            canvas.discardActiveObject()
            canvas.renderAll()
        }
        let pdf = new jsPDF('p', 'px', 'a4')
        let pdfWidth = pdf.internal.pageSize.width
        let pdfHeight = pdf.internal.pageSize.height
        document.querySelectorAll('.lower-canvas').forEach((page, idx) => {
            let marginX = (page.width - pdfWidth) / 4
            let marginY = (page.height - pdfHeight) / 4
            let imgData = page.toDataURL('image/png')
            pdf.addImage(imgData, 'PNG', marginX, marginY)
            if (idx !== $('.lower-canvas').length - 1) {
                pdf.addPage();
            }
        })
        pdf.save('pdf-test.pdf')
    },

    // 미리보기
    popupPreview: () => {
        let url = '/makers/preview'
        let name = '_blank'
        let param = {
            page: 1,
            jsonData: encodeURIComponent(JSON.stringify(canvas.toJSON()))
        }

        window.open(url+JSUtil.paramToQueryString(param), name, 'width='+canvas.width+", height="+canvas.height+", left=100, top=50")
    },


    //객체 복사
    copy: () => {
        if(!canvas.getActiveObject()) { //아무것도 선택안됐을떄
            return;
        }
        let selectedObject = canvas.getActiveObject();
        if (selectedObject) {
            selectedObject.clone((cloned) => {
                _clipboard = cloned;
            })
        } else {
            alert("선택한 요소가 없습니다.");
        }

    },

    //객체 붙여넣기
    paste: () => {
        if(!canvas.getActiveObject()) { //아무것도 선택안됐을떄
            return;
        }
        _clipboard.clone((clonedObj) => {
            canvas.discardActiveObject();
            clonedObj.set({
                left: clonedObj.left + 10,
                top: clonedObj.top + 10,
                evented: true,
            });
            if (clonedObj.type === 'activeSelection') {
                clonedObj.canvas = canvas;
                clonedObj.forEachObject((obj) => {
                    canvas.add(obj);
                });
                clonedObj.setCoords();
            } else {
                canvas.add(clonedObj);
            }
            _clipboard.top += 10;
            _clipboard.left += 10;
            canvas.setActiveObject(clonedObj);
            canvas.requestRenderAll();
        });

    },
    //객체삭제
    delete: () => {
        if(!canvas.getActiveObject()) { //아무것도 선택안됐을떄
            return;
        }
        let selecteds = canvas.getActiveObjects();
        if (selecteds.length > 0) {
            for (let i = 0; i < selecteds.length; i++) {
                canvas.remove(selecteds[i]);
            }

            /*         $("#delete").removeClass("selected");*/
        } else {
            alert("삭제할 항목을 선택해 주세요");
        }

    },

    //정렬
    shapeSort: (direction) => {
        if(!canvas.getActiveObject()) { //아무것도 선택안됐을떄
            return;
        }
        let selectedObject = canvas.getActiveObject();

        process_align(direction, selectedObject);

        selectedObject.setCoords();
        canvas.renderAll();
    },

    // SVG
    loadSvg: (type) => {

        fabric.loadSVGFromString(getSvgPath(type), function(obj, options) {
            let loadedObject = fabric.util.groupSVGElements(obj, options);
            loadedObject.set('left', '500');
            loadedObject.set('top', '500');
            loadedObject.set('fill', 'blue');
            loadedObject.set('backgroundColor', 'blue');
            loadedObject.set('stroke', 'black');
            loadedObject.set('strokeWidth', 1);
            loadedObject.set('shapeType', 'svg');
            loadedObject.set('class', 'svg');
            loadedObject.setCoords();
            canvas.add(loadedObject);
            loadedObject.scale(0.3).center().setCoords();
            canvas.renderAll();
        });
    },

    bring: (bringStatus) => {
        if(!canvas.getActiveObject()) { //아무것도 선택안됐을떄
            return;
        }
        let selectedObject = canvas.getActiveObject();
        if(bringStatus === "frontend"){
            selectedObject.bringToFront();
        }else if(bringStatus === "forward") {
            selectedObject.bringForward();
        } else if(bringStatus === "backward") {
            selectedObject.sendBackwards();
        }else {
            selectedObject.sendToBack();
        }

        canvas.renderAll();

    },

    convertSvg: () => {
        if(canvas.getActiveObject() == null) {
            alert(canvas.toSVG())
            console.log(canvas.toSVG())
        }else {
            alert(canvas.getActiveObject().toSVG())
            console.log(canvas.getActiveObject().toSVG())
        }

    },

    convertJson: () => {
        if(canvas.getActiveObject() == null) {
            alert(canvas.toDatalessJSON());
            console.log(canvas.toDatalessJSON())
            let jsonData = JSON.stringify(canvas.toDatalessJSON(['customContents', 'customType', 'customId']));
            console.log(jsonData);
        }else {
            alert(canvas.getActiveObject().toJSON())
            console.log(canvas.getActiveObject().toJSON())
            let jsonData = JSON.stringify(canvas.toDatalessJSON(['customContents', 'customType', 'customId']));
            console.log(jsonData);
        }


    },

    convertObject: () => {
        if(canvas.getActiveObject() == null) {
            alert(canvas.toDatalessObject())
            console.log(canvas.toDatalessObject());
        }else {
            alert(canvas.getActiveObject().toDatalessObject());
            console.log(canvas.getActiveObject().toDatalessObject())
        }

    },

    leftRightToggle: () => {
        if (canvas.getActiveObject() == null) {
            return;
        }
        canvas.getActiveObject().toggle("flipX")
        canvas.renderAll();
    },

    topBottomToggle: () => {
        if (canvas.getActiveObject() == null) {
            return;
        }
        canvas.getActiveObject().toggle("flipY")
        canvas.renderAll();
    },


    /**
     * 이미지 크롭 활성화
     */
    activeImageCrop: (obj) => {
        if (obj) {
            let image = obj
            let mask = new fabric.Rect({
                fill: 'rgba(0,0,0,0.4)',
                originX: 'left',
                originY: 'top',
                opacity: 1,
                width: 1,
                height: 1,
                borderColor: 'red',
                cornerColor: 'red',
                cornerSize: 6,
                shapeType: 'mask',
                lockRotation: true,
                "parentImage": image.id,
                centeredRotation: true
            }).rotate(obj.angle)
                .setControlsVisibility({ mtr: false });

            mask.left = image.left;
            mask.top = image.top;
            mask.width = image.getScaledWidth();
            mask.height = image.getScaledHeight();

            canvas.add(mask);
            canvas.setActiveObject(mask);

            mask.on('deselected', function(e){
                canvas.remove(mask)
            });

            mask.on('moving', function() {
                mask.setCoords();
                // top-left  corner
                if(mask.getBoundingRect().top < image.getBoundingRect().top || mask.getBoundingRect().left < image.getBoundingRect().left){
                    mask.top = Math.max(mask.top, mask.top-mask.getBoundingRect().top+image.getBoundingRect().top);
                    mask.left = Math.max(mask.left, mask.left-mask.getBoundingRect().left+image.getBoundingRect().left);
                }
                // bot-right corner
                if(mask.getBoundingRect().top+mask.getBoundingRect().height  > image.getBoundingRect().top+image.getBoundingRect().height || mask.getBoundingRect().left+mask.getBoundingRect().width  > image.getBoundingRect().left+image.getBoundingRect().width){
                    mask.top = Math.min(mask.top, (image.getBoundingRect().top+image.getBoundingRect().height)-mask.getBoundingRect().height+mask.top-mask.getBoundingRect().top);
                    mask.left = Math.min(mask.left, (image.getBoundingRect().left+image.getBoundingRect().width)-mask.getBoundingRect().width+mask.left-mask.getBoundingRect().left);
                }
            })

            mask.on('scaling', function () {
                let newWidth = (Math.round(mask.getScaledWidth()))
                let newHeight = (Math.round(mask.getScaledHeight()))

                if (newWidth > image.getScaledWidth()) {
                    newWidth = image.getScaledWidth()
                }
                if (newHeight > image.getScaledHeight()) {
                    newHeight = image.getScaledHeight()
                }

                mask.set({ width: newWidth, height: newHeight, scaleX: 1, scaleY: 1 });

                if (mask.top < image.top) {
                    mask.top = image.top
                }
                if (mask.left < image.left) {
                    mask.left = image.left
                }
                if (mask.left + mask.width > image.left + image.getScaledWidth()) {
                    mask.left = image.left + image.getScaledWidth() - mask.width
                }
                if (mask.top + mask.height > image.top + image.getScaledHeight()) {
                    mask.top = image.top + image.getScaledHeight() - mask.height
                }
            })

        } else {
            alert("선택된 요소 없음");
        }
    },

    changeScreenRatio: (option) => {
        $(".custom-ratio-area").hide()
        switch (option) {
            case 'cus-show' :
                $(".custom-ratio-area").show()
                break;
            case 'reset' :
                canvas.setWidth(document.querySelector(".editor-box").clientWidth)
                canvas.setHeight(document.querySelector(".editor-box").clientHeight)
                break;
            case '21' :
                canvas.setWidth(document.querySelector(".editor-box").clientWidth)
                canvas.setHeight((document.querySelector(".editor-box").clientWidth * 9) / 21)
                break;
            case '16' :
                canvas.setWidth(document.querySelector(".editor-box").clientWidth)
                canvas.setHeight((document.querySelector(".editor-box").clientWidth * 9) / 16)
                break;
            case '4' :
                canvas.setWidth(document.querySelector(".editor-box").clientWidth)
                canvas.setHeight((document.querySelector(".editor-box").clientWidth * 3) / 4)
                break;
            case 'cus':
                canvas.setWidth(Math.abs($("input[name='customWidth']").val()) || 1080)
                canvas.setHeight(Math.abs($("input[name='customHeight']").val()) || 720)
                break;
        }

        canvas.calcOffset()
        canvas.renderAll()
    }

}

function doCrop(mask, image) {
    let scaleOption = {
        scaleX: image.scaleX,
        scaleY: image.scaleY,
        angle: image.angle,
        left: mask.left,
        top: mask.top
    }

    let cropGroup = new fabric.Group([mask, image], {
        angle: -image.angle,
        centeredRotation: true
    })
    canvas.add(cropGroup)
        // .requestRenderAll()
    cropGroup.destroy()

    let cropOptions = {
        left: (mask.left - image.left)/image.scaleX,
        top: (mask.top - image.top)/image.scaleY,
        width: mask.width / image.scaleX,
        height: mask.height / image.scaleY
    }, cropDataUrl ;

    cropDataUrl = image.set({scaleX: 1, scaleY: 1}).toDataURL(cropOptions);

    let cropped = new fabric.Image.fromURL(cropDataUrl, function(img) {
        img.set({
            left: scaleOption.left,
            top: scaleOption.top,
            "objType": "media",
            "shapeType": "image",
            "id": image.id + "_cropped",
            scaleX: scaleOption.scaleX,
            scaleY: scaleOption.scaleY,
            centeredRotation: true
        }).rotate(scaleOption.angle)
        canvas.remove(image, mask, cropGroup).add(img)
    })

    reset(false, cropped)

}

// 정렬 계산식
function process_align(direction, selectedObject) {
    let bound = selectedObject.getBoundingRect();
    switch (direction) {
        case "left" :
            console.log(selectedObject.class)
            if(selectedObject._objects && selectedObject.class !== 'group') { // 2개이상 shape selected 했을때
                selectedObject._objects.forEach((obj) => {
                    let groupWidth = selectedObject.getBoundingRect(true).width;
                    let scaleFactor = selectedObject.get("scaleX");
                    let itemWidth = obj.getBoundingRect().width * scaleFactor;

                    if(obj.get("originX") === "left"){
                        obj.set({
                            originX: 'center',
                            originY: 'center',
                            left : -groupWidth / 2 + itemWidth / 2,
                            top: obj.getBoundingRect().top + obj.getBoundingRect().height / 2,
                        })
                    }else {
                        obj.set({
                            originX: 'center',
                            originY: 'center',
                            left : -groupWidth / 2 + itemWidth / 2
                        })
                    }

                    selectedObject.setCoords();
                });

            }else { //1개만잡았을때
                selectedObject.set({
                    left: selectedObject.left - bound.left,
                })

            }

            break;

            case "right" :
                if(selectedObject._objects && selectedObject.class !== 'group') { // 2개이상 shape selected 했을때
                    selectedObject._objects.forEach((obj) => {
                        let groupWidth = selectedObject.getBoundingRect(true).width;
                        let scaleFactor = selectedObject.get("scaleX");
                        let itemWidth = obj.getBoundingRect().width * scaleFactor;

                        if(obj.get("originX") === "left"){
                            obj.set({
                                originX: 'center',
                                originY: 'center',
                                left : groupWidth / 2 - itemWidth / 2,
                                top: obj.getBoundingRect().top + obj.getBoundingRect().height / 2,
                            })
                        }else {
                            obj.set({
                                originX: 'center',
                                originY: 'center',
                                left : groupWidth / 2 - itemWidth / 2
                            })
                        }

                        selectedObject.setCoords();
                    });
                }else { //1개만잡았을때
                    if(selectedObject.get("originY") === "top") { //origin center 로 인한 좌표 수정
                        selectedObject.set({
                            left: canvas.width - bound.width / 2,
                            top: bound.top + bound.height / 2,
                            originX: "center",
                            originY: "center"
                        });
                    }else {
                        selectedObject.set({
                            left: canvas.width - bound.width / 2,
                            originX: "center",
                            originY: "center"
                        });
                    }

                }
            break;
        case "centerHorizon" :
            if(selectedObject._objects && selectedObject.class !== 'group') { // 2개이상 shape selected 했을때
                selectedObject._objects.forEach((obj) => {
                    let scaleFactor = selectedObject.get("scaleX");

                    obj.set({
                        originX: 'center',
                        originY: 'center',
                        top : 0,
                        left: obj.getBoundingRect().left + obj.getBoundingRect().width / 2
                    })


                    selectedObject.setCoords();
                });

            }else {
                if(selectedObject.get("originY") === "top") { //origin center 로 인한 좌표 수정
                    selectedObject.set({
                        left: canvas.width / 2,
                        top: bound.top + bound.height / 2,
                        originX: 'center',
                        originY: 'center',
                    })

                }else{
                    selectedObject.set({
                        left: canvas.width / 2,
                        originX: 'center',
                        originY: 'center',
                    })

                }

            }
            break;


        case "top" :
            if(selectedObject._objects && selectedObject.class !== 'group') { // 2개이상 shape selected 했을때
                selectedObject._objects.forEach((obj) => {
                    let groupHeight = selectedObject.getBoundingRect(true).height;
                    let scaleFactor = selectedObject.get("scaleY");
                    let itemHeight = obj.getBoundingRect().height * scaleFactor;

                    if(obj.get("originY") === "top"){
                        obj.set({
                            originX: 'center',
                            originY: 'center',
                            top: -groupHeight / 2  + itemHeight / 2,
                            left: obj.getBoundingRect().left + obj.getBoundingRect().width / 2
                        })
                    }else {
                        obj.set({
                            originX: 'center',
                            originY: 'center',
                            top: -groupHeight / 2  + itemHeight / 2,
                        })
                    }

                    selectedObject.setCoords();
                });
            }else { //1개만잡았을때
               selectedObject.set({
                   top: selectedObject.top - bound.top
               })
            }
            break;
        case "centerVertical" :
            if(selectedObject._objects && selectedObject.class !== 'group') { // 2개이상 shape selected 했을때
                selectedObject._objects.forEach((obj) => {
                    obj.set({
                        originX: 'center',
                        originY: 'center',
                        left : 0,
                        top: obj.getBoundingRect().top + obj.getBoundingRect().height / 2
                    });
                    selectedObject.setCoords();
                });
            }else {
                if(selectedObject.get("originX") === "left") { //origin center 로 인한 좌표 수정
                    selectedObject.set({
                        top: canvas.height / 2,
                        left: bound.left + bound.width / 2,
                        originX: 'center',
                        originY: 'center',
                    })

                }else {
                    selectedObject.set({
                        top: canvas.height / 2,
                        originX: 'center',
                        originY: 'center',
                    })

                }
            }
            break;
        case "bottom" :
            if(selectedObject._objects && selectedObject.class !== 'group') { // 2개이상 shape selected 했을때
                selectedObject._objects.forEach((obj) => {
                    let groupHeight = selectedObject.getBoundingRect(true).height;
                    let scaleFactor = selectedObject.get("scaleY");
                    let itemHeight = obj.getBoundingRect().height * scaleFactor;

                    if(obj.get("originY") === "top"){
                        obj.set({
                            originX: 'center',
                            originY: 'center',
                            top: groupHeight / 2  - itemHeight / 2,
                            left: obj.getBoundingRect().left + obj.getBoundingRect().width / 2
                        })
                    }else {
                        obj.set({
                            originX: 'center',
                            originY: 'center',
                            top: groupHeight / 2  - itemHeight / 2,
                        })
                    }

                    selectedObject.setCoords();
                });
            }else { //1개만잡았을때
                if(selectedObject.get("originX") === "left") { //origin center 로 인한 좌표 수정
                    selectedObject.set({
                        top: canvas.height - bound.height/2,
                        left: bound.left + bound.width / 2,
                        originX: 'center',
                        originY: 'center'
                    });

                }else {
                    selectedObject.set({
                        top: canvas.height - bound.height/2,
                        originX: 'center',
                        originY: 'center'
                    });

                }

            }

            break;
    }

}

let state;
var undo = [];
var redo = [];

function saveObject(){
    redo = [];
    $('#redo').prop('disabled', true);
    if (state) {
        undo.push(state);
        $('#undo').prop('disabled', false);
    }
    state = JSON.stringify(canvas.toDatalessJSON(['shapeType', 'class', 'customContents']));
}

function replay(playStack, saveStack, buttonsOn, buttonsOff){
    state = JSON.stringify(canvas.toDatalessJSON(['shapeType', 'class', 'customContents']));
    canvas.renderAll();
    console.log('replay!!!!!!!!!!!!!!!!!!!!!!');

    saveStack.push(state);
    state = playStack.pop();
    var on = $(buttonsOn);
    var off = $(buttonsOff);

    on.prop('disabled', true);
    off.prop('disabled', true);


    canvas.clear();
    canvas.loadFromJSON(state, function (){
        canvas.renderAll();
        on.prop('disabled', false);
        if(playStack.length){
            off.prop('disabled', false);
        }
    });
}
