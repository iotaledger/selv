const backend = require('./src')
const config = require('./config')

backend.listen(config.serverPort,
  () => console.log(`DINaaS backend running on port ${config.serverPort}!`)
)
