import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import SocketIOClient from 'socket.io-client';
import { Landing } from './pages'
import GlobalState from './context/globalState'
import 'rsuite/lib/styles/index.less';
import './App.css';
import { routes } from './steps'
import { websocketURL } from './config.json'

const App: React.FC = () => {
  let ioClient: any

  useEffect(() => {
    async function registerDesktop() {
      ioClient = SocketIOClient(websocketURL, {
        reconnection: true,
        reconnectionDelay: 500,
        jsonp: false,
        reconnectionAttempts: Infinity,
        transports: ['websocket']
      })
  
      ioClient.emit('registerDesktopClient', { channelId: `myChannel_${Date.now()}` })
    } 
    registerDesktop()

    ioClient.on('credential', async (payload: any) => {
      try {
        console.log('WebSocket credential', payload)
      } catch (error) {
        alert('Error credential '+error.toString())
      }
    })

    // Removing the listener before unmounting the component in order to avoid addition of multiple listener
    return () => {
      console.log('will unmount');
      ioClient.off("credential");
    }
  }, [])

  return (
    <GlobalState>
      <BrowserRouter>
        <Switch>
          {
            routes.map(({ path, page }: { path: string; page: any; }) => 
              <Route exact key={path} path={path} component={page} />
            )
          }
          <Route component={Landing} />
        </Switch>
      </BrowserRouter>
    </GlobalState>
  );
}

export default App;

