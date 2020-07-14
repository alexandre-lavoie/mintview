import * as React from 'react';
import MainPanel from '../components/MainPanel';
import Canvas, { CanvasRef } from '../components/Canvas';
import { Action } from '../utils';
import { Vector2 } from '../utils/vectors';
import { fabric } from 'fabric';
import CaptureWindow from '../components/Canvas/CaptureWindow';

if (process.browser) {
    // @ts-ignore
    fabric.Object.prototype.controls.opacitySlider = new fabric.Control({
        x: 0,
        y: 0.6,
        action: 'scale',
        cursorStyle: 'w-resize',

        actionHandler: (eventData: MouseEvent, fabricObject: fabric.Object & { target: fabric.Object }) => {
            //@ts-ignore
            let bl = fabricObject.target.oCoords.bl;

            //@ts-ignore
            let br = fabricObject.target.oCoords.br;

            //@ts-ignore
            let l = fabricObject.target.oCoords.opacitySliderLine;

            let sliderbl = new Vector2(l.x, l.y);

            let sliderbr = new Vector2(br.x + (l.x - bl.x), br.y + (l.y - bl.y));

            let cursor = new Vector2(eventData.x, eventData.y);

            let a = sliderbr.sub(sliderbl);

            let b = cursor.sub(sliderbl);

            if (a.angleTo(b) > Math.PI / 2) {
                fabricObject.target.opacity = 0;
            } else {
                let proj = a.projectOnto(b);

                let offset = cursor.sub(proj);

                fabricObject.target.opacity = 1 - Math.min(Math.max(sliderbl.distanceTo(offset) / sliderbl.distanceTo(sliderbr), 0), 1);
            }
        },

        render: function (ctx: CanvasRenderingContext2D, left: number, top: number, styleOverride: any, fabricObject: fabric.Object) {
            if (fabricObject.opacity) {
                this.x = (fabricObject.opacity - 0.5);
            }

            styleOverride = styleOverride || {};
            var size = styleOverride.cornerSize || fabricObject.cornerSize,
                transparentCorners = typeof styleOverride.transparentCorners !== 'undefined' ?
                    styleOverride.transparentCorners : this.transparentCorners,
                methodName = transparentCorners ? 'stroke' : 'fill',
                stroke = !transparentCorners && (styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor);
            ctx.save();
            ctx.fillStyle = styleOverride.cornerColor || fabricObject.cornerColor;
            ctx.strokeStyle = styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(left, top, size / 2, 0, 2 * Math.PI, false);
            //@ts-ignore
            ctx[methodName as any]();
            if (stroke) {
                ctx.stroke();
            }

            ctx.restore();
        }
    });

    // @ts-ignore
    fabric.Object.prototype.controls.opacitySliderLine = new fabric.Control({
        x: -0.5,
        y: 0.6,
        cursorStyle: 'cursor',
        render: function (ctx: CanvasRenderingContext2D, left: number, top: number, styleOverride: any, fabricObject: fabric.Object) {
            styleOverride = styleOverride || {};
            var size = styleOverride.cornerSize || fabricObject.cornerSize,
                transparentCorners = typeof styleOverride.transparentCorners !== 'undefined' ?
                    styleOverride.transparentCorners : this.transparentCorners,
                methodName = transparentCorners ? 'stroke' : 'fill',
                stroke = !transparentCorners && (styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor);
            ctx.save();
            ctx.fillStyle = styleOverride.cornerColor || fabricObject.cornerColor;
            ctx.strokeStyle = styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor;
            ctx.lineWidth = 1;
            ctx.beginPath();
            //@ts-ignore
            ctx.moveTo(left, top);
            //@ts-ignore
            ctx.lineTo(fabricObject.oCoords.br.x + (left - fabricObject.oCoords.bl.x), fabricObject.oCoords.br.y + (top - fabricObject.oCoords.bl.y));
            //@ts-ignore
            ctx[methodName as any]();
            if (stroke) {
                ctx.stroke();
            }

            ctx.restore();
        }
    });
}


const App: React.FC = () => {
    const [action, setAction] = React.useState<Action>(Action.DRAG);
    const [filters, setFilters] = React.useState<fabric.IBaseFilter[]>([]);
    const [open, setOpen] = React.useState<boolean>(false);
    const [webcam, setWebcam] = React.useState<boolean>(true);

    let canvasRef: CanvasRef | null = null;

    const setNextAction = () => {
        setAction((action + 1) % (Object.keys(Action).length / 2));
    }

    if (process.browser) {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (canvasRef) {
                if (e.ctrlKey && e.key === 'z') {
                    canvasRef.undo();
                } else if (e.ctrlKey && e.key === 'y') {
                    canvasRef.redo();
                } else if (e.key === ' ') {
                    setNextAction();
                } else if (e.key === 'Delete' || e.key === 'Backspace') {
                    canvasRef.deleteObj();
                } else if (e.key === 'Home') {
                    canvasRef.webcamCapture();
                } else if (e.ctrlKey && e.key === 'c') {
                    canvasRef.copy();
                }
            }
        }

        document.removeEventListener('keydown', handleKeyDown, false);
        document.addEventListener('keydown', handleKeyDown, false);
    }

    return <div
        style={{
            position: 'fixed',
            top: 0,
            bottom: 0,
            width: '100%',
            height: '100vh',

        }}>
        <CaptureWindow
            open={open}
            onClose={() => setOpen(false)}
        />
        <MainPanel
            action={action}
            webcam={webcam}
            onWebcamChange={() => setWebcam(!webcam)}
            onRedo={() => (canvasRef) ? canvasRef.redo() : {}}
            onUndo={() => (canvasRef) ? canvasRef.undo() : {}}
            onChangeAction={() => setNextAction()}
            onFlip={() => (canvasRef) ? canvasRef.flip() : {}}
            onDelete={() => (canvasRef) ? canvasRef.deleteObj() : {}}
            onLock={() => (canvasRef) ? canvasRef.lock() : {}}
            onCopy={() => (canvasRef) ? canvasRef.copy() : {}}
            onWebcamCapture={() => {
                if(canvasRef) {
                    setOpen(true);
                    canvasRef.webcamCapture()
                }}
            }
        />
        <video width={640} height={480} id="webcam" style={{ display: 'none' }}></video>
        <Canvas
            ref={r => canvasRef = r}
            filters={filters}
            action={action}
            webcam={webcam}
            onDrawingComplete={() => setAction(Action.DRAG)}
            style={{
                overflowX: 'hidden',
                width: '100%',
                height: '100vh',
                position: 'fixed',
                top: 0,
                left: 0
            }}
        />
    </div>;
}

export default App;