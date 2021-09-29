import request from 'superagent'
import fs from 'fs'
import csv from 'csv-parser'
import path from 'path'
import es from 'event-stream'

// const req = request.get("https://skimdb.npmjs.com/registry/_changes");
const filePath = path.join(process.cwd(), 'src', 'file.csv')

const req = fs.createReadStream(filePath)

const myProcesss = (data) =>
  new Promise((resolve) => {
    setTimeout(function () {
      resolve(data)
    }, 1000)
  })

const _res = (data) => {
  console.log(this)
  console.log(data)
}

req.pipe(csv()).pipe(
  es.through(function (data) {
    const esStream = this
    esStream.pause()
    myProcesss(data).then((resume) => {
      console.log(resume)
      esStream.resume()
    })
  })
)
