const fs = require('fs')
const fsPromises = require('fs/promises')
const path = require('path')

const pathToFolder = path.join(__dirname, 'secret-folder')

fsPromises
  .readdir(pathToFolder, { withFileTypes: true }, () => {})
  .then((files) => {
    for (let file of files) {
      if (file.isFile()) {
        let name = file.name.split('.')
        fs.stat(path.join(pathToFolder, file.name), (err, stats) => {
          console.log(`${name[0]} - ${name[1]} - ${stats.size}b`)
        })
      }
    }
  })
