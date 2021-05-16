
const replaceGrass = (text: string | null) => text && text.replace(/草/g, "www");
const replaceTextNodeValue = (node: Text) => {
    const val = node.nodeValue;
    const replacedVal = replaceGrass(val);
    if(val !== replacedVal) {
        node.nodeValue = replacedVal;
    }
};

const hasLowerChar = (str: string) => str !== str.toUpperCase();
const isIgnoreNodeName = (nodeName: string) => nodeName !== "#document" && (
    nodeName === "SCRIPT" || nodeName === "STYLE"
    || hasLowerChar(nodeName)
);

const replaceAndObserveDeep = (node: Node) => {
    if(node instanceof Text) {
        replaceTextNodeValue(node);
        observer.observe(node, { characterData: true });
    } else if(!isIgnoreNodeName(node.nodeName)) {
        node.childNodes.forEach(replaceAndObserveDeep);
        observer.observe(node, { childList: true });
    }
};

const observer = new MutationObserver(records => {
    records.forEach(record => {
        switch(record.type) {
        case "characterData":
            replaceTextNodeValue(record.target as Text);
            break;
        case "childList":
            record.addedNodes.forEach(replaceAndObserveDeep);
            break;
        }
    });
});

replaceAndObserveDeep(document);
