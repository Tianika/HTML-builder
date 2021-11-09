const fs = require('fs')
const fsPromises = require('fs/promises')
const path = require('path')

const pathToFolder = path.join(__dirname, 'secret-folder')

fsPromises
  .readdir(pathToFolder, { withFileTypes: true }, () => {})
  .then((files) => {
    for (let file of files) {
      if (file.isFile()) {
        let pathToFile = path.join(pathToFolder, file.name)
        fs.stat(pathToFile, (err, stats) => {
          let name = path.parse(pathToFile).name
          let extName = path.extname(pathToFile).replace('.', '')
          console.log(`${name} - ${extName} - ${stats.size}b`)
        })
      }
    }
  })
