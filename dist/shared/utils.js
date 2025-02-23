export const getDisplayName = (change) => {
    if (change.insert) {
        return "Add:  " + change.insert;
    }
    else if (change.attributes.deletedText) {
        return "Remove:  " + change.attributes.deletedText;
    }
    else if (change.attributes.attributeChange) {
        return "Change:  " + change.attributes.attributeChange;
    }
    else {
        return "";
    }
};
export const getDisplayTextChanged = (originalText, startIndex, finishIndex) => {
    return originalText.substring(startIndex, finishIndex);
};
export const cleanEntireElement = (element, name) => {
    element.innerHTML = ` <h2>${name}</h2>`;
};
//# sourceMappingURL=utils.js.map