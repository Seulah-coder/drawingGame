let cnt = 0;
const reset = (draw, element) => {
    canvas.off("mouse:down");
    canvas.off("mouse:move");
    canvas.off("mouse:up");
    canvas.off("mouse:dblclick");
    $(document).unbind('keyup');
    $(document).unbind('keydown');

    isDrawing = false;

    draw = false;
    element = null;
    canvas.selection = true;
    canvas.preserveObjectStacking = true;

    prevObject = element;
    bindEvent();
}


let draw = {
    //사각형
    createRect: () => {
        let rect;
        let draw = false;
        let pointerObj = new Object();
        reset(draw, rect);
        canvas.on("mouse:down", (obj) => {
            draw = true;
            let pointer = canvas.getPointer(obj.e);
            pointerObj["startX"] = pointer.x;
            pointerObj["startY"] = pointer.y;

            rect = new fabric.Rect({
                left: pointerObj["startX"],
                top: pointerObj["startY"],
                fill: '#A6A6A6',
                shapeType: 'rect',
                class:'polygon',
                strokeWidth : 1,
                primaryId: 'shape',
            });

            canvas.add(rect);


        });



        canvas.on("mouse:move", (obj) => {
            canvas.setCursor("crosshair");
            if (draw) {
                canvas.selection = false;
                let pointer = canvas.getPointer(obj.e);

                pointerObj["endX"] = pointer.x;
                pointerObj["endY"] = pointer.y;

                if (pointerObj["endY"] <= pointerObj["startY"]) {
                    rect.set({top: pointerObj["endY"]});
                } else if (pointerObj["endY"] > pointerObj["startY"]) {
                    rect.set({top: pointerObj["startY"]});
                }

                if (pointerObj["endX"] <= pointerObj["startX"]) {
                    rect.set({left: pointerObj["endX"]});
                } else if (pointerObj["endX"] > pointerObj["startX"]) {
                    rect.set({left: pointerObj["startX"]});
                }

                rect.set({
                    width: Math.abs(pointerObj["startX"] - pointerObj["endX"]),
                    height: Math.abs(pointerObj["startY"] - pointerObj["endY"]),
                });

                canvas.setActiveObject(rect);
                canvas.renderAll();
            }
        });

        canvas.on("mouse:up", () => {
            //setSessionStorage(rect);
            reset(draw, rect);
        })

    },
    //원
    createCircle: () => {
        let ellipse;
        let draw = false;
        let pointerObj = new Object();
        reset(draw, ellipse);


        canvas.on("mouse:down", (obj) => {
            draw = true;
            let pointer = canvas.getPointer(obj.e);
            pointerObj["startX"] = pointer.x;
            pointerObj["startY"] = pointer.y;
            ellipse = new fabric.Ellipse({
                left: pointerObj["startX"],
                top: pointerObj["startY"],
                rx: 0,
                ry: 0,
                fill: '#A6A6A6',
                shapeType: 'ellipse',
                class:'polygon',
                strokeWidth : 1,

            });
            canvas.add(ellipse);

        });

        canvas.on("mouse:move", (obj) => {
            canvas.setCursor("crosshair");
            if (draw) {
                canvas.selection = false;
                let pointer = canvas.getPointer(obj.e);
                pointerObj["endX"] = pointer.x;
                pointerObj["endY"] = pointer.y;
                if (pointerObj["startX"] > pointerObj["endX"]) {
                    ellipse.set({left: Math.abs(pointerObj["endX"])});
                }
                if (pointerObj["startY"] > pointerObj["endY"]) {
                    ellipse.set({top: Math.abs(pointerObj["endY"])});
                }

                ellipse.set({
                    rx: Math.abs(pointerObj["startX"] - pointerObj["endX"]) / 2,
                    ry: Math.abs(pointerObj["startY"] - pointerObj["endY"]) / 2
                })
                canvas.setActiveObject(ellipse);
                canvas.renderAll();
            }

        });

        canvas.on("mouse:up", () => {
            //setSessionStorage(ellipse);
            reset(draw, ellipse);
        })


    },
    //삼각형
    createTriangle: () => {
        let triangle;
        let draw = false;
        let pointerObj = new Object();
        reset(draw, triangle);

        canvas.on("mouse:down", (obj) => {
            draw = true;
            let pointer = canvas.getPointer(obj.e);
            pointerObj["startX"] = pointer.x;
            pointerObj["startY"] = pointer.y;

            triangle = new fabric.Triangle({
                left: pointerObj["startX"],
                top: pointerObj["startY"],
                fill: '#A6A6A6',
                width: 0,
                height: 0,
                shapeType: 'triangle',
                class:'polygon',
                strokeWidth : 1,
            });

            canvas.add(triangle);
        });

        canvas.on("mouse:move", (obj) => {
            canvas.setCursor("crosshair");
            if (draw) {
                canvas.selection = false;
                let pointer = canvas.getPointer(obj.e);
                pointerObj["endX"] = pointer.x;
                pointerObj["endY"] = pointer.y;

                //오른쪽 대각선으로 드래그 했을떄
                if (pointerObj["startX"] < pointerObj["endX"] && pointerObj["startY"] < pointerObj["endY"]) {
                    if (triangle.get("angle") === 180) {
                        triangle.set({
                            left: pointerObj["startX"],
                            angle: 0
                        })
                    }

                }

                //오른쪽에서 왼쪽으로 그릴때
                if (pointerObj["startX"] > pointerObj["endX"] && pointerObj["startY"] < pointerObj["endY"]) {
                    if (triangle.get("angle") === 180) {
                        triangle.set({
                            angle: 0
                        })
                    }

                    if (triangle.get("angle") === 0) {
                        triangle.set({
                            left: pointerObj["endX"]
                        })
                    }

                }

                //오른쪽 대각선 위로 그릴때
                if (pointerObj["startX"] < pointerObj["endX"] && pointerObj["startY"] > pointerObj["endY"]) {
                    triangle.set({
                        left: pointerObj["startX"] + Math.abs(pointerObj["startX"] - pointerObj["endX"]),
                        angle: 180
                    })
                }


                //왼쪽 대각선 위로 그릴때
                if (pointerObj["startX"] > pointerObj["endX"] && pointerObj["startY"] > pointerObj["endY"]) {
                    if (triangle.get("angle") === 180) {
                        triangle.set({
                            left: pointerObj["endX"] + Math.abs(pointerObj["endX"] - pointerObj["startX"]),
                        })
                    }

                    if (triangle.get("angle") === 0) {
                        triangle.set({
                            left: pointerObj["startX"] + Math.abs(pointerObj["startX"] - pointerObj["endX"]),
                            angle: 180
                        })

                    }

                }

                triangle.set({
                    width: Math.abs(pointerObj["startX"] - pointerObj["endX"]),
                    height: Math.abs(pointerObj["startY"] - pointerObj["endY"]),
                });

                canvas.setActiveObject(triangle)
                canvas.renderAll();

            }
        });

        canvas.on("mouse:up", () => {
            //setSessionStorage(triangle);
            reset(draw, triangle);
        })

    },
    //텍스트박스
    createItext: () => {
        let textBox;
        let draw = false;
        let pointerObj = new Object();
        reset(draw, textBox);
        canvas.on("mouse:down", (obj) => {
            draw = true;
            let pointer = canvas.getPointer(obj.e);
            pointerObj["startX"] = pointer.x;
            pointerObj["startY"] = pointer.y;
        });

        textBox = new fabric.Textbox('', {
            left: pointerObj["startX"],
            top: pointerObj["startY"],
            shapeType: 'text',
            class:'text',
            text: '텍스트 입력',
            fontSize: 20,
            textAlign : 'left',
        })

        canvas.add(textBox);

        canvas.on("mouse:move", (obj) => {
            canvas.setCursor("crosshair");
            if (draw) {
                canvas.selection = false;
                let pointer = canvas.getPointer(obj.e);

                pointerObj["endX"] = pointer.x;
                pointerObj["endY"] = pointer.y;

                if (pointerObj["endY"] <= pointerObj["startY"]) {
                    textBox.set({top: pointerObj["endY"]});
                } else if (pointerObj["endY"] > pointerObj["startY"]) {
                    textBox.set({top: pointerObj["startY"]});
                }

                if (pointerObj["endX"] <= pointerObj["startX"]) {
                    textBox.set({left: pointerObj["endX"]});
                } else if (pointerObj["endX"] > pointerObj["startX"]) {
                    textBox.set({left: pointerObj["startX"]});
                }

                textBox.set({
                    width: Math.abs(pointerObj["startX"] - pointerObj["endX"]),
                    height: Math.abs(pointerObj["startY"] - pointerObj["endY"])
                });

                canvas.setActiveObject(textBox);
                canvas.renderAll();
            }
        });

        canvas.on("mouse:up", () => {
            textBox.set({
                fill: "black",
                editingBorderColor: "blue",
                text: '텍스트 입력',
                shapeType: 'text',
                class:'text',
            })
            canvas.renderAll();
            //setSessionStorage(textBox);

            reset(draw, textBox);
        })


    },

    //선
    createLines: () => {
        let line;
        let draw = false;
        let pointerObj = new Object();
        reset(draw, line);
        canvas.on("mouse:down", (obj) => {
            draw = true;
            let pointer = canvas.getPointer(obj.e);
            pointerObj["startX"] = pointer.x;
            pointerObj["startY"] = pointer.y;

            line = new fabric.Line([pointerObj["startX"], pointerObj["startY"], pointerObj["startX"], pointerObj["startY"]], {
                stroke: 'black',
                strokeWidth: 2,
                originX: 'center',
                originY: 'center',
                shapeType: 'line',
                class:'line',
            })

            canvas.add(line);
        });


        canvas.on("mouse:move", (obj) => {
            canvas.setCursor("crosshair");
            if (draw) {
                canvas.selection = false;
                let pointer = canvas.getPointer(obj.e);
                pointerObj["endX"] = pointer.x;
                pointerObj["endY"] = pointer.y;


                line.set({
                    "x2": pointerObj["endX"],
                    "y2": pointerObj["endY"]
                })

                canvas.setActiveObject(line);
                canvas.renderAll();
            }

        });

        canvas.on("mouse:up", () => {
            //setSessionStorage(line);
            reset(draw, line);
        })



    },

    //화살표 선
    createArrowLine: () => {
        let line;
        let triangle;
        let draw = false;
        let pointerObj = new Object();
        reset(draw, triangle);
        reset(draw, line);
        canvas.on("mouse:down", (obj) => {
            draw = true;
            let pointer = canvas.getPointer(obj.e);
            pointerObj["startX"] = pointer.x;
            pointerObj["startY"] = pointer.y;

            line = new fabric.Line([pointerObj["startX"], pointerObj["startY"], pointerObj["startX"], pointerObj["startY"]], {
                stroke: 'black',
                strokeWidth: 2,
                originX: 'center',
                originY: 'center',
                shapeType: 'line',
                class:'line',

            });

            triangle = new fabric.Triangle({
                left: pointerObj["startX"],
                top: pointerObj["startY"],
                width: 0,
                height: 0,
                fill: 'black',
                shapeType: 'triangle',
                class:'polygon',
            })

            canvas.add(line);
            canvas.add(triangle)
        });


        canvas.on("mouse:move", (obj) => {
            canvas.setCursor("crosshair");
            if (draw) {
                canvas.selection = false;
                let pointer = canvas.getPointer(obj.e);
                pointerObj["endX"] = pointer.x;
                pointerObj["endY"] = pointer.y;


                let centerX = (pointerObj["startX"] + pointerObj["endX"]) / 2
                let centerY = (line.y1 + line.y2) / 2
                let deltaX = line.left - centerX
                let deltaY = line.top - centerY

                line.set({
                    "x2": pointerObj["endX"],
                    "y2": pointerObj["endY"]
                })

                triangle.set({
                    left: line.x2,
                    top: line.y2,
                    width: 15,
                    height: 15,
                    angle: calcArrowAngle(pointerObj["startX"], pointerObj["startY"], pointerObj["endX"], pointerObj["endY"]),
                    originX: 'center',
                    originY: 'center',
                    hasBorders: false,
                    hasControls: false,
                    lockScalingX: true,
                    lockScalingY: true,
                    lockRotation: true,
                })

                canvas.setActiveObject(line);
                canvas.renderAll();
            }

        });

        canvas.on("mouse:up", () => {
            const objs = [line, triangle];
            const togetherObj = new fabric.Group(objs);
            togetherObj.set({
                shapeType: 'arrow',
                class:'group',
            });
            canvas.add(togetherObj);
            canvas.remove(triangle);
            canvas.remove(line)
            canvas.setActiveObject(togetherObj);
            canvas.renderAll();
            //setSessionStorage(togetherObj);
            line = null;
            triangle = null;
            reset(draw, togetherObj);
        })



    },
    //양쪽 화살표
    createBothArrowLine: () => {
        let line;
        let startTriangle;
        let endTriangle;
        let draw = false;
        let pointerObj = new Object();
        reset(draw, startTriangle);
        reset(draw, endTriangle);
        reset(draw, line);
        canvas.on("mouse:down", (obj) => {
            draw = true;
            let pointer = canvas.getPointer(obj.e);
            pointerObj["startX"] = pointer.x;
            pointerObj["startY"] = pointer.y;

            line = new fabric.Line([pointerObj["startX"], pointerObj["startY"], pointerObj["startX"], pointerObj["startY"]], {
                stroke: 'black',
                strokeWidth: 2,
                originX: 'center',
                originY: 'center',
                shapeType: 'line',
                class:'line',
            });

            startTriangle = new fabric.Triangle({
                left: pointerObj["startX"],
                top: pointerObj["startY"],
                width: 0,
                height: 0,
                fill: 'black',
                shapeType: 'triangle',
                class:'polygon',
            })

            endTriangle = new fabric.Triangle({
                left: pointerObj["startX"],
                top: pointerObj["startY"],
                width: 0,
                height: 0,
                fill: 'black',
                shapeType: 'triangle',
                class:'polygon',
            })


            canvas.add(line);
            canvas.add(startTriangle)
            canvas.add(endTriangle)
        });


        canvas.on("mouse:move", (obj) => {
            canvas.setCursor("crosshair");
            if (draw) {
                canvas.selection = false;
                let pointer = canvas.getPointer(obj.e);
                pointerObj["endX"] = pointer.x;
                pointerObj["endY"] = pointer.y;


                let centerX = (pointerObj["startX"] + pointerObj["endX"]) / 2
                let centerY = (line.y1 + line.y2) / 2
                let deltaX = line.left - centerX
                let deltaY = line.top - centerY

                line.set({
                    "x2": pointerObj["endX"],
                    "y2": pointerObj["endY"]
                })

                startTriangle.set({
                    left: line.x1,
                    top: line.y1,
                    width: 15,
                    height: 15,
                    angle: calcArrowAngle(pointerObj["startX"], pointerObj["startY"], pointerObj["endX"], pointerObj["endY"]) + 180,
                    originX: 'center',
                    originY: 'center',
                    hasBorders: false,
                    hasControls: false,
                    lockScalingX: true,
                    lockScalingY: true,
                    lockRotation: true,
                })


                endTriangle.set({
                    left: line.x2,
                    top: line.y2,
                    width: 15,
                    height: 15,
                    angle: calcArrowAngle(pointerObj["startX"], pointerObj["startY"], pointerObj["endX"], pointerObj["endY"]),
                    originX: 'center',
                    originY: 'center',
                    hasBorders: false,
                    hasControls: false,
                    lockScalingX: true,
                    lockScalingY: true,
                    lockRotation: true,
                })

                canvas.setActiveObject(line);
                canvas.renderAll();
            }

        });

        canvas.on("mouse:up", () => {
            const objs = [startTriangle, line, endTriangle];
            const togetherObj = new fabric.Group(objs);
            togetherObj.set({
                shapeType: 'arrow',
                class:'group',
            });
            canvas.add(togetherObj);
            canvas.remove(startTriangle);
            canvas.remove(line);
            canvas.remove(endTriangle)
            canvas.setActiveObject(togetherObj);
            canvas.renderAll();
            //setSessionStorage(togetherObj);
            line = null;
            endTriangle = null;
            reset(draw, objs);
        })



    },
    //마름모
    createDiamond: () => {

        let diamond;
        let draw = false;
        let pointerObj = new Object();
        let point;
        reset(draw, diamond);
        canvas.on("mouse:down", (obj) => {
            draw = true;
            let pointer = canvas.getPointer(obj.e);
            pointerObj["startX"] = pointer.x;
            pointerObj["startY"] = pointer.y;

            point = [
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0}
            ]

            diamond = new fabric.Polygon(point, {
                left: pointerObj["startX"],
                top: pointerObj["startY"],
                fill: '#A6A6A6',
                shapeType: 'diamond',
                class:'polygon',
            })

            canvas.add(diamond);

        })

        canvas.on("mouse:move", (obj) => {
            canvas.setCursor("crosshair");
            if (draw) {
                canvas.selection = false;
                let pointer = canvas.getPointer(obj.e);
                pointerObj["endX"] = pointer.x;
                pointerObj["endY"] = pointer.y;

                //오른쪽 대각선으로 드래그 했을떄
                if (pointerObj["startX"] <= pointerObj["endX"] && pointerObj["startY"] <= pointerObj["endY"]) {
                    point = [
                        {
                            x: Math.abs(pointerObj["startX"] - pointerObj["endX"]) / 2 + pointerObj["startX"],
                            y: pointerObj["startY"]
                        },
                        {
                            x: pointerObj["endX"],
                            y: Math.abs(pointerObj["startY"] - pointerObj["endY"]) / 2 + pointerObj["startY"]
                        },
                        {
                            x: Math.abs(pointerObj["startX"] - pointerObj["endX"]) / 2 + pointerObj["startX"],
                            y: pointerObj["endY"]
                        },
                        {
                            x: pointerObj["startX"],
                            y: Math.abs(pointerObj["startY"] - pointerObj["endY"]) / 2 + pointerObj["startY"]
                        },
                    ];

                }

                //오른쪽에서 왼쪽으로 그릴때
                if (pointerObj["startX"] >= pointerObj["endX"] && pointerObj["startY"] <= pointerObj["endY"]) {
                    point = [
                        {
                            x: Math.abs(pointerObj["endX"] - pointerObj["startX"]) / 2 + pointerObj["endX"],
                            y: pointerObj["startY"]
                        },
                        {
                            x: pointerObj["startX"],
                            y: Math.abs(pointerObj["startY"] - pointerObj["endY"]) / 2 + pointerObj["startY"]
                        },
                        {
                            x: Math.abs(pointerObj["endX"] - pointerObj["startX"]) / 2 + pointerObj["endX"],
                            y: pointerObj["endY"]
                        },
                        {
                            x: pointerObj["endX"],
                            y: Math.abs(pointerObj["startY"] - pointerObj["endY"]) / 2 + pointerObj["startY"]
                        },
                    ];

                }

                //오른쪽 대각선 위로 그릴때
                if (pointerObj["startX"] <= pointerObj["endX"] && pointerObj["startY"] >= pointerObj["endY"]) {
                    point = [
                        {
                            x: Math.abs(pointerObj["startX"] - pointerObj["endX"]) / 2 + pointerObj["startX"],
                            y: pointerObj["endY"]
                        },
                        {
                            x: pointerObj["endX"],
                            y: Math.abs(pointerObj["endY"] - pointerObj["startY"]) / 2 + pointerObj["endY"]
                        },
                        {
                            x: Math.abs(pointerObj["startX"] - pointerObj["endX"]) / 2 + pointerObj["startX"],
                            y: pointerObj["startY"]
                        },
                        {
                            x: pointerObj["startX"],
                            y: Math.abs(pointerObj["endY"] - pointerObj["startY"]) / 2 + pointerObj["endY"]
                        },
                    ];
                }

                //왼쪽 대각선 위로 그릴때
                if (pointerObj["startX"] >= pointerObj["endX"] && pointerObj["startY"] >= pointerObj["endY"]) {
                    point = [
                        {
                            x: Math.abs(pointerObj["endX"] - pointerObj["startX"]) / 2 + pointerObj["endX"],
                            y: pointerObj["endY"]
                        },
                        {
                            x: pointerObj["startX"],
                            y: Math.abs(pointerObj["endY"] - pointerObj["startY"]) / 2 + pointerObj["endY"]
                        },
                        {
                            x: Math.abs(pointerObj["endX"] - pointerObj["startX"]) / 2 + pointerObj["endX"],
                            y: pointerObj["startY"]
                        },
                        {
                            x: pointerObj["endX"],
                            y: Math.abs(pointerObj["endY"] - pointerObj["startY"]) / 2 + pointerObj["endY"]
                        },
                    ];
                }

                diamond = new fabric.Polygon(point, {
                    width: Math.abs(pointerObj["startX"] - pointerObj["endX"]),
                    height: Math.abs(pointerObj["startY"] - pointerObj["endY"]),
                    fill: '#A6A6A6',
                    strokeWidth : 1,
                    shapeType: 'diamond',
                    class:'polygon',
                });

                canvas.add(diamond);
                canvas.remove(canvas.getActiveObject());
                canvas.setActiveObject(diamond);
                canvas.renderAll();

            }

        });

        canvas.on("mouse:up", () => {
            //setSessionStorage(diamond);
            reset(draw, diamond);

        })


    },
    //직삼각형
    createRightTriangle: () => {
        let triangle;
        let draw = false;
        let pointerObj = new Object();
        let point;
        reset(draw, triangle);
        canvas.on("mouse:down", (obj) => {
            draw = true;
            let pointer = canvas.getPointer(obj.e);
            pointerObj["startX"] = pointer.x;
            pointerObj["startY"] = pointer.y;

            point = [
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0}
            ]


        })

        canvas.on("mouse:move", (obj) => {
            canvas.setCursor("crosshair");
            if (draw) {
                canvas.selection = false;
                let pointer = canvas.getPointer(obj.e);
                pointerObj["endX"] = pointer.x;
                pointerObj["endY"] = pointer.y;

                point = [
                    {x: pointerObj["startX"], y: pointerObj["startY"]},
                    {x: pointerObj["startX"], y: pointerObj["endY"]},
                    {x: pointerObj["endX"], y: pointerObj["endY"]}

                ];

                triangle = new fabric.Polygon(point, {
                    width: Math.abs(pointerObj["startX"] - pointerObj["endX"]),
                    height: Math.abs(pointerObj["startY"] - pointerObj["endY"]),
                    fill: '#A6A6A6',
                    shapeType: 'rightTriangle',
                    class:'polygon',
                    strokeWidth : 1,
                });

                canvas.remove(canvas.getActiveObject())
                canvas.add(triangle)
                canvas.setActiveObject(triangle);
                canvas.renderAll();

            }

        });

        canvas.on("mouse:up", (obj) => {
            //setSessionStorage(triangle);
            reset(draw, triangle);

        })
    },

    //평행사변형
    createParallelogram: () => {

        let parallelogram;
        let draw = false;
        let pointerObj = new Object();
        let point;
        reset(draw, parallelogram);
        canvas.on("mouse:down", (obj) => {
            draw = true;
            let pointer = canvas.getPointer(obj.e);
            pointerObj["startX"] = pointer.x;
            pointerObj["startY"] = pointer.y;

            point = [
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0}
            ]


        })

        canvas.on("mouse:move", (obj) => {
            canvas.setCursor("crosshair");
            if (draw) {
                canvas.selection = false;
                let pointer = canvas.getPointer(obj.e);
                pointerObj["endX"] = pointer.x;
                pointerObj["endY"] = pointer.y;

                let width = (Math.abs(pointerObj["startX"] - pointerObj["endX"])) * 30 / 100;

                //오른쪽 대각선으로 드래그 했을떄
                if(pointerObj["startX"] <= pointerObj["endX"] && pointerObj["startY"] <= pointerObj["endY"]){
                    point = [
                        {x: pointerObj["startX"] + width, y: pointerObj["startY"]},
                        {x: pointerObj["endX"], y: pointerObj["startY"]},
                        {x: pointerObj["endX"] - width, y: pointerObj["endY"]},
                        {x: pointerObj["startX"], y: pointerObj["endY"]}
                    ];
                }

                //오른쪽에서 왼쪽으로 그릴때
                if(pointerObj["startX"] >= pointerObj["endX"] &&  pointerObj["startY"] <= pointerObj["endY"]) {
                    point = [
                        {x: pointerObj["startX"] - width, y: pointerObj["startY"]},
                        {x: pointerObj["endX"], y: pointerObj["startY"]},
                        {x: pointerObj["endX"] + width, y: pointerObj["endY"]},
                        {x: pointerObj["startX"], y: pointerObj["endY"]}
                    ];
                }

                //오른쪽 대각선 위로 그릴때
                if(pointerObj["startX"] <= pointerObj["endX"] && pointerObj["startY"] >= pointerObj["endY"]){
                    point = [
                        {x: pointerObj["startX"] + width, y: pointerObj["startY"]},
                        {x: pointerObj["endX"], y: pointerObj["startY"]},
                        {x: pointerObj["endX"] - width, y: pointerObj["endY"]},
                        {x: pointerObj["startX"], y: pointerObj["endY"]}
                    ];
                }


                //왼쪽 대각선 위로 그릴때
                if (pointerObj["startX"] >= pointerObj["endX"] && pointerObj["startY"] >= pointerObj["endY"]) {
                    point = [
                        {x: pointerObj["startX"] - width, y: pointerObj["startY"]},
                        {x: pointerObj["endX"], y: pointerObj["startY"]},
                        {x: pointerObj["endX"] + width, y: pointerObj["endY"]},
                        {x: pointerObj["startX"], y: pointerObj["endY"]}
                    ];
                }

                parallelogram = new fabric.Polygon(point, {
                    width: Math.abs(pointerObj["startX"] - pointerObj["endX"]),
                    height: Math.abs(pointerObj["startY"] - pointerObj["endY"]),
                    fill: '#A6A6A6',
                    shapeType: 'parallelogram',
                    class:'polygon',
                    strokeWidth : 1,
                });

                canvas.remove(canvas.getActiveObject())
                canvas.add(parallelogram)
                canvas.setActiveObject(parallelogram);
                canvas.renderAll();
            }

        });

        canvas.on("mouse:up", () => {
            //setSessionStorage(parallelogram);
            reset(draw, parallelogram);

        })

    },

    //오각형
    createPentagon: () => {

        let pentagon;
        let draw = false;
        let pointerObj = new Object();
        let point;
        reset(draw, pentagon);
        canvas.on("mouse:down", (obj) => {
            draw = true;
            let pointer = canvas.getPointer(obj.e);
            pointerObj["startX"] = pointer.x;
            pointerObj["startY"] = pointer.y;

            point = [
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0}
            ]


        })

        canvas.on("mouse:move", (obj) => {
            canvas.setCursor("crosshair");
            if (draw) {
                canvas.selection = false;
                let pointer = canvas.getPointer(obj.e);
                pointerObj["endX"] = pointer.x;
                pointerObj["endY"] = pointer.y;

                let width = Math.abs(pointerObj["startX"] - pointerObj["endX"]) * 20 / 100;
                let height =  Math.abs(pointerObj["endY"] - pointerObj["startY"]) * 12 / 100;

                //오른쪽 대각선으로 드래그 했을떄
                if(pointerObj["startX"] <= pointerObj["endX"] && pointerObj["startY"] <= pointerObj["endY"]){
                    point = [
                        {x: Math.abs(pointerObj["startX"] - pointerObj["endX"]) / 2 + pointerObj["startX"], y: pointerObj["startY"]},
                        {x: pointerObj["endX"], y: Math.abs(pointerObj["endY"] - pointerObj["startY"]) / 2 + pointerObj["startY"] - height},
                        {x: pointerObj["endX"] - width, y: pointerObj["endY"]},
                        {x: pointerObj["startX"] + width, y: pointerObj["endY"]},
                        {x: pointerObj["startX"], y: Math.abs(pointerObj["endY"] - pointerObj["startY"]) / 2 + pointerObj["startY"] - height},

                    ];
                }

                //오른쪽에서 왼쪽으로 그릴때
                if(pointerObj["startX"] >= pointerObj["endX"] &&  pointerObj["startY"] <= pointerObj["endY"]) {
                    point = [
                        {x: Math.abs(pointerObj["endX"] - pointerObj["startX"]) / 2 + pointerObj["endX"], y: pointerObj["startY"]},
                        {x: pointerObj["startX"], y: Math.abs(pointerObj["endY"] - pointerObj["startY"]) / 2 + pointerObj["startY"] - height},
                        {x: pointerObj["startX"] - width, y: pointerObj["endY"]},
                        {x: pointerObj["endX"] + width, y: pointerObj["endY"]},
                        {x: pointerObj["endX"], y: Math.abs(pointerObj["endY"] - pointerObj["startY"]) / 2 + pointerObj["startY"] - height},

                    ];
                }

                //오른쪽 대각선 위로 그릴때
               if(pointerObj["startX"] <= pointerObj["endX"] && pointerObj["startY"] >= pointerObj["endY"]){
                    point = [
                        {x: Math.abs(pointerObj["startX"] - pointerObj["endX"]) / 2 + pointerObj["startX"], y: Math.abs(pointerObj["startY"])},
                        {x: pointerObj["endX"], y: (pointerObj["startY"] - pointerObj["endY"]) / 2 + pointerObj["endY"] + height},
                        {x: pointerObj["endX"] - width, y: pointerObj["endY"]}, //왼쪽위
                        {x: pointerObj["startX"] + width, y: pointerObj["endY"]}, //오른쪽위
                        {x: pointerObj["startX"], y: (pointerObj["startY"] - pointerObj["endY"]) / 2 + pointerObj["endY"] + height},

                    ];
                }


                //왼쪽 대각선 위로 그릴때
                if (pointerObj["startX"] >= pointerObj["endX"] && pointerObj["startY"] >= pointerObj["endY"]) {
                    point = [
                        {x: Math.abs(pointerObj["endX"] - pointerObj["startX"]) / 2 + pointerObj["endX"], y: Math.abs(pointerObj["startY"])},
                        {x: pointerObj["startX"], y: (pointerObj["startY"] - pointerObj["endY"]) / 2 + pointerObj["endY"] + height},
                        {x: pointerObj["startX"] - width, y: pointerObj["endY"]}, //왼쪽위
                        {x: pointerObj["endX"] + width, y: pointerObj["endY"]}, //오른쪽위
                        {x: pointerObj["endX"], y: (pointerObj["startY"] - pointerObj["endY"]) / 2 + pointerObj["endY"] + height},

                    ];
                }

                pentagon = new fabric.Polygon(point, {
                    width: Math.abs(pointerObj["startX"] - pointerObj["endX"]),
                    height: Math.abs(pointerObj["startY"] - pointerObj["endY"]),
                    fill: '#A6A6A6',
                    shapeType: 'pentagon',
                    class:'polygon',
                });

                canvas.remove(canvas.getActiveObject())
                canvas.add(pentagon)
                canvas.setActiveObject(pentagon);
                canvas.renderAll();

            }

        });

        canvas.on("mouse:up", () => {
            //setSessionStorage(pentagon);
            reset(draw, pentagon);

        })

    },

    //육각형
    createHexagon: () => {
        let Hexagon;
        let draw = false;
        let pointerObj = new Object();
        let point;
        reset(draw, Hexagon);
        canvas.on("mouse:down", (obj) => {
            draw = true;
            let pointer = canvas.getPointer(obj.e);
            pointerObj["startX"] = pointer.x;
            pointerObj["startY"] = pointer.y;

            point = [
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0},
            ]


        })

        canvas.on("mouse:move", (obj) => {
            canvas.setCursor("crosshair");
            if (draw) {
                canvas.selection = false;
                let pointer = canvas.getPointer(obj.e);
                pointerObj["endX"] = pointer.x;
                pointerObj["endY"] = pointer.y;

                let width = (Math.abs(pointerObj["startX"] - pointerObj["endX"])) * 15 / 100;

                //오른쪽 대각선으로 드래그 했을떄
                if(pointerObj["startX"] <= pointerObj["endX"] && pointerObj["startY"] <= pointerObj["endY"]) {
                    point = [
                        {x: pointerObj["startX"] + width, y: pointerObj["startY"]},
                        {x: pointerObj["endX"] - width, y: pointerObj["startY"]},
                        {x: pointerObj["endX"], y: Math.abs(pointerObj["endY"] - pointerObj["startY"]) / 2 + pointerObj["startY"]},
                        {x: pointerObj["endX"] - width, y: pointerObj["endY"]},
                        {x: pointerObj["startX"] + width, y: pointerObj["endY"]},
                        {x: pointerObj["startX"], y: Math.abs(pointerObj["endY"] - pointerObj["startY"]) / 2 + pointerObj["startY"]},
                    ];
                }

                //오른쪽에서 왼쪽으로 그릴때
                if(pointerObj["startX"] >= pointerObj["endX"] && pointerObj["startY"] <= pointerObj["endY"]) {
                    point = [
                        {x: pointerObj["endX"] + width, y: pointerObj["startY"]},
                        {x: pointerObj["startX"] - width, y: pointerObj["startY"]},
                        {x: pointerObj["startX"], y: Math.abs(pointerObj["startY"] - pointerObj["endY"]) / 2 + pointerObj["startY"]},
                        {x: pointerObj["startX"] - width, y: pointerObj["endY"]},
                        {x: pointerObj["endX"] + width, y: pointerObj["endY"]},
                        {x: pointerObj["endX"], y: Math.abs(pointerObj["startY"] - pointerObj["endY"]) / 2 + pointerObj["startY"]},

                    ];
                }

                //오른쪽 대각선 위로 그릴때
                if(pointerObj["startX"] <= pointerObj["endX"] && pointerObj["startY"] >= pointerObj["endY"]){
                    point = [
                        {x: pointerObj["startX"] + width, y: pointerObj["startY"]},
                        {x: pointerObj["endX"] - width, y: pointerObj["startY"]},
                        {x: pointerObj["endX"], y: Math.abs(pointerObj["endY"] - pointerObj["startY"]) / 2 + pointerObj["endY"]},
                        {x: pointerObj["endX"] - width, y: pointerObj["endY"]},
                        {x: pointerObj["startX"] + width, y: pointerObj["endY"]},
                        {x: pointerObj["startX"], y: Math.abs(pointerObj["endY"] - pointerObj["startY"])  / 2 + pointerObj["endY"]},
                    ];
                }

                //왼쪽 대각선 위로 그릴때
                if(pointerObj["startX"] >= pointerObj["endX"] && pointerObj["startY"] >= pointerObj["endY"]){
                    point = [
                        {x: pointerObj["endX"] + width, y: pointerObj["startY"]},
                        {x: pointerObj["startX"] - width, y: pointerObj["startY"]},
                        {x: pointerObj["startX"], y: Math.abs(pointerObj["endY"] - pointerObj["startY"]) / 2 + pointerObj["endY"]},
                        {x: pointerObj["startX"] - width, y: pointerObj["endY"]},
                        {x: pointerObj["endX"] + width, y: pointerObj["endY"]},
                        {x: pointerObj["endX"], y: Math.abs(pointerObj["endY"] - pointerObj["startY"]) / 2 + pointerObj["endY"]},

                    ];
                }

                Hexagon = new fabric.Polygon(point, {
                    width: Math.abs(pointerObj["startX"] - pointerObj["endX"]),
                    height: Math.abs(pointerObj["startY"] - pointerObj["endY"]),
                    fill: '#A6A6A6',
                    shapeType: 'Hexagon',
                    class:'polygon',
                    strokeWidth : 1,
                });


                canvas.remove(canvas.getActiveObject());
                canvas.add(Hexagon)
                canvas.setActiveObject(Hexagon);
                canvas.renderAll();
            }
        });

        canvas.on("mouse:up", () => {
            //setSessionStorage(Hexagon);
            reset(draw, Hexagon);

        })

    },
    //자유 드로잉
    freeDrawing: () => {
        canvas.isDrawingMode = true;
    },

    // 사다리꼴
    createTrapezoid: () => {
        let trapezoid;
        let draw = false;
        let pointerObj = new Object();
        let point;
        reset(draw, trapezoid);
        canvas.on("mouse:down", (obj) => {
            draw = true;
            let pointer = canvas.getPointer(obj.e);
            pointerObj["startX"] = pointer.x;
            pointerObj["startY"] = pointer.y;

            point = [
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0}
            ]


        });

        canvas.on("mouse:move", (obj) => {
            canvas.setCursor("crosshair");
            if (draw) {
                canvas.selection = false;
                let pointer = canvas.getPointer(obj.e);

                pointerObj["endX"] = pointer.x;
                pointerObj["endY"] = pointer.y;

                let width = (Math.abs(pointerObj["startX"] - pointerObj["endX"])) * 12 / 100;

                //오른쪽 대각선으로 드래그 했을떄
                if(pointerObj["startX"] <= pointerObj["endX"] && pointerObj["startY"] <= pointerObj["endY"]) {
                    point = [
                        {x: pointerObj["startX"] + width, y: pointerObj["startY"]},
                        {x: pointerObj["endX"] - width, y: pointerObj["startY"]},
                        {x: pointerObj["endX"], y: pointerObj["endY"]},
                        {x: pointerObj["startX"], y: pointerObj["endY"]},
                    ];
                }

                //오른쪽에서 왼쪽으로 그릴때
                if(pointerObj["startX"] >= pointerObj["endX"] && pointerObj["startY"] <= pointerObj["endY"]) {
                    point = [
                        {x: pointerObj["endX"] + width, y: pointerObj["startY"]},
                        {x: pointerObj["startX"] - width, y: pointerObj["startY"]},
                        {x: pointerObj["startX"], y: pointerObj["endY"]},
                        {x: pointerObj["endX"], y: pointerObj["endY"]},
                    ];
                }

                //오른쪽 대각선 위로 그릴때
                if(pointerObj["startX"] <= pointerObj["endX"] && pointerObj["startY"] >= pointerObj["endY"]){
                    point = [
                        {x: pointerObj["startX"] + width, y: pointerObj["startY"]},
                        {x: pointerObj["endX"] - width, y: pointerObj["startY"]},
                        {x: pointerObj["endX"], y: pointerObj["endY"]},
                        {x: pointerObj["startX"], y: pointerObj["endY"]},
                    ];
                }

                //왼쪽 대각선 위로 그릴때
                if(pointerObj["startX"] >= pointerObj["endX"] && pointerObj["startY"] >= pointerObj["endY"]){
                    point = [
                        {x: pointerObj["startX"], y: pointerObj["endY"]},
                        {x: pointerObj["endX"], y: pointerObj["endY"]},
                        {x: pointerObj["endX"] + width, y: pointerObj["startY"]},
                        {x: pointerObj["startX"] - width, y: pointerObj["startY"]},
                    ];
                }

                trapezoid = new fabric.Polygon(point, {
                    width: Math.abs(pointerObj["startX"] - pointerObj["endX"]),
                    height: Math.abs(pointerObj["startY"] - pointerObj["endY"]),
                    fill: '#A6A6A6',
                    shapeType: 'trapezoid',
                    class:'polygon',
                    strokeWidth : 1,
                })

                canvas.add(trapezoid);
                canvas.remove(canvas.getActiveObject());
                canvas.setActiveObject(trapezoid);

                canvas.renderAll();
            }
        });

        canvas.on("mouse:up", () => {
            //(trapezoid);
            reset(draw, trapezoid);
        });

    },

    // 십자형
    createCross: () => {
        let cross;
        let draw = false;
        let pointerObj = new Object();
        let point;
        reset(draw, cross);
        canvas.on("mouse:down", (obj) => {
            draw = true;
            let pointer = canvas.getPointer(obj.e);
            pointerObj["startX"] = pointer.x;
            pointerObj["startY"] = pointer.y;

            point = [
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0},
            ]


        });

        canvas.on("mouse:move", (obj) => {
            canvas.setCursor("crosshair");
            if (draw) {
                canvas.selection = false;
                let pointer = canvas.getPointer(obj.e);

                pointerObj["endX"] = pointer.x;
                pointerObj["endY"] = pointer.y;

                let width = (Math.abs(pointerObj["startX"] - pointerObj["endX"])) * 30 / 100;
                let height = (Math.abs(pointerObj["startY"] - pointerObj["endY"])) * 30 / 100;

                //오른쪽 대각선으로 드래그 했을떄
                if (pointerObj["startX"] <= pointerObj["endX"] && pointerObj["startY"] <= pointerObj["endY"]) {
                    point = [
                        {x: pointerObj["startX"] + width, y: pointerObj["startY"]},
                        {x: pointerObj["endX"] - width, y: pointerObj["startY"]},
                        {x: pointerObj["endX"] - width, y: pointerObj["startY"] + height},
                        {x: pointerObj["endX"], y: pointerObj["startY"] + height},
                        {x: pointerObj["endX"], y: pointerObj["endY"] - height},
                        {x: pointerObj["endX"] - width, y: pointerObj["endY"] - height},
                        {x: pointerObj["endX"] - width, y: pointerObj["endY"]},
                        {x: pointerObj["startX"] + width, y: pointerObj["endY"]},
                        {x: pointerObj["startX"] + width, y: pointerObj["endY"] - height},
                        {x: pointerObj["startX"], y: pointerObj["endY"] - height},
                        {x: pointerObj["startX"], y: pointerObj["startY"] + height},
                        {x: pointerObj["startX"] + width, y: pointerObj["startY"] + height},
                    ];
                }

                //오른쪽에서 왼쪽으로 그릴때
                if (pointerObj["startX"] >= pointerObj["endX"] && pointerObj["startY"] <= pointerObj["endY"]) {
                    point = [
                        {x: pointerObj["endX"] + width, y: pointerObj["startY"]},
                        {x: pointerObj["startX"] - width, y: pointerObj["startY"]},
                        {x: pointerObj["startX"] - width, y: pointerObj["startY"] + height},
                        {x: pointerObj["startX"], y: pointerObj["startY"] + height},
                        {x: pointerObj["startX"], y: pointerObj["endY"] - height},
                        {x: pointerObj["startX"] - width, y: pointerObj["endY"] - height},
                        {x: pointerObj["startX"] - width, y: pointerObj["endY"]},
                        {x: pointerObj["endX"] + width, y: pointerObj["endY"]},
                        {x: pointerObj["endX"] + width, y: pointerObj["endY"] - height},
                        {x: pointerObj["endX"], y: pointerObj["endY"] - height},
                        {x: pointerObj["endX"], y: pointerObj["startY"] + height},
                        {x: pointerObj["endX"] + width, y: pointerObj["startY"] + height},
                    ];

                }

                //오른쪽 대각선 위로 그릴때
                if (pointerObj["startX"] <= pointerObj["endX"] && pointerObj["startY"] >= pointerObj["endY"]) {
                    point = [
                        {x: pointerObj["startX"] + width, y: pointerObj["endY"]},
                        {x: pointerObj["endX"] - width, y: pointerObj["endY"]},
                        {x: pointerObj["endX"] - width, y: pointerObj["endY"] + height},
                        {x: pointerObj["endX"], y: pointerObj["endY"] + height},
                        {x: pointerObj["endX"], y: pointerObj["startY"] - height},
                        {x: pointerObj["endX"] - width, y: pointerObj["startY"] - height},
                        {x: pointerObj["endX"] - width, y: pointerObj["startY"]},
                        {x: pointerObj["startX"] + width, y: pointerObj["startY"]},
                        {x: pointerObj["startX"] + width, y: pointerObj["startY"] - height},
                        {x: pointerObj["startX"], y: pointerObj["startY"] - height},
                        {x: pointerObj["startX"], y: pointerObj["endY"] + height},
                        {x: pointerObj["startX"] + width, y: pointerObj["endY"] + height},
                    ];
                }

                //왼쪽 대각선 위로 그릴때
                if (pointerObj["startX"] >= pointerObj["endX"] && pointerObj["startY"] >= pointerObj["endY"]) {
                    point = [
                        {x: pointerObj["endX"] + width, y: pointerObj["endY"]},
                        {x: pointerObj["startX"] - width, y: pointerObj["endY"]},
                        {x: pointerObj["startX"] - width, y: pointerObj["endY"] + height},
                        {x: pointerObj["startX"], y: pointerObj["endY"] + height},
                        {x: pointerObj["startX"], y: pointerObj["startY"] - height},
                        {x: pointerObj["startX"] - width, y: pointerObj["startY"] - height},
                        {x: pointerObj["startX"] - width, y: pointerObj["startY"]},
                        {x: pointerObj["endX"] + width, y: pointerObj["startY"]},
                        {x: pointerObj["endX"] + width, y: pointerObj["startY"] - height},
                        {x: pointerObj["endX"], y: pointerObj["startY"] - height},
                        {x: pointerObj["endX"], y: pointerObj["endY"] + height},
                        {x: pointerObj["endX"] + width, y: pointerObj["endY"] + height},
                    ];
                }

                cross = new fabric.Polygon(point, {
                    width: Math.abs(pointerObj["startX"] - pointerObj["endX"]),
                    height: Math.abs(pointerObj["startY"] - pointerObj["endY"]),
                    fill: '#A6A6A6',
                    shapeType: 'cross',
                    class:'polygon',
                    strokeWidth : 1,
                })

                canvas.add(cross);
                canvas.remove(canvas.getActiveObject());
                canvas.setActiveObject(cross);

                canvas.renderAll();
            }
        });

        canvas.on("mouse:up", () => {
            //setSessionStorage(cross);
            reset(draw, cross);
        });

    },

    createTable: function (){
        $(".dialog-table")
            .dialog("open");

        // let win = window.open("", "", "width=450,height=300,left=500, top=400");
        // win.document.write('<div class="form-item">' +
        //     '행(가로)<input type="text" id="row">' +
        //     ' 열(세로)<input type="text" id="column">' +
        //     ' </div>' + '<button onclick="window.opener.appendTable()">완료</button>');

/*        fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
        fabric.Object.prototype.noScaleCache = false;*/

        canvas.on("mouse:down", function (object){
            if(object.target && object.target.class){
                canvas.forEachObject(function (obj) {
                    var tableId = obj.customId;
                    if (tableId) {
                        for (var i = 0; i < obj.canvas._objects.length; i++) {
                            var findCustomId = obj.canvas._objects[i].customId;
                            if (tableId === findCustomId) {
                                var object = obj.canvas._objects[i];
                                positionTable(object, tableId);
                            }
                        }
                        object.on('moving', function () {
                            positionTable(object, tableId)
                        });
                        object.on('scaling', function (e) {
                            //table 크기 조절 scaling 함수
                            scaleTable(object, e);
                            //table 포지션 잡는 함수
                            positionTable(object, tableId);
                        });
                    }

                });
            }



        });

        canvas.on("mouse:move", function (){


        });

        canvas.on("mouse:up", function (){

        });
    },

    // 팔각형
    createOctagon: () => {
        let octagon;
        let draw = false;
        let pointerObj = new Object();
        let point;
        canvas.on("mouse:down", (obj) => {
            draw = true;
            let pointer = canvas.getPointer(obj.e);
            pointerObj["startX"] = pointer.x;
            pointerObj["startY"] = pointer.y;

            point = [
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0},
            ]

            octagon = new fabric.Polygon(point, {
                left: pointerObj["startX"],
                top: pointerObj["startY"],
                fill: '#A6A6A6',
                shapeType: 'octagon',
                class:'polygon',
            })
            canvas.add(octagon)

        });

        canvas.on("mouse:move", (obj) => {
            canvas.setCursor("crosshair");
            if (draw) {
                canvas.selection = false;
                let pointer = canvas.getPointer(obj.e);

                pointerObj["endX"] = pointer.x;
                pointerObj["endY"] = pointer.y;

                let width = (Math.abs(pointerObj["startX"] - pointerObj["endX"])) * 30 / 100;
                let height = (Math.abs(pointerObj["startY"] - pointerObj["endY"])) * 30 / 100;

                //오른쪽 대각선으로 드래그 했을떄
                if (pointerObj["startX"] <= pointerObj["endX"] && pointerObj["startY"] <= pointerObj["endY"]) {
                    point = [
                        {x: pointerObj["startX"] + width, y: pointerObj["startY"]},
                        {x: pointerObj["endX"] - width, y: pointerObj["startY"]},
                        {x: pointerObj["endX"], y: pointerObj["startY"] + height},
                        {x: pointerObj["endX"], y: pointerObj["endY"] - height},
                        {x: pointerObj["endX"] - width, y: pointerObj["endY"]},
                        {x: pointerObj["startX"] + width, y: pointerObj["endY"]},
                        {x: pointerObj["startX"], y: pointerObj["endY"] - height}, //7
                        {x: pointerObj["startX"], y: pointerObj["startY"] + height},
                    ];
                }

                //오른쪽에서 왼쪽으로 그릴때
                if (pointerObj["startX"] >= pointerObj["endX"] && pointerObj["startY"] <= pointerObj["endY"]) {
                    point = [
                        {x: pointerObj["endX"] + width, y: pointerObj["startY"]},
                        {x: pointerObj["startX"] - width, y: pointerObj["startY"]},
                        {x: pointerObj["startX"], y: pointerObj["startY"] + height},
                        {x: pointerObj["startX"], y: pointerObj["endY"] - height},
                        {x: pointerObj["startX"] - width, y: pointerObj["endY"]},
                        {x: pointerObj["endX"] + width, y: pointerObj["endY"]},
                        {x: pointerObj["endX"], y: pointerObj["endY"] - height}, //7
                        {x: pointerObj["endX"], y: pointerObj["startY"] + height},
                    ];
                }

                //오른쪽 대각선 위로 그릴때
                if (pointerObj["startX"] <= pointerObj["endX"] && pointerObj["startY"] >= pointerObj["endY"]) {
                    point = [
                        {x: pointerObj["startX"] + width, y: pointerObj["endY"]},
                        {x: pointerObj["endX"] - width, y: pointerObj["endY"]},
                        {x: pointerObj["endX"], y: pointerObj["endY"] + height},
                        {x: pointerObj["endX"], y: pointerObj["startY"] - height},
                        {x: pointerObj["endX"] - width, y: pointerObj["startY"]},
                        {x: pointerObj["startX"] + width, y: pointerObj["startY"]},
                        {x: pointerObj["startX"], y: pointerObj["startY"] - height},
                        {x: pointerObj["startX"], y: pointerObj["endY"] + height},
                    ];
                }

                //왼쪽 대각선 위로 그릴때
                if (pointerObj["startX"] >= pointerObj["endX"] && pointerObj["startY"] >= pointerObj["endY"]) {
                    point = [
                        {x: pointerObj["endX"] + width, y: pointerObj["endY"]},
                        {x: pointerObj["startX"] - width, y: pointerObj["endY"]},
                        {x: pointerObj["startX"], y: pointerObj["endY"] + height},
                        {x: pointerObj["startX"], y: pointerObj["startY"] - height},
                        {x: pointerObj["startX"] - width, y: pointerObj["startY"]},
                        {x: pointerObj["endX"] + width, y: pointerObj["startY"]},
                        {x: pointerObj["endX"], y: pointerObj["startY"] - height}, //7
                        {x: pointerObj["endX"], y: pointerObj["endY"] + height},
                    ];
                }

                octagon = new fabric.Polygon(point, {
                    width: Math.abs(pointerObj["startX"] - pointerObj["endX"]),
                    height: Math.abs(pointerObj["startY"] - pointerObj["endY"]),
                    fill: '#A6A6A6',
                    shapeType: 'octagon',
                    class:'polygon',
                })

                canvas.add(octagon);
                canvas.remove(canvas.getActiveObject());
                canvas.setActiveObject(octagon);

                canvas.renderAll();
            }
        });

        canvas.on("mouse:up", () => {
            //
            // setSessionStorage(octagon);
            reset(draw, octagon);
        });

    },

    // 별 (오각별 + 십각별)
    //TODO 다른 방향으로 그릴 때 잡기
    createStar: (id) => {
        let star;
        let draw = false;
        let pointerObj = new Object();
        let point = [];
        reset(draw, star);
        let cnt = (id === "basicStar" ? 5 : 10);

        canvas.on("mouse:down", (obj) => {
            draw = true;
            let pointer = canvas.getPointer(obj.e);
            pointerObj["startX"] = pointer.x;
            pointerObj["startY"] = pointer.y;

            star = new fabric.Polygon(point, {
                left: pointerObj["startX"],
                top: pointerObj["startY"],
                fill: '#A6A6A6',
                shapeType: 'star',
                class:'polygon',
            })
            canvas.add(star)
        });

        canvas.on("mouse:move", (obj) => {
            canvas.setCursor("crosshair");
            if (draw) {
                canvas.selection = false;
                let pointer = canvas.getPointer(obj.e);

                pointerObj["endX"] = pointer.x;
                pointerObj["endY"] = pointer.y;

                let innerRadius = (Math.abs(pointerObj["startX"] - pointerObj["endX"])) / 2;
                let outerRadius = Math.abs(pointerObj["startX"] - pointerObj["endX"]);
                let center = Math.max(innerRadius, outerRadius);
                let angle = Math.PI / cnt;

                point = [];

                //오른쪽 대각선으로 드래그 했을떄
                if (pointerObj["startX"] <= pointerObj["endX"] && pointerObj["startY"] <= pointerObj["endY"]) {
                    for (let i = 0 ; i < cnt * 2 ; i++) {
                        let radius = i & 1 ? innerRadius : outerRadius;
                        let obj = {
                            x: (center + radius * Math.sin(i * angle)) / 2,
                            y: (center - radius * Math.cos(i * angle)) / 2
                        }
                        point.push(obj);
                    }
                }

                //오른쪽에서 왼쪽으로 그릴때
/*                if (pointerObj["startX"] >= pointerObj["endX"] && pointerObj["startY"] <= pointerObj["endY"]) {
                    console.log('a')
                    for (let i = 0 ; i < cnt * 2 ; i++) {
                        let radius = i & 1 ? innerRadius : outerRadius;
                        let obj = {
                            x: (center - radius * Math.sin(i * angle)) / 2,
                            y: (center + radius * Math.cos(i * angle)) / 2
                        }
                        point.push(obj);
                    }
                }*/


                star = new fabric.Polygon(point, {
                    left: pointerObj["startX"],
                    top: pointerObj["startY"],
                    width: Math.abs(pointerObj["startX"] - pointerObj["endX"]),
                    height: Math.abs(pointerObj["startY"] - pointerObj["endY"]),
                    fill: '#A6A6A6',
                    shapeType: 'star',
                    class:'polygon',
                })

                canvas.add(star);
                canvas.remove(canvas.getActiveObject());
                canvas.setActiveObject(star);

                canvas.renderAll();
            }
        });

        canvas.on("mouse:up", () => {
            //setSessionStorage(star);
            reset(draw, star);
        });

    },

    // 사각 말풍선
    createSquareBubble: () => {
        let textBox;
        let rect;
        let tail1;
        let tail2;
        let handle;
        let msg = "dd";
        let draw = false;
        let pointerObj = new Object();
        let point;
        let point2;
        let handleStrokeWidth = 0.5;
        let bubbleGroup;

        canvas.on("mouse:down", (obj) => {
            draw = true;
            let pointer = canvas.getPointer(obj.e);
            pointerObj["startX"] = pointer.x;
            pointerObj["startY"] = pointer.y;
        });

        canvas.on("mouse:move", (obj) => {
            canvas.setCursor("crosshair");
            if (draw) {
                canvas.selection = false;
                let pointer = canvas.getPointer(obj.e);

                pointerObj["endX"] = pointer.x;
                pointerObj["endY"] = pointer.y;

                let height = Math.abs(pointerObj["startY"] - pointerObj["endY"]) * 30 / 100;

                /////////////// s: textBox ///////////////////
                canvas.remove(textBox);

                let boxPadding = Math.abs(pointerObj["startX"] - pointerObj["endX"]) * 10 / 100;

                textBox = new fabric.IText(msg, {
                    left: pointerObj["startX"] + boxPadding/2,
                    top: pointerObj["startY"] + boxPadding/2,
                    fontSize: 18,
                    fill: 'black',
                    groupId: 'group-1',
                    textAlign: 'center',
                    hasControls: false,
                    shapeType: 'bubbleTextBox',
                    class:'group',
                });

                canvas.add(textBox);

                textBox.width = Math.abs(pointerObj["endX"] - pointerObj["startX"]) - boxPadding;
                textBox.height = Math.abs(pointerObj["endY"] - pointerObj["startY"]) - boxPadding - height;

                textBox.lastLeft = textBox.left;
                textBox.lastTop = textBox.top;

                textBox.setCoords();
                /////////////// e: textBox ///////////////////

                /////////////// s: handle ///////////////////
                canvas.remove(handle);

                handle = new fabric.Ellipse({
                    left: textBox.left + 30,
                    top: pointerObj["endY"],
                    rx: 6,
                    ry: 6,
                    fill: 'yellow',
                    hasRotatingPoint: false,
                    hasControls: false,
                    stroke: 'black',
                    strokeWidth: handleStrokeWidth,
                    shapeType: "handle",
                    groupId: 'group-1',
                    originX: 'center',
                    originY: 'center',
                    class:'group',
                })

                canvas.add(handle);

                // handle.left = textBox.left + 30;
                // handle.top = textBox.top + textBox.height ;

/*                if (textBox.left !== textBox.lastLeft || textBox.top !== textBox.lastTop) {
                    handle.left += (textBox.left - textBox.lastLeft);
                    handle.top += (textBox.top - textBox.lastTop);
                    handle.setCoords();
                }*/

                /////////////// e: handle ///////////////////

                /////////////// s: rect ///////////////////
                rect = new fabric.Rect({
                    left: textBox.left - boxPadding/2,
                    top: textBox.top - boxPadding/2,
                    fill: 'white',
                    stroke: 'black',
                    strokeWidth: 3,
                    width: textBox.width + boxPadding,
                    height: (textBox.height + boxPadding),
                    groupId: 'group-1',
                    class:'group',
                });
                /////////////// e: rect ///////////////////

                /////////////// s: tail ///////////////////
                let angleRadians = Math.atan2(handle.top - textBox.top, handle.left - textBox.left);
                let halfPi = Math.PI / 2;
                let offsetX = Math.cos(angleRadians + halfPi);
                let offsetY = Math.sin(angleRadians + halfPi);
                let arrowWidth = Math.abs(pointerObj["startX"] - pointerObj["endX"]) * 10 / 100;

                point = [
                    {x: (handle.left), y: (handle.top)},
                    {x: textBox.left + (textBox.width/2 + boxPadding/2) - (offsetX * arrowWidth), y: textBox.top - (offsetY * arrowWidth) + boxPadding/2},
                    {x: textBox.left + (textBox.width/2 + boxPadding/2) + (offsetX * arrowWidth), y: textBox.top + (offsetY * arrowWidth) + boxPadding/2},
                ];

                tail1 = new fabric.Polygon(point, {
                    fill: 'white',
                    stroke: 'black',
                    strokeWidth: 3,
                    groupId: 'group-1',
                    class:'group',
                });

                point2 = [
                    {x: (handle.left), y: (handle.top)},
                    {x: textBox.left + (textBox.width/2 + boxPadding/2) - offsetX * (arrowWidth - 1.5), y: textBox.top - offsetY * (arrowWidth - 1.5) + boxPadding/2},
                    {x: textBox.left + (textBox.width/2 + boxPadding/2) + offsetX * (arrowWidth - 1.5), y: textBox.top + offsetY * (arrowWidth - 1.5) + boxPadding/2},
                ];

                tail2 = new fabric.Polygon(point2, {
                    fill: 'white',
                    groupId: 'group-1',
                    class:'group',
                });

                /////////////// e: tail ///////////////////

                /////////////// s: bubbleGroup ///////////////////
                canvas.remove(bubbleGroup);

                bubbleGroup = new fabric.Group([tail1, rect, tail2], {
                    canvas: canvas,
                    groupId: 'group-1',
                    shapeType: 'bubble',
                    class:'group',
                });

                canvas.add(bubbleGroup);

                /////////////// e: bubbleGroup ///////////////////

                textBox.bringToFront();
                handle.bringToFront();

/*                let allGroup = new fabric.Group([bubbleGroup, handle, textBox], {
                    left: pointerObj['startX'],
                    top: pointerObj['startY'],
                    canvas: canvas,
                    groupId: 'group-1',
                    customType: 'squareBubble',
                });*/

                // canvas.add(allGroup);
                // canvas.setActiveObject(allGroup);

                canvas.renderAll();

                canvas.selection = true;
            }
        });

        canvas.on("mouse:up", () => {
            draw = false;
            canvas.selection = true;
            rect = null;
            textBox = null;
            tail1 = null;
            tail2 = null;
            handle = null;
            reset(draw, rect, textBox, tail1, tail2, handle);

            // itemUnGrouping >> bubbleGroup, textBox, handle
            // canvas.getActiveObject().toActiveSelection();
        });

/*
        canvas.on('object:moving', (targetObj) => { // 언그룹
        });
*/

/*        canvas.on("object:modified", (targetObj) => {
        });*/

    },
    mathExpression: () => {
        $(".dialog-math")
            .dialog("open");

        // let text = "1+\\int_x^y e^x dx + \\ldots";
        // let text = "극한" +  "\\\lim_{x\\rightarrow a}f(x)=L" + "로부터" + "\\\lim_{x\\rightarrow a}(3f(x))=3L\" +을 얻는다.";
        // tex(text, function(svg, width, height) {
        //     // Here you have a data url for a svg file
        //     // Draw using FabricJS:
        //     fabric.Image.fromURL(svg, function(img) {
        //         img.height = height;
        //         img.width = width;
        //         canvas.add(img);
        //     });
        // });
    },

    renderMedia: async (file) => {
        if (typeof file === 'string') {
            renderYoutube(file)
        } else {
            if (file) {
                let filePath = await saveFile(file)

                let reader = new FileReader();
                reader.onload = function (event) {
                    if (file.type.includes('video')) {
                        let dataUrl =  reader.result;
                        let videoId = "videoMain";
                        let $videoEl = $('<video id="' + videoId + '"></video>');
                        let $source = $('<source src="' + dataUrl +'" type="video/mp4">')
                        $videoEl.append($source)
                        // $("body").append($videoEl);
                        // $videoEl.hide();

                        let videoTagRef = $videoEl[0];
                        videoTagRef.addEventListener('loadedmetadata', function(e){
                            renderVideo(file, videoTagRef.videoWidth, videoTagRef.videoHeight)
                        });
                        $videoEl.remove()
                    } else if (file.type.includes('image')) {
                        renderImage(event)
                    }
                }
                reader.readAsDataURL(file);
                $(".filter-box").show()
                $(".file-box").hide()
            } else {
                $(".filter-box").hide()
                $(".file-box").hide()
            }
        }
    },

    createCylinder: () => {
        let ellipse1;
        let ellipse2;
        let line1;
        let line2;
        let rect;
        let draw = false;
        let pointerObj = new Object();
        reset(draw, ellipse1);



        canvas.on("mouse:down", (obj) => {
            draw = true;
            let pointer = canvas.getPointer(obj.e);
            pointerObj["startX"] = pointer.x;
            pointerObj["startY"] = pointer.y;
            ellipse1 = new fabric.Ellipse({
                left: pointerObj["startX"],
                top: pointerObj["startY"],
                rx: 0,
                ry: 0,
                stroke: "black",
                fill: "white",
                shapeType: 'Ellipse',
                class : 'polygon',
                strokeWidth : 2,

            });


            ellipse2 = new fabric.Ellipse({
                left: pointerObj["startX"],
                top: pointerObj["startY"],
                rx: 0,
                ry: 0,
                stroke: "black",
                fill: "white",
                shapeType: 'Ellipse',
                class : 'polygon',
                strokeWidth : 2,
            })

            rect = new fabric.Rect({
                left: pointerObj["startX"],
                top: pointerObj["startY"],
                width: 0,
                height: 0,
                fill: "white",
                stroke: "black",
                shapeType: 'rect',
                class : 'polygon',
                strokeWidth: 2
            })

            line1 = new fabric.Line([pointerObj["startX"], pointerObj["startY"], pointerObj["startX"], pointerObj["startY"]], {
                stroke: 'black',
                strokeWidth: 2,
                originX: 'center',
                originY: 'center',
                shapeType: 'line',
                class : 'line',
            });

            line2 = new fabric.Line([pointerObj["startX"], pointerObj["startY"], pointerObj["startX"], pointerObj["startY"]], {
                stroke: 'black',
                strokeWidth: 2,
                originX: 'center',
                originY: 'center',
                shapeType: 'line',
                class : 'line',
            });

            canvas.add(rect)
            canvas.add(ellipse1);
            canvas.add(ellipse2);


        });

        canvas.on("mouse:move", (obj) => {
            canvas.setCursor("crosshair");
            if (draw) {
                canvas.selection = false;
                let pointer = canvas.getPointer(obj.e);
                pointerObj["endX"] = pointer.x;
                pointerObj["endY"] = pointer.y;

                if (pointerObj["startX"] > pointerObj["endX"]) {
                    ellipse1.set({left: Math.abs(pointerObj["endX"])});
                    ellipse2.set({left: Math.abs(pointerObj["endX"])});
                }
                if (pointerObj["startY"] > pointerObj["endY"]) {
                    ellipse1.set({top: Math.abs(pointerObj["endY"])});
                    ellipse2.set({top: Math.abs(pointerObj["endY"])});
                }

                ellipse1.set({
                    rx: Math.abs(pointerObj["startX"] - pointerObj["endX"]) / 2 + Math.abs(pointerObj["startX"] - pointerObj["endX"]) / 2 ,
                    ry: Math.abs(pointerObj["startY"] - pointerObj["endY"]) / 2 - 50  ,
                    top: pointerObj["startY"]
                });

                ellipse2.set({
                    rx: Math.abs(pointerObj["startX"] - pointerObj["endX"]) / 2 + Math.abs(pointerObj["startX"] - pointerObj["endX"]) / 2,
                    ry: Math.abs(pointerObj["startY"] - pointerObj["endY"]) / 2 - 50,
                    top: pointerObj["endY"]
                })


                rect.set({
                    left: ellipse1.left,
                    top: ellipse1.top + ellipse1.ry,
                    width: ellipse1.rx * 2,
                    height: ellipse2.top - ellipse1.top
                })


                canvas.setActiveObject(ellipse1);
                canvas.setActiveObject(ellipse2);
                canvas.setActiveObject(rect)

                canvas.renderAll();
            }

        });

        canvas.on("mouse:up", () => {
            let group = new fabric.Group([rect, ellipse1, ellipse2 ], {
                canvas: canvas,
                fill: "red",
                shapeType: 'cylinder',
                class:'group',
            })
            canvas.add(group);
            canvas.remove(ellipse1);
            canvas.remove(ellipse2);
            canvas.remove(rect);

            reset(draw, ellipse1, ellipse2, rect);
        })


    },

    createCone: () => {
        let elipse;
        let triangle
        let draw = false;
        let pointerObj = new Object();
        reset(draw, elipse);

        canvas.on("mouse:down", (obj) => {
            draw = true;
            let pointer = canvas.getPointer(obj.e);
            pointerObj["startX"] = pointer.x;
            pointerObj["startY"] = pointer.y;
            elipse = new fabric.Ellipse({
                left: pointerObj["startX"],
                top: pointerObj["startY"],
                rx: 0,
                ry: 0,
                stroke: "black",
                fill: "white",
                shapeType: 'ellipse',
                class : 'polygon',
                strokeWidth : 2,

            });

            triangle = new fabric.Triangle({
                left: pointerObj["startX"],
                top: pointerObj["startY"],
                fill: 'white',
                width: 0,
                height: 0,
                stroke: "black",
                shapeType: 'triangle',
                class : 'polygon',
                strokeWidth : 2,
            });

            canvas.add(triangle)
            canvas.add(elipse);


        });

        canvas.on("mouse:move", (obj) => {
            canvas.setCursor("crosshair");
            if (draw) {
                canvas.selection = false;
                let pointer = canvas.getPointer(obj.e);
                pointerObj["endX"] = pointer.x;
                pointerObj["endY"] = pointer.y;

                if (pointerObj["startX"] > pointerObj["endX"]) {
                    elipse.set({left: Math.abs(pointerObj["endX"])});
                }
                if (pointerObj["startY"] > pointerObj["endY"]) {
                    elipse.set({top: Math.abs(pointerObj["endY"])});
                }

                elipse.set({
                    rx: Math.abs(pointerObj["startX"] - pointerObj["endX"]) / 2 + Math.abs(pointerObj["startY"] - pointerObj["endY"]),
                    ry: Math.abs(pointerObj["startY"] - pointerObj["endY"]) / 2,
                });


                triangle.set({
                    left: elipse.left,
                    top: elipse.top + elipse.ry - triangle.height + 2,
                    width: elipse.rx * 2,
                    height: elipse.rx * 2.5,
                });

                canvas.setActiveObject(triangle)
                canvas.setActiveObject(elipse);
                canvas.renderAll();
            }

        });

        canvas.on("mouse:up", () => {
            let group = new fabric.Group([triangle, elipse], {
                canvas: canvas,
                fill: "red",
                shapeType: 'cone',
                class:'group',
            })
            canvas.add(group);
            canvas.remove(elipse);
            canvas.remove(triangle);
            canvas.renderAll();

            reset(draw, elipse, triangle);
        })


    },

    createPyramid: () => {
        let triangle1;
        let poly1;
        let poly2;
        let draw = false;
        let pointerObj = new Object();
        reset(draw, triangle1);

        canvas.on("mouse:down", (obj) => {
            draw = true;
            let pointer = canvas.getPointer(obj.e);
            pointerObj["startX"] = pointer.x;
            pointerObj["startY"] = pointer.y;

            triangle1 = new fabric.Triangle({
                left: pointerObj["startX"],
                top: pointerObj["startY"],
                fill: 'white',
                width: 0,
                height: 0,
                shapeType: 'triangle',
                class : 'polygon',
                stroke: "black",
                strokeWidth : 2,
            });


            canvas.add(triangle1);
        });

        canvas.on("mouse:move", (obj) => {
            canvas.setCursor("crosshair");
            if (draw) {
                canvas.selection = false;
                let pointer = canvas.getPointer(obj.e);
                pointerObj["endX"] = pointer.x;
                pointerObj["endY"] = pointer.y;


                triangle1.set({
                    width: Math.abs(pointerObj["startX"] - pointerObj["endX"]),
                    height: Math.abs(pointerObj["startY"] - pointerObj["endY"]),
                });



                canvas.remove(poly1)

                let point = [
                    {x: triangle1.left, y: triangle1.top + triangle1.height},
                    {x: triangle1.left + triangle1.width / 2, y: triangle1.top },
                    {x: triangle1.left + triangle1.width - triangle1.width / 2, y: triangle1.top + triangle1.height - 40}
                ]


                poly1 = new fabric.Polygon(point, {
                    width: Math.abs(pointerObj["startX"] - pointerObj["endX"]),
                    height: Math.abs(pointerObj["startY"] - pointerObj["endY"]),
                    fill: "white",
                    stroke: "black",
                    strokeWidth: 2,
                    shapeType: 'polygon',
                    class : 'polygon',
                });

                canvas.add(poly1)
                canvas.remove(poly2)

                let point2 = [
                    {x: triangle1.left + triangle1.width, y: triangle1.top + triangle1.height},
                    {x: triangle1.left + triangle1.width / 2, y: triangle1.top },
                    {x: triangle1.left + triangle1.width - triangle1.width / 2, y: triangle1.top + triangle1.height - 40}
                ]

                poly2 = new fabric.Polygon(point2, {
                    width: Math.abs(pointerObj["startX"] - pointerObj["endX"]),
                    height: Math.abs(pointerObj["startY"] - pointerObj["endY"]),
                    fill: "white",
                    stroke: "black",
                    strokeWidth: 2,
                    shapeType: 'polygon',
                    class : 'polygon',
                });
                canvas.add(poly2)
                canvas.requestRenderAll();

            }
        });

        canvas.on("mouse:up", () => {
            //setSessionStorage(triangle);
            let group = new fabric.Group([triangle1, poly1, poly2 ], {
                canvas: canvas,
                shapeType: 'pyramid',
                class:'group',
            })
            canvas.add(group);
            canvas.remove(triangle1);
            canvas.remove(poly1);
            canvas.remove(poly2);

            reset(draw, triangle1);
            reset(draw, poly1);
            reset(draw, poly2)
        })


    },


}

