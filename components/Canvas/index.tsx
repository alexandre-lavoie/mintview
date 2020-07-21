import * as React from 'react';
import { fabric } from 'fabric';
import { Action } from '../../utils';
import MouseHandler from './MouseHandler';
import UtilHandler from './UtilHandler';
import { useTheme } from '@material-ui/core';
import { Vector2 } from '../../utils/vectors';
import { attachSliderControls } from './SliderControl';

interface CanvasProps {
    /** Current action to perform on canvas. */
    action?: Action,
    /** Is grid active? */
    grid?: boolean,
    style?: React.CSSProperties | undefined,
    /** Is webcam active? */
    webcam?: boolean,
    /** Pen color to use when sketching. */
    penColor?: string,
    /** Pen width to use when sketching. */
    penWidth?: number,
    /** Filters to apply on camera. */
    filters?: fabric.IBaseFilter[],
    /** Action triggered when a sketch is complete. */
    onDrawingComplete?: () => void
}

export interface CanvasRef {
    /** Deletes active objects else all non-essential objects. */
    deleteObj: () => void,
    /** Undos sketch line. */
    undo: () => void,
    /** Redos sketch line. */
    redo: () => void,
    /** Captures the scene as a screenshot. */
    screenshot: () => void,
    /** Captures webcam as image object. */
    webcamCapture: () => void,
    /** Copies active objects else copies webcam image. */
    copy: () => void,
    /** Flips all active objects else all image objects. */
    flip: () => void,
    /** Handles locking of active objects. */
    lock: () => void,
    /** Handles unlocking locked objects. */
    unlock: () => void
}

/** Constant set for stopping drawing. */
const DRAWING_STOP_DISTANCE = 0.5;

/** Adds the slider control if in browser. */
if (process.browser) {
    attachSliderControls();
}

