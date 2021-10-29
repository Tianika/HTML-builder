const fs = require('fs')
const path = require('path')

const pathToFile = path.join(__dirname, 'text.txt')
const src = fs.createReadStream(pathToFile)
src.pipe(process.stdout)
