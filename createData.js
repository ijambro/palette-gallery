const filesystem = require('fs');
const path = require('path');
const commandLineArgs = require('command-line-args');
const getColors = require('get-image-colors');
const { isArray } = require('util');
const { folderToTree } = require('folder-to-tree');

const FILENAME = "images.json";
const VERSION = "0.0.1";
const DEFAULT_IMG_DIR = path.join(__dirname, 'src', 'images');
const DEFAULT_OUTPUT_DIR = path.join(__dirname, 'data');
const HAS_IMAGE_FILE_TYPE = /\.(gif|jpg|jpeg|png|svg)$/i;

console.log('-- createData --');
console.log();
console.log('-- Creating a JSON file containing every image and its color palette --');
console.log();

let options = commandLineArgs([
  { name: 'input-dir', alias: 'd', type: String, defaultValue: DEFAULT_IMG_DIR },
  { name: 'all-files', alias: 'a', type: Boolean, defaultValue: false },
  { name: 'input-files', alias: 'f', type: String, multiple: true, defaultOption: true },
  { name: 'num-colors', alias: 'c', type: Number, defaultValue: 11 },
  { name: 'output-dir', alias: 'o', type: String, defaultValue: DEFAULT_OUTPUT_DIR }
]);

console.log(options);
console.log();

const OUTPUT_FILE = path.join(options['output-dir'], FILENAME);

if (options['all-files']) {
  createOutputDir();
  getColorsFromAllImages();
}
else if (options['input-files'] && isArray(options['input-files']) && options['input-files'].length > 0) {
  createOutputDir();
  getColorsFromSpecifiedImages();
}
else {
  console.log('You must specify at least one image for me to include in the output data file');
}

function createOutputDir() {
    const outputDir = options['output-dir'];
    if (!filesystem.existsSync(outputDir)){
      filesystem.mkdirSync(outputDir);
    }
  }

async function getColorsFromSpecifiedImages() {
    const imgDir = options['input-dir'];
    const allFiles = options['input-files'];
    process(imgDir, allFiles);
}
  
function getColorsFromAllImages() {
    const imgDir = options['input-dir'];
    console.log('Loading all images from ' + imgDir);
    const allFiles = filesystem.readdirSync(imgDir);
    process(imgDir, allFiles);
}

async function process(imgDir, imgFilenames) {
    let imagesData = {
        "version": VERSION,
        "generated": new Date(),
        "numColors": options['num-colors'],
        "images": []
    };

    let folderToTreeOptions = {
      isIgnoreHiddenFolderOrFile: true,
      ignoreFilePattern: /node_modules/,
      reachLeafNodeCallback: processImageFile
    };
  
    let imageData = await folderToTree(options['input-dir'], folderToTreeOptions);
    console.log('folderToTree returned:');
    console.log(imageData);
    imagesData.images.push(imageData); 

    // for (const imgFilename of imgFilenames) {
    //     if (HAS_IMAGE_FILE_TYPE.test(imgFilename)) {
    //         const imgFilepath = path.join(imgDir, imgFilename);

    //         let imageData = await processImage(imgFilename, imgFilepath);
    //         console.log('processImage returned:');
    //         console.log(imageData);
    //         imagesData.images.push(imageData);      
    //     }
    // }

    saveOutputFile(OUTPUT_FILE, JSON.stringify(imagesData, null, 4));
  }

  function processImageDummy(imgFilepath) {
    console.log('Processing dummy image ' + imgFilepath);
    let imgFilename = imgFilepath.substring(imgFilepath.lastIndexOf("/") + 1);

    let imageData = {
        "name": imgFilename,
        "url": "/images/" + imgFilename,
        "colors": []
    };

    return imageData;
  }

  async function processImageFile(imgFilepath) {
    console.log('Processing image file ' + imgFilepath);
    let imgFilename = imgFilepath.substring(imgFilepath.lastIndexOf("/") + 1);

    if (HAS_IMAGE_FILE_TYPE.test(imgFilename)) {
      return await processImage(imgFilename, imgFilepath);
    }
    else {
      return null;
    }
  }

  async function processImage(imgFilename, imgFilepath) {
    console.log('Processing image ' + imgFilepath);

    let imageData = {
        "name": imgFilename,
        "url": "/images/" + imgFilename,
        "colors": []
    };

    const colorOptions = {
        count: options['num-colors']
    };
    const colorArray = await getColors(imgFilepath, colorOptions);

    for (c of colorArray) {
        imageData.colors.push(c.hex());
    }

    return imageData;
  }

async function saveOutputFile(filepath, content) {
    console.log('Generating data output file: ' + filepath);
    filesystem.writeFile(filepath, content, err => {
      if (err) { throw err; }
      console.log('Successfully generated file: ' + filepath);
      console.log();
    });
}