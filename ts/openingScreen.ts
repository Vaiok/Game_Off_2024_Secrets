import { MainCanvas } from './canvas.js';
import { KeyboardControls, MouseControls } from './controls.js';

type OpeningScreenOptions = 'New Game' | 'Load Game' | 'Exit';

class OpeningScreen {
    private selectedOption: OpeningScreenOptions = 'New Game';
    private chosenOption: OpeningScreenOptions | null = null;
    private drawOpeningScene: () => void;
    constructor(
        private canvas: MainCanvas, private sound: AudioContext,
        private keyboard: KeyboardControls, private mouse: MouseControls,
    ) {
        this.drawOpeningScene = this.drawScene.bind(this);
        this.setupOpeningScreen();
    }

    private cleanupAndStart(): void {
        this.canvas.freezeCanvasSize();
        window.removeEventListener('resize', this.drawOpeningScene);
        this.chosenOption = this.selectedOption;
    }
    
    private findSelectedOption(x: number, y: number): void {
        const canvas = this.canvas.getCanvas();
        const context = this.canvas.getContext()!;
        const newGameSize = context.measureText('New Game');
        const loadGameSize = context.measureText('Load Game');
        const exitSize = context.measureText('Exit');
        const newGameLeft = (canvas.width - newGameSize.width) / 2;
        const newGameRight = (canvas.width + newGameSize.width) / 2;
        const newGameTop = canvas.height / 2 - canvas.height / 5 - newGameSize.actualBoundingBoxAscent;
        const newGameBottom = canvas.height / 2 - canvas.height / 5 + newGameSize.actualBoundingBoxDescent;
        const loadGameLeft = (canvas.width - loadGameSize.width) / 2;
        const loadGameRight = (canvas.width + loadGameSize.width) / 2;
        const loadGameTop = canvas.height / 2 - loadGameSize.actualBoundingBoxAscent;
        const loadGameBottom = canvas.height / 2 + loadGameSize.actualBoundingBoxDescent;
        const exitLeft = (canvas.width - exitSize.width) / 2;
        const exitRight = (canvas.width + exitSize.width) / 2;
        const exitTop = canvas.height / 2 + canvas.height / 5 - exitSize.actualBoundingBoxAscent;
        const exitBottom = canvas.height / 2 + canvas.height / 5 + exitSize.actualBoundingBoxDescent;
        if (x > newGameLeft && x < newGameRight && y > newGameTop && y < newGameBottom) {
            this.selectedOption = 'New Game';
            this.cleanupAndStart();
        } else if (x > loadGameLeft && x < loadGameRight && y > loadGameTop && y < loadGameBottom) {
            this.selectedOption = 'Load Game';
            this.cleanupAndStart();
        } else if (x > exitLeft && x < exitRight && y > exitTop && y < exitBottom) { window.close(); }
    }

    private moveUp(): void {
        if (this.selectedOption === 'Exit') { this.selectedOption = 'Load Game'; }
        else if (this.selectedOption === 'Load Game') { this.selectedOption = 'New Game'; }
        else if (this.selectedOption === 'New Game') { this.selectedOption = 'Exit'; }
    }
    private moveDown(): void {
        if (this.selectedOption === 'New Game') { this.selectedOption = 'Load Game'; }
        else if (this.selectedOption === 'Load Game') { this.selectedOption = 'Exit'; }
        else if (this.selectedOption === 'Exit') { this.selectedOption = 'New Game'; }
    }
    private selectOption(): void {
        if (this.selectedOption === 'New Game') { this.cleanupAndStart(); }
        else if (this.selectedOption === 'Load Game') { this.cleanupAndStart(); }
        else if (this.selectedOption === 'Exit') { window.close(); }
    }
    
    public setupOpeningScreen(): void {
        this.canvas.adjustableCanvasSize();
        window.addEventListener('resize', this.drawOpeningScene);
        this.chosenOption = null;
    }

    public updateScene(): OpeningScreenOptions | null {
        if (this.mouse.buttonPressed(0)) {
            const client = this.mouse.getMousePosition();
            this.findSelectedOption(client.x, client.y);
        }
        if (this.keyboard.keyPressed('ArrowDown')) {
            this.moveDown();
            this.keyboard.discontinueKey('ArrowDown');
        }
        if (this.keyboard.keyPressed('ArrowUp')) {
            this.moveUp();
            this.keyboard.discontinueKey('ArrowUp');
        }
        if (this.keyboard.keyPressed('Enter')) {
            this.selectOption();
            this.keyboard.discontinueKey('Enter');
        }
        return this.chosenOption;
    }
    public drawScene(): void {
        const canvas = this.canvas.getCanvas();
        const context = this.canvas.getContext()!;
        const cw = canvas.width;
        const ch = canvas.height;
        context.fillStyle = 'black';
        context.fillRect(0, 0, cw, ch);
        context.font = `${ch / 20}px sans-serif`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        const menuItems = [
            {text: 'New Game', y: ch / 2 - ch / 5},
            {text: 'Load Game', y: ch / 2},
            {text: 'Exit', y: ch / 2 + ch / 5}
        ];
        for (const item of menuItems) {
            if (this.selectedOption === item.text) { context.fillStyle = 'red'; }
            else { context.fillStyle = 'white'; }
            context.fillText(item.text, cw / 2, item.y);
        }
    }
}

export { OpeningScreen };