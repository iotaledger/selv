import React, { useEffect, useState } from 'react';
import SocketIOClient from 'socket.io-client';
import { Button } from 'antd';
import 'antd/dist/antd.css';
import { websocketURL } from './config.json'
import { Form } from './components'
import { createIdentity, createCredential, createPresentation } from './did'
import 'rsuite/lib/styles/index.less';
import { encrypt } from './did/helper'

// https://randomuser.me/api/
const App = () => {
  const [password, setPassword] = useState('HerpaDerperDerpaHerpaDerperDerpa')
  const [channelId, setChannelId] = useState(null)
  const [ioClient, setIoClient] = useState(null)

  useEffect(() => {
    if (ioClient) {
      ioClient.on('error', async (payload) => {
          console.error('WebSocket error', payload)
      })
    }

    // Removing the listener before unmounting the component in order to avoid addition of multiple listener
    return () => {
      ioClient.disconnect();
    }
  }, [])

  async function setChannel(channelId) {
    console.log('setChannel', channelId);
    setChannelId(channelId)
    connectWebSocket(channelId)
  }

  async function connectWebSocket(channelId) {
    console.log('connectWebSocket', channelId)
    if (channelId) {
      // ioClient && ioClient.disconnect()
      const newIoClient = SocketIOClient(websocketURL, {
        reconnection: true,
        reconnectionDelay: 500,
        jsonp: false,
        reconnectionAttempts: Infinity,
        transports: ['websocket']
      })
      setIoClient(newIoClient)

      newIoClient.emit('registerMobileClient', { channelId })
    } else {
      console.log('No websocket connection details')
    }
  } 

  async function processIdentity() {
    console.log('Creating identity')
    const result = await createIdentity()
    console.log('processIdentity result', result.status)
  } 

  async function processCredential() {
    console.log('Creating verifiable credential')
    const result = await createCredential('testCredential', {
      Language: 'English',
      UserPersonalData: {
        UserName: {
          FirstName: 'Bob',
          LastName: 'Smith'
        }
      }
    })
    console.log('processCredential result', result.status)
  } 

  async function processPresentation() {
    console.log('Creating verifiable presentation')
    const presentationJSON = await createPresentation('testCredential', 'HerpaDerperDerp')
    console.log('createPresentation result')
    console.log(JSON.stringify(presentationJSON))
    const payload = await encrypt(password, JSON.stringify(presentationJSON))
    await emitMessage(payload)
  } 

  async function emitMessage(payload) {
    console.log('emitMessage')
    console.log(ioClient)
    ioClient && ioClient.emit('verifiablePresentation', { channelId, payload })
    return true;
  } 

  return (
      <div>
        <Form setChannel={setChannel} />
        <hr />
        <Button type="primary" onClick={processIdentity}>Create Own Identity</Button>
        <hr />
        <Button type="primary" onClick={processCredential}>Process Identity</Button>
        <hr />
        <Button type="primary" onClick={processPresentation}>Create Presentation</Button>
      </div>
  );
}

export default App;

