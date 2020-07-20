import * as React from 'react';
import { fabric } from 'fabric';
import { Action } from '../../utils';

interface MouseHandlerProps {
    /** Attached canvas. */
    canvas: fabric.Canvas | null,
    /** Current action to perform on canvas. */
    action?: Action,
    /** Line that follows cursor. */
    followLine?: fabric.Line,
    /** Handles mouse down event. */
    onMouseDown?: (opt: fabric.IEvent) => void
}

const MouseHandler: React.FC<MouseHandlerProps> = (props) => {
    /** Current button being held on mouse. */
    const [button, setButton] = React.useState<number | undefined>(undefined);

    /**
     * Handles mouse wheel event.
     * @param opt Mouse event.
     */
    function handleMouseWheel(opt: fabric.IEvent) {
        if (props.canvas) {
            //@ts-ignore
            var delta = opt.e.deltaY;
            var zoom = props.canvas.getZoom();
            zoom *= 0.999 ** delta;
            if (zoom > 20) zoom = 20;
            if (zoom < 0.01) zoom = 0.01;
            //@ts-ignore
            props.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
            opt.e.preventDefault();
            opt.e.stopPropagation();
        }
    }

    /**
     * Handles mouse move event.
     * @param opt Mouse event.
     */
    function handleMouseMove(opt: fabric.IEvent) {
        if (props.canvas) {
            if (props.followLine && opt.absolutePointer) {
                props.followLine.set({ x2: opt.absolutePointer.x, y2: opt.absolutePointer.y });
                props.followLine.moveTo(1);
            }

            switch (button) {
                case 2:
                    //@ts-ignore
                    props.canvas.relativePan({ x: opt.e.movementX, y: opt.e.movementY });
                    opt.e.preventDefault();
                    opt.e.stopPropagation();
                    break;
            }
        }
    }

    /**
     * Handles mouse down event.
     * @param opt Mouse event.
     */
    function handleMouseDown(opt: fabric.IEvent) {
        if (props.canvas) {
            setButton(opt.button);

            if (props.onMouseDown) {
                props.onMouseDown(opt);
            }
        }
    }

    /**
     * Handles mouse up event.
     * @param opt Mouse event.
     */
    function handleMouseUp(opt: fabric.IEvent) {
        setButton(undefined);
    }

    /**
     * Attaches mouse event trigger to mouse event function.
     * @dependency props.canvas, button, props.action
     */
    React.useEffect(() => {
        if (props.canvas) {
            props.canvas.off('mouse:wheel').on('mouse:wheel', handleMouseWheel);
            props.canvas.off('mouse:up').on('mouse:up', handleMouseUp);
            props.canvas.off('mouse:move').on('mouse:move', handleMouseMove);
            props.canvas.off('mouse:down').on('mouse:down', handleMouseDown);
        }

        return () => {
            if (props.canvas) {
                props.canvas.off('mouse:wheel');
                props.canvas.off('mouse:up');
                props.canvas.off('mouse:move');
                props.canvas.off('mouse:down');
            }
        };
    }, [props.canvas, button, props.action]);

    return <></>;
};

export default MouseHandler;