function getMathText(){
    // let text = "1+\\int_x^y e^x dx + \\ldots";
    // let text = "극한" +  "\\\lim_{x\\rightarrow a}f(x)=L" + "로부터" + "\\\lim_{x\\rightarrow a}(3f(x))=3L\" +을 얻는다.";
    let text = document.getElementById('mathText').value;
    tex(text, function(svg, width, height) {
        // Here you have a data url for a svg file
        // Draw using FabricJS:
        fabric.Image.fromURL(svg, function(img) {
            img.height = height;
            img.width = width;
            img.class = 'math';
            img.customContents = text;
            canvas.add(img);
        });
    });
}

function setSessionStorage(element) {
    if(element) {
        sessionStorage.setItem("primaryIdIndex", sessionStorage.getItem("primaryIdIndex") == null ? "0" : String(parseInt(sessionStorage.getItem("primaryIdIndex")) + 1));
    }
}


// 선에 대한 각도당 화살포 angle 계산
function calcArrowAngle(x1, y1, x2, y2) {
    let angle = 0;
    let x;
    let y;

    x = x2 - x1;
    y = y2- y1;

    if (x === 0) {
        angle = (y === 0) ? 0 : (y > 0) ? Math.PI / 2 : Math.PI * 3 / 2;
    } else if (y === 0) {
        angle = (x > 0) ? 0 : Math.PI;
    } else {
        angle = (x < 0) ? Math.atan(y / x) + Math.PI : (y < 0) ? Math.atan(y / x) + (2 * Math.PI) : Math.atan(y / x);
    }

    return (angle * 180 / Math.PI + 90);

}

