import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, IconButton, Divider, useMediaQuery, useTheme, Button, TextField, TextareaAutosize } from '@mui/material'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import OnlinePredictionOutlinedIcon from '@mui/icons-material/OnlinePredictionOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import VerifiedIcon from '@mui/icons-material/Verified';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import styles from './styles/Profile.module.css'

import Cover from '../assets/cover.svg'
import Post from '../components/Post';
import { useAppContext } from '../contexts/AppContext';
import ProfilePic from '../components/ProfilePic';
import { Edit } from '@mui/icons-material';
import { Edit2 } from 'react-feather';
import { useSendMessage } from '../contexts/WebSocketContext';
import axios from "axios";

const Profile = () => {

  const theme = useTheme()

  const navigate = useNavigate();

  const location = useLocation();

  let { user:otherUser } = location.state || {};

  const { user, posts, setUser, setPosts, setToken } = useAppContext();

  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:960px)');
  const isDesktop = useMediaQuery('(min-width:960px)');

  const [isSaving, setSaving] = useState(false);
  const [isEdit, setEdit] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  useEffect(() => {
    if (otherUser) {
      setUser(otherUser);
    }
    return () => {
      try {
        otherUser = undefined
        location.state.user = undefined
      } catch (e) { }
      setUser(user);
    }
  }, [otherUser]);


  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    setProfileImage(file);
  };

  const handleCoverImageChange = async (event) => {
    const file = event.target.files[0];
    setCoverImage(file);
  };

  const uploadImage = async (imageFile) => {
    if (!imageFile) return;
    const formData = new FormData();
    formData.append('file', imageFile);
    try {
      const response = await axios.post('http://localhost:4000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.publicUrl;
    } catch (error) {
      return;
    }
  };

  const handleEditButtonClick = () => {
    const fileInput = document.getElementById('coverImageInput');
    if (fileInput) {
      fileInput.click();
    }
  };

  const sendMessage = useSendMessage();

  const updateUser = async () => {
    if (isEdit) {
      setSaving(true);
      user.profile = (await uploadImage(profileImage)) || user.profile;
      user.cover = (await uploadImage(coverImage)) || user.cover;
      sendMessage('UPDATE_USER_BY_ID', { userId: user._id, updates: user });
      setSaving(false);
      setUser(user);
      setPosts((prePost) => prePost.map(p => {
        if (p.author._id === user._id) {
          p.author = user
          return p;
        }
        return p;
      }));
      setEdit(false);
    } else {
      setEdit(true);
    }
  }


  return (
    <div className={styles.container}>
      {isEdit ? <>
        <input
          type="file"
          accept="image/*"
          id="coverImageInput"
          style={{ display: 'none' }}
          onChange={handleCoverImageChange}
        />
        <label htmlFor="coverImageInput" style={{ width: '100%' }}>
          <img
            className={styles.banner}
            style={{ height: isMobile ? '120px' : '200px', width: '100%', objectFit: 'cover' }}
            src={coverImage ? URL.createObjectURL(coverImage) : (user.cover ? user.cover : Cover)}
            alt="Cover"
          />
          <Button onClick={handleEditButtonClick} variant="outlined" style={{ padding: '5px', position: 'absolute', right: '0px', top: isMobile ? '60px' : '130px', margin: '10px' }}>
            <Edit />
          </Button>
        </label>
      </> :
        <img
          className={styles.banner}
          style={{ height: isMobile ? '120px' : '200px', width: '100%', objectFit: 'cover' }}
          src={(user.cover ? user.cover : Cover)}
          alt="Cover"
        />}

      {isEdit ? <><input
        type="file"
        accept="image/*"
        id="profilePicInput"
        style={{ display: 'none' }}
        onChange={handleProfileImageChange}
      />
        <label htmlFor="profilePicInput">
          <ProfilePic
            isActive={user.isActive}
            src={profileImage ? URL.createObjectURL(profileImage) : user.profile}
            alt="Profile"
            sx={{ background: '#CCCCCC', width: '90px', height: '90px', mt: '-40px', mb: '5px', border: '3px solid white' }}
          />
        </label>
      </> : <>
        <ProfilePic
          isActive={user.isActive}
          src={user.profile}
          alt="Profile"
          sx={{ background: '#CCCCCC', width: '90px', height: '90px', mt: '-40px', mb: '5px', border: '3px solid white' }}
        />
      </>}

      {
        isEdit && (<>
          <div style={{ marginBottom: '10px', fontSize: '14px' }}>
            Tap to change profile
          </div>
        </>)
      }

      {!isEdit && <>
        <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{user.name}</span>

        <span style={{ margin: '4px 0px', fontWeight: '500', fontSize: '17px' }}>{user.bio || user.username}</span>

        <div style={{ width: '75%', marginTop: '8px' }}>
          {user.info}
        </div>
      </>}

      {isEdit && <div style={{ width: '75%', display: 'flex', flexDirection: 'column' }}>
        <TextField label="Name" name="name" type="text" margin="normal" value={user.name || ''} sx={{ margin: '8px 0px' }} onChange={(event) => setUser({ ...user, name: event.target.value })} />
        <TextField label="Bio" name="bio" type="text" margin="normal" value={user.bio || ''} sx={{ margin: '8px 0px' }} onChange={(event) => setUser({ ...user, bio: event.target.value })} />
        <TextField multiline rows={4} label="Info" name="info" type="text" margin="normal" sx={{ margin: '8px 0px' }} value={user.info || ''} onChange={(event) => setUser({ ...user, info: event.target.value })} />
      </div>}

      {!otherUser && <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '0px 12px', marginTop: '10px' }}>

        {!isEdit && <Button variant="contained" onClick={() => {
          window.localStorage.clear();
          setToken(null);
          navigate('../#', { replace: true });
        }} sx={{ marginRight: '15px' }}>LOGOUT</Button>}

        <Button variant="contained" onClick={updateUser}>{isEdit ? isSaving ? 'Saving...' : 'SAVE' : 'EDIT'}</Button>

      </div>}

      {otherUser && <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '0px 12px', marginTop: '10px' }}>

        <Button onClick={()=>{
          navigate('../chating', { state: { reciver: otherUser } })
        }} variant="contained" sx={{ textTransform: 'capitalize' }}>Messenger</Button>

      </div>}


      {/* <div style={{ display: 'flex', marginTop: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>135</span>
              <span style={{ fontSize: '14px' }}>Following</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '45px' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>135</span>
              <span style={{ fontSize: '14px' }}>Follower's</span>
            </div>
          </div> */}



      <hr style={{ width: '100%', margin: '16px 0px' }} />

      <h2>Posts</h2>


      <Post type="profile" isOthersUser={otherUser} />

    </div>
  )
}

export default Profile;