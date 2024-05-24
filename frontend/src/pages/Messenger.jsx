import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Badge, Card, Divider, IconButton, List, ListItem, Modal, Snackbar, useMediaQuery, useTheme } from '@mui/material'
import { useSendMessage, useWebSocket } from '../contexts/WebSocketContext';
import styles from './styles/Messenger.module.css'
import { Plus, Search } from 'react-feather';
import { useAppContext } from '../contexts/AppContext';
import ProfilePic from '../components/ProfilePic';

const Messenger = () => {
  const navigate = useNavigate();

  const theme = useTheme()
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:960px)');
  const isDesktop = useMediaQuery('(min-width:960px)');

  const [error, setError] = useState(null);

  const { user, users, setMessageCounter, messageCounter } = useAppContext();

  const sendMessage = useSendMessage();

  useEffect(() => {
    window.localStorage.removeItem('new_message');
    setMessageCounter(0);
  }, []);

  const goToChats = (u) => {
    navigate('../chating', { state: { reciver: u } })
  }

  return (<>
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', borderBottom: '1px solid #CCCCCC', padding: '8px' }}>
          <div style={{ width: isMobile ? '75%' : '50%', display: 'flex', flexDirection: 'column' }}>
            <b style={{ fontSize: '20px', margin: '0px 6px 4px' }}>Status</b>
            <div style={{ display: 'flex', padding: '5px', border: '1.5px solid #CCCCCC', borderRadius: '20px' }}>
              <Search size={16} />
              <input style={{ flex: 'auto', background: 'transparent', border: 'none', outline: 'none', marginLeft: '5px', fontSize: '13px' }} placeholder='Search...' />
            </div>
          </div>

          <div style={{ flex: 'auto', display: 'flex', justifyContent: 'end' }}>
            <ProfilePic isActive={user.isActive} src={user.profile} alt='Profile' sx={{ width: '50px', height: '50px', borderRadius: '50%', }} />
          </div>
        </div>

        {/* <div style={{ width: '100%', position: 'relative', display: 'flex', alignItems: 'center', borderBottom: '1px solid #CCCCCC', padding: '8px', overflow: 'hidden', overflowX: 'scroll' }}>

          <Avatar sx={{ width: '55px', height: '55px', marginLeft: '6px', marginRight: '6px' }}>
            <Plus size={25} />
          </Avatar>

          <div className={styles.divider}></div>
          {
            users.map((u, index) => u._id != user._id && <ProfilePic isActive={u.isActive} key={u._id} src={u.profile} alt='Profile' style={{ width: '50px', height: '50px', borderRadius: '50%', marginLeft: '5px', marginRight: '5px' }} />)
          }

        </div> */}
        
        {
          users.map((u, index) => u._id != user._id && <div key={u._id} onClick={() => goToChats(u)} style={{ width: '100%', display: 'flex', flexDirection: 'column', padding: '4px 10px' }}>
            <Card elevation={4} sx={{ height: '65px', width: '100%', borderRadius: '8px', padding: '8px 4px', display: 'flex', alignItems: 'center' }}>
              <ProfilePic isActive={u.isActive} src={u.profile} alt='Profile' sx={{ width: '50px', height: '50px', borderRadius: '50%', marginLeft: '4px', marginRight: '8px' }} />
              <div style={{ flex: 'auto', display: 'flex', flexDirection: 'column', marginLeft: '12px' }}>
                <b style={{ fontSize: '19px', marginBottom: '3px' }}>{u.name}</b>
                {/* <span style={{ color: 'gray' }}>You: How are you?</span> */}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/* <b style={{ fontSize: '18px', marginBottom: '4px', color: theme.palette.primary.main }}>10:12 PM</b>
                <div style={{ textAlign: 'right' }}>
                  <Badge badgeContent={4} color="primary" sx={{ marginRight: '12px' }} />
                </div> */}
              </div>
            </Card>
          </div>)
        }
      </div>
    </div>
    <Snackbar
      open={error !== null}
      autoHideDuration={6000}
      onClose={() => setError(null)}
      message={error}
    />
  </>
  )
}

export default Messenger