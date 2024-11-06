import { MainCanvas } from './canvas.js';
import { OpeningScreen } from "./openingScreen.js";
const mainCanvas = new MainCanvas();
const sound = new AudioContext();
const openingScreen = new OpeningScreen(mainCanvas, sound, () => { });
openingScreen.runOpeningScreen();
