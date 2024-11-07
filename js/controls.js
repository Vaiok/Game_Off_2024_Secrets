class KeyboardControls {
    constructor() {
        this.keysPressed = {};
        this.keyDown = this.keyDown.bind(this);
        this.keyUp = this.keyUp.bind(this);
    }
    keyDown(event) { this.keysPressed[event.key] = true; }
    keyUp(event) { this.keysPressed[event.key] = false; }
    keyPressed(key) { return this.keysPressed[key]; }
    addControls() {
        window.addEventListener('keydown', this.keyDown);
        window.addEventListener('keyup', this.keyUp);
    }
    removeControls() {
        window.removeEventListener('keydown', this.keyDown);
        window.removeEventListener('keyup', this.keyUp);
    }
    discontinueKey(key) { this.keysPressed[key] = false; }
}
class MouseControls {
    constructor() {
        this.buttonsPressed = {};
        this.mousePosition = { x: 0, y: 0 };
        this.buttonDown = this.buttonDown.bind(this);
        this.buttonUp = this.buttonUp.bind(this);
        this.mouseMoved = this.mouseMoved.bind(this);
    }
    buttonDown(event) { this.buttonsPressed[event.button] = true; }
    buttonUp(event) { this.buttonsPressed[event.button] = false; }
    mouseMoved(event) {
        this.mousePosition.x = event.clientX;
        this.mousePosition.y = event.clientY;
    }
    buttonPressed(button) { return this.buttonsPressed[button]; }
    getMousePosition() { return this.mousePosition; }
    addControls(element) {
        element.addEventListener('mousedown', this.buttonDown);
        element.addEventListener('mouseup', this.buttonUp);
        element.addEventListener('mousemove', this.mouseMoved);
    }
    removeControls(element) {
        element.removeEventListener('mousedown', this.buttonDown);
        element.removeEventListener('mouseup', this.buttonUp);
        element.removeEventListener('mousemove', this.mouseMoved);
    }
    discontinueButton(button) { this.buttonsPressed[button] = false; }
}
export { KeyboardControls, MouseControls };
