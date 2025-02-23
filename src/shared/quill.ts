export class QuillEditor {
  private quill: any;

  loadQuillEditor(elementId: string) {
    const createDiv = document.getElementById(elementId);
    if (!createDiv) {
      return;
    }
    const editorContainerNode = document.createElement("div");
    editorContainerNode.id = `${elementId}-editor-container`;
    createDiv.appendChild(editorContainerNode);
    // @ts-expect-error: indeterminate comes from ionic
    const quill = new Quill(`#${elementId}-editor-container`, {
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

  getQuill() {
    return this.quill;
  }

  disableEditor(referenceNode: HTMLElement) {
    this.quill.disable();
    const toolbar = referenceNode.querySelector(".ql-toolbar");
    if (toolbar) {
      (toolbar as HTMLDivElement).style.display = "none";
    }
    const qlContainer = referenceNode.querySelector(".ql-container");
    if (qlContainer) {
      (qlContainer as HTMLDivElement).style.border = "none";
    }
  }
}
