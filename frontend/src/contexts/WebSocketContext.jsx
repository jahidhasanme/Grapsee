import { createContext, useContext, useEffect, useState } from 'react';
import GrapseeIcon from '../assets/grapsee.png';

const WS_URL = 'ws://localhost:4000';
export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);
  const [isLoading, setLoading] = useState(true); 

  useEffect(() => {
    const socket = new WebSocket(WS_URL);

    let keepAliveInterval;

    socket.onopen = () => {
      setWs(socket);
      setLoading(false);

      keepAliveInterval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'PING' }));
        }
      }, 30000);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setLoading(false);
    };

    socket.onclose = () => {
      console.error('WebSocket connection closed.');
      setLoading(false);
      clearInterval(keepAliveInterval);
    };
    
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  if (isLoading) {
    return <div style={{ width: '100%', height: '100%', position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px'}}>
      <img src={GrapseeIcon} style={{ height: '120px', width: '120px' }} alt='Loading...'/>
    </div>;
  }

  return (
    <WebSocketContext.Provider value={ws}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const useSendMessage = () => {
  const ws = useContext(WebSocketContext);
  
  const sendMessage = (type, payload) => {
    if (ws) {
      ws.send(JSON.stringify({ type, payload }));
    } else {
      throw new Error('WebSocket connection not established.');
    }
  };

  return sendMessage;
};
