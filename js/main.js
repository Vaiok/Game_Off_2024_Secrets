import { MainCanvas } from './canvas.js';
import { KeyboardControls, MouseControls } from './controls.js';
import { Scene } from './scene.js';
import { OpeningScreen } from "./openingScreen.js";
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
const getTileSize = (canvas) => {
    const canvasWidth = canvas.getCanvas().width;
    const canvasHeight = canvas.getCanvas().height;
    return (canvasHeight <= canvasWidth) ? Math.floor(canvasHeight / 20) : Math.floor(canvasWidth / 20);
};
const setupGame = (data) => {
    const tileSize = getTileSize(data.mainCanvas);
    const tileTypes = ['grass', 'water', 'mountain'];
    const atlasDimensions = tileSize * 3 * Math.ceil(Math.sqrt(tileTypes.length));
    const tileAtlas = new OffscreenCanvas(atlasDimensions, atlasDimensions);
    data.scenes['start'] = new Scene(data.mainCanvas, data.sound, data.keyboard, data.mouse, tileAtlas, tileSize, 200, 200);
    data.currentScene = 'start';
    return { tileSize, tileTypes, atlasDimensions, tileAtlas };
};
const gameLoop = (data) => {
    data.stopLoop = requestAnimationFrame(() => gameLoop(data));
    const sceneResult = data.scenes[data.currentScene].runScene();
    if (sceneResult) {
        cancelAnimationFrame(data.stopLoop);
        data.keyboard.removeControls();
        data.mouse.removeControls(data.mainCanvas.getCanvas());
        if (sceneResult === 'New Game' || sceneResult === 'Load Game') {
            setupGame(data);
            data.stopLoop = requestAnimationFrame(() => gameLoop(data));
            data.keyboard.addControls();
            data.mouse.addControls(data.mainCanvas.getCanvas());
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
