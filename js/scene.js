import { PerlinNoise } from "./perlinNoise.js";
class Scene {
    constructor(mainCanvas, sound, keyboard, mouse, tileAtlas, atlasData, tileSize, width, height) {
        this.mainCanvas = mainCanvas;
        this.sound = sound;
        this.keyboard = keyboard;
        this.mouse = mouse;
        this.tileAtlas = tileAtlas;
        this.atlasData = atlasData;
        this.tileSize = tileSize;
        this.backgroundData = [];
        this.backgroundData = this.generateBackground(width, height);
    }
    generateBackground(width, height) {
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
    updateScene() {
        return null;
    }
    drawScene() {
        const context = this.mainCanvas.getContext();
        for (let y = 0; y < this.backgroundData.length; y++) {
            for (let x = 0; x < this.backgroundData[y].length; x++) {
                const sampleX = Math.random() * this.tileSize * 2;
                const sampleY = Math.random() * this.tileSize * 2;
                let terrainType = '';
                if (this.backgroundData[y][x] <= 0.35) {
                    terrainType = 'water';
                }
                else if (this.backgroundData[y][x] <= 0.65) {
                    terrainType = 'grass';
                }
                else if (this.backgroundData[y][x] <= 1.0) {
                    terrainType = 'mountain';
                }
                context.drawImage(this.tileAtlas, this.atlasData[terrainType].x + sampleX, this.atlasData[terrainType].y + sampleY, this.tileSize, this.tileSize, x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
            }
        }
    }
}
export { Scene };
