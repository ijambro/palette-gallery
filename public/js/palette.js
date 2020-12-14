function showPalette(type, imageData) {
    let text = generatePaletteText(type, imageData);
    setPaletteText(text);
}

function generatePaletteText(type, imageData) {
    switch(type) {
        //TODO: Replace each generateList call with a specific generateX function
        case "html": return generateList(imageData);
        case "css": return generateList(imageData);
        case "scss": return generateList(imageData);
        case "sass": return generateList(imageData);
        case "js": return generateList(imageData);
    }
}

function generateList(imageData) {
    return imageData.colors;
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