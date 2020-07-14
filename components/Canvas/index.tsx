import * as React from 'react';
import { fabric } from 'fabric';
import { Action } from '../../utils';
import MouseHandler from './MouseHandler';
import UtilHandler from './UtilHandler';
import { useTheme } from '@material-ui/core';

interface CanvasProps {
    action?: Action,
    style?: React.CSSProperties | undefined,
    webcam?: boolean,
    filters?: fabric.IBaseFilter[],
    onDrawingComplete?: () => void
}

export interface CanvasRef {
    deleteObj: () => void,
    undo: () => void,
    redo: () => void,
    webcamCapture: () => void,
    copy: () => void,
    flip: () => void,
    lock: () => void
}

const DRAWING_STOP_DISTANCE = 0.5;

const Canvas = React.forwardRef((props: CanvasProps, ref: React.Ref<CanvasRef>) => {
    const [canvas, setCanvas] = React.useState<fabric.Canvas | null>(null);
    const [lines, setLines] = React.useState<fabric.Line[]>([]);
    const [lineOffset, setLineOffset] = React.useState(-1);
    const [previousCursor, setPreviousCursor] = React.useState([-1, -1]);
    const [webcam, setWebcam] = React.useState<fabric.Image | undefined>(undefined);
    const [handleFrame, setHandleFrame] = React.useState<NodeJS.Timeout | null>(null);
    const theme = useTheme();

    React.useEffect(() => {
        fabric.Object.prototype.borderColor = fabric.Object.prototype.cornerStrokeColor = fabric.Object.prototype.cornerColor = theme.palette.primary.main;
        fabric.Object.prototype.cornerStyle = 'circle';
    }, [theme]);

    React.useEffect(() => {
        if(webcam) {
            webcam.visible = props.webcam == true;
        }
    }, [webcam, props.webcam]);

    const lock = () => {
        if (canvas) {
            canvas.getActiveObjects().forEach(obj => { obj.selectable = false; obj.evented = false; obj.moveTo(0) });
            canvas.discardActiveObject();
        }
    }

    const undo = () => {
        if (canvas && lineOffset > 0) {
            let line = lines[lineOffset - 1];

            if (lineOffset > 1) {
                setPreviousCursor([line.x1, line.y1] as any);
            } else {
                setPreviousCursor([-1, -1]);
            }

            canvas.remove(line);

            setLineOffset(lineOffset - 1);
        }
    }

    const redo = () => {
        if (canvas && lineOffset < lines.length && lineOffset >= 0) {
            let line = lines[lineOffset];

            setPreviousCursor([line.x2, line.y2] as any);

            canvas.add(line);

            setLineOffset(lineOffset + 1);
        }
    }

    const deleteObj = () => {
        if (canvas) {
            let selectedObjects = canvas.getActiveObjects();

            if (selectedObjects.length > 0) {
                canvas.remove(...selectedObjects);
            } else {
                canvas.remove(...canvas.getObjects().filter(obj => obj != webcam));
            }
        }
    }

    const copy = () => {
        if (webcam && canvas) {
            let activeObj = canvas.getActiveObjects();

            if(activeObj.length > 0) {
                activeObj.forEach(o => o.clone((clone: fabric.Object) => {
                    canvas.add(clone);

                    canvas.setActiveObject(clone);
                }));
            } else {
                let wb: HTMLVideoElement = document.getElementById('webcam') as any;

                fabric.Image.fromURL(webcam.toDataURL({}), (img) => {
                    img.moveTo(0);
    
                    canvas.add(img);
                }, { left: window.innerWidth / 2 + wb.videoWidth + 10, top: window.innerHeight / 2, originX: 'center', originY: 'center' });
            }
        }
    };

    const webcamCapture = () => {
        if(canvas) {
            let viewport = canvas.calcViewportBoundaries();

            let image = canvas.toDataURL({ width: window.outerWidth, height: window.outerHeight, multiplier: canvas.getZoom() * 2, left: viewport.tl.x, top: viewport.tl.y }).replace('image/png', 'image/octet-stream');

            let waitCapture = setInterval(() => {
                let capture = document.getElementById('capture') as HTMLImageElement;

                if(capture) {
                    let capture = document.getElementById('capture') as HTMLImageElement;
                    capture.src = image;
                    capture.width = window.outerWidth / 3;
                    capture.height = window.outerHeight / 3;
                    clearInterval(waitCapture);
                }
            }, 100);
        }
    };

    const flip = () => {
        if (canvas) {
            let selectedObjects = canvas.getActiveObjects();

            if (selectedObjects.length > 0) {
                selectedObjects.forEach(obj => obj.flipX = !obj.flipX);
            } else {
                canvas.getObjects('image').forEach(obj => obj.flipX = !obj.flipX);
            }
        }
    }

    React.useImperativeHandle(ref, () => ({ deleteObj, undo, redo, webcamCapture, flip, lock, copy }));

    React.useEffect(() => {
        let c = new fabric.Canvas('main-canvas', {
            width: window.innerWidth * 2,
            height: window.innerHeight * 2,
            fireMiddleClick: true,
            fireRightClick: true,
            stopContextMenu: true
        });

        setCanvas(c);
    }, []);

    React.useEffect(() => {
        if (canvas) {
            let webcam: HTMLVideoElement = document.getElementById('webcam') as any;

            navigator.mediaDevices.getUserMedia({
                audio: false, video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            })
                .then((stream) => {
                    webcam.srcObject = stream;
                    webcam.onloadeddata = () => {
                        webcam.width = webcam.videoWidth;
                        webcam.height = webcam.videoHeight;

                        let webcamVideo = new fabric.Image(webcam, {
                            left: window.innerWidth / 2,
                            top: window.innerHeight / 2,
                            originX: 'center',
                            originY: 'center',
                            selectable: false,
                            evented: false
                        });

                        setWebcam(webcamVideo);

                        webcamVideo.moveTo(0);

                        canvas.add(webcamVideo);

                        webcam.play();
                    }
                });
        }
    }, [canvas]);

    const frameRender = () => {
        if (canvas && webcam) {
            fabric.util.requestAnimFrame(() => {
                webcam.applyFilters(props.filters);
                var backend = fabric.filterBackend;

                if (backend && backend.evictCachesForKey) {
                    backend.evictCachesForKey(webcam.cacheKey as string);
                    backend.evictCachesForKey(webcam.cacheKey + '_filtered');
                }

                canvas.renderAll();
            });
        }
    }

    React.useEffect(() => {
        if (webcam && canvas) {
            if (handleFrame) {
                clearInterval(handleFrame)
            }

            setHandleFrame(setInterval(frameRender, 0));
        }
    }, [webcam, canvas, props.filters])

    React.useEffect(() => {
        if (canvas) {
            if (lines.length > 0 && props.action != Action.DRAW) {
                let polyLine = new fabric.Polyline(lines.map(line => [{ x: line.x1, y: line.y1 }, { x: line.x2, y: line.y2 }]).slice(0, lineOffset).reduce((arr, points) => [...arr, ...points], []) as any, {
                    stroke: '#189F5A',
                    strokeWidth: 3,
                    fill: 'rgba(0,0,0,0)'
                });

                canvas.add(polyLine);

                canvas.setActiveObject(polyLine);

                canvas.remove(...lines);

                setLines([]);

                setLineOffset(-1);
            }

            if (props.action != Action.DRAW) {
                setPreviousCursor([-1, -1]);
            } else {
                canvas.discardActiveObject();
            }
        }
    }, [canvas, props.action, lines]);

    return <>
        <canvas
            id='main-canvas'
            style={props.style}
        ></canvas>

        {(() => {
            if (process.browser) {
                return <>
                    <UtilHandler canvas={canvas} />

                    <MouseHandler action={props.action} canvas={canvas} onMouseDown={(opt: fabric.IEvent) => {
                        if (canvas) {
                            switch (opt.button) {
                                case 1:
                                    switch (props.action) {
                                        case Action.DRAW:
                                            //@ts-ignore
                                            let current = [opt.absolutePointer.x, opt.absolutePointer.y];

                                            if (Math.sqrt((previousCursor[0] - current[0]) ^ 2 + (previousCursor[1] - current[1]) ^ 2) < DRAWING_STOP_DISTANCE) {
                                                if (props.onDrawingComplete) {
                                                    props.onDrawingComplete();
                                                }

                                                break;
                                            }

                                            if (previousCursor[0] > -1) {
                                                canvas.remove(...lines.slice(lineOffset + 1, lines.length));

                                                let line = new fabric.Line([...previousCursor, ...current], { stroke: '#189F5A', strokeWidth: 3 });

                                                line.selectable = false;

                                                line.evented = false;

                                                let nextLines = [...lines.slice(0, lineOffset), line];

                                                setLineOffset(nextLines.length);

                                                setLines(nextLines);

                                                canvas.add(line);
                                            }

                                            setPreviousCursor(current);

                                            opt.e.preventDefault();

                                            opt.e.stopPropagation();

                                            break;
                                    }
                                    break;
                            }
                        }
                    }} />
                </>;
            }
        })()}
    </>;
});

export default Canvas;