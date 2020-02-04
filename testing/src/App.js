import React, { useEffect } from 'react';
import SocketIOClient from 'socket.io-client';
import { Button } from 'antd';
import 'antd/dist/antd.css';
import { websocketURL } from './config.json'
import { Form } from './components'
import { createIdentity, createCredential, createPresentation } from './did'
import 'rsuite/lib/styles/index.less';

const App = () => {
  let ioClient;

  useEffect(() => {
    // Removing the listener before unmounting the component in order to avoid addition of multiple listener
    return () => {
      ioClient.disconnect();
    }
  }, [])

  async function setChannel(channelId) {
    console.log('setChannel', channelId);
    connectWebSocket(channelId)
  }

  async function connectWebSocket(channelId) {
    console.log('connectWebSocket', channelId)
    if (channelId) {
      // ioClient && ioClient.disconnect()
      ioClient = SocketIOClient(websocketURL, {
        reconnection: true,
        reconnectionDelay: 500,
        jsonp: false,
        reconnectionAttempts: Infinity,
        transports: ['websocket']
      })

      ioClient.emit('registerMobileClient', { channelId })
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
    const result = await createCredential('testCredential', {Language: 'English'})
    console.log('processCredential result', result.status)
  } 

  async function processPresentation() {
    console.log('Creating verifiable presentation')
    const result = await createPresentation('testCredential')
    console.log('createPresentation result')
    console.log(result)
  } 

  return (
      <div>
        <Form setChannel={setChannel} />
        <Button type="primary" onClick={setChannel}>Connect to WebSocket channel</Button>
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