let downloadFont;



let objectStyle = {

    selectTextStyle: (fontStyle) => {
        let object = canvas.getActiveObject();
        if (object) {
            if (fontStyle === 'bold') {
                if (object.get("fontStyle") === "bold") {
                    object.set("fontStyle", "");
                } else {
                    object.set("fontStyle", fontStyle);
                }
            } else if (fontStyle === 'italic') {
                if (object.get("fontStyle") === "italic") {
                    object.set("fontStyle", "");
                } else {
                    object.set("fontStyle", fontStyle);
                }
            } else if (fontStyle === 'underline') {
                if (object.get("underline") === true) {
                    object.set("underline", false);
                } else {
                    object.set("underline", true);
                }
                object.set("overline", false);
                object.set("linethrough", false);
            } else if (fontStyle === 'linethrough') {
                if (object.get("linethrough") === true) {
                    object.set("linethrough", false);
                } else {
                    object.set("linethrough", true);
                }
                object.set("underline", false);
                object.set("overline", false);

            } else if (fontStyle === 'overline') {
                if (object.get("overline") === true) {
                    object.set("overline", false);
                } else {
                    object.set("overline", true);
                }
                object.set("underline", false);
                object.set("linethrough", false);
            } else if (fontStyle === 'cancelFontStyle') {
                object.set("overline", false);
                object.set("underline", false);
                object.set("linethrough", false);
                object.set("fontStyle", "");
            }

        }
        canvas.requestRenderAll();

    },
    applyFontSize: (displayValue, idValue) => {

        document.getElementById('displayValue').value=displayValue;
        document.getElementById('idValue').value=idValue;
        let object = canvas.getActiveObject();
        if(object){
            object.set("fontSize", displayValue);
        }
        canvas.requestRenderAll();

    },
    applyCharSpacing: (charSpacingValue) => {
        document.getElementById('charSpacingValue').value = charSpacingValue;
        let object = canvas.getActiveObject();
        if(object.get('class') === 'text'){
            object.set('charSpacing', charSpacingValue)

        }
        canvas.requestRenderAll();

    },
    selectStrokeStyle:(strokeStyle) => {

        switch (strokeStyle) {

            case "straight" :

                canvas.getActiveObjects().forEach(function (object) {
                    object.set("strokeWidth", 1);
                    object.set("strokeDashArray", "");
                    object.set("strokeUniform", true);

                }, this);
                canvas.requestRenderAll();
                break;



            case "wavy":

                canvas.getActiveObjects().forEach(function (object) {


                }, this);
                canvas.requestRenderAll();
                break;


            case "long-dashed" :

                canvas.getActiveObjects().forEach(function (object) {
                    object.set("strokeWidth", 1);
                    object.set("strokeDashArray", [8,5]);
                    object.set("strokeUniform", true);

                }, this);
                canvas.requestRenderAll();
                break;

            case "short-dashed" :

                canvas.getActiveObjects().forEach(function (object) {
                    object.set("strokeWidth", 1);
                    object.set("strokeDashArray", [5,5]);
                    object.set("strokeUniform", true);
                }, this);
                canvas.requestRenderAll();
                break;

            case "long-dotted" :

                canvas.getActiveObjects().forEach(function (object) {
                    object.set("strokeWidth", 1);
                    object.set("strokeDashArray", [3,7]);
                    object.set("strokeUniform", true);
                }, this);
                canvas.requestRenderAll();
                break;

            case "short-dotted" :

                canvas.getActiveObjects().forEach(function (object) {
                    object.set("strokeWidth", 1);
                    object.set("strokeDashArray", [1,8]);
                    object.set("strokeUniform", true);
                }, this);
                canvas.requestRenderAll();
                break;

        }

    },
    selectColor : (className) => {

        let colorPicker = $('.' + className);

        colorPicker.spectrum({
            allowEmpty: true
            , showInitial: true
            , showInput: true
            , showButtons: true
            , showSelectionPalette: true
            , palette: [ ]
            , preferredFormat: "hex"
            , chooseText: "선택"
            , cancelText: "취소"
            , move: function (color) {
                if (color) {
                    switch (className) {
                        //도형 채우기
                        case "fill-color-picker" :
                            let fillColor = color.toRgbString();
                            canvas.getActiveObjects().forEach(function (object) {

                                if (object.get('class') === 'polygon') {
                                    object.set("fill", fillColor);
                                }

                            }, this);
                            canvas.requestRenderAll();
                            break;


                        // 도형 윤곽선
                        case "stroke-color-picker":
                            let strokeColor = color.toRgbString();
                            canvas.getActiveObjects().forEach(function (object) {
                                if (object.get('class') === 'polygon') {
                                    object.set("stroke", strokeColor);
                                }　else if (object.get('class') === 'line'){
                                    object.set("stroke", strokeColor);
                                }
                                canvas.requestRenderAll();
                            }, this);
                            break;

                        //도형 배경색
                        case "background-color-picker" :
                            let backgroundColor = color.toRgbString();
                            canvas.getActiveObjects().forEach(function (object) {
                                if (object.get('class') === 'polygon') {
                                    object.set("backgroundColor", backgroundColor);
                                }
                                canvas.requestRenderAll();
                            }, this);
                            break;

                        //글자 색상
                        case "font-color-picker" :
                            let fontColor = color.toRgbString();

                            canvas.getActiveObjects().forEach(function (object) {
                                if (object.get("class") === "text") {
                                    object.set("fill", fontColor);
                                }
                                canvas.requestRenderAll();
                            }, this);
                            break;


                    }
                }

            }

        });

    },
    applyStrokeWidth : (value) => {
        console.log(value);

        canvas.getActiveObjects().forEach(function (object) {
            const classType = object.get("class");
            if (classType === 'polygon') {
                object.set('noScaleCache', true);
                object.set("strokeWidth", parseInt(value));
                object.set("strokeUniform", true);
                object.setCoords();
            }

        }, this);
        canvas.requestRenderAll();
    },
    applyFontStyle : (fontStyle) => {
        let object = canvas.getActiveObject();
        if(object && downloadFont === 'success'){
            object.set("fontFamily", fontStyle);

        }

        canvas.requestRenderAll();
    },
    applyLineHeight: (lineHeightValue) => {
        document.getElementById('lineHeightValue').value = lineHeightValue;
        let object = canvas.getActiveObject();
        if(object.get('class') === 'text'){
            object.set('lineHeight', lineHeightValue)
        }
        canvas.requestRenderAll();
    },

    applyTextAlign : (selectedOption)=>{
        let object = canvas.getActiveObject();
        if(object.get('class') === 'text'){
            const test = object.get('fontSize');
            object.set('textAlign', selectedOption);

        }
        canvas.requestRenderAll();


    },

};


