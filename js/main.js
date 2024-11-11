import { MainCanvas } from './canvas.js';
import { KeyboardControls, MouseControls } from './controls.js';
import { TileAtlas } from './tileAtlas.js';
import { Scene } from './scene.js';
import { OpeningScreen } from './openingScreen.js';
const setupProgram = () => {
    const mainCanvas = new MainCanvas();
    const sound = new AudioContext();
    const keyboard = new KeyboardControls();
    const mouse = new MouseControls();
    const scenes = {};
    scenes['openingScreen'] = new OpeningScreen(mainCanvas, sound, keyboard, mouse);
    let currentScene = 'openingScreen';
    return { mainCanvas, sound, keyboard, mouse, scenes, currentScene, stopLoop: 0 };
};
const setupGame = (data) => {
    const { mainCanvas, sound, keyboard, mouse } = data;
    const mapWidth = 200;
    const mapHeight = 200;
    const tileViewRange = 20;
    const tileAtlas = new TileAtlas(mainCanvas, tileViewRange);
    const { atlas, samples, tileSize } = tileAtlas.generateTileAtlas();
    data.scenes['start'] = new Scene(mainCanvas, sound, keyboard, mouse, atlas, samples, tileSize, mapWidth, mapHeight, tileViewRange);
    data.currentScene = 'start';
};
const gameLoop = (data) => {
    data.stopLoop = requestAnimationFrame(() => gameLoop(data));
    const sceneResult = data.scenes[data.currentScene].updateScene();
    if (!sceneResult) {
        data.scenes[data.currentScene].drawScene();
    }
    else {
        cancelAnimationFrame(data.stopLoop);
        data.keyboard.removeControls();
        data.mouse.removeControls(data.mainCanvas.getCanvas());
        if (data.currentScene === 'openingScreen') {
            if (sceneResult === 'New Game' || sceneResult === 'Load Game') {
                setupGame(data);
                data.stopLoop = requestAnimationFrame(() => gameLoop(data));
                data.keyboard.addControls();
                data.mouse.addControls(data.mainCanvas.getCanvas());
            }
        }
    }
};
const initializeProgram = () => {
    const data = setupProgram();
    data.stopLoop = requestAnimationFrame(() => gameLoop(data));
    data.keyboard.addControls();
    data.mouse.addControls(data.mainCanvas.getCanvas());
};
initializeProgram();
