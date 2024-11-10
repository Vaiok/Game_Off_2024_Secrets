import { Position2D } from './transformTypes.js';
import { VisibleCanvas } from './canvas.js';
import { PerlinNoise } from './perlinNoise.js';

type Tile = 'water' | 'grass' | 'mountain';
type AtlasData = { [key: string]: Position2D };

interface TerrainData {
    terrainNumber: number;
    sampleX: number;
    sampleY: number;
}

const getTileSize = (canvas: VisibleCanvas, tileViewRange: number): number => {
    const canvasWidth = canvas.getCanvas().width;
    const canvasHeight = canvas.getCanvas().height;
    return (canvasHeight <= canvasWidth) ? Math.floor(canvasHeight / tileViewRange) : Math.floor(canvasWidth / tileViewRange);
};
const hexToRgb = (hex: string): number[] => {
    const red = parseInt(hex.substring(1, 3), 16);
    const green = parseInt(hex.substring(3, 5), 16);
    const blue = parseInt(hex.substring(5, 7), 16);
    return [red, green, blue];
};
const generateTileAtlas = (tileAtlas: OffscreenCanvas, tileSize: number, tileTypes: Tile[]): AtlasData => {
    const atlasData: AtlasData = {};
    const atlasContext = tileAtlas.getContext('2d')!;
    let startX = 0;
    let startY = 0;
    const perlinRed = new PerlinNoise(1854);
    const perlinGreen = new PerlinNoise(7185514);
    const perlinBlue = new PerlinNoise(212215);
    for (const tileType of tileTypes) {
        let color = '#000000';
        let redVariance = 0;
        let greenVariance = 0;
        let blueVariance = 0;
        switch (tileType) {
            case 'grass':
                color = '#30CF30';
                redVariance = 50;
                greenVariance = 50;
                blueVariance = 50;
                break;
            case 'water':
                color = '#3030CF';
                redVariance = 50;
                greenVariance = 50;
                blueVariance = 50;
                break;
            case 'mountain':
                color = '#808080';
                redVariance = 50;
                greenVariance = 50;
                blueVariance = 50;
                break;
            default:
        }
        const [baseRed, baseGreen, baseBlue] = hexToRgb(color);

        const imageData = atlasContext.createImageData(tileSize * 3, tileSize * 3);
        for (let i = 0; i < imageData.data.length; i += 4) {
            const x = Math.floor(i / 4) % (tileSize * 3);
            const y = Math.floor(Math.floor(i / 4) / (tileSize * 3));
            
            const redNoise = perlinRed.generateNoise(x, y, 5, 6, 0.5, 2, false);
            const greenNoise = perlinGreen.generateNoise(x, y, 5, 6, 0.5, 2, false);
            const blueNoise = perlinBlue.generateNoise(x, y, 5, 6, 0.5, 2, false);

            imageData.data[i] = baseRed + Math.floor(redNoise * redVariance);
            imageData.data[i + 1] = baseGreen + Math.floor(greenNoise * greenVariance);
            imageData.data[i + 2] = baseBlue + Math.floor(blueNoise * blueVariance);
            imageData.data[i + 3] = 255;
        }
        atlasContext.putImageData(imageData, startX, startY);

        atlasData[tileType] = { x: startX, y: startY };
        startX += tileSize * 3;
        if (startX >= tileAtlas.width) {
            startX = 0;
            startY += tileSize * 3;
        }
    }
    return atlasData;
};

export { Tile, AtlasData, TerrainData, getTileSize, generateTileAtlas };