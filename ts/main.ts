interface CanvasAndContext {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
}

type OpeningScreenOptions = 'New Game' | 'Load Game' | 'Exit';

const setupMainCanvas = (): CanvasAndContext => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) { throw new Error('Could not get 2d context from canvas'); }
    document.body.appendChild(canvas);
    return { canvas, context };
};

const adjustCanvasResolution = (canvas: HTMLCanvasElement) => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
};
const adjustableCanvasSize = (canvas: HTMLCanvasElement) => {
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    window.addEventListener('resize', () => adjustCanvasResolution(canvas));
    adjustCanvasResolution(canvas);
};
const freezeCanvasSize = (canvas: HTMLCanvasElement) => {
    window.removeEventListener('resize', () => adjustCanvasResolution(canvas));
    canvas.style.width = `${canvas.clientWidth}px`;
    canvas.style.height = `${canvas.clientHeight}px`;
    adjustCanvasResolution(canvas);
};

const findSelectedOption = (
    context: CanvasRenderingContext2D, x: number, y: number, existingOption: [OpeningScreenOptions]
): OpeningScreenOptions => {
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
    if (x > newGameLeft && x < newGameRight && y > newGameTop && y < newGameBottom) { return 'New Game'; }
    if (x > loadGameLeft && x < loadGameRight && y > loadGameTop && y < loadGameBottom) { return 'Load Game'; }
    if (x > exitLeft && x < exitRight && y > exitTop && y < exitBottom) { return 'Exit'; }
    return existingOption[0];
};
const drawOpeningScreen = (mainCanvas: CanvasAndContext, selectedOption: OpeningScreenOptions) => {
    const { canvas, context } = mainCanvas;
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = `${canvas.height / 20}px sans-serif`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    if (selectedOption === 'New Game') { context.fillStyle = 'red'; }
    else { context.fillStyle = 'white'; }
    context.fillText('New Game', canvas.width / 2, canvas.height / 2 - canvas.height / 5);
    if (selectedOption === 'Load Game') { context.fillStyle = 'red'; }
    else { context.fillStyle = 'white'; }
    context.fillText('Load Game', canvas.width / 2, canvas.height / 2);
    if (selectedOption === 'Exit') { context.fillStyle = 'red'; }
    else { context.fillStyle = 'white'; }
    context.fillText('Exit', canvas.width / 2, canvas.height / 2 + canvas.height / 5);
};
const selectOption = (event: MouseEvent, mainCanvas: CanvasAndContext, selectedOption: [OpeningScreenOptions]) => {
    const canvasBounds = mainCanvas.canvas.getBoundingClientRect();
    const x = event.clientX - canvasBounds.left / mainCanvas!.canvas.width;
    const y = event.clientY - canvasBounds.top / mainCanvas!.canvas.height;
    selectedOption[0] = findSelectedOption(mainCanvas.context, x, y, selectedOption);
    drawOpeningScreen(mainCanvas, selectedOption[0]);
};

const runOpeningScreen = (mainCanvas: CanvasAndContext | null, soundContext: AudioContext | null) => {
    mainCanvas = mainCanvas || setupMainCanvas();
    soundContext = soundContext || new AudioContext();
    adjustableCanvasSize(mainCanvas.canvas);
    let selectedOption: [OpeningScreenOptions] = ['New Game'];
    mainCanvas.canvas.addEventListener('click', (event) => selectOption(event, mainCanvas, selectedOption));
    drawOpeningScreen(mainCanvas, selectedOption[0]);
};

runOpeningScreen(null, null);