export class QuillEditor {
    loadQuillEditor(elementId) {
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
        });
        this.quill = quill;
    }
    getRitchText() {
        return this.quill.getContents();
    }
    setRitchText(value) {
        this.quill.setContents(value);
    }
    getQuill() {
        return this.quill;
    }
    disableEditor(referenceNode) {
        this.quill.disable();
        const toolbar = referenceNode.querySelector(".ql-toolbar");
        if (toolbar) {
            toolbar.style.display = "none";
        }
        const qlContainer = referenceNode.querySelector(".ql-container");
        if (qlContainer) {
            qlContainer.style.border = "none";
        }
    }
}
//# sourceMappingURL=quill.js.map