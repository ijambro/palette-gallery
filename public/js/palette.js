function showPalette(type, imageData) {
    let text = generatePaletteText(type, imageData);
    setPaletteText(text);
}

function generatePaletteText(type, imageData) {
    switch(type) {
        case "html": return generateHTML(imageData.colors);
        case "css": return generateCSS(imageData.colors);
        case "scss": return generateSCSS(imageData.colors);
        case "json": return generateJson(imageData.colors);
    }
}

function generateHTML(colors) {
    let colorString = "<style>\n";
    colorString += generateCSS(colors);
    colorString += "\n</style>";
    return colorString;
}

function generateCSS(colors) {
    let colorString = ":root {\n";
    for (let i = 0; i < colors.length; i++) {
        colorString += ("--color" + (i + 1) + ": " + colors[i] + ";\n");
    }
    colorString += "}";
    return colorString;
}

function generateSCSS(colors) {
    let colorString = "";
    for (let i = 0; i < colors.length; i++) {
        colorString += ("$color" + (i + 1) + ": " + colors[i] + ";\n");
    }
    return colorString;
}

function generateJson(colors) {
    return JSON.stringify(colors);
}

function setPaletteText(text) {
    document.getElementById("codeModalText").innerText = text;
}


function updateCoolorsLink(imageData) {
    let link = "https://coolors.co/" + generateDashSeparatedColors(imageData);
    setCoolorsLink(link);
}

function generateDashSeparatedColors(imageData) {
    let text = new String(imageData.colors);
    return text.replaceAll("#", "").replaceAll(",", "-");
}

function setCoolorsLink(link) {
     document.getElementById("coolorsLink").href = link;
}

function copyToClipboard() {
    doCopyForOldBrowsers();
    document.getElementById("alertCopySuccess").style.setProperty("display", "inline");
    setTimeout(() => {
        document.getElementById("alertCopySuccess").style.setProperty("display", "none");
    }, 3000);
}

function doCopyForNewBrowsers() {
    let text = document.getElementById("codeModalText").innerText;
    navigator.clipboard.writeText(text);
}

function doCopyForOldBrowsers() {
    selectText("codeModalText");
    document.execCommand("copy");
}

function selectText(elementId) {
    if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(elementId));
        range.select();
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(document.getElementById(elementId));
        window.getSelection().addRange(range);
    }
}