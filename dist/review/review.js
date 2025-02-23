import { AppButtons } from "../shared/button.js";
import { QuillEditor } from "../shared/quill.js";
import { getDisplayName } from "../shared/utils.js";
export class ReviewPage {
    constructor() {
        this.pageId = "review";
        this.editorContainerId = "review-editor-container";
        this.reviewQuill = new QuillEditor();
        this.changesValues = [];
        this.reviewQuill.loadQuillEditor(this.editorContainerId);
        this.onPageLoad();
    }
    onPageLoad() {
        this.getDocumentsDifferences();
        const sectionContainer = document.getElementById(this.pageId);
        if (!sectionContainer) {
            return;
        }
        this.reviewQuill.disableEditor(sectionContainer);
        const checkboxesContentContainer = document.getElementById("checkboxes-content-container");
        if (checkboxesContentContainer) {
            const button = AppButtons.createButton(`${this.pageId}-action-button`, "Save");
            button.disabled = true;
            button.style.alignSelf = "flex-end";
            button.addEventListener("click", this.onSaveDocument.bind(this));
            checkboxesContentContainer.appendChild(button);
        }
    }
    loadNewHiddenQuill() {
        const sectionNode = document.getElementById(this.editorContainerId);
        if (!sectionNode) {
            throw new Error("Section node not found");
        }
        const hiddenId = "review-editor-container-hidden";
        const divElement = document.createElement("div");
        divElement.id = hiddenId;
        divElement.style.display = "none";
        sectionNode.appendChild(divElement);
        const changesQuill = new QuillEditor();
        changesQuill.loadQuillEditor(hiddenId);
        this.hiddenQuill = changesQuill;
        return changesQuill;
    }
    getDocumentsDifferences() {
        const initialDocument = localStorage.getItem("InitialDoument");
        const editedDoument = localStorage.getItem("EditedDoument");
        if (!initialDocument || !editedDoument) {
            return;
        }
        const initialDocumentContents = JSON.parse(initialDocument);
        const editedDoumentContents = JSON.parse(editedDoument);
        this.reviewQuill.setRitchText(editedDoumentContents);
        const hiddenQuill = this.loadNewHiddenQuill();
        hiddenQuill.setRitchText(initialDocumentContents);
        const hiddenQuillNodes = hiddenQuill.getQuill().getContents();
        const reviewQuillNodes = this.reviewQuill.getQuill().getContents();
        const differences = hiddenQuillNodes.diff(reviewQuillNodes);
        const { differences: changedDifferences, changes } = this.setDifferencesToLegible(differences, this.hiddenQuill.getQuill().getText());
        this.changesValues = changes;
        const composedValue = hiddenQuillNodes.compose(changedDifferences);
        this.reviewQuill.setRitchText(composedValue);
        this.paintChangesOnUi();
    }
    setDifferencesToLegible(differences, originalText) {
        let diff = { ...differences };
        console.log({ diff });
        let changesArray = [];
        let currentIndex = 0;
        for (let i = 0; i < diff.ops.length; i++) {
            const op = diff.ops[i];
            op["id"] = crypto.randomUUID();
            const before = { ...op };
            let after;
            if ("retain" in op) {
                if (op.attributes) {
                    const attributeChange = originalText.substring(currentIndex, currentIndex + op.retain);
                    op.attributes = {
                        ...op.attributes,
                        background: "#cce8cc",
                        color: "#003700",
                        attributeChange,
                    };
                    after = { ...op };
                }
                currentIndex += op.retain;
            }
            if (op.hasOwnProperty("insert")) {
                // color it green
                if (op.insert.includes("\n")) {
                    op.insert = "⏎\n";
                }
                op.attributes = {
                    background: "#cce8cc",
                    color: "#003700",
                };
                after = { ...op };
            }
            if (op.hasOwnProperty("delete")) {
                let deletedText = originalText.substring(currentIndex, currentIndex + op.delete);
                console.log("Deleted text:", deletedText);
                currentIndex += op.delete;
                op.retain = op.delete;
                delete op.delete;
                op.attributes = {
                    background: "#e8cccc",
                    color: "#370000",
                    strike: true,
                    deletedText,
                };
                after = { ...op };
            }
            changesArray.push({ before, after });
        }
        return { differences: diff, changes: changesArray };
    }
    areAllChecked() {
        const checkboxes = document.querySelectorAll("ion-checkbox");
        const finalDocument = localStorage.getItem("FinalDocument");
        if (finalDocument) {
            return false;
        }
        return Array.from(checkboxes).every((checkbox) => checkbox.ariaChecked !== "mixed");
    }
    changeEventListener(event) {
        setTimeout(() => {
            const buttonElement = document.getElementById(`${this.pageId}-action-button`);
            if (!buttonElement) {
                return;
            }
            const areAllChecked = this.areAllChecked();
            buttonElement.disabled = !areAllChecked;
        }, 0);
    }
    paintChangesOnUi() {
        const editorContainer = document.getElementById("checkboxes-content-container");
        if (!editorContainer) {
            return;
        }
        const finalDocument = localStorage.getItem("FinalDocument");
        this.changesValues
            .filter((change) => !!change.after)
            .map((change) => change.after)
            .forEach((change) => {
            const checkbox = document.createElement("ion-checkbox");
            checkbox.indeterminate = true;
            checkbox.disabled = !!finalDocument;
            checkbox.style.color = change.attributes.color;
            checkbox.style.background = change.attributes.background;
            checkbox.setAttribute("label-placement", "end");
            checkbox.innerHTML = `${getDisplayName(change)}`;
            checkbox.id = `${change.id}`;
            checkbox.addEventListener("ionChange", this.changeEventListener.bind(this));
            editorContainer.appendChild(checkbox);
        });
    }
    onSaveDocument() {
        let finalValues = this.changesValues;
        console.log({ finalValues });
        const checkboxes = document.querySelectorAll("ion-checkbox");
        Array.from(checkboxes).forEach((checkbox, index) => {
            const checkboxElement = checkbox;
            if (!checkboxElement.checked) {
                finalValues = finalValues.map((change) => {
                    if (change.before.id === checkboxElement.id) {
                        return {
                            ...change,
                            before: {
                                insert: "",
                                attributes: { background: "", color: "" },
                                id: "",
                                hasChanges: false,
                            },
                        };
                    }
                    return change;
                });
            }
        });
        const finalNodes = finalValues.map((change) => change.before);
        const reviewQuillNodes = this.hiddenQuill.getQuill().getContents();
        const composedValue = reviewQuillNodes.compose({ ops: finalNodes });
        this.reviewQuill.setRitchText(composedValue);
        const finalDocument = JSON.stringify(this.reviewQuill.getRitchText());
        localStorage.setItem("FinalDocument", finalDocument);
        AppButtons.disableButton(`${this.pageId}-action-button`);
    }
}
new ReviewPage();
//# sourceMappingURL=review.js.map