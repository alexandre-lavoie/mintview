import { Vector2 } from '../../utils/vectors';

export function attachSliderControls() {
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