var strokeDot = getDashedArray('object' , 100, 100, ['top','right','bottom','left'], [2,7])

function getDashedArray(object, width, height, position, aList){
    var plist=['top','right','bottom','left'];
    var llist=[width,height,width,height];
    var llen=aList.length;
    var flist = [];
    var tlen=0;
    for(var i=0;i<4;i++){
        if(position.indexOf(plist[i])>=0){ //점선 적용
            tlen=llist[i];
            var c=0;
            var d=0;
            if(flist.length%2===1){
                flist.push(0);
            }
            for(var j=0;j<tlen;j){
                d=aList[c];
                j+=d;
                if(j>tlen){
                    var t=j-tlen;
                    d-=t;
                    flist.push(d);
                    break;
                }
                else
                    flist.push(d);
                c++;
                if(c>=llen)c=0;
            }
        }
        else{ //실선
            if(flist.length%2===0){
                flist.push(llist[i]);
            }
            else{
                flist.push(0);
                flist.push(llist[i]);
            }
        }
    }
    return flist;
}


function createDialog() {
    //테이블 생성 dialog
    $(".dialog-table").dialog({

        autoOpen: false,
        dialogClass: "basic-type dialog-grid-a",
        width: 500,
        height: 200,
        modal: true,
        resizable: false,
        open: function () {

        },
        buttons: [
            {
                text: "완료",
                click: function (e) {
                    const rowVal = $('#row').val();
                    const columnVal = $('#column').val();
                    appendTable(rowVal, columnVal);
                }
            }
        ],
        close: function (event, ui) {
            $(this).dialog("close");
        }
    });


    $(".dialog-math").dialog({

        autoOpen: false,
        dialogClass: "basic-type dialog-grid-a",
        width: 500,
        height: 200,
        modal: true,
        resizable: false,
        open: function () {
            document.getElementById('mathText').value = "";
            const output = document.getElementById('showMath');
            output.innerHTML = "";
        },
        buttons: [
            {
                text: "완료",
                click: function (e) {
                    getMathText();
                    document.getElementById('mathText').value = "";
                    document.getElementById('showMath').innerHTML = "";
                }
            }
        ],
        close: function (event, ui) {
            $(this).dialog("close");
        }
    });

    $(".dialog-root").dialog({

        autoOpen: false,
        dialogClass: "basic-type dialog-grid-a",
        width: 500,
        height: 200,
        modal: true,
        resizable: false,
        open: function () {

        },
        buttons: [
            {
                text: "완료",
                click: function (e) {
                    const rootNumValue = $('#rootNumValue').val();
                    const rootText = '\\sqrt{A}';
                    //TODO 함수 중복됨 나중에 하나로 합칠 수 있는법 찾기
                    const getSymbolDataValue = rootText.replace(/A/, rootNumValue);
                    const input = document.getElementById('mathText');
                    input.value = input.value + getSymbolDataValue;

                    const output = document.getElementById('showMath');
                    // output.innerText = output.innerText +  getSymbolDataValue;
                    output.innerHTML = '$$' + output.innerText +  `\ ` + getSymbolDataValue + '$$';
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub]); //mathjax 미리보기
                }
            }
        ],
        close: function (event, ui) {
            $(this).dialog("close");
        }
    });
}

