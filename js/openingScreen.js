class OpeningScreen {
    constructor(canvas, sound, keyboard, mouse, beginFunction) {
        this.canvas = canvas;
        this.sound = sound;
        this.keyboard = keyboard;
        this.mouse = mouse;
        this.beginFunction = beginFunction;
        this.selectedOption = 'New Game';
        this.stopLoop = 0;
        this.drawScreen = this.drawOpeningScreen.bind(this);
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
    cleanupAndStart() {
        cancelAnimationFrame(this.stopLoop);
        this.canvas.freezeCanvasSize();
        this.keyboard.removeControls();
        this.mouse.removeControls(this.canvas.getCanvas());
        window.removeEventListener('resize', this.drawScreen);
        this.beginFunction();
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
            this.cleanupAndStart();
        }
        else if (x > loadGameLeft && x < loadGameRight && y > loadGameTop && y < loadGameBottom) {
            this.selectedOption = 'Load Game';
            this.cleanupAndStart();
        }
        else if (x > exitLeft && x < exitRight && y > exitTop && y < exitBottom) {
            window.close();
        }
    }
    selectOptionMouse(clientX, clientY) {
        const canvas = this.canvas.getCanvas();
        const context = this.canvas.getContext();
        if (!context) {
            throw new Error('Could not get 2d context from canvas');
        }
        const canvasBounds = canvas.getBoundingClientRect();
        const x = clientX - canvasBounds.left / canvas.width;
        const y = clientY - canvasBounds.top / canvas.height;
        this.findSelectedOption(x, y);
        this.drawOpeningScreen();
    }
    moveUp() {
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
    moveDown() {
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
    selectOption() {
        if (this.selectedOption === 'New Game') {
            this.cleanupAndStart();
        }
        else if (this.selectedOption === 'Load Game') {
            this.cleanupAndStart();
        }
        else if (this.selectedOption === 'Exit') {
            window.close();
        }
    }
    setupOpeningScreen() {
        this.canvas.adjustableCanvasSize();
        this.keyboard.addControls();
        this.mouse.addControls(this.canvas.getCanvas());
        window.addEventListener('resize', this.drawScreen);
    }
    openingScreenLoop() {
        this.stopLoop = requestAnimationFrame(() => this.openingScreenLoop());
        if (this.mouse.buttonPressed(0)) {
            const client = this.mouse.getMousePosition();
            this.selectOptionMouse(client.x, client.y);
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
        this.drawOpeningScreen();
    }
    runOpeningScreen() {
        this.setupOpeningScreen();
        this.stopLoop = requestAnimationFrame(() => this.openingScreenLoop());
    }
}
export { OpeningScreen };
