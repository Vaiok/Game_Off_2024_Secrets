class VisibleCanvas {
    protected canvas: HTMLCanvasElement;
    protected context: CanvasRenderingContext2D | null;
    constructor() {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        if (!this.context) { throw new Error('Could not get 2d context from canvas'); }
        document.body.appendChild(this.canvas);
    }

    public getCanvas() { return this.canvas; }
    public getContext() { return this.context; }

    protected adjustCanvasResolution() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }
}

class MainCanvas extends VisibleCanvas {
    constructor() {
        super();
    }

    public adjustableCanvasSize() {
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        window.addEventListener('resize', () => this.adjustCanvasResolution());
        this.adjustCanvasResolution();
    }

    public freezeCanvasSize() {
        window.removeEventListener('resize', () => this.adjustCanvasResolution());
        this.canvas.style.width = `${this.canvas.clientWidth}px`;
        this.canvas.style.height = `${this.canvas.clientHeight}px`;
        this.adjustCanvasResolution();
    }
}

export { VisibleCanvas, MainCanvas };