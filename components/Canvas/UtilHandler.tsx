import * as React from 'react';
import { fabric } from 'fabric';
import { convertDataURIToBinaryFetch } from '../../utils';

interface UtilHandlerProps {
    /** Attached canvas. */
    canvas: fabric.Canvas | null
}

const UtilHandler: React.FC<UtilHandlerProps> = (props) => {
    /** 
     * Copies first active object on canvas to clipboard. 
     * @param e Clipboard event.
     */
    async function copy(e: ClipboardEvent) {
        if (e.clipboardData && props.canvas) {
            let items = await Promise.all((
                props.canvas
                    .getActiveObjects()
                    .filter((obj: fabric.Object) => obj instanceof fabric.Image) as fabric.Image[])
                .map(async (img: fabric.Image) => {
                    let blob = await convertDataURIToBinaryFetch(img.getSrc());

                    //@ts-ignore
                    return new ClipboardItem({
                        [blob.type]: blob
                    });
                }
                ));

            if (items.length > 0) {
                //@ts-ignore
                navigator.clipboard.write([items[0]]);
            }
        }

        e.preventDefault();
    }

    /** 
     * Pastes images on clipboard onto canvas. 
     * @param e Clipboard event.
     */
    function paste(e: ClipboardEvent) {
        if (props.canvas) {
            //@ts-ignore
            Object.values(e.clipboardData.items).forEach(file => {
                if (props.canvas && file.type.indexOf('image') != -1) {
                    let URLobj = window.URL || window.webkitURL;
                    fabric.Image.fromURL(URLobj.createObjectURL(file.getAsFile()), (img) => {
                        if(props.canvas) {
                            props.canvas.add(img);
                            
                            img.moveTo(0);

                            props.canvas.discardActiveObject();
                            props.canvas.setActiveObject(img);
                        }
                    });
                }
            });
        }
    };

    /** 
     * Handles drag and drop images onto canvas.
     * @param e Drag event.
     */
    function drop (e: DragEvent) {
        if (props.canvas && e.dataTransfer) {
            let pointer = props.canvas.getPointer(e);

            Object.values(e.dataTransfer.items).forEach(file => {
                if (file.type.indexOf('image') != -1) {
                    let URLobj = window.URL || window.webkitURL;
                    fabric.Image.fromURL(URLobj.createObjectURL(file.getAsFile()), (img) => {
                        if(props.canvas) {
                            props.canvas.add(img);
                        }
                    }, { left: pointer.x, top: pointer.y });
                }
            });
        }

        e.preventDefault();
    }

    /**
     * Attaches util event trigger to mouse event function.
     * @dependency props.canvas
     */
    React.useEffect(() => {
        if (props.canvas) {
            window.removeEventListener('drop', drop);

            window.addEventListener('drop', drop);

            document.removeEventListener('copy', copy);

            document.addEventListener('copy', copy);

            document.removeEventListener('paste', paste);

            document.addEventListener('paste', paste);
        }
    }, [props.canvas]);

    return <></>;
}

export default UtilHandler;