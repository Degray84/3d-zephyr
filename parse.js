const fs = require('fs');
const path = require('path');

// This function reads a file and returns its contents as a string
async function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

// This function writes the given data to a file
async function writeFile(filePath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// This function reads all of the JSON files in a given directory (and its subdirectories)
// and returns their contents as an array of objects
async function readJsonFiles(dir) {
  const fileNames = await readDirectory(dir);
  const jsonFiles = fileNames.filter(fileName => fileName.endsWith('.json'));
  const jsonData = await Promise.all(
    jsonFiles.map(fileName => readJsonFile(path.join(dir, fileName)))
  );
  return jsonData;
}

// This function reads a JSON file and returns its contents as an object
async function readJsonFile(filePath) {
  const fileData = await readFile(filePath);
  return JSON.parse(fileData);
}

// This function reads all of the files in a given directory (and its subdirectories)
// and returns their names as an array
async function readDirectory(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, { withFileTypes: true }, (err, fileNames) => {
      if (err) {
        reject(err);
      } else {
        // Recursively read subdirectories
        const subdirPromises = fileNames
          .filter(dirent => dirent.isDirectory())
          .map(dirent => readDirectory(path.join(dir, dirent.name)));
        Promise.all(subdirPromises).then(subdirContents => {
          resolve(fileNames.concat(...subdirContents));
        });
      }
    });
  });
}

async function main() {
  // Replace "./data" with the path to the directory containing your JSON files
  const jsonData = await readJsonFiles('./src/locales/ru');

  console.log(jsonData);

  // Flatten the array of objects into a single string
  const output = jsonData.map(obj => JSON.stringify(obj)).join('');

  // Replace "./output.txt" with the desired path for the output file
  await writeFile('./output.txt', output);
}

main();
