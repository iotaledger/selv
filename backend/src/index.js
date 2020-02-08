const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const SocketIO = require('socket.io')
const { Server } = require('http');
const { storeOwnIdentity, getOwnIdentity } = require('./helper')
const { createIdentity, createAccessCredential } = require('./DID')
const config = require('../config')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express()
app.use(cors());
app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    next();
});

const processOwnIdentity = async () => {
  try {
    const did = await getOwnIdentity()
    if (!did) {
      const identity = await createIdentity()
      console.log('New identity created', identity)
      storeOwnIdentity(identity)
    }
  } catch (e) {
    console.error('processOwnIdentity', e)
  }
}

processOwnIdentity()

console.log('Websocket server starting', config.websocketPort)

const server = new Server(app);
const socketServer = SocketIO(server);
server.listen(config.websocketPort);
// const server = io.listen(config.websocketPort)
const mobileClients = new Map()
const desktopClients = new Map()

const getChannelIdBySocket = (clients, socketId) =>
  [...clients.values()].find(entry => entry.socketId === socketId);

socketServer.on('connection', (socket) => {
  
  socket.on('registerMobileClient', async (data) => {
    const { channelId } = data
    console.info(`Mobile client connected [id=${socket.id}, channel=${channelId}]`)
    mobileClients.set(channelId, { socket, channelId, socketId: socket.id })
  })

  socket.on('registerDesktopClient', async (data) => {
    const { channelId } = data
    console.info(`Desktop client connected [id=${socket.id}, channel=${channelId}]`)
    desktopClients.set(channelId, { socket, channelId, socketId: socket.id })
  })

  socket.on('disconnect', async () => {
    console.info(`Client gone [id=${socket.id}]`)
    
    const desktopClient = getChannelIdBySocket(desktopClients, socket.id)
    if (desktopClient && desktopClient.channelId) {
      console.log('desktop client removed', desktopClient.channelId)
      await desktopClients.delete(desktopClient.channelId)
    }
    
    const mobileClient = getChannelIdBySocket(mobileClients, socket.id)
    if (mobileClient && mobileClient.channelId) {
      console.log('mobile client removed', mobileClient.channelId)
      await mobileClients.delete(mobileClient.channelId)
    }

    console.log('connected desktopClients', desktopClients.keys())
    console.log('connected mobileClients', mobileClients.keys())
  })

  socket.on('verifiablePresentation', async (data) => {
    const { channelId, payload } = data
    const desktopClient = desktopClients.get(channelId)
    const desktopSocket = desktopClient.socket
    desktopSocket && desktopSocket.emit('verifiablePresentation', payload)
    console.info('Verifiable Presentation sent to desktop client')
  })
})


//       const socket = clients.get(idInput)
//       const { credential, serverRoot } = await createAccessCredential()
//       socket && socket.emit('credential', { credential })

/*
Check if mobile client is connected
*/
app.get('/connection', async (req, res) => {
  try {
    const mobileClient = mobileClients.has(req.query.channelId);
    console.log('isMobileConnected', req.query.channelId, mobileClient);
    if (mobileClient) {
      res.json({
        status: 'success'
      });
    } else {
      res.json({
        status: 'not connected'
      });
    }
  } catch (e) {
    console.error(e)
    res.json({
      status: 'failure',
      error: JSON.stringify(e),
      mobileClient: null
    });
  }
})


module.exports = app
