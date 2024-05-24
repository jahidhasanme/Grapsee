import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Snackbar, useMediaQuery, useTheme } from '@mui/material'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import OnlinePredictionOutlinedIcon from '@mui/icons-material/OnlinePredictionOutlined'
import styles from './styles/Home.module.css';
import { useAppContext } from '../contexts/AppContext';
import Post from '../components/Post';
import ProfilePic from '../components/ProfilePic';
import { useSendMessage } from '../contexts/WebSocketContext';

const Home = () => {

  const navigate = useNavigate();

  const location = useLocation();
  const { postId } = location.state ? location.state.data : {}; 

  const theme = useTheme()
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:960px)');
  const isDesktop = useMediaQuery('(min-width:960px)');

  const [isLoading, setLoading] = useState(false);

  const sendMessage = useSendMessage();
  const { user, users, token } = useAppContext();

  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      sendMessage('USERS', { token: token });
      sendMessage('POSTS', { token: token });
    } else {
      navigate('login', { replace: true });
    }
  }, []);

  return (
    <div className={styles.container} style={{ padding: (isMobile || isTablet) ? '12px' : '24px' }}>
      <div className={styles.topbar} onClick={() => navigate('/new_post')}>
        <ProfilePic isActive={user.isActive} src={user.profile} sx={{ width: '40px', height: '40px', background: '#CCCCCC' }} alt='Profile' />
        <input className={styles.whatsOnYoursMind} value="WHAT'S ON YOUR MIND?" readOnly />
        <ImageOutlinedIcon style={{ background: '#08851a', color: 'white', borderRadius: '50%', padding: '4px', fontSize: '30px', marginRight: '10px' }} />
        <OnlinePredictionOutlinedIcon style={{ color: 'red', fontSize: '35px' }} />
      </div>

      <div className={styles.usersStores}>
        <ProfilePic onClick={()=> { navigate('../profile') }} isActive={user.isActive} src={user.profile} alt='Profile' sx={{ width: '48px', height: '48px', ml: '16px', background: '#CCCCCC' }} />
        <div className={styles.divider}></div>
        <div className={styles.profiles}>
          {users.map((item) =>
            (item._id !== user._id) && <ProfilePic onClick={()=> { navigate('../profile', { state: { user: item } }) }} isActive={item.isActive} src={item.profile} alt='Profile' key={item.email} sx={{ width: '40px', height: '40px', marginRight: '12px', background: '#CCCCCC' }} />
          )}
        </div>
      </div>

      <Post firstPostId={postId} />

      <Snackbar
        open={error !== null}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />
    </div>
  )
}

export default Home
