const filesystem = require('fs');
const path = require('path');
const commandLineArgs = require('command-line-args');
// const getColors = require('get-image-colors');
const { isArray } = require('util');

const FILENAME = "images.json";
const VERSION = "0.0.1";
const DEFAULT_IMG_DIR = path.join(__dirname, 'src', 'images');
const DEFAULT_OUTPUT_DIR = path.join(__dirname, 'data');

console.log('-- createData --');
console.log();
console.log('-- Creating a JSON file containing every image and its color palette --');
console.log();

let options = commandLineArgs([
  { name: 'input-dir', alias: 'd', type: String, defaultValue: DEFAULT_IMG_DIR },
  { name: 'all-files', alias: 'a', type: Boolean, defaultValue: true },
  { name: 'input-files', alias: 'f', type: String, multiple: true, defaultOption: true },
  { name: 'num-colors', alias: 'c', type: Number, defaultValue: 11 },
  { name: 'output-dir', alias: 'o', type: String, defaultValue: DEFAULT_OUTPUT_DIR }
]);

console.log(options);

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
    options['input-files'].forEach(imgFilename => {
      const imgFilepath = path.join(imgDir, imgFilename);
      
      processImage(imgFilename, imgFilepath);
      }
    );
}
  
  function getColorsFromAllImages() {
    const imgDir = options['input-dir'];
    console.log('Loading all images from ' + imgDir);
  
    let imagesData = {
        "version": VERSION,
        "generated": new Date(),
        "numColors": options['num-colors'],
        "images": []
    };

    filesystem.readdirSync(imgDir).forEach(async imgFilename => {
      const imgFilepath = path.join(imgDir, imgFilename);
      
      processImage(imgFilename, imgFilepath);
    });

    saveOutputFile(OUTPUT_FILE, JSON.stringify(imagesData));
  }

  async function processImage(imgFilename, imgFilepath) {
    console.log('Processing image ' + imgFilepath);

    //TODO
  }

async function saveOutputFile(filepath, content) {
    console.log('Generating data output file: ' + filepath);
    filesystem.writeFile(filepath, content, err => {
      if (err) { throw err; }
      console.log('Successfully generated file: ' + filepath);
      console.log();
    });
}