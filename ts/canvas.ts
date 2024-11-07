class VisibleCanvas {
    protected canvas: HTMLCanvasElement = document.createElement('canvas');
    protected context: CanvasRenderingContext2D | null = this.canvas.getContext('2d');
    constructor() {
        if (!this.context) { throw new Error('Could not get 2d context from canvas'); }
        document.body.appendChild(this.canvas);
    }

    public getCanvas(): HTMLCanvasElement { return this.canvas; }
    public getContext(): CanvasRenderingContext2D | null { return this.context; }

    protected adjustCanvasResolution(): void {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }
}

class MainCanvas extends VisibleCanvas {
    constructor() {
        super();
    }

    public adjustableCanvasSize(): void {
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        window.addEventListener('resize', () => this.adjustCanvasResolution());
        this.adjustCanvasResolution();
    }

    public freezeCanvasSize(): void {
        window.removeEventListener('resize', () => this.adjustCanvasResolution());
        this.canvas.style.width = `${this.canvas.clientWidth}px`;
        this.canvas.style.height = `${this.canvas.clientHeight}px`;
        this.adjustCanvasResolution();
    }
}

export { VisibleCanvas, MainCanvas };