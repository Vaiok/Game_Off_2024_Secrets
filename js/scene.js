import { PerlinNoise } from "./perlinNoise.js";
import { Camera } from "./camera.js";
class Scene {
    constructor(mainCanvas, sound, keyboard, mouse, tileAtlas, atlasData, tileSize, mapWidth, mapHeight, tileViewRange) {
        this.mainCanvas = mainCanvas;
        this.sound = sound;
        this.keyboard = keyboard;
        this.mouse = mouse;
        this.tileAtlas = tileAtlas;
        this.atlasData = atlasData;
        this.tileSize = tileSize;
        this.backgroundData = [];
        const target = { x: mapWidth * this.tileSize / 2, y: mapHeight * this.tileSize / 2 };
        const cameraWidth = tileViewRange * this.tileSize;
        const cameraHeight = tileViewRange * this.tileSize;
        this.camera = new Camera(target, cameraWidth, cameraHeight);
        this.backgroundData = this.generateBackground(mapWidth, mapHeight);
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
        const { x, y } = this.camera.getTarget();
        if (this.keyboard.keyPressed('ArrowUp')) {
            this.camera.updateView(x, y - this.tileSize);
        }
        if (this.keyboard.keyPressed('ArrowDown')) {
            this.camera.updateView(x, y + this.tileSize);
        }
        if (this.keyboard.keyPressed('ArrowLeft')) {
            this.camera.updateView(x - this.tileSize, y);
        }
        if (this.keyboard.keyPressed('ArrowRight')) {
            this.camera.updateView(x + this.tileSize, y);
        }
        return null;
    }
    drawScene() {
        const canvas = this.mainCanvas.getCanvas();
        const context = this.mainCanvas.getContext();
        const viewport = this.camera.getViewport();
        const left = Math.floor(viewport.left / this.tileSize);
        const top = Math.floor(viewport.top / this.tileSize);
        const right = Math.ceil(viewport.right / this.tileSize);
        const bottom = Math.ceil(viewport.bottom / this.tileSize);
        const verticalLimit = Math.min(bottom, this.backgroundData.length);
        const horizontalLimit = Math.min(right, this.backgroundData[0].length);
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (let sy = top, dy = 0; sy < verticalLimit; sy++, dy++) {
            if (this.backgroundData[sy] === undefined) {
                continue;
            }
            for (let sx = left, dx = 0; sx < horizontalLimit; sx++, dx++) {
                if (this.backgroundData[sy][sx] === undefined) {
                    continue;
                }
                const sampleX = Math.random() * this.tileSize * 2;
                const sampleY = Math.random() * this.tileSize * 2;
                let terrainType = '';
                if (this.backgroundData[sy][sx] <= 0.35) {
                    terrainType = 'water';
                }
                else if (this.backgroundData[sy][sx] <= 0.65) {
                    terrainType = 'grass';
                }
                else if (this.backgroundData[sy][sx] <= 1.0) {
                    terrainType = 'mountain';
                }
                context.drawImage(this.tileAtlas, this.atlasData[terrainType].x + sampleX, this.atlasData[terrainType].y + sampleY, this.tileSize, this.tileSize, dx * this.tileSize, dy * this.tileSize, this.tileSize, this.tileSize);
            }
        }
    }
}
export { Scene };
