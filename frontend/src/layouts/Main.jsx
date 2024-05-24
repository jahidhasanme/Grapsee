import { useEffect } from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import MainNav from "../components/MainNav"
import HomeOutlinedIcon from '@mui/icons-material/Home'
import PersonOutlinedIcon from '@mui/icons-material/Person'
import NotificationsOutlinedIcon from '@mui/icons-material/Notifications'
import MessageOutlinedIcon from '@mui/icons-material/Message'
import GroupOutlinedIcon from '@mui/icons-material/Group'
import SearchIcon from '@mui/icons-material/Search'
import PlayCircleFilledOutlinedIcon from '@mui/icons-material/PlayCircleFilledOutlined';
import GrapseeImage from '../assets/grapsee_gold.png'
import SettingsOutlinedIcon from '@mui/icons-material/Settings'
import SearchOutlinedIcon from '@mui/icons-material/Search';

import styles from './styles/Main.module.css'
import Sponsors from "../components/Sponsors"
import { Badge, IconButton, InputBase, alpha, styled, useMediaQuery, useTheme } from "@mui/material"
import { useSendMessage, useWebSocket } from "../contexts/WebSocketContext"
import { useAppContext } from "../contexts/AppContext"
import { Plus } from "react-feather"

const Main = () => {
  const theme = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  const sendMessage = useSendMessage()

  const { user, token, users, posts, notifictionCounter, messageCounter } = useAppContext()

  useEffect(() => {
    sendMessage('ADD_TO_ACTIVE_USER', { userId: user._id });
    if (token) {
      sendMessage('USERS', { token: token });
      sendMessage('POSTS', { token: token });
    } else {
      navigate('login', { replace: true });
    }
  }, []);

  const isMobile = useMediaQuery('(max-width:600px)')
  const isTablet = useMediaQuery('(max-width:960px)')

  const items = [
    { text: 'Home', icon: <HomeOutlinedIcon />, route: '/home' },
    { text: 'Videos', icon: <PlayCircleFilledOutlinedIcon />, route: '/videos' },
    { text: 'Profile', icon: <PersonOutlinedIcon />, route: '/profile' },
    { text: 'Peoples', icon: <GroupOutlinedIcon />, route: '/peoples' },
    {
      text: 'Notifications', icon: <Badge color="secondary" badgeContent={notifictionCounter}>
        <NotificationsOutlinedIcon />
      </Badge>, route: '/notifications'
    },
    {
      text: 'Messenger', icon: <Badge color="secondary" badgeContent={messageCounter}>
        <MessageOutlinedIcon />
      </Badge>, route: '/messenger'
    },
    //{ text: 'Settings', icon: <SettingsOutlinedIcon />, route: '/settings' },
    //   { text: 'GS Premium', image: <img src={GrapseeImage} alt="Grapsee" className={styles.grapseeImage} />, route: '/grapsee' },
  ];

  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));

  return (
    <div className={styles.container}>
      {!isMobile && <MainNav items={items} />}
      <div className={styles.pages}>
        {
          isMobile ? (<>
            <div className={styles.pageHeader}>
              <div className={styles.grapseeText} style={{ color: theme.palette.primary.main }} onClick={() => navigate('home')}>Grapsee</div>
              <div className={styles.headerBtns}>
                {/* <IconButton color="primary" >
                  <SearchOutlinedIcon />
                </IconButton> */}
                <IconButton color="primary" onClick={() => navigate('notifications')}>
                  <Badge color="secondary" badgeContent={notifictionCounter}>
                    <NotificationsOutlinedIcon sx={location.pathname === '/notifications' ? { fontSize: '30px' } : {}} />
                  </Badge>
                </IconButton>
                <IconButton color="primary" onClick={() => navigate('peoples')}>
                  <GroupOutlinedIcon sx={location.pathname === '/peoples' ? { fontSize: '30px' } : {}} />
                </IconButton>
              </div>
            </div>
            <Outlet />
            <div className={styles.pageFooter}>

              <IconButton color="primary" onClick={() => navigate('home')}>
                <HomeOutlinedIcon sx={location.pathname === '/home' ? { fontSize: '32px' } : {}} />
              </IconButton>

              <IconButton color="primary" onClick={() => navigate('videos')}>
                <PlayCircleFilledOutlinedIcon sx={location.pathname === '/videos' ? { fontSize: '32px' } : {}} />
              </IconButton>

              <div onClick={() => navigate('new_post')} className={styles.grapseeImageBtn} style={{ background: theme.palette.primary.main, color: 'white' }}>
                {/* <img src={GrapseeImage} alt="Grapsee" /> */}
                <Plus size={30} />
              </div>

              <IconButton color="primary" onClick={() => navigate('messenger')}>
                <Badge color="secondary" badgeContent={messageCounter}>
                  <MessageOutlinedIcon sx={location.pathname === '/messenger' ? { fontSize: '32px' } : {}} />
                </Badge>
              </IconButton>
              <IconButton color="primary" onClick={() => navigate('profile')}>
                <PersonOutlinedIcon sx={location.pathname === '/profile' ? { fontSize: '30px' } : {}} />
              </IconButton>
              {/* <IconButton color="primary" onClick={() => navigate('settings')}>
                <SettingsOutlinedIcon sx={location.pathname === '/settings' ? { fontSize: '32px' } : {}} />
              </IconButton> */}
            </div>
          </>) : <Outlet />
        }
      </div>
      {!isTablet && <Sponsors />}
    </div>
  )
}

export default Main
