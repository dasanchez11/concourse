import { QuillEditor } from "../shared/quill.js";

class EditPage extends QuillEditor {
  private pageId = "edit";

  constructor() {
    super();
    this.loadQuillEditor(this.pageId);
    this.onPageLoad();
  }

  onPageLoad() {
    const initialDocument = localStorage.getItem("InitialDoument");
    if (initialDocument) {
      this.setRitchText(JSON.parse(initialDocument));
    }
  }

  onSaveDocument() {
    console.log("onSaveDocument");
    const richTextContents = JSON.stringify(this.getRitchText());
    localStorage.setItem("EditedDoument", richTextContents);
  }
}

new EditPage();
