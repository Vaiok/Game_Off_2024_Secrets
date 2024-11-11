import { PerlinNoise } from './perlinNoise.js';
class TileAtlas {
    constructor(canvas, tileViewRange) {
        this.tileSize = this.getTileSize(canvas, tileViewRange);
        this.sampleSize = this.tileSize * 3;
        this.tileTypes = ['water', 'grass', 'mountain'];
        const atlasDimensions = this.sampleSize * Math.ceil(Math.sqrt(this.tileTypes.length));
        this.tileAtlas = new OffscreenCanvas(atlasDimensions, atlasDimensions);
    }
    getTileSize(canvas, tileViewRange) {
        const canvasWidth = canvas.getCanvas().width;
        const canvasHeight = canvas.getCanvas().height;
        return (canvasHeight <= canvasWidth) ? Math.floor(canvasHeight / tileViewRange) : Math.floor(canvasWidth / tileViewRange);
    }
    hexToRgb(hex) {
        const red = parseInt(hex.substring(1, 3), 16);
        const green = parseInt(hex.substring(3, 5), 16);
        const blue = parseInt(hex.substring(5, 7), 16);
        return [red, green, blue];
    }
    generateTileAtlas() {
        const samples = {};
        const atlasContext = this.tileAtlas.getContext('2d');
        let startX = 0;
        let startY = 0;
        const perlinRed = new PerlinNoise(1854);
        const perlinGreen = new PerlinNoise(7185514);
        const perlinBlue = new PerlinNoise(212215);
        for (const tileType of this.tileTypes) {
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
            const [baseRed, baseGreen, baseBlue] = this.hexToRgb(color);
            const imageData = atlasContext.createImageData(this.sampleSize, this.sampleSize);
            for (let i = 0; i < imageData.data.length; i += 4) {
                const x = Math.floor(i / 4) % (this.sampleSize);
                const y = Math.floor(Math.floor(i / 4) / (this.sampleSize));
                const redNoise = perlinRed.generateNoise(x, y, 5, 6, 0.5, 2, false);
                const greenNoise = perlinGreen.generateNoise(x, y, 5, 6, 0.5, 2, false);
                const blueNoise = perlinBlue.generateNoise(x, y, 5, 6, 0.5, 2, false);
                imageData.data[i] = baseRed + Math.floor(redNoise * redVariance);
                imageData.data[i + 1] = baseGreen + Math.floor(greenNoise * greenVariance);
                imageData.data[i + 2] = baseBlue + Math.floor(blueNoise * blueVariance);
                imageData.data[i + 3] = 255;
            }
            atlasContext.putImageData(imageData, startX, startY);
            samples[tileType] = { x: startX, y: startY };
            startX += this.sampleSize;
            if (startX >= this.tileAtlas.width) {
                startX = 0;
                startY += this.sampleSize;
            }
        }
        return { atlas: this.tileAtlas, samples, tileSize: this.tileSize };
    }
}
export { TileAtlas };