function showStyleDiv(target){

    if (target) {
        const classType = target.class;
        if (classType === 'polygon' || classType === 'line') {
            let strokeWidthRange = document.getElementById('strokeWidth');
            strokeWidthRange.value = target.get('strokeWidth');
            $('#figureOptions').show();
            $('#textOptions').hide();
        } else if (classType === 'text') {
            $('#figureOptions').hide();
            $('#textOptions').show();
            $('#displayValue').val(target.get('fontSize'));
        } else if (classType === 'table') {

        }
    } else {
        let strokeWidthRange = document.getElementById('strokeWidth');
        strokeWidthRange.value = 1;
        $('#figureOptions').hide();
        $('#textOptions').hide();
    }

}

function applyStyle(){
    state = JSON.stringify(canvas.toDatalessJSON(['shapeType', 'class', 'customContents']));
    saveObject();

    let slideClassList = document.querySelectorAll('.style-option');
    slideClassList.forEach((element) => {
        element.classList.remove("active")
    })
    this.classList.add("active");
    let style = this.dataset.style;


    switch (style){
        case "fill-color-picker":
            objectStyle.selectColor('fill-color-picker');
            break;
        case "stroke-color-picker":
            objectStyle.selectColor('stroke-color-picker');
            break;
        case "background-color-picker":
            objectStyle.selectColor('background-color-picker');
            break;
        case "straight":
            objectStyle.selectStrokeStyle('straight');
            break;
        case "wavy":
            objectStyle.selectStrokeStyle('wavy')
            break;
        case "long-dashed":
            objectStyle.selectStrokeStyle('long-dashed')
            break;
        case "short-dashed":
            objectStyle.selectStrokeStyle('short-dashed')
            break;
        case "long-dotted":
            objectStyle.selectStrokeStyle('long-dotted')
            break;
        case "short-dotted":
            objectStyle.selectStrokeStyle('short-dotted')
            break;
        case "font-color-picker":
            objectStyle.selectColor('font-color-picker');
            break;
        case "bold":
            objectStyle.selectTextStyle('bold')
            break;
        case "italic":
            objectStyle.selectTextStyle('italic')
            break;
        case "linethrough":
            objectStyle.selectTextStyle('linethrough')
            break;
        case "underline":
            objectStyle.selectTextStyle('underline')
            break;
        case "overline":
            objectStyle.selectTextStyle('overline')
            break;
        case "cancelFontStyle":
            objectStyle.selectTextStyle('cancelFontStyle')
            break;
        case "textAlign":
            objectStyle.selectTextStyle('textAlign')
            break;
    }

}

