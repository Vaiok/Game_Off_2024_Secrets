import { VisibleCanvas } from './canvas.js';

type Tile = 'grass' | 'water' | 'mountain';
type AtlasData = { [key: string]: Position2D };

interface Position2D {
    x: number;
    y: number;
}

const getTileSize = (canvas: VisibleCanvas): number => {
    const canvasWidth = canvas.getCanvas().width;
    const canvasHeight = canvas.getCanvas().height;
    return (canvasHeight <= canvasWidth) ? Math.floor(canvasHeight / 20) : Math.floor(canvasWidth / 20);
};
const generateTileAtlas = (tileAtlas: OffscreenCanvas, tileSize: number, tileTypes: string[]): AtlasData => {
    const atlasData: AtlasData = {};
    const atlasContext = tileAtlas.getContext('2d')!;
    let x = 0;
    let y = 0;
    for (const tileType of tileTypes) {
        let color = '#000000';
        switch (tileType) {
            case 'grass': color = '#00FF00'; break;
            case 'water': color = '#0000FF'; break;
            case 'mountain': color = '#808080'; break;
            default: color = '#000000';
        }
        atlasContext.fillStyle = color;
        atlasContext.fillRect(x, y, tileSize * 3, tileSize * 3);
        atlasData[tileType] = { x, y };
        x += tileSize * 3;
        if (x >= tileAtlas.width) {
            x = 0;
            y += tileSize * 3;
        }
    }
    return atlasData;
};

export { Tile, AtlasData, Position2D, getTileSize, generateTileAtlas };