import { MainCanvas } from "./canvas.js";
import { KeyboardControls, MouseControls } from "./controls.js";

class Scene {
    private backgroundData: number[][] = [];
    constructor(
        private mainCanvas: MainCanvas, private sound: AudioContext,
        private keyboard: KeyboardControls, private mouse: MouseControls,
        private tileAtlas: OffscreenCanvas, private tileSize: number,
        width: number, height: number
    ) {
        this.backgroundData = this.generateBackground(width, height);
    }

    private generateBackground(width: number, height: number): number[][] {
        const backgroundData = new Array(height).fill(0).map(() => new Array(width).fill(0));
        return backgroundData;
    }

    public runScene(): void {
        this.mainCanvas.getContext()!.drawImage(this.tileAtlas, 0, 0);
    }
}

export { Scene };