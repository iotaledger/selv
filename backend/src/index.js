const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const SocketIO = require('socket.io');
const { Server } = require('http');
// const { createIdentity, createAccessCredential } = require('./DID')
const { websocketPort } = require('../config');
const { createOrUpdateCompany, readData, readAllData, removeData } = require('./database');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const whitelist = ['http://localhost:3000', 'https://selv.iota.org', 'https://selv.now.sh', 'https://selv.iota-dev1.now.sh', 'https://covid-19-iota.now.sh'];
const corsOptions = {
    // methods: ["GET, POST, OPTIONS"],
    // allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            console.log('Allowed by CORS', origin);
            callback(null);
        } else {
            console.error('Not allowed by CORS', origin);
            callback(new Error('Not allowed by CORS ' + origin));
        }
    }
};

const app = express();
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(bodyParser.json());

console.log('Websocket server starting', websocketPort);

const server = new Server(app);
const socketServer = SocketIO(server);
server.listen(websocketPort);
const mobileClients = new Map();
const desktopClients = new Map();

setInterval(() => {
    try {
        if (mobileClients && mobileClients.size > 2) {
            const keys = Array.from(mobileClients.keys()).slice(0, 2);
            keys.forEach(k => {
                mobileClients.delete(k);
                console.log('Removed mobile client', k);
            });
        }

        if (desktopClients && desktopClients.size > 2) {
            const keys = Array.from(desktopClients.keys()).slice(0, 2);
            keys.forEach(k => {
                desktopClients.delete(k);
                console.log('Removed desktop client', k);
            });
        }
    } catch (error) {
        console.error('cleanUpStaleSessions', error);
    }
}, 10 * 60 * 1000); // every 10 minutes

try {
    const getChannelIdBySocket = (clients, socketId) =>
        [...clients.values()].find(entry => entry.socketId === socketId);

    socketServer.on('connection', (socket) => {
        socket.on('registerMobileClient', async (data) => {
            const { channelId } = data;
            console.info(`Mobile client connected [id=${socket.id}, channel=${channelId}]`);
            mobileClients.set(channelId, { socket, channelId, socketId: socket.id });
        });

        socket.on('registerDesktopClient', async (data) => {
            const { channelId } = data;
            console.info(`Desktop client connected [id=${socket.id}, channel=${channelId}]`);
            desktopClients.set(channelId, { socket, channelId, socketId: socket.id });

            const isMobileClient = mobileClients.has(channelId);
            if (isMobileClient) {
                const mobileClient = mobileClients.get(channelId);
                if (mobileClient && mobileClient.socket) {
                    const mobileSocket = mobileClient.socket;
                    mobileSocket && mobileSocket.emit('desktopConnected', { channelId });
                    console.info('Connection notification sent to mobile client', channelId);
                }
            }
        });

        socket.on('disconnect', async () => {
            console.info(`Client gone [id=${socket.id}]`);

            const desktopClient = getChannelIdBySocket(desktopClients, socket.id);
            if (desktopClient && desktopClient.channelId) {
                console.log('desktop client removed', desktopClient.channelId);
                await desktopClients.delete(desktopClient.channelId);
            }

            const mobileClient = getChannelIdBySocket(mobileClients, socket.id);
            if (mobileClient && mobileClient.channelId) {
                console.log('mobile client removed', mobileClient.channelId);
                await mobileClients.delete(mobileClient.channelId);
            }

            console.log('connected desktopClients', desktopClients.keys());
            console.log('connected mobileClients', mobileClients.keys());
        });

        socket.on('verifiablePresentation', async (data) => {
            const { channelId, payload } = data;
            const desktopClient = desktopClients.get(channelId);
            if (desktopClient && desktopClient.socket) {
                const desktopSocket = desktopClient.socket;
                desktopSocket && desktopSocket.emit('verifiablePresentation', payload);
                console.info('Verifiable Presentation sent to desktop client');
            }
        });

        socket.on('createCredential', async (data) => {
            const { channelId, payload } = data;
            const mobileClient = mobileClients.get(channelId);
            if (mobileClient && mobileClient.socket) {
                const mobileSocket = mobileClient.socket;
                mobileSocket && mobileSocket.emit('createCredential', payload);
                console.info('Create Credential request sent to mobile client', channelId);
            }
        });

        socket.on('createCredentialConfirmation', async (data) => {
            const { channelId, payload } = data;
            const desktopClient = desktopClients.get(channelId);
            if (desktopClient && desktopClient.socket) {
                const desktopSocket = desktopClient.socket;
                desktopSocket && desktopSocket.emit('createCredentialConfirmation', payload);
                console.info('Create Credential Confirmation sent to desktop client', channelId);
            }
        });

        socket.on('errorMessage', async (data) => {
            const { channelId, payload } = data;
            const desktopClient = desktopClients.get(channelId);
            if (desktopClient && desktopClient.socket) {
                const desktopSocket = desktopClient.socket;
                desktopSocket && desktopSocket.emit('errorMessage', payload);
            }
        });

        socket.on('rejectCredentials', async (data) => {
            const { channelId, payload } = data;
            const desktopClient = desktopClients.get(channelId);
            if (desktopClient && desktopClient.socket) {
                const desktopSocket = desktopClient.socket;
                desktopSocket && desktopSocket.emit('rejectCredentials', payload);
            }
        });

        socket.on('createCompany', async (data) => {
            const { payload } = data;
            await createOrUpdateCompany(payload);
            console.info('Company created', payload);
        });
    });
} catch (error) {
    console.error(error);
}

