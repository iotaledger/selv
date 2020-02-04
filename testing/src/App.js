import React, { useEffect } from 'react';
import SocketIOClient from 'socket.io-client';
import { websocketURL } from './config.json'
import { Form } from './components'
import 'rsuite/lib/styles/index.less';

const App = () => {
  let ioClient;

  useEffect(() => {
    // Removing the listener before unmounting the component in order to avoid addition of multiple listener
    return () => {
      ioClient.disconnect();
    }
  }, [])

  function setChannel(channelId) {
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

  return (
      <div>
        <Form setChannel={setChannel} />
      </div>
  );
}

export default App;