const Canvas = React.forwardRef((props: CanvasProps, ref: React.Ref<CanvasRef>) => {
    /** Canvas object reference. */
    const [canvas, setCanvas] = React.useState<fabric.Canvas | null>(null);
    /** Collection of lines drawn in sketch. */
    const [lines, setLines] = React.useState<fabric.Line[]>([]);
    /** Offset in lines history for "lines" variable. */
    const [lineOffset, setLineOffset] = React.useState(-1);
    /** Position of cursor prior to previous click - Used for draw mode. */
    const [previousCursor, setPreviousCursor] = React.useState([-1, -1]);
    /** Webcam object reference. */
    const [webcam, setWebcam] = React.useState<fabric.Image | undefined>(undefined);
    /** Frame loop reference. */
    const [handleFrame, setHandleFrame] = React.useState<NodeJS.Timeout | null>(null);
    /** Cursor line follower reference. */
    const [followLine, setFollowLine] = React.useState<fabric.Line | undefined>(undefined);
    /** Grid reference. */
    const [grid, setGrid] = React.useState<fabric.Image | undefined>(undefined);
    /** Theme reference. */
    const theme = useTheme();

    /**
     * Handles locking of active objects.
     */
    function lock() {
        if (canvas) {
            let activatedObjects = canvas.getActiveObjects();

            activatedObjects.forEach(obj => { obj.set({ selectable: false, evented: false }); obj.moveTo(0) });
            canvas.discardActiveObject();
        }
    }

    /**
     * Handles unlocking of objects.
     */
    function unlock() {
        if (canvas) {
            canvas.getObjects().filter(obj => obj != webcam && !obj.isType('line')).forEach(obj => obj.set({ selectable: true, evented: true }));
        }
    }

    /**
     * Creates a new line for skecthing.
     * @param points [x1, y1, x2, y2].
     */
    function newSketchLine(points?: number[] | undefined) {
        return new fabric.Line(points, {
            evented: false,
            selectable: false,
            stroke: props.penColor ? props.penColor : theme.palette.primary.main,
            strokeWidth: props.penWidth ? props.penWidth : 5
        });
    }

    /**
     * Undos sketch line.
     */
    function undo() {
        if (canvas && lineOffset > 0) {
            let line = lines[lineOffset - 1];

            if (followLine) {
                followLine.set({ x1: line.x1, y1: line.y1 });
            }

            if (lineOffset > 1) {
                setPreviousCursor([line.x1, line.y1] as any);
            } else {
                setPreviousCursor([-1, -1]);
            }

            canvas.remove(line);

            setLineOffset(lineOffset - 1);
        } else if (followLine) {
            followLine.set('visible', false);
        }
    }

    /**
     * Redos sketch line.
     */
    function redo() {
        if (canvas && lineOffset < lines.length && lineOffset >= 0) {
            let line = lines[lineOffset];

            if (followLine) {
                followLine.set({ x1: line.x2, y1: line.y2 });
            }

            setPreviousCursor([line.x2, line.y2] as any);

            canvas.add(line);

            setLineOffset(lineOffset + 1);
        }
    }

    /** 
     * Deletes active objects else all non-essential objects. 
     */
    function deleteObj() {
        if (canvas) {
            let selectedObjects = canvas.getActiveObjects();

            if (selectedObjects.length > 0) {
                canvas.remove(...selectedObjects);
            } else {
                canvas.remove(...canvas.getObjects().filter(obj => obj != webcam));
            }
        }
    }

    /**
     * Copies active objects else copies webcam image.
     */
    function copy() {
        if (webcam && canvas) {
            canvas.getActiveObjects().forEach(o => o.clone((clone: fabric.Object) => {
                canvas.add(clone);

                if(clone.left && clone.top) {
                    clone.set({ left: clone.left + 50, top: clone.top + 50 });
                }

                canvas.setActiveObject(clone);
            }));
        }
    }

    /**
     * Captures the camera as an image object.
     */
    function webcamCapture() {
        if (webcam && canvas) {
            let wb: HTMLVideoElement = document.getElementById('webcam') as any;

            fabric.Image.fromURL(webcam.toDataURL({}), (img) => {
                img.moveTo(0);

                canvas.add(img);
            }, { left: wb.videoWidth + 50 });
        }
    }

    /**
     * Captures the scene as a screenshot.
     */
    function screenshot() {
        if (canvas) {
            let image = canvas.toDataURL({
                width: window.outerWidth,
                height: window.outerHeight,
                multiplier: 1
            }).replace('image/png', 'image/octet-stream');

            let waitCapture = setInterval(() => {
                let capture = document.getElementById('capture') as HTMLImageElement;

                if (capture) {
                    let capture = document.getElementById('capture') as HTMLImageElement;
                    capture.src = image;
                    capture.width = window.outerWidth / 3;
                    capture.height = window.outerHeight / 3;
                    clearInterval(waitCapture);
                }
            }, 100);
        }
    }

    /**
     * Flips all active objects else all image objects.
     */
    function flip() {
        if (canvas) {
            let selectedObjects = canvas.getActiveObjects();

            if (selectedObjects.length > 0) {
                selectedObjects.forEach(obj => obj.flipX = !obj.flipX);
            } else {
                canvas.getObjects('image').forEach(obj => obj.flipX = !obj.flipX);
            }
        }
    }

    /**
     * Renders a webcam frame with filters.
     */
    function frameRender() {
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

    /**
     * Handles the mouse down event.
     * @param opt Event properties.
     * @param lineOffset Current offset for line stack.
     */
    function onMouseDown(opt: fabric.IEvent) {
        if (canvas) {
            switch (opt.button) {
                case 1:
                    switch (props.action) {
                        case Action.DRAW:
                            //@ts-ignore
                            let current = [opt.absolutePointer.x, opt.absolutePointer.y];

                            if (followLine) {
                                followLine.set({ x1: current[0], y1: current[1] });
                            }

                            if (new Vector2(...current).distanceTo(new Vector2(...previousCursor)) < DRAWING_STOP_DISTANCE) {
                                if (props.onDrawingComplete) {
                                    props.onDrawingComplete();
                                }

                                break;
                            }

                            if (previousCursor[0] > -1) {
                                canvas.remove(...lines.slice(lineOffset + 1, lines.length));

                                let line = newSketchLine([...previousCursor, ...current]);

                                let nextLines = [...lines.slice(0, lineOffset), line];

                                setLineOffset(nextLines.length);

                                setLines(nextLines);

                                canvas.add(line);
                            } else if (followLine) {
                                followLine.set('visible', true);
                            }

                            setPreviousCursor(current);

                            opt.e.preventDefault();

                            opt.e.stopPropagation();

                            break;
                    }
                    break;
            }
        }
    }

    // Attaches functions to referance to be called outside of the object.
    React.useImperativeHandle(ref, () => ({ deleteObj, undo, redo, screenshot, flip, lock, copy, webcamCapture, unlock }));

    /**
     * Updates object tools styles to theme color.
     * @dependency theme
     */
    React.useEffect(() => {
        fabric.Object.prototype.borderColor = fabric.Object.prototype.cornerStrokeColor = fabric.Object.prototype.cornerColor = theme.palette.primary.main;
        fabric.Object.prototype.cornerStyle = 'circle';
    }, [theme]);

    /**
     * Updates grid state.
     */
    React.useEffect(() => {
        if (grid) {
            grid.set('visible', props.grid != false);
        }
    }, [props.grid, grid]);

    /**
     * Updates webcam visibility.
     * @dependency webcam, props.webcam
     */
    React.useEffect(() => {
        if (webcam) {
            webcam.set('visible', props.webcam == true);
        }
    }, [webcam, props.webcam]);

    /**
     * Updates the cursor following line with pen colors.
     * @dependency props.penColor, props.penWidth
     */
    React.useEffect(() => {
        if (followLine) {
            followLine.set({
                stroke: props.penColor ? props.penColor : theme.palette.primary.main,
                strokeWidth: props.penWidth ? props.penWidth : 5
            });
        }
    }, [props.penColor, props.penWidth]);

    /**
     * Initializes canvas.
     */
    React.useEffect(() => {
        let c = new fabric.Canvas('main-canvas', {
            width: window.innerWidth * 2,
            height: window.innerHeight * 2,
            fireMiddleClick: true,
            fireRightClick: true,
            stopContextMenu: true
        });

        setCanvas(c);

        fabric.Image.fromURL('./grid.png', img => {
            setGrid(img);
            c.setOverlayImage(img, () => { });
        }, { evented: false, selectable: false, visible: false, left: 0, top: 0 });

        let followLine = newSketchLine();

        setFollowLine(followLine);

        c.add(followLine);
    }, []);

    /**
     * Initializes webcam.
     * @dependency canvas
     */
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
                            left: 0,
                            top: 0,
                            selectable: false,
                            evented: false
                        });

                        setWebcam(webcamVideo);

                        webcamVideo.moveTo(0);

                        canvas.add(webcamVideo);

                        webcam.play();
                    }
                }).catch(() => { });
        }
    }, [canvas]);

    /**
     * Updates frameRender loop when there is a webcam change.
     * @dependency webcam, canvas, props.filters
     */
    React.useEffect(() => {
        if (webcam && canvas) {
            if (handleFrame) {
                clearInterval(handleFrame)
            }

            setHandleFrame(setInterval(frameRender, 0));
        }
    }, [webcam, canvas, props.filters]);

    /**
     * Handles the action change event.
     * @dependency canvas, props.action, lines, followLine
     */
    React.useEffect(() => {
        if (canvas) {
            if (lines.length > 0 && props.action != Action.DRAW) {
                let polyLine = new fabric.Polyline(lines.map(line => [{ x: line.x1, y: line.y1 }, { x: line.x2, y: line.y2 }]).slice(0, lineOffset).reduce((arr, points) => [...arr, ...points], []) as any, {
                    stroke: props.penColor ? props.penColor : theme.palette.primary.main,
                    strokeWidth: props.penWidth ? props.penWidth : 5,
                    fill: 'rgba(0,0,0,0)'
                });

                canvas.add(polyLine);

                canvas.setActiveObject(polyLine);

                canvas.remove(...lines);

                setLines([]);

                setLineOffset(-1);
            }

            if (props.action != Action.DRAW) {
                if (followLine) {
                    followLine.set('visible', false);
                }

                setPreviousCursor([-1, -1]);
            } else {
                canvas.discardActiveObject();
            }
        }
    }, [canvas, props.action, lines, followLine]);

    return <>
        <canvas
            id='main-canvas'
            style={props.style}
        ></canvas>

        {(() => {
            if (process.browser) {
                return <>
                    <UtilHandler
                        canvas={canvas}
                    />

                    <MouseHandler
                        lineOffset={lineOffset}
                        followLine={followLine}
                        action={props.action}
                        canvas={canvas}
                        onMouseDown={(e) => onMouseDown(e)}
                    />
                </>;
            }
        })()}
    </>;
});

export default Canvas;