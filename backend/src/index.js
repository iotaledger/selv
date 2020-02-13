const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const SocketIO = require('socket.io')
const { Server } = require('http');
const { createIdentity, createAccessCredential } = require('./DID')
const { websocketPort } = require('../config')
const { createCompany, readData, readAllData } = require('./database')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express()
app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    next();
});

console.log('Websocket server starting', websocketPort)

const server = new Server(app);
const socketServer = SocketIO(server);
server.listen(websocketPort);
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

  socket.on('createCredential', async (data) => {
    const { channelId, payload } = data
    const mobileClient = mobileClients.get(channelId)
    const mobileSocket = mobileClient.socket
    mobileSocket && mobileSocket.emit('createCredential', payload)
    console.info('Create Credential request sent to mobile client', channelId)
  })

  socket.on('createCredentialConfirmation', async (data) => {
    const { channelId, payload } = data
    const desktopClient = desktopClients.get(channelId)
    const desktopSocket = desktopClient.socket
    desktopSocket && desktopSocket.emit('createCredentialConfirmation', payload)
    console.info('Create Credential Confirmation sent to desktop client', channelId)
  })

  socket.on('errorMessage', async (data) => {
    const { channelId, payload } = data
    const desktopClient = desktopClients.get(channelId)
    const desktopSocket = desktopClient.socket
    desktopSocket && desktopSocket.emit('errorMessage', payload)
  })

  socket.on('createCompany', async (data) => {
    const { payload } = data
    await createCompany(payload)
    console.info('Company created', payload)
  })
})

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

/*
Check if mobile client is connected
*/
app.get('/company', async (req, res) => {
  try {
    const companyNumber = req.query.company;
    if (companyNumber) {
      const company = await readData('company', companyNumber) 
      res.json({
        status: 'success',
        company
      });
    } else {
      const companies = await readAllData('company')
      res.json({
        status: 'success',
        companies
      });
    }
  } catch (e) {
    console.error(e)
    res.json({
      status: 'failure',
      error: JSON.stringify(e),
    });
  }
})

module.exports = app
