const fs = require('fs')
const fsPromises = require('fs/promises')
const path = require('path')

const pathToAssetsForCopy = path.join(__dirname, 'assets')
const pathToBundleFolder = path.join(__dirname, 'project-dist', 'assets')

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

createFolder(path.join(__dirname, 'project-dist'))
createFolder(pathToBundleFolder)

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

let templates = {}

function getTemples() {
  fsPromises
    .readdir(pathToComponents, { withFileTypes: true }, () => {})
    .then((datas) => {
      datas.forEach((data) => {
        const src = fs.createReadStream(
          path.join(pathToComponents, data.name),
          'utf-8',
          () => {}
        )
        src.on('data', (chunk) => {
          templates[data.name.split('.')[0]] = chunk
        })
      })
    })
}

function replacer(word) {
  let template = word.replace(/{{|}}/g, '')

  return templates[template]
}

copy(pathToAssetsForCopy, pathToBundleFolder)
getTemples()

const bundleCSS = fs.createWriteStream(pathToStylesFile)

fsPromises
  .readdir(pathToStylesFolder, { withFileTypes: true }, () => {})
  .then((datas) => {
    datas.forEach((data) => {
      let extName = path
        .extname(path.join(pathToStylesFolder, data.name))
        .replace('.', '')
      if (data.isFile() && extName === 'css') {
        const src = fs.createReadStream(
          path.resolve(pathToStylesFolder, data.name)
        )
        src.pipe(bundleCSS)
      }
    })
  })

fsPromises
  .readFile(pathToTemplate, 'utf-8', () => {})
  .then((data) => {
    let t = data.replace(/{{\w+}}/g, replacer)

    fs.writeFile(pathToHTMLFile, t, () => {})
  })