let tableWidth;
let tableHeight;
let rect;
let tableCount = 0;
function positionTable(obj, tableId) {

    var absCoords = canvas.getAbsoluteCoords(obj);
    var newTable = document.getElementById(tableId);

    tableWidth = $(newTable)[0].offsetWidth;
    tableHeight = $(newTable)[0].offsetHeight;

    newTable.style.left = (absCoords.left - tableWidth / 2) + 'px';
    newTable.style.top = (absCoords.top - tableHeight / 2) + 'px';
}

function appendTable(rowVal, columnVal) {
    var html = '';
    html += '<div id="table-' + tableCount + '" style="position: absolute; left: 350px; top: 300px;" contenteditable>'
    html += '<table>';

    for (var i = 0; i < parseInt(rowVal); i++) {
        html += '<tr>';

        for (var j = 0; j < parseInt(columnVal); j++) {
            if (i === 0) {
                html += '<th class="editable">test</th>';
            } else {
                html += '<td class="editable">test</td>';
            }
        }
        html += '</tr>';
    }

    html += '</table>';
    html += '</div>'

    $('#tables').append(html);
    getTableBound('table-' + tableCount);
    tableCount++;

}

function getTableBound(tableId) {

    var newTable = document.getElementById(tableId);

    rect = new fabric.Rect({
        left: 350,
        top: 300,
        width: $(newTable)[0].offsetWidth + 20,
        height: $(newTable)[0].offsetHeight + 20,
        fill: 'transparent',
        class: 'table',
        customContents: $(newTable)[0].outerHTML,
        customId: tableId,
        borderColor: 'red',
        originY : 'center',
        originX : 'center',
    });
    // rect.toObject = function() {
    //     return {
    //         rect : rect,
    //         customType: 'table',
    //         contents: $(newTable)[0].innerHTML
    //     }
    // }

    canvas.add(rect);
    canvas.renderAll();
    canvas.toJSON(['shapeType', 'class', 'customContents', 'customId']);

    // rect.on('moving', function (){
    //     positionTable(rect)
    // });
    // rect.on('scaling', function (){
    //     positionTable(rect);
    // });
    canvas.setActiveObject(rect);
    positionTable(rect, tableId);
    //TODO 그룹화/ 테이블도 undo로 지워야함


}