/*
Check if mobile client is connected
*/
app.get('/connection', cors(corsOptions), async (req, res) => {
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
        console.error(e);
        res.json({
            status: 'failure',
            error: JSON.stringify(e),
            mobileClient: null
        });
    }
});

/*
Check if mobile client is connected
*/
app.get('/connection-app', cors(corsOptions), async (req, res) => {
    try {
        const desktopClient = desktopClients.has(req.query.channelId);
        console.log('isDesktopConnected', req.query.channelId, desktopClient);
        if (desktopClient) {
            res.json({
                status: 'success'
            });
        } else {
            res.json({
                status: 'not connected'
            });
        }
    } catch (e) {
        console.error(e);
        res.json({
            status: 'failure',
            error: JSON.stringify(e),
            mobileClient: null
        });
    }
});

/*
Get company details
*/
app.get('/company', cors(corsOptions), async (req, res) => {
    try {
        const companyNumber = req.query.company;
        await removeData('company', '');
        if (companyNumber) {
            const data = await readData('company', companyNumber);
            res.json({
                status: 'success',
                data
            });
        } else {
            const data = await readAllData('company');
            res.json({
                status: 'success',
                data
            });
        }
    } catch (e) {
        console.error(e);
        res.json({
            status: 'failure',
            error: JSON.stringify(e)
        });
    }
});

/*
Activate company
*/
app.get('/activate', cors(corsOptions), async (req, res) => {
    try {
        const companyNumber = req.query.company;
        if (companyNumber) {
            const company = await readData('company', companyNumber);
            await createOrUpdateCompany({ ...company, CompanyStatus: 'Active' });
            console.log('Activating company', companyNumber);
            res.json({
                status: 'success'
            });
        }
    } catch (e) {
        console.error(e);
        res.json({
            status: 'failure',
            error: JSON.stringify(e)
        });
    }
});

app.post('/activate', cors(corsOptions), async (req, res) => {
    // res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    // res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    try {
        const companyNumber = req.body.company;
        if (companyNumber) {
            const company = await readData('company', companyNumber);
            await createOrUpdateCompany({ ...company, CompanyStatus: 'Active' });
            res.json({
                status: 'success'
            });
        }
    } catch (e) {
        console.error(e);
        res.json({
            status: 'failure',
            error: JSON.stringify(e)
        });
    }
});

/*
Remove company
*/
app.get('/remove', cors(corsOptions), async (req, res) => {
    try {
        const companyNumber = req.query.company;
        if (companyNumber) {
            await removeData('company', companyNumber);
            console.log('Removed company', companyNumber);
           
        } else {
            await removeData('company', '');
        }
        res.json({
            status: 'success'
        });
    } catch (e) {
        console.error(e);
        res.json({
            status: 'failure',
            error: JSON.stringify(e)
        });
    }
});

module.exports = app;
