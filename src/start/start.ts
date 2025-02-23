import { QuillEditor } from "../shared/quill.js";
import { AppButtons } from "../shared/button.js";

class StartPage {
  private pageId = "create";
  public createQuill = new QuillEditor();
  private sectionContainer?: HTMLElement;

  constructor() {
    this.createQuill.loadQuillEditor(this.pageId);
    this.onPageLoad();
  }

  onSaveDocument() {
    const richTextContents = JSON.stringify(this.createQuill.getRitchText());
    localStorage.setItem("InitialDoument", richTextContents);
    AppButtons.disableButton(`${this.pageId}-action-button`);
    if (this.sectionContainer) {
      this.createQuill.disableEditor(this.sectionContainer);
    }
  }

  onPageLoad() {
    const button = AppButtons.createButton(
      `${this.pageId}-action-button`,
      "Save"
    );
    const sectionContainer = document.getElementById(this.pageId);
    if (!sectionContainer) {
      return;
    }
    this.sectionContainer = sectionContainer;
    sectionContainer.appendChild(button);
    const initialDocument = localStorage.getItem("InitialDoument");
    if (initialDocument) {
      this.createQuill.setRitchText(JSON.parse(initialDocument));
      AppButtons.disableButton(`${this.pageId}-action-button`);
      this.createQuill.disableEditor(sectionContainer);
    }
    AppButtons.attachListenerToButton(
      `${this.pageId}-action-button`,
      this.onSaveDocument.bind(this)
    );
  }
}

new StartPage();
