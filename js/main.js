import { MainCanvas } from './canvas.js';
import { KeyboardControls, MouseControls } from './controls.js';
import { OpeningScreen } from "./openingScreen.js";
const mainCanvas = new MainCanvas();
const sound = new AudioContext();
const keyboard = new KeyboardControls();
const mouse = new MouseControls();
const openingScreen = new OpeningScreen(mainCanvas, sound, keyboard, mouse, () => { });
openingScreen.runOpeningScreen();
