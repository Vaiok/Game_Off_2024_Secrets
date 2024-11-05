class OpeningScreen {
    constructor(canvas, sound) {
        this.canvas = canvas;
        this.sound = sound;
    }
    drawOpeningScreen(selectedOption) {
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
        if (selectedOption === 'New Game') {
            context.fillStyle = 'red';
        }
        else {
            context.fillStyle = 'white';
        }
        context.fillText('New Game', canvas.width / 2, canvas.height / 2 - canvas.height / 5);
        if (selectedOption === 'Load Game') {
            context.fillStyle = 'red';
        }
        else {
            context.fillStyle = 'white';
        }
        context.fillText('Load Game', canvas.width / 2, canvas.height / 2);
        if (selectedOption === 'Exit') {
            context.fillStyle = 'red';
        }
        else {
            context.fillStyle = 'white';
        }
        context.fillText('Exit', canvas.width / 2, canvas.height / 2 + canvas.height / 5);
    }
    findSelectedOption(x, y, existingOption) {
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
            return 'New Game';
        }
        if (x > loadGameLeft && x < loadGameRight && y > loadGameTop && y < loadGameBottom) {
            return 'Load Game';
        }
        if (x > exitLeft && x < exitRight && y > exitTop && y < exitBottom) {
            return 'Exit';
        }
        return existingOption[0];
    }
    selectOptionMouse(event, selectedOption) {
        const canvas = this.canvas.getCanvas();
        const context = this.canvas.getContext();
        if (!context) {
            throw new Error('Could not get 2d context from canvas');
        }
        const canvasBounds = canvas.getBoundingClientRect();
        const x = event.clientX - canvasBounds.left / canvas.width;
        const y = event.clientY - canvasBounds.top / canvas.height;
        selectedOption[0] = this.findSelectedOption(x, y, selectedOption);
        this.drawOpeningScreen(selectedOption[0]);
    }
    selectOptionKeyboard(event, selectedOption, keyDown) {
        if (!keyDown[0]) {
            keyDown[0] = true;
            if (event.key === 'ArrowDown') {
                if (selectedOption[0] === 'New Game') {
                    selectedOption[0] = 'Load Game';
                }
                else if (selectedOption[0] === 'Load Game') {
                    selectedOption[0] = 'Exit';
                }
                else if (selectedOption[0] === 'Exit') {
                    selectedOption[0] = 'New Game';
                }
            }
            else if (event.key === 'ArrowUp') {
                if (selectedOption[0] === 'Exit') {
                    selectedOption[0] = 'Load Game';
                }
                else if (selectedOption[0] === 'Load Game') {
                    selectedOption[0] = 'New Game';
                }
                else if (selectedOption[0] === 'New Game') {
                    selectedOption[0] = 'Exit';
                }
            }
            else if (event.key === 'Enter') {
                if (selectedOption[0] === 'New Game') {
                    console.log('New Game');
                }
                else if (selectedOption[0] === 'Load Game') {
                    console.log('Load Game');
                }
                else if (selectedOption[0] === 'Exit') {
                    console.log('Exit');
                }
            }
            this.drawOpeningScreen(selectedOption[0]);
        }
    }
    runOpeningScreen() {
        const canvas = this.canvas.getCanvas();
        this.canvas.adjustableCanvasSize();
        let selectedOption = ['New Game'];
        let keyDown = [false];
        canvas.addEventListener('click', (event) => this.selectOptionMouse(event, selectedOption));
        window.addEventListener('keydown', (event) => this.selectOptionKeyboard(event, selectedOption, keyDown));
        window.addEventListener('keyup', () => keyDown[0] = false);
        window.addEventListener('resize', () => this.drawOpeningScreen(selectedOption[0]));
        this.drawOpeningScreen(selectedOption[0]);
    }
}
export { OpeningScreen };
