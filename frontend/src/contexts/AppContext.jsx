import { createContext, useState, useContext, useEffect } from 'react';
import { useSendMessage, useWebSocket } from './WebSocketContext';
import NotificationSound from '../assets/notification.mp3';
import { Snackbar } from '@mui/material';

const AppContext = createContext();

const AppContextProvider = ({ children }) => {

  const ws = useWebSocket();
  const sendMessage = useSendMessage();

  const [user, setUser] = useState(JSON.parse(window.localStorage.getItem('user') || '{}'));
  const [token, setToken] = useState(JSON.parse(window.localStorage.getItem('token')));
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  const [allChats, setAllChats] = useState([]);
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [notifictionCounter, setNotificationCounter] = useState(Number.parseInt(window.localStorage.getItem('new_notification') || '0'));
  const [messageCounter, setMessageCounter] = useState(Number.parseInt(window.localStorage.getItem('new_message') || '0'));

  const [error, setError] = useState(null);

  useEffect(() => {
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case 'ERROR':
          //console.error('Error: ' + message.payload);
          //setError(message.payload)
          break;
        case 'LOGIN_SUCCESS':
          window.localStorage.setItem('user', JSON.stringify(message.payload.user));
          window.localStorage.setItem('token', JSON.stringify(message.payload.token));
          setUser(message.payload.user);
          setToken(message.payload.token);
          break;
        case 'REGISTER_SUCCESS':
          window.localStorage.setItem('user', JSON.stringify(message.payload.user));
          window.localStorage.setItem('token', JSON.stringify(message.payload.token));
          setUser(message.payload.user);
          setToken(message.payload.token);
          break;
        case 'USER_UPDATED':
          window.localStorage.setItem('user', JSON.stringify(message.payload));
          setUser(message.payload);
          break;
        case 'LOGOUT_SUCCESS':
          window.localStorage.removeItem('user');
          window.localStorage.removeItem('token');
          setUser({});
          setToken(null);
          break;

        case 'USERS':
          setUsers(message.payload);
          for (let index = 0; index < message.payload.length; index++) {
            const u = message.payload[index];
            if (u._id === user._id) {
              setUser(u);
              sendMessage('NOTIFICATIONS', { token, receiverId: u._id });
              break;
            }
          }
          break;
        case 'POST':
          setPosts((prePost) => [message.payload, ...prePost]);
          break;
        case 'POSTS':
          setPosts(message.payload);
          break;
        case 'COMMENT_CREATED':
          const comment = message.payload
          setPosts((prePost) => {
            const posts = prePost.map((p) => {
              if (p._id === comment.postId) {
                p.comments.unshift(comment)
                return p;
              }
              return p;
            })
            return posts
          })
          break;
        case 'COMMENT_DELETED':
          break;
        case 'POST_CREATED':
          message.payload.author = user;
          setPosts((prePost => [message.payload, ...prePost]));
          window.location.replace('/#/home');
          break;
        case 'UPDATED_POST':
          break;
        case 'DELETED_POST':
          setPosts((prePost) => prePost.filter(p => p._id != message.payload.postId))
          break;
        case 'LAST_CHATS':
          setAllChats(message.payload);
          break;
        case 'CHATS':
          setChats(message.payload);
          break;
        case 'CHAT_SAVED':
          setChats((c) => [...c, message.payload]);
          sendMessage('ON_CHAT_CONFIRM', { chatId: message.payload._id, userId: message.payload.senderId });
          break;
        case 'NEW_CHAT':
          setChats((c) => [...c, message.payload]);
          sendMessage('ON_CHAT_CONFIRM', { chatId: message.payload._id, userId: message.payload.receiverId });
          window.localStorage.setItem('new_message', (messageCounter + 1));
          setMessageCounter((c) => c + 1);
          (new Audio(NotificationSound)).play();
          break;
        case 'CHAT_CONFIRM':

          break;
        case 'CHAT_CONFIRM_SUCCESS':

          break;

        case 'NOTIFICATION_CREATED':

          break;

        case 'NOTIFICATION_RECEIVED':
          setNotifications((n) => [message.payload, ...n]);
          window.localStorage.setItem('new_notification', (notifictionCounter + 1));
          setNotificationCounter((n) => n + 1);
          (new Audio(NotificationSound)).play();
          break;

        case 'NOTIFICATIONS':
          setNotifications(message.payload.notifications);
          break;

        case 'USER_DEACTIVATED':
          setUsers((preUsers) => {
            for (let i = 0; i < preUsers.length; i++) {
              if (preUsers[i]._id === message.payload.userId) {
                preUsers[i].isActive = false;
                break;
              }
            }
            return [...preUsers];
          });
          break;
        case 'PONG':
          break;
        default:
          //console.error('Invalid action type');
          break;
      }
    }
  }, []);

  return (
    <AppContext.Provider value={{
      user, setUser,
      token, setToken,
      users, setUsers,
      posts, setPosts,

      allChats, setAllChats,
      chats, setChats,
      notifications, setNotifications,

      notifictionCounter, setNotificationCounter,
      messageCounter, setMessageCounter,
    }}>
      {children}
      
      <Snackbar
        open={error !== null}
        autoHideDuration={2500}
        onClose={() => setError(null)}
        message={error}
      />
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppContextProvider, useAppContext };