import { AppButtons } from "../shared/button.js";
import { QuillEditor } from "../shared/quill.js";
class CompletePage {
    constructor() {
        this.pageId = "complete";
        this.completeQuill = new QuillEditor();
        this.onPageLoad();
    }
    onPageLoad() {
        const sectionContainer = document.getElementById(this.pageId);
        if (!sectionContainer) {
            return;
        }
        const localFinalDocument = localStorage.getItem("FinalDocument");
        if (!localFinalDocument) {
            const noDocumentsText = document.createElement("p");
            noDocumentsText.innerHTML = "No documents found";
            sectionContainer.appendChild(noDocumentsText);
            return;
        }
        this.completeQuill.loadQuillEditor(this.pageId);
        const button = AppButtons.createButton(`${this.pageId}-action-button`, "Generate New Document");
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
//# sourceMappingURL=complete.js.map