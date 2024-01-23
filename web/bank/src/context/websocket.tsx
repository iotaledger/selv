import React, { FC, ReactNode } from 'react';
import { createContext, useEffect, useState } from "react"

import SocketIOClient, { Socket } from 'socket.io-client';

import config from '../config.json';

// "undefined" means the URL will be computed from the `window.location` object
const URL = config.websocketURL // process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';

export const socket = SocketIOClient(URL, {
    autoConnect: false,
    transports: ['websocket'],
    secure: true,
});

export const WebsocketContext = createContext<[boolean, Socket]>([false, socket])

// Make sure to put WebsocketProvider higher up in
// the component tree than any consumer.
export const WebsocketProvider: FC<{children: ReactNode}> = (props) => {
    const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.removeAllListeners();
    };
  }, []);

  const ret:[boolean, Socket] = [isConnected, socket]

  return (
    <WebsocketContext.Provider value={ret}>
      {props.children}
    </WebsocketContext.Provider>
  )
}