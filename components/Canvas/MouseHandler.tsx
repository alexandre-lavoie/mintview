import * as React from 'react';
import { fabric } from 'fabric';
import { Action } from '../../utils';

interface MouseHandlerProps {
    canvas: fabric.Canvas | null,
    action?: Action,
    onMouseDown?: (opt: fabric.IEvent) => void
}

const MouseHandler: React.FC<MouseHandlerProps> = (props) => {
    const [button, setButton] = React.useState<number | undefined>(undefined);

    const handleMouseWheel = (opt: fabric.IEvent) => {
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
    };

    const handleMouseMove = (opt: fabric.IEvent) => {
        if (props.canvas) {
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

    const handleMouseDown = (opt: fabric.IEvent) => {
        if (props.canvas) {
            setButton(opt.button);

            if(props.onMouseDown) {
                props.onMouseDown(opt);
            }
        }
    }

    const handleMouseUp = (opt: fabric.IEvent) => {
        setButton(undefined);
    }

    React.useEffect(() => {
        if(props.canvas) {
            props.canvas.off('mouse:wheel').on('mouse:wheel', handleMouseWheel);
            props.canvas.off('mouse:up').on('mouse:up', handleMouseUp);
        }
    }, [props.canvas]);

    React.useEffect(() => {
        if(props.canvas) {
            props.canvas.off('mouse:move').on('mouse:move', handleMouseMove);
        }
    }, [props.canvas, button]);

    React.useEffect(() => {
        if(props.canvas) {
            props.canvas.off('mouse:down').on('mouse:down', handleMouseDown);
        }
    }, [props.canvas, button, props.action])

    return <></>
};

export default MouseHandler;