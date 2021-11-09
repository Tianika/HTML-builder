const fs = require('fs')
const fsPromises = require('fs/promises')
const path = require('path')

const pathToStylesFolder = path.join(__dirname, 'styles')
const pathToStylesFile = path.resolve(__dirname, 'project-dist', 'bundle.css')

const bundle = fs.createWriteStream(pathToStylesFile)

fsPromises
  .readdir(pathToStylesFolder, { withFileTypes: true }, () => {})
  .then((datas) => {
    datas.forEach((data) => {
      let extName = path
        .extname(path.join(pathToStylesFolder, data.name))
        .replace('.', '')
      if (data.isFile() && extName === 'css') {
        const src = fs.createReadStream(
          path.join(pathToStylesFolder, data.name)
        )
        src.pipe(bundle)
      }
    })
  })
