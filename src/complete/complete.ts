import { AppButtons } from "../shared/button.js";
import { QuillEditor } from "../shared/quill.js";
import { cleanEntireElement } from "../shared/utils.js";

class CompletePage {
  private pageId = "complete";
  public completeQuill = new QuillEditor();

  constructor() {
    this.onPageLoad();
  }

  onPageLoad() {
    const sectionContainer = document.getElementById(this.pageId);
    if (!sectionContainer) {
      return;
    }
    cleanEntireElement(sectionContainer, "Contract Complete");
    const localFinalDocument = localStorage.getItem("FinalDocument");
    if (!localFinalDocument) {
      const noDocumentsText = document.createElement("p");
      noDocumentsText.innerHTML = "No documents found";
      sectionContainer.appendChild(noDocumentsText);
      return;
    }
    this.completeQuill.loadQuillEditor(this.pageId);
    const button = AppButtons.createButton(
      `${this.pageId}-action-button`,
      "Generate New Document"
    );
    button.addEventListener("click", this.onCreateNewDocument.bind(this));
    sectionContainer.appendChild(button);
    this.completeQuill.disableEditor(sectionContainer);
    const finalDocumentContents = JSON.parse(localFinalDocument);
    this.completeQuill.setRitchText(finalDocumentContents);
  }

  onCreateNewDocument() {
    localStorage.removeItem("InitialDoument");
    localStorage.removeItem("EditedDoument");
    localStorage.removeItem("FinalDocument");
    location.reload();
  }
}

new CompletePage();
