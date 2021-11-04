const fs = require('fs')
const fsPromises = require('fs/promises')
const path = require('path')

const pathToOldFolder = path.join(__dirname, 'files')
const pathToNewFolder = path.join(__dirname, 'files-copy')

const files = []

fs.mkdir(pathToNewFolder, { recursive: true }, (err) => {
  if (err) console.log(err)
})

fsPromises
  .readdir(pathToOldFolder, { withFileTypes: true }, () => {})
  .then((datas) => {
    for (let data of datas) {
      fsPromises.copyFile(
        path.join(pathToOldFolder, data.name),
        path.join(pathToNewFolder, data.name)
      )
      files.push(data.name)
    }
  })
  .then(() => {
    fsPromises
      .readdir(pathToNewFolder, { withFileTypes: true }, () => {})
      .then((datas) => {
        datas.forEach((data) => {
          if (!files.includes(data.name)) {
            fsPromises.rm(path.join(pathToNewFolder, data.name))
          }
        })
      })
  })
