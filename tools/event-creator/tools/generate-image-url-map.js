import fs from 'fs'
import path from 'path'

const inputDir = path.join(process.cwd(), process.argv[2]) // get the directory path from the command line argument
const outputFile = path.join(process.cwd(), process.argv[3]) // path to the .csv file where the file names will be written

// check if the argument path is a directory
fs.stat(inputDir, (err, stats) => {
  if (err) {
    console.log(`An error occurred while reading the path: ${err}`)
    return
  }

  try {
    if (!stats.isDirectory()) {
      console.log(`${inputDir} is not a directory.`)
      return
    }

    const files = fs.readdirSync(inputDir)
    fs.writeFileSync(outputFile, JSON.stringify(files, null, 2))

    console.log(`The file names have been written to ${outputFile}`)
  } catch (err) {
    console.log(`An error occurred while reading the path: ${err}`)
    process.exit(1)
  }
})
