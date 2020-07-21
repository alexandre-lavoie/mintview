import * as React from 'react';
import MainPanel from '../components/MainPanel';
import Canvas, { CanvasRef } from '../components/Canvas';
import { Action } from '../utils';
import { fabric } from 'fabric';
import CaptureWindow from '../components/CaptureWindow';
import SettingsPanel from '../components/SettingsPanel';
import { useTheme } from '@material-ui/core';

const App: React.FC = () => {
    const theme = useTheme();
    /** Current canvas action. */
    const [action, setAction] = React.useState<Action>(Action.DRAG);
    /** Filters to apply on webcam. */
    const [filters, setFilters] = React.useState<fabric.IBaseFilter[]>([]);
    /** Is the image save prompt open? */
    const [captureWindowOpen, setCaptureWindowOpen] = React.useState<boolean>(false);
    /** Is the setting prompt open? */
    const [settingsPanelOpen, setSettingsPanelOpen] = React.useState<boolean>(false);
    /** Is the webcam active? */
    const [webcam, setWebcam] = React.useState<boolean>(true);
    /** Pen color. */
    const [penColor, setPenColor] = React.useState<string>(theme.palette.primary.main);
    /** Pen width. */
    const [penWidth, setPenWidth] = React.useState(5);
    /** Is grid active? */
    const [grid, setGrid] = React.useState(false);
    /** Reference to canvas object. */
    let canvasRef: CanvasRef | null = null;

    /**
     * Set default values.
     */
    React.useEffect(() => {
        let penColor = localStorage.getItem('penColor');

        if(penColor) {
            setPenColor(penColor);
        }

        let penWidth = localStorage.getItem('penWidth');

        if(penWidth) {
            setPenWidth(parseInt(penWidth));
        }
    }, []);

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
                    canvasRef.screenshot();
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
            open={captureWindowOpen}
            onClose={() => setCaptureWindowOpen(false)}
        />
        <SettingsPanel
            open={settingsPanelOpen}
            penColor={penColor}
            penWidth={penWidth}
            onPenWidthChange={(width) => {setPenWidth(width); localStorage.setItem('penWidth', width.toString())}}
            onPenColorChange={(c) => {setPenColor(c.hex); localStorage.setItem('penColor', c.hex)}}
            onClose={() => setSettingsPanelOpen(false)}
        />
        <MainPanel
            action={action}
            webcam={webcam}
            grid={grid}
            onWebcamChange={() => setWebcam(!webcam)}
            onRedo={() => (canvasRef) ? canvasRef.redo() : {}}
            onUndo={() => (canvasRef) ? canvasRef.undo() : {}}
            onChangeAction={() => setNextAction()}
            onFlip={() => (canvasRef) ? canvasRef.flip() : {}}
            onDelete={() => (canvasRef) ? canvasRef.deleteObj() : {}}
            onLock={() => (canvasRef) ? canvasRef.lock() : {}}
            onCopy={() => (canvasRef) ? canvasRef.copy() : {}}
            onUnlock={() => (canvasRef) ? canvasRef.unlock() : {}}
            onSettingsChange={() => setSettingsPanelOpen(!settingsPanelOpen)}
            onGridChange={() => setGrid(!grid)}
            onWebcamCapture={() => (canvasRef) ? canvasRef.webcamCapture() : {}}
            onScreenshot={() => {
                if(canvasRef) {
                    setCaptureWindowOpen(true);
                    canvasRef.screenshot()
                }}
            }
        />
        <video width={640} height={480} id="webcam" style={{ display: 'none' }}></video>
        <Canvas
            ref={r => canvasRef = r}
            filters={filters}
            action={action}
            webcam={webcam}
            penColor={penColor}
            penWidth={penWidth}
            grid={grid}
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