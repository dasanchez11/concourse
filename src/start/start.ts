import { QuillEditor } from "../shared/quill.js";
import { AppButtons } from "../shared/button.js";

class StartPage extends QuillEditor {
  private pageId = "create";

  constructor() {
    super();
    this.loadQuillEditor(this.pageId);
    this.onPageLoad();
  }

  onSaveDocument() {
    console.log("onSaveDocument");
    const richTextContents = JSON.stringify(this.getRitchText());
    localStorage.setItem("InitialDoument", richTextContents);
    AppButtons.disableButton("action-button");
  }

  onPageLoad() {
    const button = AppButtons.createButton("action-button", "Save");
    const sectionContainer = document.getElementById(this.pageId);
    if (!sectionContainer) {
      return;
    }
    sectionContainer.appendChild(button);
    const initialDocument = localStorage.getItem("InitialDoument");
    if (initialDocument) {
      this.setRitchText(JSON.parse(initialDocument));
      AppButtons.disableButton("action-button");
    }
    AppButtons.attachListenerToButton("action-button", this.onSaveDocument);
  }
}

new StartPage();
