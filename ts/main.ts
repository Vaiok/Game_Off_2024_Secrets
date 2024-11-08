import { VisibleCanvas, MainCanvas } from './canvas.js';
import { KeyboardControls, MouseControls } from './controls.js';
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

interface GameData {
    tileSize: number;
    tileTypes: string[];
    atlasDimensions: number;
    tileAtlas: OffscreenCanvas;
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

const getTileSize = (canvas: VisibleCanvas): number => {
    const canvasWidth = canvas.getCanvas().width;
    const canvasHeight = canvas.getCanvas().height;
    return (canvasHeight <= canvasWidth) ? Math.floor(canvasHeight / 20) : Math.floor(canvasWidth / 20);
};
const setupGame = (data: ProgramData): GameData => {
    const tileSize = getTileSize(data.mainCanvas);
    const tileTypes = ['grass', 'water', 'mountain'];
    const atlasDimensions = tileSize * 3 * Math.ceil(Math.sqrt(tileTypes.length));
    const tileAtlas = new OffscreenCanvas(atlasDimensions, atlasDimensions);
    data.scenes['start'] = new Scene(data.mainCanvas, data.sound, data.keyboard, data.mouse, tileAtlas, tileSize, 200, 200);
    data.currentScene = 'start';
    return { tileSize, tileTypes, atlasDimensions, tileAtlas };
};
const gameLoop = (data: ProgramData): void => {
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

const initializeProgram = (): void => {
    const data = setupProgram();
    data.stopLoop = requestAnimationFrame(() => gameLoop(data));
    data.keyboard.addControls();
    data.mouse.addControls(data.mainCanvas.getCanvas());
};
initializeProgram();