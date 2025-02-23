import { AppButtons } from "../shared/button.js";
import { QuillEditor } from "../shared/quill.js";
import { cleanEntireElement, getDisplayName } from "../shared/utils.js";
import { ChangesArrayValues } from "./review.model.js";

export class ReviewPage {
  private pageId = "review";
  private editorContainerId = "review-editor-container";
  private reviewQuill = new QuillEditor();
  private changesValues: ChangesArrayValues[] = [];
  private hiddenQuill: any;

  constructor() {
    this.onPageLoad();
  }

  onPageLoad() {
    const sectionContainer = document.getElementById(this.pageId);
    if (!sectionContainer) {
      return;
    }
    cleanEntireElement(sectionContainer, "");
    this.addTitleContents();
    this.reviewQuill.loadQuillEditor(this.editorContainerId);
    this.getDocumentsDifferences();
    this.reviewQuill.disableEditor(sectionContainer);
    const checkboxesContentContainer = document.getElementById(
      "checkboxes-content-container"
    );

    if (checkboxesContentContainer) {
      const button = AppButtons.createButton(
        `${this.pageId}-action-button`,
        "Save"
      );
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

    const { differences: changedDifferences, changes } =
      this.setDifferencesToLegible(
        differences,
        this.hiddenQuill.getQuill().getText()
      );
    this.changesValues = changes;
    const composedValue = hiddenQuillNodes.compose(changedDifferences);
    this.reviewQuill.setRitchText(composedValue);
    this.paintChangesOnUi();
  }

  setDifferencesToLegible(differences: any, originalText: string) {
    let diff = { ...differences };
    let changesArray: ChangesArrayValues[] = [];
    let currentIndex = 0;
    for (let i = 0; i < diff.ops.length; i++) {
      const op = diff.ops[i];
      op["id"] = crypto.randomUUID();
      const before = { ...op };
      let after;

      if ("retain" in op) {
        if (op.attributes) {
          const attributeChange = originalText.substring(
            currentIndex,
            currentIndex + op.retain
          );
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
        if (op.insert.includes("\n")) {
          op.insert = op.insert.replace(/\n/g, "⏎\n");
        }
        op.attributes = {
          background: "#cce8cc",
          color: "#003700",
        };
        after = { ...op };
      }

      if (op.hasOwnProperty("delete")) {
        let deletedText = originalText.substring(
          currentIndex,
          currentIndex + op.delete
        );
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

  areAllChecked(): boolean {
    const checkboxes = document.querySelectorAll("ion-checkbox");
    const finalDocument = localStorage.getItem("FinalDocument");
    if (finalDocument) {
      return false;
    }
    return Array.from(checkboxes).every(
      (checkbox) => checkbox.ariaChecked !== "mixed"
    );
  }

  changeEventListener(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target || !target.id) {
      return;
    }
    this.onChangeCheckbox(target.id, (event as CustomEvent).detail.checked);
    const buttonElement = document.getElementById(
      `${this.pageId}-action-button`
    ) as HTMLButtonElement;
    if (!buttonElement) {
      return;
    }
    setTimeout(() => {
      const areAllChecked = this.areAllChecked();
      buttonElement.disabled = !areAllChecked;
    }, 0);
  }

  paintChangesOnUi() {
    const editorContainer = document.getElementById(
      "checkboxes-content-container"
    );
    if (!editorContainer) {
      return;
    }

    const finalDocument = localStorage.getItem("FinalDocument");
    const localChanges = this.changesValues;
    localChanges
      .filter((change) => !!change.after)
      .map((change) => change.after)
      .forEach((change) => {
        const checkbox = document.createElement(
          "ion-checkbox"
        ) as HTMLInputElement;
        checkbox.indeterminate = true;
        checkbox.disabled = !!finalDocument;
        checkbox.style.color = change.attributes.color;
        checkbox.style.background = change.attributes.background;
        checkbox.setAttribute("label-placement", "end");
        checkbox.innerHTML = `${getDisplayName(change)}`;
        checkbox.id = `${change.id}`;

        checkbox.replaceWith(checkbox.cloneNode(true));
        checkbox.addEventListener("ionChange", (event) =>
          this.changeEventListener(event)
        );
        editorContainer.appendChild(checkbox);
      });
  }

  onChangeCheckbox(checkboxId: string, checked: boolean) {
    this.changesValues = this.changesValues.map((change) => {
      if (change.before.id === checkboxId) {
        let updatedChange = { ...change };

        if (checked) {
          if (updatedChange.after?.insert) {
            if (updatedChange.after.insert.includes("\n")) {
              updatedChange.before.insert = updatedChange.after.insert.replace(
                /⏎\n/g,
                "\n"
              );
            } else {
              updatedChange.before.insert = updatedChange.after.insert;
            }
          }
          if (
            updatedChange.after?.retain &&
            updatedChange.after?.attributes.strike
          ) {
            console.log({ updatedChange });

            updatedChange.before.delete = updatedChange.after.retain;
          }
          if (updatedChange.after?.attributes) {
            updatedChange.before.attributes = {
              ...updatedChange.after.attributes,
              color: "",
              background: "",
            };
          }
        } else {
          if (updatedChange.after?.insert) {
            updatedChange.before.insert = "";
          }
          if (
            updatedChange.after?.retain &&
            updatedChange.after?.attributes.strike
          ) {
            updatedChange.before.insert =
              updatedChange.after.attributes.deletedText;
            updatedChange.before.retain = updatedChange.after.delete;
            updatedChange.before.delete = undefined;
          }
          if (updatedChange.after?.attributes) {
            updatedChange.before.attributes = {} as any;
          }
        }

        return updatedChange;
      }
      return change;
    });

    const finalNodes = this.changesValues.map((change) => change.before);
    const reviewQuillNodes = this.hiddenQuill.getQuill().getContents();
    const composedValue = reviewQuillNodes.compose({ ops: finalNodes });
    this.reviewQuill.setRitchText(composedValue);

    this.reviewQuill.getQuill().update();
  }

  onSaveDocument() {
    const finalDocument = JSON.stringify(this.reviewQuill.getRitchText());
    localStorage.setItem("FinalDocument", finalDocument);
    AppButtons.disableButton(`${this.pageId}-action-button`);
  }

  addTitleContents() {
    const title = document.createElement("h2");
    title.innerHTML = "Review Changes";
    const description = document.createElement("p");
    description.innerHTML = "Review the changes to the contract";
    const reviewContainer = document.createElement("div");
    reviewContainer.className = "review-container";
    reviewContainer.innerHTML = `
              <div id="review-editor-container"></div>
              <div id="checkboxes-content-container"></div>
    `;
    const sectionContainer = document.getElementById(this.pageId);
    if (!sectionContainer) {
      return;
    }
    sectionContainer.appendChild(title);
    sectionContainer.appendChild(description);
    sectionContainer.appendChild(reviewContainer);
  }
}

new ReviewPage();
