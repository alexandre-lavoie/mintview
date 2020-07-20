import * as React from 'react';
import MainPanel from '../components/MainPanel';
import Canvas, { CanvasRef } from '../components/Canvas';
import { Action } from '../utils';
import { fabric } from 'fabric';
import CaptureWindow from '../components/Canvas/CaptureWindow';

const App: React.FC = () => {
    /** Current canvas action. */
    const [action, setAction] = React.useState<Action>(Action.DRAG);
    /** Filters to apply on webcam. */
    const [filters, setFilters] = React.useState<fabric.IBaseFilter[]>([]);
    /** Is the image save prompt open? */
    const [open, setOpen] = React.useState<boolean>(false);
    /** Is the webcam active? */
    const [webcam, setWebcam] = React.useState<boolean>(true);
    /** Reference to canvas object. */
    let canvasRef: CanvasRef | null = null;

    /** 
     * Updates current canvas action.
     */
    function setNextAction () {
        setAction((action + 1) % (Object.keys(Action).length / 2));
    }

    /** If browser, handles key events. */
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
            penColor='#189F5A'
            penWidth={5}
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