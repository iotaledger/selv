const backend = require('./src')
const { serverPort } = require('./config')

backend.listen(serverPort,
  () => console.log(`Selv backend running on port ${serverPort}!`)
)
