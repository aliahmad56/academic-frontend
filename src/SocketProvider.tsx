import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth } from './redux/authSlice';
import { addNotification } from './redux/notificationSlice';

// Create a SocketContext with an initial value of null
const SocketContext = createContext<Socket | null>(null);

// Custom hook to use the SocketContext
export const useSocket = (): Socket | null => useContext(SocketContext);

// Define the type for SocketProvider props
interface SocketProviderProps {
  children: ReactNode;
}

// SocketProvider component
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);

  // Initialize the socket connection
  const socket: Socket = io('https://aca-space.com', {
    query: {
      userId: auth?.userProfile?._id,
    },
  });

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('notification', (notification) => {
      console.log('Notification received:', notification);
      // Dispatch notification to Redux or handle it here
      dispatch(addNotification(notification));
    });

    return () => {
      socket.disconnect(); // Cleanup on unmount
    };
  }, [auth?.userProfile?._id, dispatch]); // Add dispatch as a dependency

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
