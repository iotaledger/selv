import React, { useEffect, useState } from 'react';
import SocketIOClient from 'socket.io-client';
import AppContext from './app-context';
import { routes, mainSteps, subSteps } from '../steps'
import { websocketURL } from '../config.json'

const GlobalState = ({ children }: any) => {
  const [language, setLanguage] = useState('en')
  
  let ioClient: any

  useEffect(() => {
    async function connectWS() {
      await connectWebSocket();
    } 

    connectWS()
    // Removing the listener before unmounting the component in order to avoid addition of multiple listener
    return () => {
      console.log('will unmount');
      // ioClient?.off("credential");
      ioClient?.disconnect();
    }
  }, [ioClient])

  async function connectWebSocket() {
    const storedChannelDetails = await localStorage.getItem('WebSocket_DID') || null;
    const channelDetails = storedChannelDetails && JSON.parse(storedChannelDetails);

    if (channelDetails?.channelId) {
      ioClient?.disconnect()
      ioClient = SocketIOClient(websocketURL, {
        reconnection: true,
        reconnectionDelay: 500,
        jsonp: false,
        reconnectionAttempts: Infinity,
        transports: ['websocket']
      })

      ioClient?.emit('registerDesktopClient', { channelId: channelDetails?.channelId })
    } else {
      console.log('No websocket connection details')
    }

  } 

  // ioClient.on('credential', async (payload: any) => {
  //   try {
  //     console.log('WebSocket credential', payload)
  //   } catch (error) {
  //     alert('Error credential '+error.toString())
  //   }
  // })

  function changeLanguage(language: string) {
    setLanguage(language);
  };

  return (
    <AppContext.Provider value={{ 
      changeLanguage, language, 
      mainSteps, subSteps, routes,
      connectWebSocket, ioClient
    }}>
        {children}
    </AppContext.Provider>
  );
}

export default GlobalState;