export class AppButtons {
  constructor() {}

  static createButton(buttonId: string, buttonText: string) {
    const button = document.createElement("ion-button");
    button.id = buttonId;
    button.innerText = buttonText;
    return button as HTMLButtonElement;
  }

  static disableButton(buttonId: string) {
    const button = document.getElementById(buttonId) as HTMLButtonElement;
    if (!button) {
      return;
    }
    button.disabled = true;
  }

  static attachListenerToButton(buttonId: string, listener: () => void) {
    const button = document.getElementById(buttonId) as HTMLButtonElement;
    if (!button) {
      return;
    }
    button.addEventListener("click", listener);
  }
}
