class Scene {
    constructor(mainCanvas, sound, keyboard, mouse, tileAtlas, tileSize, width, height) {
        this.mainCanvas = mainCanvas;
        this.sound = sound;
        this.keyboard = keyboard;
        this.mouse = mouse;
        this.tileAtlas = tileAtlas;
        this.tileSize = tileSize;
        this.backgroundData = [];
        this.backgroundData = this.generateBackground(width, height);
    }
    generateBackground(width, height) {
        const backgroundData = new Array(height).fill(0).map(() => new Array(width).fill(0));
        return backgroundData;
    }
    runScene() {
        this.mainCanvas.getContext().drawImage(this.tileAtlas, 0, 0);
    }
}
export { Scene };
