try {
  const server = require('../lib/server')

  server.get('/qr-redirect', async (req, res) => {
      var ua = req.header('user-agent');
      if (/iphone|ipod|ipad/i.test(ua)){
          res.redirect('https://testflight.apple.com/join/3FCosIcj')
      } else {
          res.redirect('https://play.google.com/apps/testing/com.iota.selv.demo')
      }
  })

  module.exports = server
} catch (error) {
  console.log('API Error', error)
}
