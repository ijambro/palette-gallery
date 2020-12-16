function showPalette(type, imageData) {
    let text = generatePaletteText(type, imageData);
    setPaletteText(text);
}

function generatePaletteText(type, imageData) {
    switch(type) {
        //TODO: Replace each generateList call with a specific generateX function
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