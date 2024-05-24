import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSendMessage, useWebSocket } from '../contexts/WebSocketContext';
import { Button, Card, CardContent, Divider, Snackbar, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import Logo from '../assets/grapsee.png'
import styles from './styles/Login.module.css'

const Login = () => {
  
  const navigate = useNavigate();
  const theme = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const isMobile = useMediaQuery('(max-width:600px)')
  const isTablet = useMediaQuery('(max-width:960px)')
  const isDesktop = useMediaQuery('(min-width:960px)')

  const isEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const ws = useWebSocket();
  const sendMessage = useSendMessage();

  const handleLogin = () => {
    if (isEmail(username)) {
      sendMessage('LOGIN', { email: username, password });
    } else {
      sendMessage('LOGIN_BY_USERNAME', { username, password });
    }
  };

  return (<>
    <div className={styles.container}>
      {
        !isMobile && <div className={styles.left} style={{ width: '40%' }}>
          <img src={Logo} className={styles.logo} />
        </div>
      }
      <div className={styles.right} style={{ width: isMobile ? '100%' : '60%' }}>
        {
          isMobile && (<>
            <img src={Logo} style={{ height: '100px', width: '100px' }} alt="Logo" />
          </>)
        }
        <p style={{ fontSize: '17px', marginBottom: '8px' }}>Wellcome to</p>
        <h1 style={{ color: theme.palette.primary.main, fontSize: '35px', marginBottom: '12px' }}>Grapsee</h1>
        <Card elevation={8} sx={{ width: isMobile ? '310px' : '350px', maxWidth: isMobile ? '310px' : '350px' }}>
          <CardContent>
            <TextField
              label="Email or Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
            />
            <Typography variant="body2" style={{ marginTop: '4px', textAlign: 'right' }}>
              <Link href="#" color="inherit">
                Forgot Password?
              </Link>
            </Typography>
            <div style={{ width: '100%', textAlign: 'center' }}>
              <Button variant="outlined" color="primary" sx={{ mt: '10px', borderRadius: '20px', pt: '7px' }} onClick={handleLogin}>
                Login
              </Button>
            </div>

            <Divider sx={{ mt: '10px', mb: '10px' }}>Don't have an account yet?</Divider>

            <div style={{ width: '100%', textAlign: 'center' }}>
              <Button onClick={() => navigate('../create_new_account')} variant="contained" color="primary" sx={{ mt: '10px' }}>
                Create New Account
              </Button>
            </div>
          </CardContent>
        </Card>
        <div style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
          <Button variant="outlined" color="primary" sx={{ mt: '10px', borderRadius: '20px' }} onClick={handleLogin}>
            Google Signup
          </Button>
        </div>
      </div>

    </div>

  </>
  )
}

export default Login