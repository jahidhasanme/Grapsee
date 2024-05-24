import { Avatar, IconButton, List, ListItem, Typography, useTheme } from '@mui/material'
import { calculateTimeDifference, formatUserCount } from '../utils/calculations';
import styles from './styles/Notifications.module.css'
import { useAppContext } from '../contexts/AppContext';
import ProfilePic from '../components/ProfilePic';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {

  const theme = useTheme();

  const navigate = useNavigate();

  const { notifications, setNotificationCounter } = useAppContext();

  useEffect(()=>{
    window.localStorage.removeItem('new_notification');
    setNotificationCounter(0);
  }, [])

  return (
    <List className={styles.container} sx={{ width: '100%' }}>
      {
        notifications.map((notification) => (
          <ListItem onClick={() => {
            navigate('../home', { state: { data: { postId: notification.postId } } })
          }} button sx={{ width: '100%', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }} key={notification._id}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ProfilePic src={notification.senderId.profile} alt='Profile' sx={{ width: '48px', height: '48px', background: '#CCCCCC' }} />
              <div style={{ marginLeft: '10px' }}>
                <b style={{ color: theme.palette.primary.main }}>{notification.senderId.name}</b> &nbsp;{notification.message}
              </div>
            </div>
            <div>
              {calculateTimeDifference(notification.createdAt)}
            </div>
          </ListItem>
        ))
      }
      {
        (notifications.length === 0) && 
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
          <span style={{ fontSize: '17px' }}>Notifications not found!</span>
        </div>
      }
    </List>
  )
}

export default Notifications
