import { ReviewChanges } from "../review/review.model.js";

export const getDisplayName = (change: ReviewChanges) => {
  if (change.insert) {
    return "Add:  " + change.insert;
  } else if (change.attributes.deletedText) {
    return "Remove:  " + change.attributes.deletedText;
  } else if (change.attributes.attributeChange) {
    return "Change:  " + change.attributes.attributeChange;
  } else {
    return "";
  }
};

export const getDisplayTextChanged = (
  originalText: string,
  startIndex: number,
  finishIndex: number
) => {
  return originalText.substring(startIndex, finishIndex);
};

export const cleanEntireElement = (element: HTMLElement, name: string) => {
  element.innerHTML = ` <h2>${name}</h2>`;
};
