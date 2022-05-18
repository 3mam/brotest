let fs = require("fs")
let path = require("path")
let { spawn } = require("child_process")

let getFiles = (folder) =>
  fs
    .readdirSync(folder, { withFileTypes: true })
    .reduce(
      (a, f) => [
        ...a,
        f.isDirectory()
          ? getFiles(`${folder}${f.name}/`)
          : `${folder}${f.name}`,
      ],
      []
    )
    .flat()

let getTestFilesList = (folder) =>
  getFiles(folder).filter((v) => v.includes(".test."))

let createHtml = (testFilesList, source) => {
  let testFiles = testFilesList.map((v) => ({
    name: v.replaceAll(/(\/|\.)/gm, "_"),
    file: v,
  }))

  let objects = testFiles.map(
    (v) => `{name:"${v.name}", file:"${v.file}", obj:import("./${v.file}")}\n`
  )

  fs.writeFile(
    "test.html",
    source.replace('"{objects}"', objects),
    (err) => err
  )
}

let htmlPath = path.resolve(__dirname, "test.html")
let html = fs.readFileSync(htmlPath).toString()
let arg = process.argv[2]
if (!arg) {
  console.log("Missing parameter with the folder that contain code.")
  process.exit()
}
let folder = arg.charAt(arg.length - 1) === "/" ? arg : arg + "/"

createHtml(getTestFilesList(folder), html)

let testFilesListLen = 0
setInterval(() => {
  let newTestFilesList = getTestFilesList(folder)
  let newTestFilesListLen = newTestFilesList.toString().length
  if (testFilesListLen === newTestFilesListLen) return

  testFilesListLen = newTestFilesListLen
  createHtml(newTestFilesList, html)
}, 1000)

spawn("npx", ["parcel", "--lazy", "test.html"]).stdout.on("data", (data) => {
  let str = data.toString()
  if (str.includes("http")) {
    process.stdout.write(str)
  } else {
    process.stdout.clearLine()
    process.stdout.write(str.replace("\n", "\r"))
  }
})
