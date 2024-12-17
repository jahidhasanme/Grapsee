import { Avatar, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, Input, InputLabel, List, ListItem, MenuItem, Select, Snackbar, useTheme } from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import SlowMotionVideoIcon from '@mui/icons-material/SlowMotionVideo';
import PersonPinOutlinedIcon from '@mui/icons-material/PersonPinOutlined';
import OnlinePredictionOutlinedIcon from '@mui/icons-material/OnlinePredictionOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WebSocketContext, useSendMessage } from '../contexts/WebSocketContext';
import styles from './styles/CreatePost.module.css'
import axios from 'axios';
import { useAppContext } from '../contexts/AppContext';


const CreatePost = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [privacy, setPrivacy] = useState('public');
  const [inputKey, setInputKey] = useState(Date.now());
  const [content, setContent] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);

  const ws = useContext(WebSocketContext);
  const sendMessage = useSendMessage();

  const { user } = useAppContext()

  useEffect(() => {
    
  }, []);

  const createPost = async () => {
    if (ws && (selectedImageFile || selectedVideoFile || content) && !isLoading) {
      setLoading(true);
      const url = await handleUpload(selectedImageFile || selectedVideoFile);
      sendMessage('CREATE_POST', { content, author: user._id, url, type: selectedImageFile ? 'image' : selectedVideoFile ? 'video' : 'text' });
    }
  };

  const handleImageFileChange = (event) => {
    setSelectedVideoFile(null);
    setSelectedImageFile(event.target.files[0]);
    setInputKey(Date.now());
  };

  const handleVideoFileChange = (event) => {
    setSelectedImageFile(null);
    setSelectedVideoFile(event.target.files[0]);
    setInputKey(Date.now());
  };

  const handleListItemClick = (inputId) => {
    const inputElement = document.getElementById(inputId);
    inputElement.click();
  };

  const handleCancel = () => {
    setSelectedImageFile(null);
    setSelectedVideoFile(null);
  };

  const handleUpload = async (selectedFile) => {
    if (!selectedFile) return ''
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.post('http://localhost:4000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div style={{ display: "flex", justifyContent: 'center', width: "100%" }}>
          <h2>Create Post</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', marginBottom: '16px' }}>
          <Avatar src={user.profile} alt='Profile' sx={{ width: '60px', height: '60px', background: '#CCCCCC' }} />
          <div style={{ display: 'flex', flex: 'auto', flexDirection: 'column', marginLeft: '8px' }}>
            <b style={{ fontSize: '20px', flex: 'auto' }}>{user.name}</b>
            <FormControl sx={{ maxWidth: '120px', padding: '0px' }}>
              <Select
                sx={{ padding: '2px', background: '#EEEEEE' }}
                variant="standard"
                size='small'
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
              >
                <MenuItem value={'public'}>Public</MenuItem>
                <MenuItem value={'only me'}>Only me</MenuItem>
              </Select>
            </FormControl>
          </div>
          <Button variant='contained' onClick={createPost} style={{ textTransform: "none" }}>{isLoading ? 'Posting...' : 'Post'}</Button>
        </div>
        <Input onChange={(e) => setContent(e.target.value)} multiline maxRows={4} placeholder={'Whats on your mind?'} style={{ height: "100px", borderRadius: '12px', padding: "12px", marginBottom: '12px' }} />

        <div style={{ width: '100%', position: 'relative' }}>
          {(selectedImageFile || selectedVideoFile) && (
            <IconButton onClick={handleCancel} size='30px' style={{ float: 'right' }}>
              <CloseOutlinedIcon />
            </IconButton>
          )}
          {selectedImageFile && <img src={URL.createObjectURL(selectedImageFile)} style={{ width: '100%', maxHeight: '320px', marginTop: '10px', borderRadius: '15px' }} alt='Loading...' />}
          {selectedVideoFile && <video controls src={URL.createObjectURL(selectedVideoFile)} style={{ width: '100%', maxHeight: '320px', marginTop: '10px', borderRadius: '15px' }} alt='Loading...' />}
        </div>

        <List>
          <ListItem button onClick={() => handleListItemClick('photo-upload')}>
            <label htmlFor="photo-upload" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <ImageOutlinedIcon style={{ background: '#08851a', color: 'white', borderRadius: '50%', padding: '4px', fontSize: '30px', marginRight: '10px' }} />
              <b>Photo</b>
            </label>
            <input id="photo-upload" key={inputKey} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageFileChange} />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick('video-upload')}>
            <label htmlFor="video-upload" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <SlowMotionVideoIcon style={{ background: 'red', color: 'white', borderRadius: '50%', padding: '4px', fontSize: '32px', marginRight: '10px' }} />
              <b>Video</b>
            </label>
            <input id="video-upload" key={inputKey} type="file" accept="video/*" style={{ display: 'none' }} onChange={handleVideoFileChange} />
          </ListItem>
          <ListItem button>
            <OnlinePredictionOutlinedIcon style={{ color: 'red', fontSize: '42px', borderRadius: '50%', padding: '4px', marginRight: '5px', marginLeft: "-5px" }} />
            <b>Live</b>
          </ListItem>
          <ListItem button>
            <PersonPinOutlinedIcon style={{ color: theme.palette.primary.main, fontSize: '42px', borderRadius: '50%', padding: '4px', marginRight: '5px', marginLeft: "-5px" }} />
            <b>Tag people</b>
          </ListItem>
        </List>
      </div>
      <Snackbar
        open={error !== null}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />
    </>
  );
};

export default CreatePost;
