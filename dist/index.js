function segmentChanged(event) {
    const selectedPage = event.detail.value;
    jsRouter(selectedPage);
    document.querySelectorAll(".page").forEach((page) => {
        page.classList.remove("active");
    });
    const activePage = document.getElementById(selectedPage);
    if (activePage) {
        activePage.classList.add("active");
    }
}
document.addEventListener("DOMContentLoaded", function () {
    const segment = document.getElementById("navSegment");
    if (!segment) {
        return;
    }
    segment.addEventListener("ionChange", segmentChanged);
    jsRouter();
});
const jsRouter = (page) => {
    const date = new Date().getTime();
    switch (page) {
        case "create":
            return import(`./start/start.js`);
        case "edit":
            return import("./edit/edit.js");
        case "review":
            return import("./review/review.js");
        case "complete":
            return import("./complete/complete.js");
        default:
            return import("./start/start.js");
    }
};
export {};
//# sourceMappingURL=index.js.map