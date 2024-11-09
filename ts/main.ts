import { VisibleCanvas, MainCanvas } from './canvas.js';
import { KeyboardControls, MouseControls } from './controls.js';
import { getTileSize, generateTileAtlas } from './tileAtlas.js'
import { Scene } from './scene.js';
import { OpeningScreen } from "./openingScreen.js";

type SceneManager = { [key: string]: Scene | OpeningScreen };

interface ProgramData {
    mainCanvas: MainCanvas;
    sound: AudioContext;
    keyboard: KeyboardControls;
    mouse: MouseControls;
    scenes: SceneManager;
    currentScene: string;
    stopLoop: number;
}

const setupProgram = (): ProgramData => {
    const mainCanvas = new MainCanvas();
    const sound = new AudioContext();
    const keyboard = new KeyboardControls();
    const mouse = new MouseControls();
    const scenes: SceneManager = {};
    scenes['openingScreen'] = new OpeningScreen(mainCanvas, sound, keyboard, mouse);
    let currentScene: string = 'openingScreen';
    return { mainCanvas, sound, keyboard, mouse, scenes, currentScene, stopLoop: 0 };
};

const setupGame = (data: ProgramData): void => {
    const tileSize = getTileSize(data.mainCanvas);
    const tileTypes = ['grass', 'water', 'mountain'];
    const atlasDimensions = tileSize * 3 * Math.ceil(Math.sqrt(tileTypes.length));
    const tileAtlas = new OffscreenCanvas(atlasDimensions, atlasDimensions);
    const atlasData = generateTileAtlas(tileAtlas, tileSize, tileTypes);
    data.scenes['start'] = new Scene(data.mainCanvas, data.sound, data.keyboard, data.mouse, tileAtlas, atlasData, tileSize, 40, 20);
    data.currentScene = 'start';
};
const gameLoop = (data: ProgramData): void => {
    data.stopLoop = requestAnimationFrame(() => gameLoop(data));
    const sceneResult = data.scenes[data.currentScene].updateScene();
    if (!sceneResult) { data.scenes[data.currentScene].drawScene(); }
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

const initializeProgram = (): void => {
    const data = setupProgram();
    data.stopLoop = requestAnimationFrame(() => gameLoop(data));
    data.keyboard.addControls();
    data.mouse.addControls(data.mainCanvas.getCanvas());
};
initializeProgram();