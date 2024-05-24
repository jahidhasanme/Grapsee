import { Avatar, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, useTheme } from '@mui/material'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActiveOutlined';
import BlockIcon from '@mui/icons-material/BlockOutlined';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import PrivacyTipOutlinedIcon from '@mui/icons-material/PrivacyTipOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import { styled } from '@mui/material/styles';
import styles from './styles/Settings.module.css'


const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 5,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(4px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(25px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));


const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 55,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(28px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

const Settings = () => {

  const theme = useTheme()

  return (
    <div className={styles.container}>
      <h2>Settings</h2>

      <div className={styles.profileSettingsArea} style={{ background: theme.palette.primary.main }}>
        <div style={{ flex: 'auto', display: 'flex', flexDirection: 'column', color: 'white' }}>
          <div className={styles.settingsTitle}>Profile</div>
          <div className={styles.settingsTitle}>Profile settings</div>
          <div className={styles.settingsTitle}>Logout</div>
        </div>
        <Avatar src='https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659652_1280.png' alt='Profile' sx={{ width: '50px', height: '50px', background: '#CCCCCC' }} />
      </div>

      <div className={styles.settingsArea} style={{ background: theme.palette.primary.main }}>
        <div style={{ flex: 'auto', display: 'flex', flexDirection: 'column', color: 'white' }}>

          <div className={styles.settingsItems}>
            <span className={styles.settingsTitle} style={{ flex: 'auto' }}>Notification</span>
            <IOSSwitch theme={theme} sx={{ m: 1 }} defaultChecked />
          </div>

          <div className={styles.settingsItems}>
            <span className={styles.settingsTitle} style={{ flex: 'auto' }}>Langauge</span>
            <Select
              sx={{ background: '#CCCCCC' }}
              value={'en'}
            >
              <MenuItem value='en'>English</MenuItem>
              <MenuItem value='bn'>Bangla</MenuItem>
            </Select>
          </div>

          <div className={styles.settingsItems}>
            <span className={styles.settingsTitle} style={{ flex: 'auto' }}>Dark Mode</span>
            <MaterialUISwitch theme={theme} sx={{ m: 1, ml: '20px' }} defaultChecked />
          </div>

        </div>
      </div>


      <div className={styles.settingsArea} style={{ background: theme.palette.primary.main }}>
        <div style={{ flex: 'auto', display: 'flex', flexDirection: 'column', color: 'white' }}>

          <div className={styles.settingsItems} style={{ marginBottom: '10px ' }}>
            <span className={styles.settingsTitle} style={{ flex: 'auto' }}>Blocking</span>
            <BlockIcon sx={{ fontSize: '35px', marginRight: '20px' }} />
          </div>

          <div className={styles.settingsItems} style={{ marginBottom: '5px ' }}>
            <span className={styles.settingsTitle} style={{ flex: 'auto' }}>Notification</span>
            <NotificationsActiveIcon sx={{ fontSize: '35px', marginRight: '20px' }} />
          </div>
          <div>
            <span style={{ fontSize: '18px' }}>How people find and cotact you</span>
          </div>
        </div>
      </div>

      <div className={styles.settingsArea} style={{ background: theme.palette.primary.main }}>
        <div style={{ flex: 'auto', display: 'flex', flexDirection: 'column', color: 'white' }}>

          <div className={styles.settingsItems} style={{ marginBottom: '10px ' }}>
            <span style={{ flex: 'auto', fontSize: '24px' }}>Trems or service</span>
            <StickyNote2OutlinedIcon sx={{ fontSize: '30px', marginTop: "2px", marginRight: '20px' }} />
          </div>
          <div className={styles.settingsItems} style={{ marginBottom: '10px ' }}>
            <span style={{ flex: 'auto', fontSize: '24px' }}>Privacy policy</span>
            <PrivacyTipOutlinedIcon sx={{ fontSize: '30px', marginTop: "2px", marginRight: '20px' }} />
          </div>

          <div className={styles.settingsItems} style={{ marginBottom: '10px ' }}>
            <span style={{ flex: 'auto', fontSize: '24px' }}>Business Integration</span>
            <WorkOutlineOutlinedIcon sx={{ fontSize: '30px', marginTop: "2px", marginRight: '20px' }} />
          </div>
        </div>
      </div>

    </div>
  )
}

export default Settings