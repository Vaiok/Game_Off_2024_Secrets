class OpeningScreen {
    constructor(canvas, sound, beginFunction) {
        this.canvas = canvas;
        this.sound = sound;
        this.selectedOption = 'New Game';
        this.keyDown = false;
        this.beginFunction = beginFunction;
        this.mouseSelect = this.selectOptionMouse.bind(this);
        this.keyboardSelect = this.selectOptionKeyboard.bind(this);
        this.releaseKey = this.keyReleased.bind(this);
        this.drawScreen = this.drawOpeningScreen.bind(this);
    }
    cleanupAndStart() {
        this.canvas.freezeCanvasSize();
        this.canvas.getCanvas().removeEventListener('click', this.mouseSelect);
        window.removeEventListener('keydown', this.keyboardSelect);
        window.removeEventListener('keyup', this.releaseKey);
        window.removeEventListener('resize', this.drawScreen);
        this.beginFunction();
    }
    drawOpeningScreen() {
        const canvas = this.canvas.getCanvas();
        const context = this.canvas.getContext();
        if (!context) {
            throw new Error('Could not get 2d context from canvas');
        }
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = `${canvas.height / 20}px sans-serif`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        if (this.selectedOption === 'New Game') {
            context.fillStyle = 'red';
        }
        else {
            context.fillStyle = 'white';
        }
        context.fillText('New Game', canvas.width / 2, canvas.height / 2 - canvas.height / 5);
        if (this.selectedOption === 'Load Game') {
            context.fillStyle = 'red';
        }
        else {
            context.fillStyle = 'white';
        }
        context.fillText('Load Game', canvas.width / 2, canvas.height / 2);
        if (this.selectedOption === 'Exit') {
            context.fillStyle = 'red';
        }
        else {
            context.fillStyle = 'white';
        }
        context.fillText('Exit', canvas.width / 2, canvas.height / 2 + canvas.height / 5);
    }
    findSelectedOption(x, y) {
        const context = this.canvas.getContext();
        if (!context) {
            throw new Error('Could not get 2d context from canvas');
        }
        const newGameSize = context.measureText('New Game');
        const loadGameSize = context.measureText('Load Game');
        const exitSize = context.measureText('Exit');
        const newGameLeft = (context.canvas.width - newGameSize.width) / 2;
        const newGameRight = newGameLeft + newGameSize.width;
        const newGameTop = context.canvas.height / 2 - context.canvas.height / 5 - newGameSize.actualBoundingBoxAscent;
        const newGameBottom = newGameTop + newGameSize.actualBoundingBoxAscent + newGameSize.actualBoundingBoxDescent;
        const loadGameLeft = (context.canvas.width - loadGameSize.width) / 2;
        const loadGameRight = loadGameLeft + loadGameSize.width;
        const loadGameTop = context.canvas.height / 2 - loadGameSize.actualBoundingBoxAscent;
        const loadGameBottom = loadGameTop + loadGameSize.actualBoundingBoxAscent + loadGameSize.actualBoundingBoxDescent;
        const exitLeft = (context.canvas.width - exitSize.width) / 2;
        const exitRight = exitLeft + exitSize.width;
        const exitTop = context.canvas.height / 2 + context.canvas.height / 5 - exitSize.actualBoundingBoxAscent;
        const exitBottom = exitTop + exitSize.actualBoundingBoxAscent + exitSize.actualBoundingBoxDescent;
        if (x > newGameLeft && x < newGameRight && y > newGameTop && y < newGameBottom) {
            this.selectedOption = 'New Game';
        }
        if (x > loadGameLeft && x < loadGameRight && y > loadGameTop && y < loadGameBottom) {
            this.selectedOption = 'Load Game';
        }
        if (x > exitLeft && x < exitRight && y > exitTop && y < exitBottom) {
            this.selectedOption = 'Exit';
        }
    }
    selectOptionMouse(event) {
        const canvas = this.canvas.getCanvas();
        const context = this.canvas.getContext();
        if (!context) {
            throw new Error('Could not get 2d context from canvas');
        }
        const canvasBounds = canvas.getBoundingClientRect();
        const x = event.clientX - canvasBounds.left / canvas.width;
        const y = event.clientY - canvasBounds.top / canvas.height;
        this.findSelectedOption(x, y);
        this.drawOpeningScreen();
    }
    selectOptionKeyboard(event) {
        if (!this.keyDown) {
            this.keyDown = true;
            if (event.key === 'ArrowDown') {
                if (this.selectedOption === 'New Game') {
                    this.selectedOption = 'Load Game';
                }
                else if (this.selectedOption === 'Load Game') {
                    this.selectedOption = 'Exit';
                }
                else if (this.selectedOption === 'Exit') {
                    this.selectedOption = 'New Game';
                }
            }
            else if (event.key === 'ArrowUp') {
                if (this.selectedOption === 'Exit') {
                    this.selectedOption = 'Load Game';
                }
                else if (this.selectedOption === 'Load Game') {
                    this.selectedOption = 'New Game';
                }
                else if (this.selectedOption === 'New Game') {
                    this.selectedOption = 'Exit';
                }
            }
            else if (event.key === 'Enter') {
                if (this.selectedOption === 'New Game') {
                    console.log('New Game');
                    this.cleanupAndStart();
                }
                else if (this.selectedOption === 'Load Game') {
                    console.log('Load Game');
                    this.cleanupAndStart();
                }
                else if (this.selectedOption === 'Exit') {
                    console.log('Exit');
                    window.close();
                }
            }
            this.drawOpeningScreen();
        }
    }
    keyReleased() { this.keyDown = false; }
    runOpeningScreen() {
        this.canvas.adjustableCanvasSize();
        this.canvas.getCanvas().addEventListener('click', this.mouseSelect);
        window.addEventListener('keydown', this.keyboardSelect);
        window.addEventListener('keyup', this.releaseKey);
        window.addEventListener('resize', this.drawScreen);
        this.drawOpeningScreen();
    }
}
export { OpeningScreen };
