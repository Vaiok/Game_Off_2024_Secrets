import { Position2D, Size2D } from './transformTypes.js';

interface Viewport {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

class Camera {
    private viewPort: Viewport;
    private halfWidth: number;
    private halfHeight: number;
    constructor(
        private target: Position2D,
        private width: number,
        private height: number
    ) {
        this.halfWidth = width / 2;
        this.halfHeight = height / 2;
        this.viewPort = {
            left: this.target.x - this.halfWidth,
            top: this.target.y - this.halfHeight,
            right: this.target.x + this.halfWidth,
            bottom: this.target.y + this.halfHeight
        };
    }

    public getViewport(): Viewport { return this.viewPort; }
    public getTarget(): Position2D { return this.target; }
    public getSize(): Size2D { return { width: this.width, height: this.height }; }

    public updateView(x: number, y: number): void {
        this.target.x = x;
        this.target.y = y;
        this.viewPort = {
            left: this.target.x - this.halfWidth,
            top: this.target.y - this.halfHeight,
            right: this.target.x + this.halfWidth,
            bottom: this.target.y + this.halfHeight
        };
    }
}

export { Viewport, Camera };