const backend = require('./src')
const { serverPort } = require('./config')

backend.listen(serverPort,
  () => console.log(`DINaaS backend running on port ${serverPort}!`)
)
