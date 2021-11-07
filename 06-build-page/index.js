const fs = require('fs')
const fsPromises = require('fs/promises')
const path = require('path')

const pathToAssetsForCopy = path.join(__dirname, 'assets')
const pathToBundleFolder = path.join(__dirname, 'project-dist')

const pathToStylesFolder = path.join(__dirname, 'styles')
const pathToStylesFile = path.resolve(__dirname, 'project-dist', 'style.css')

const pathToComponents = path.join(__dirname, 'components')
const pathToTemplate = path.resolve(__dirname, 'template.html')
const pathToHTMLFile = path.resolve(__dirname, 'project-dist', 'index.html')

function createFolder(pathToFolder) {
  fs.mkdir(pathToFolder, { recursive: true }, (err) => {
    if (err) console.log(err)
  })
}

function copy(pathToSource, pathToCopy) {
  fsPromises
    .readdir(pathToSource, { withFileTypes: true }, () => {})
    .then((datas) => {
      datas.forEach((data) => {
        if (data.isFile()) {
          fsPromises.copyFile(
            path.join(pathToSource, data.name),
            path.join(pathToCopy, data.name)
          )
        } else {
          newPathToSource = path.resolve(pathToSource, data.name)
          newPathToCopy = path.resolve(pathToCopy, data.name)
          createFolder(newPathToCopy)
          copy(newPathToSource, newPathToCopy)
        }
      })
    })
}

createFolder(pathToBundleFolder)
copy(pathToAssetsForCopy, pathToBundleFolder)

const bundleCSS = fs.createWriteStream(pathToStylesFile)

fsPromises
  .readdir(pathToStylesFolder, { withFileTypes: true }, () => {})
  .then((datas) => {
    datas.forEach((data) => {
      if (data.isFile() && data.name.split('.')[1] === 'css') {
        const src = fs.createReadStream(
          path.join(pathToStylesFolder, data.name)
        )
        src.pipe(bundleCSS)
      }
    })
  })

const bundleHTML = fs.createWriteStream(pathToHTMLFile, () => {})

function replacer(word) {
  let template = word.replace(/{{|}}/g, '')
  let temp = fsPromises
    .readdir(pathToComponents, { withFileTypes: true }, () => {})
    .then((datas) => {
      datas.forEach((data) => {
        if (data.name.split('.')[0] === template) {
          const src = fs.createReadStream(
            path.join(pathToComponents, data.name),
            'utf-8',
            () => {}
          )
          src.on('data', (chunk) => {
            console.log('chunk', chunk)
            return chunk
          })
        }
      })
    })

  console.log(temp)
  return temp
}

fsPromises
  .readFile(pathToTemplate, 'utf-8', () => {})
  .then((data) => {
    let temp = data.replace(/{{\w+}}/g, replacer)
    console.log('temp            ', temp)
    fs.writeFile(pathToHTMLFile, temp, () => {})
  })
