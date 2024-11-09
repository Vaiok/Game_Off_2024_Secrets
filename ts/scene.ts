import { MainCanvas } from "./canvas.js";
import { KeyboardControls, MouseControls } from "./controls.js";
import { AtlasData } from "./tileAtlas.js";
import { PerlinNoise } from "./perlinNoise.js";

class Scene {
    private backgroundData: number[][] = [];
    constructor(
        private mainCanvas: MainCanvas, private sound: AudioContext,
        private keyboard: KeyboardControls, private mouse: MouseControls,
        private tileAtlas: OffscreenCanvas, private atlasData: AtlasData, private tileSize: number,
        width: number, height: number
    ) {
        this.backgroundData = this.generateBackground(width, height);
    }

    private generateBackground(width: number, height: number): number[][] {
        const backgroundData = new Array(height).fill(0).map(() => new Array(width).fill(0));
        const perlinNoise = new PerlinNoise(1234567890);
        let maxValue = 0;
        let minValue = 1;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const noise = perlinNoise.generateNoise(x, y, 10, 1, 0.5, 2, true);
                backgroundData[y][x] = noise;
                maxValue = Math.max(maxValue, noise);
                minValue = Math.min(minValue, noise);
            }
        }
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                backgroundData[y][x] = (backgroundData[y][x] - minValue) / (maxValue - minValue);
            }
        }
        return backgroundData;
    }

    public updateScene(): string | null {
        return null;
    }
    public drawScene(): void {
        const context = this.mainCanvas.getContext()!;
        for (let y = 0; y < this.backgroundData.length; y++) {
            for (let x = 0; x < this.backgroundData[y].length; x++) {
                const sampleX = Math.random() * this.tileSize * 2;
                const sampleY = Math.random() * this.tileSize * 2;
                let terrainType = '';
                if (this.backgroundData[y][x] <= 0.35) { terrainType = 'water'; }
                else if (this.backgroundData[y][x] <= 0.65) { terrainType = 'grass'; } 
                else if (this.backgroundData[y][x] <= 1.0) { terrainType = 'mountain'; }
                context.drawImage(
                    this.tileAtlas,
                    this.atlasData[terrainType].x + sampleX,
                    this.atlasData[terrainType].y + sampleY,
                    this.tileSize, this.tileSize,
                    x * this.tileSize, y * this.tileSize,
                    this.tileSize, this.tileSize
                );
            }
        }
    }
}

export { Scene };