function scaleTable(object, event){
    //table 크기 조절 scaling

    var newWidth = object.width * object.scaleX;
    var newHeight = object.height * object.scaleY;
    // if(newWidth > event.pointer){
    //TODO object bounding 상자가 table width보다 작어지면 안됨.....


    var tableId = object.customId;
    var targetTableDiv = document.getElementById(tableId);
    const targetTable = $(targetTableDiv).find('table')[0];
    targetTable.width = newWidth - 30;
    targetTable.height = newHeight - 30;
    // }
    //바뀐 테이블 크기로 저장
    object.customContents = $(targetTableDiv)[0].outerHTML;
}

function tex(text, callback) {
    // Create a script element with the LaTeX code
    var div = document.createElement("div");
    div.style.position = "absolute";
    div.style.left = "-1000px";
    document.body.appendChild(div);
    var se = document.createElement("script");
    se.setAttribute("type", "math/tex");
    se.innerHTML = text;
    div.appendChild(se);
    MathJax.Hub.Process(se, function() {
        // When processing is done, remove from the DOM
        // Wait some time before doing tht because MathJax calls this function before
        // actually displaying the output
        var display = function() {
            // Get the frame where the current Math is displayed
            var frame = document.getElementById(se.id + "-Frame");
            if(!frame) {
                setTimeout(display, 500);
                return;
            }

            // Load the SVG
            var svg = frame.getElementsByTagName("svg")[0];
            svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            svg.setAttribute("version", "1.1");
            var height = svg.parentNode.offsetHeight;
            var width = svg.parentNode.offsetWidth;
            svg.setAttribute("height", height);
            svg.setAttribute("width", width);
            svg.removeAttribute("style");

            // Embed the global MathJAX elements to it
            var mathJaxGlobal = document.getElementById("MathJax_SVG_glyphs");
            svg.appendChild(mathJaxGlobal.cloneNode(true));

            // Create a data URL
            var svgSource = '<?xml version="1.0" encoding="UTF-8"?>' + "\n" + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' + "\n" + svg.outerHTML;
            var retval = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgSource)));

            // Remove the temporary elements
            document.body.removeChild(div);

            // Invoke the user callback
            callback(retval, width, height);
        };
        setTimeout(display, 1000);
    });
}

