class KeyboardControls {
    private keysPressed: { [key: string]: boolean } = {};
    constructor() {
        this.keyDown = this.keyDown.bind(this);
        this.keyUp = this.keyUp.bind(this);
    }

    private keyDown(event: KeyboardEvent): void { this.keysPressed[event.key] = true; }
    private keyUp(event: KeyboardEvent): void { this.keysPressed[event.key] = false; }

    public keyPressed(key: string): boolean { return this.keysPressed[key]; }

    public addControls(): void {
        window.addEventListener('keydown', this.keyDown);
        window.addEventListener('keyup', this.keyUp);
    }
    public removeControls(): void {
        window.removeEventListener('keydown', this.keyDown);
        window.removeEventListener('keyup', this.keyUp);
    }

    public discontinueKey(key: string): void { this.keysPressed[key] = false; }
}

class MouseControls {
    private buttonsPressed: { [button: number]: boolean } = {};
    private mousePosition: { x: number, y: number } = { x: 0, y: 0 };
    constructor() {
        this.buttonDown = this.buttonDown.bind(this);
        this.buttonUp = this.buttonUp.bind(this);
        this.mouseMoved = this.mouseMoved.bind(this);
    }

    private buttonDown(event: MouseEvent): void { this.buttonsPressed[event.button] = true; }
    private buttonUp(event: MouseEvent): void { this.buttonsPressed[event.button] = false; }
    private mouseMoved(event: MouseEvent): void {
        this.mousePosition.x = event.clientX;
        this.mousePosition.y = event.clientY;
    }

    public buttonPressed(button: number): boolean { return this.buttonsPressed[button]; }
    public getMousePosition(): { x: number, y: number } { return this.mousePosition; }

    public addControls(element: HTMLElement): void {
        element.addEventListener('mousedown', this.buttonDown);
        element.addEventListener('mouseup', this.buttonUp);
        element.addEventListener('mousemove', this.mouseMoved);
    }
    public removeControls(element: HTMLElement): void {
        element.removeEventListener('mousedown', this.buttonDown);
        element.removeEventListener('mouseup', this.buttonUp);
        element.removeEventListener('mousemove', this.mouseMoved);
    }

    public discontinueButton(button: number): void { this.buttonsPressed[button] = false; }
}

export { KeyboardControls, MouseControls };