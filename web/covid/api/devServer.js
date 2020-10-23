const express = require('express')
const next = require('next')
const cors = require('cors')
const bodyParser = require('body-parser')
const API = require('./routes')

const port = 3000
const app = next({ dev: true })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.use(cors())

  server.use(bodyParser.json())
  server.use(
    bodyParser.urlencoded({
      extended: true
    })
  )

  server.use(API)

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