function checkRootSymbol(){
    $(".dialog-root")
        .dialog("open");
}

/**
 * Image filter
 */
function applyFilter(index, filter) {
    var obj = canvas.getActiveObject();
    obj.filters[index] = filter;
    var timeStart = +new Date();
    obj.applyFilters();
    var timeEnd = +new Date();
    var dimString = canvas.getActiveObject().width + ' x ' +
        canvas.getActiveObject().height;
    $('bench').innerHTML = dimString + 'px ' +
        parseFloat(timeEnd-timeStart) + 'ms';
    canvas.renderAll();
}

function getFilter(index) {
    var obj = canvas.getActiveObject();
    return obj.filters[index];
}

function applyFilterValue(index, prop, value) {
    var obj = canvas.getActiveObject();
    if (obj.filters[index]) {
        obj.filters[index][prop] = value;
        var timeStart = +new Date();
        obj.applyFilters();
        var timeEnd = +new Date();
        var dimString = canvas.getActiveObject().width + ' x ' +
            canvas.getActiveObject().height;
        $('bench').innerHTML = dimString + 'px ' +
            parseFloat(timeEnd-timeStart) + 'ms';
        canvas.renderAll();
    }
}


/**
 * 미디어 렌더링
 * @param event
 */
function renderImage(event) {
    // let example = "/upload/media/example.jpeg"
    // let image = new fabric.Image.fromURL(example, function(img) {
    //     let mag = (canvas.width / img.width) * 0.4
    //     img.set({
    //         "objType": "media",
    //         "shapeType": "image",
    //         "id": "test",
    //         centeredRotation: true
    //     }).scale(mag);
    //     canvas.centerObject(img);
    //     canvas.add(img);
    //     canvas.renderAll();
    // })
    //
    // reset(false, image)

    let imageObj = new Image();
    imageObj.src = event.target.result;
    imageObj.onload = function () {
        let image = new fabric.Image(imageObj);
        let mag = (canvas.width / image.width) * 0.4
        image.set({
            "objType": "media",
            "shapeType": "image",
            "id": "test",
            centeredRotation: true
        }).scale(mag);
        canvas.centerObject(image);
        canvas.add(image);
        canvas.renderAll();

    }
}
function renderVideo(file, width, height) {
    let url = URL.createObjectURL(file)
    let mag = (canvas.width / width) * 0.75
    let videoE = document.createElement('video')
    videoE.width = width
    videoE.height = height
    videoE.muted = true
    videoE.loop = true
    videoE.crossOrigin = "anonymous"
    let source = document.createElement('source')
    source.src = url
    source.type = 'video/mp4'
    videoE.appendChild(source)
    let fab_video = new fabric.Image(videoE, {
        left: 0,
        top: 0,
        hasControls: true,
        "objType": "media",
        shapeType: "video"
    }).scale(mag)
    canvas.add(fab_video)
    canvas.centerObject(fab_video)
    fab_video.getElement().play()
    fabric.util.requestAnimFrame(function render() {
        canvas.renderAll()
        fabric.util.requestAnimFrame(render)
    });


    let playBtn = `<button class='btn-tool-a playBtn' id='playBtn' value="play" style="position: absolute">재생/정지</button>`
    $("body").append(playBtn)
    const offset = {
        left: document.getElementById('canvas').getBoundingClientRect().left + window.scrollX,
        top: document.getElementById('canvas').getBoundingClientRect().top + window.scrollY,
    }
    $("#playBtn").css("left", offset.left + fab_video.aCoords.tl.x + 10)
    $("#playBtn").css("top", offset.top + fab_video.aCoords.tl.y + 10)

    $("#playBtn").on('click', function() {
        if ($(this).val() === 'play') {
            $(this).val('pause')
            fab_video.getElement().pause()
            canvas.renderAll()
        } else {
            $(this).val('play')
            fab_video.getElement().play()
            canvas.renderAll()
            fabric.util.requestAnimFrame(function render() {
                canvas.renderAll()
                fabric.util.requestAnimFrame(render)
            });
        }
    })

    reset(false, fab_video)
}

function renderYoutube(url) {
    let youtubeUrl = url
    let youtubeId = ''
    if (!youtubeUrl.includes('youtube') && !youtubeUrl.includes('youtu.be')) {
        alert('유튜브 형식 x')
    } else {
        if (youtubeUrl.includes("youtube") && !youtubeUrl.includes("shorts")) {
            youtubeId = new URLSearchParams(youtubeUrl.substring(youtubeUrl.indexOf("?"))).get("v");
        } else {
            youtubeId = youtubeUrl.substring(youtubeUrl.lastIndexOf("/") + 1);
            if (youtubeId.includes("?")) {
                youtubeId = youtubeId.replace(youtubeId.substring(youtubeId.indexOf("?")), "");
            }
        }

        let tag = ''
        tag += '<div class="video-div">';
        tag += '<iframe id="video-preview" src="https://youtube.com/embed/' + youtubeId + '?enablejsapi" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
        tag += '</div>'

        $("body").append(tag)

        document.getElementById("video-preview").onload = () => {
            let fab_video = new fabric.Image(document.getElementById("video-preview"), {
                left: 100,
                top: 50,
                data: "video"
            });
            canvas.add(fab_video);
            fab_video.getElement().play();
            fabric.util.requestAnimFrame(function render() {
                canvas.renderAll()
                fabric.util.requestAnimFrame(render)
            });
            reset(false, fab_video)
        }
    }
}

/**
 * 미디어 저장
 * @param file
 */
function saveFile(file) {
    const formData = new FormData()
    formData.append("inputMedia", file)
    console.log(formData)
    $.ajax({
        type: "POST",
        url: "/upload/drawing/media",
        processData: false,
        contentType: false,
        data: formData,
        success: function(res) {
            console.log(res.upload.filePath)
            return res.upload.filePath
        },
        err: function (err) {
            console.log(err)
            return err.message
        }
    })
}