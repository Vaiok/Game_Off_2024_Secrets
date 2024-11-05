import { VisibleCanvas } from './canvas.js';
import { OpeningScreen } from "./openingScreen.js";

const canvas = new VisibleCanvas();
const sound = new AudioContext();
const openingScreen = new OpeningScreen(canvas, sound, () => {});
openingScreen.runOpeningScreen();