import { AppButtons } from "../shared/button.js";
import { QuillEditor } from "../shared/quill.js";

class EditPage {
  private pageId = "edit";
  public editQuill = new QuillEditor();
  private sectionContainer?: HTMLElement;

  constructor() {
    this.editQuill.loadQuillEditor(this.pageId);
    this.onPageLoad();
  }

  onPageLoad() {
    const button = AppButtons.createButton(
      `${this.pageId}-actionbutton`,
      "Save"
    );
    const sectionContainer = document.getElementById(this.pageId);
    if (!sectionContainer) {
      return;
    }
    this.sectionContainer = sectionContainer;
    sectionContainer.appendChild(button);
    const initialDocument = localStorage.getItem("InitialDoument");
    const editedDoument = localStorage.getItem("EditedDoument");

    if (editedDoument) {
      button.disabled = true;
      this.editQuill.setRitchText(JSON.parse(editedDoument || "{}"));
    } else {
      this.editQuill.setRitchText(JSON.parse(initialDocument || "{}"));
    }

    AppButtons.attachListenerToButton(
      `${this.pageId}-actionbutton`,
      this.onSaveDocument.bind(this)
    );
  }

  onSaveDocument() {
    const richTextContents = JSON.stringify(this.editQuill.getRitchText());
    localStorage.setItem("EditedDoument", richTextContents);
    AppButtons.disableButton(`${this.pageId}-actionbutton`);
    if (this.sectionContainer) {
      this.editQuill.disableEditor(this.sectionContainer);
    }
  }

  checkEditedDocument() {
    const editeDocument = localStorage.getItem("EditedDoument");
    if (!editeDocument || !this.sectionContainer) {
      return;
    }
    AppButtons.disableButton(`${this.pageId}-actionbutton`);
    this.editQuill.disableEditor(this.sectionContainer);
  }
}

new EditPage();
