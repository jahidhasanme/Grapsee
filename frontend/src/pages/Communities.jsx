import { Avatar, IconButton, useMediaQuery, useTheme } from '@mui/material'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import OnlinePredictionOutlinedIcon from '@mui/icons-material/OnlinePredictionOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import styles from './styles/Communities.module.css'

const Communities = () => {

  const theme = useTheme()
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:960px)');
  const isDesktop = useMediaQuery('(min-width:960px)');

  const users = {
    "uid_1": {
      "name": "Arafat Hosson",
      "gname": "BPL LEAGE",
      "email": "arafathosson@gmail.com",
      "gender": "male",
      "date_of_birth": "22-06-2007",
      "proffesion": "Student",
      "password": "hello8920",
      "profile": "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659652_1280.png",
      "cover": "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659652_1280.png",
      "description": "jgfijwoifghghaoiguahguiehgoihegoinogndjgvndfbgudfbgoidfnoi",
      "followers": ["uid_2", "uid_3"],
      "posts": ["pid_1"],
      "createdAt": '',
      "updatedAt": '',
    },
    "uid_2": {
      "name": "Rafid Hosson",
      "gname": "Programmer",
      "email": "rafidhosson@gmail.com",
      "gender": "male",
      "date_of_birth": "22-06-2008",
      "proffesion": "Student",
      "password": "hello8920",
      "profile": "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659652_1280.png",
      "cover": "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659652_1280.png",
      "description": "jgfijwoifghghaoiguahguiehgoihegoinogndjgvndfbgudfbgoidfnoi",
      "followers": ["uid_1", "uid_3"],
      "posts": ["pid_2"],
      "createdAt": '',
      "updatedAt": '',
    },
    "uid_3": {
      "name": "Mamun Hosson",
      "gname": "Python",
      "email": "manunhosson@gmail.com",
      "gender": "male",
      "date_of_birth": "22-06-2007",
      "proffesion": "Student",
      "password": "hello8920",
      "profile": "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659652_1280.png",
      "cover": "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659652_1280.png",
      "description": "jgfijwoifghghaoiguahguiehgoihegoinogndjgvndfbgudfbgoidfnoi",
      "followers": ["uid_1", "uid_2"],
      "posts": ["pid_3"],
      "createdAt": '',
      "updatedAt": '',
    },
  }

  const posts = {
    "pid_1": {
      "uid": "uid_1",
      "type": 'image',
      "description": 'Happy Day 🎉💜',
      "url": 'https://source.boomplaymusic.com/group10/M00/11/06/c5e7eda561d74b09ba8748c67acb4744_464_464.jpg',
      "privacy": 'public',
      "createdAt": '',
      "updatedAt": '',
      "reacts": {
        "uid_1": 'like',
        "uid_2": 'love',
        "uid_3": 'like'
      },
      "shares": [
        "uid_1",
        "uid_2",
        "uid_3"
      ],
      "comments": {
        "uid_1": {
          "comment": 'Very good!',
          "createdAt": '',
          "updatedAt": '',
          "reacts": {
            "uid_1": 'like',
            "uid_2": 'love',
            "uid_3": 'like',
          },
        },
        "uid_2": {
          "comment": 'Thanks you...',
          "createdAt": '',
          "updatedAt": '',
          "reacts": {
            "uid_1": 'like',
            "uid_2": 'love',
            "uid_3": 'like',
          },
        },
        "uid_3": {
          "comment": 'Thanks you so mouch!',
          "createdAt": '',
          "updatedAt": '',
          "reacts": {
            "uid_1": 'like',
            "uid_2": 'love',
            "uid_3": 'like',
          },
        },
      },
    },
    "pid_2": {
      "uid": "uid_2",
      "type": 'image',
      "description": 'Eid Mubarak 🎉💜',
      "url": 'https://static.toiimg.com/thumb/msid-99583904,width-1070,height-580,imgsize-43976,resizemode-6,overlay-toi_sw,pt-32,y_pad-40/photo.jpg',
      "privacy": 'public',
      "createdAt": '',
      "updatedAt": '',
      "reacts": {
        "uid_1": 'like',
        "uid_2": 'love',
        "uid_3": 'like'
      },
      "shares": [
        "uid_1",
        "uid_2",
        "uid_3"
      ],
      "comments": {
        "uid_1": {
          "comment": 'Very good!',
          "createdAt": '',
          "updatedAt": '',
          "reacts": {
            "uid_1": 'like',
            "uid_2": 'love',
            "uid_3": 'like',
          },
        },
        "uid_2": {
          "comment": 'Thanks you...',
          "createdAt": '',
          "updatedAt": '',
          "reacts": {
            "uid_1": 'like',
            "uid_2": 'love',
            "uid_3": 'like',
          },
        },
        "uid_3": {
          "comment": 'Thanks you so mouch!',
          "createdAt": '',
          "updatedAt": '',
          "reacts": {
            "uid_1": 'like',
            "uid_2": 'love',
            "uid_3": 'like',
          },
        },
      },
    },
    "pid_3": {
      "uid": "uid_3",
      "type": 'image',
      "description": '',
      "url": 'https://hips.hearstapps.com/hmg-prod/images/drinks-to-avoid-1621959532.jpg',
      "privacy": 'public',
      "createdAt": '',
      "updatedAt": '',
      "reacts": {
        "uid_1": 'like',
        "uid_2": 'love',
        "uid_3": 'like'
      },
      "shares": [
        "uid_1",
        "uid_2",
        "uid_3"
      ],
      "comments": {
        "uid_1": {
          "comment": 'Very good!',
          "createdAt": '',
          "updatedAt": '',
          "reacts": {
            "uid_1": 'like',
            "uid_2": 'love',
            "uid_3": 'like',
          },
        },
        "uid_2": {
          "comment": 'Thanks you...',
          "createdAt": '',
          "updatedAt": '',
          "reacts": {
            "uid_1": 'like',
            "uid_2": 'love',
            "uid_3": 'like',
          },
        },
        "uid_3": {
          "comment": 'Thanks you so mouch!',
          "createdAt": '',
          "updatedAt": '',
          "reacts": {
            "uid_1": 'like',
            "uid_2": 'love',
            "uid_3": 'like',
          },
        },
      },
    }
  }

  return (
    <div className={styles.container}>

      <div className={styles.groupsContainer}>
        <div style={{ display: 'flex', position: 'absolute' }}>
          {Object.keys(posts).map((postKey) => (
            <div className={styles.group} style={{ background: theme.palette.primary.main }}>
              <img src={posts[postKey].url} style={{ height: '70px', width: '200px', borderRadius: '10px' }} alt='Loading...' />
              <span style={{ color: 'white', marginTop: '4px' }}>{users[posts[postKey].uid].gname}</span>
            </div>
          ))}
        </div>

      </div>

      <div className={styles.posts}>
        {
          Object.keys(posts).map((postKey, index) => (
            <div className={styles.post} key={postKey}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', position: 'relative' }}>
                  <Avatar src={posts.pid_1.url} alt='Profile' variant="rounded" sx={{ width: '60px', height: '60px', background: '#CCCCCC' }} />
                  <Avatar src={users.uid_1.profile} alt='Profile' sx={{ width: '34px', height: '34px', position: 'absolute', left: '32px', top: '32px', border: '3px solid white', background: '#CCCCCC' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '18px' }}>{users[posts[postKey].uid].gname}</span>
                    <span style={{ color: theme.palette.primary.main, fontSize: '12px', marginLeft: '16px', marginTop: '5px' }}>JOIN</span>
                  </div>
                  <div style={{ color: theme.palette.primary.main }}>
                    {users[posts[postKey].uid].name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '2px' }}>
                    <PublicOutlinedIcon sx={{ fontSize: '12px' }} />
                    <span style={{ fontSize: '12px', marginLeft: '6px' }}>2h ago</span>
                  </div>
                </div>
                <div style={{ flex: 'auto', display: 'flex', justifyContent: 'end' }}>
                  <IconButton>
                    <MoreVertOutlinedIcon sx={{ fontSize: '32px' }} />
                  </IconButton>
                </div>
              </div>

              <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column' }}>
                <div>{posts[postKey].description}</div>
                <img src={posts[postKey].url} style={{ width: '100%', maxHeight: '320px', marginTop: '10px', borderRadius: '15px' }} alt='Loading...' />
                <span style={{ fontSize: '15px', marginLeft: '10px', marginTop: '5px' }}>❤️ {users[Object.keys(posts[postKey].reacts)[index]].name} and <span>{Object.keys(posts[postKey].reacts).length + ''}</span> others</span>
              </div>

              <div style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
                <IconButton>
                  <FavoriteOutlinedIcon sx={{ fontSize: '30px' }} />
                </IconButton>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span>{Object.keys(posts[postKey].comments).length + ''}</span>
                  <IconButton>
                    <ModeCommentOutlinedIcon sx={{ fontSize: '30px' }} />
                  </IconButton>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span>{posts[postKey].shares.length + ''}</span>
                  <IconButton>
                    <ShareOutlinedIcon sx={{ fontSize: '30px' }} />
                  </IconButton>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Communities