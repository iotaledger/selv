try {
  const server = require('../lib/server')

  server.get('/qr-redirect', async (req, res) => {
    res.json({ test: 'test' });
  })

  module.exports = server
} catch (error) {
  console.log('API Error', error)
}
