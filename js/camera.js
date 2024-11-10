class Camera {
    constructor(target, width, height) {
        this.target = target;
        this.width = width;
        this.height = height;
        this.halfWidth = width / 2;
        this.halfHeight = height / 2;
        this.viewPort = {
            left: this.target.x - this.halfWidth,
            top: this.target.y - this.halfHeight,
            right: this.target.x + this.halfWidth,
            bottom: this.target.y + this.halfHeight
        };
    }
    getViewport() { return this.viewPort; }
    getTarget() { return this.target; }
    getSize() { return { width: this.width, height: this.height }; }
    updateView(x, y) {
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
export { Camera };
