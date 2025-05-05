export class Canvas {
    constructor(canvasId) {
        this.canvas;
        this.parent;
        this.canvasId = canvasId;
    }

    render(parent) {
        this.canvas = document.createElement('canvas');
        this.canvas.id = this.canvasId;
        
        parent.appendChild(this.canvas); 
    }
}