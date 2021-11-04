const fs = require('fs')
const path = require('path')
const process = require('process')

const pathToFile = path.join(__dirname, 'text.txt')

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
})

function addToFile(input) {
  if (input.toUpperCase().trim() === 'EXIT') {
    closeInput()
  } else {
    fs.appendFile(pathToFile, `${input}\r`, () => {})
  }
}

function closeInput() {
  console.log('See you late! Exit...')
  readline.close()
}

fs.createWriteStream(pathToFile, () => {})

readline.question('Hello! What are you want to say? ', (input) => {
  addToFile(input)
})

readline.on('line', (input) => {
  addToFile(input)
})

readline.on('SIGINT', () => {
  closeInput()
})
