import { MainCanvas } from './canvas.js';
import { KeyboardControls, MouseControls } from './controls.js';
import { Tile, AtlasData, TerrainData, SampleLocations } from './tileAtlas.js';
import { PerlinNoise } from './perlinNoise.js';
import { Camera } from './camera.js';

class Scene {
    private camera: Camera;
    private backgroundData: TerrainData[][];
    constructor(
        private mainCanvas: MainCanvas, private sound: AudioContext,
        private keyboard: KeyboardControls, private mouse: MouseControls,
        private atlas: OffscreenCanvas, private samples: SampleLocations, private tileSize: number,
        mapWidth: number, mapHeight: number, tileViewRange: number
    ) {
        const target = { x: mapWidth * this.tileSize / 2, y: mapHeight * this.tileSize / 2 };
        const cameraWidth = tileViewRange * this.tileSize;
        const cameraHeight = tileViewRange * this.tileSize;
        this.camera = new Camera(target, cameraWidth, cameraHeight); 
        this.backgroundData = this.generateBackground(mapWidth, mapHeight);
    }

    private generateBackground(width: number, height: number): TerrainData[][] {
        const backgroundData: TerrainData[][] = [];
        const perlinNoise = new PerlinNoise(13116);
        let maxValue = 0;
        let minValue = 1;
        for (let y = 0; y < height; y++) {
            backgroundData[y] = [];
            for (let x = 0; x < width; x++) {
                backgroundData[y][x] = { terrainNumber: 0, sampleX: 0, sampleY: 0 };
                const noise = perlinNoise.generateNoise(x, y, 10, 1, 0.5, 2, true);
                backgroundData[y][x].terrainNumber = noise;
                maxValue = Math.max(maxValue, noise);
                minValue = Math.min(minValue, noise);
            }
        }
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                backgroundData[y][x].terrainNumber = (backgroundData[y][x].terrainNumber - minValue) / (maxValue - minValue);
                backgroundData[y][x].sampleX = Math.random() * this.tileSize * 2;
                backgroundData[y][x].sampleY = Math.random() * this.tileSize * 2;
            }
        }
        return backgroundData;
    }

    public updateScene(): string | null {
        const { x, y } = this.camera.getTarget();
        if (this.keyboard.keyPressed('ArrowUp')) { this.camera.updateView(x, y - this.tileSize); }
        if (this.keyboard.keyPressed('ArrowDown')) { this.camera.updateView(x, y + this.tileSize); }
        if (this.keyboard.keyPressed('ArrowLeft')) { this.camera.updateView(x - this.tileSize, y); }
        if (this.keyboard.keyPressed('ArrowRight')) { this.camera.updateView(x + this.tileSize, y); }
        return null;
    }

    public drawScene(): void {
        const canvas = this.mainCanvas.getCanvas();
        const context = this.mainCanvas.getContext()!;
        const viewport = this.camera.getViewport();
        const left = Math.floor(viewport.left / this.tileSize);
        const top = Math.floor(viewport.top / this.tileSize);
        const right = Math.floor(viewport.right / this.tileSize);
        const bottom = Math.floor(viewport.bottom / this.tileSize);
        const verticalLimit = Math.min(bottom, this.backgroundData.length);
        const horizontalLimit = Math.min(right, this.backgroundData[0].length);
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (let sy = top, dy = 0; sy < verticalLimit; sy++, dy++) {
            if (this.backgroundData[sy] === undefined) { continue; }
            for (let sx = left, dx = 0; sx < horizontalLimit; sx++, dx++) {
                if (this.backgroundData[sy][sx] === undefined) { continue; }
                let terrainType = '';
                if (this.backgroundData[sy][sx].terrainNumber <= 0.35) { terrainType = 'water'; }
                else if (this.backgroundData[sy][sx].terrainNumber <= 0.65) { terrainType = 'grass'; } 
                else if (this.backgroundData[sy][sx].terrainNumber <= 1.0) { terrainType = 'mountain'; }
                context.drawImage(
                    this.atlas,
                    this.samples[terrainType].x + this.backgroundData[sy][sx].sampleX,
                    this.samples[terrainType].y + this.backgroundData[sy][sx].sampleY,
                    this.tileSize, this.tileSize,
                    dx * this.tileSize, dy * this.tileSize,
                    this.tileSize, this.tileSize
                );
            }
        }
    }
}

export { Scene };