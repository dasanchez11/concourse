export class QuillEditor {
  private quill: any;

  loadQuillEditor(elementId: string) {
    const createDiv = document.getElementById(elementId);
    if (!createDiv) {
      return;
    }
    const editorContainerNode = document.createElement("div");
    editorContainerNode.id = "editor-container";
    createDiv.appendChild(editorContainerNode);

    const quill = new Quill("#editor-container", {
      theme: "snow",
    }) as unknown as any;

    this.quill = quill;
  }

  getRitchText() {
    return this.quill.getContents();
  }

  setRitchText(value: any) {
    this.quill.setContents(value);
  }
}
