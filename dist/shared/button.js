export class AppButtons {
    constructor() { }
    static createButton(buttonId, buttonText) {
        const button = document.createElement("ion-button");
        button.id = buttonId;
        button.innerText = buttonText;
        return button;
    }
    static disableButton(buttonId) {
        const button = document.getElementById(buttonId);
        if (!button) {
            return;
        }
        button.disabled = true;
    }
    static attachListenerToButton(buttonId, listener) {
        const button = document.getElementById(buttonId);
        if (!button) {
            return;
        }
        button.addEventListener("click", listener);
    }
}
//# sourceMappingURL=button.js.map