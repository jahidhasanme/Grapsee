import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSendMessage, useWebSocket } from '../contexts/WebSocketContext';
import { Avatar, Badge, Button, Card, Divider, Grid, IconButton, LinearProgress, List, ListItem, Modal, Popover, Snackbar, TextareaAutosize, useMediaQuery, useTheme } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CallIcon from '@mui/icons-material/Call';
import styles from './styles/Chating.module.css'
import { Camera, Mic, MoreVertical, Paperclip, Phone, Send, Smile, Video } from 'react-feather';
import { SendOutlined } from '@mui/icons-material';
import fileIcon from '../assets/file_icon.svg';
import audioIcon from '../assets/audio_icon.svg';

import axios from 'axios';
import { useAppContext } from '../contexts/AppContext';
import ProfilePic from '../components/ProfilePic';

const Chating = () => {
  const chatContainerRef = useRef(null);

  const location = useLocation();
  const { reciver } = location.state;

  const navigate = useNavigate()

  const theme = useTheme()
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:960px)');
  const isDesktop = useMediaQuery('(min-width:960px)');

  const [error, setError] = useState(null);

  const [message, setMessage] = useState('');
  const [messageLine, setMessageLine] = useState(1);
  const { user, chats, users, setMessageCounter, messageCounter } = useAppContext();


  useEffect(() => {
    window.localStorage.removeItem('new_message');
    setMessageCounter(0);
  }, [messageCounter]);

  const [emojiPopoverAnchorEl, setEmojiPopoverAnchorEl] = useState(null);

  const handleIconButtonClick = (event) => {
    setEmojiPopoverAnchorEl(event.currentTarget);
  };

  const handleCloseEmojiPopover = (emoji) => {
    if (emoji) {
      setMessage((prevMessage) => prevMessage + emoji);
      return;
    }
    setEmojiPopoverAnchorEl(null);
  };

  const isEmojiPopoverOpen = Boolean(emojiPopoverAnchorEl);
  const emojiPopoverId = isEmojiPopoverOpen ? 'emoji-popover' : undefined;

  const emojiList = [
    '❤️', '💕', '😍', '😘', '💖', '💋', '💘', '💗', '💝', '😻', '🥰', '😻', '💑', '💏', '💌', '💞', '💓', '💟', '💔', '❣️',
    '😂', '😊', '😭', '😱', '😅', '😡', '😢', '😎', '😒', '😳', '🙄', '😤', '😩', '😔', '😞', '😕', '😣', '😖', '😫', '😰',
    '🎉', '🎊', '🎈', '🥳', '🎂', '🍰', '🍾', '🥂', '🎁', '🎆', '🎇', '🎀', '🎈', '🎊', '🎈', '🎖️', '🏅', '🏆', '🥇', '🥈',
    '🍕', '🍔', '🍟', '🌭', '🍿', '🧁', '🍩', '🍪', '🍫', '🍭', '🍬', '🍮', '🍦', '🍨', '🍧', '🎂', '🍰', '🧇', '🥞', '🧆',
    '🐶', '🐱', '🐭', '🐼', '🦊', '🐻', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦉', '🦆', '🦢',
    '☀️', '🌤️', '⛅', '🌦️', '🌧️', '⛈️', '🌩️', '❄️', '🌨️', '🌪️', '🌫️', '☔', '❄️', '☃️', '⛄', '💧', '💦', '🌊', '🌊', '🌬️',
    '🌸', '🌼', '🌻', '🌺', '🌹', '🌷', '🌵', '🌴', '🌳', '🌲', '🪵', '🌾', '🍁', '🍂', '🍃', '🍄', '🌰', '🌱', '🌿', '☘️',
    '🚗', '🚀', '🚢', '🚲', '🚁', '🛸', '🛶', '🚂', '✈️', '🚓', '🛵', '🚑', '🚒', '🚙', '🚌', '🚎', '🏍️', '🛴', '🚛', '🚚',
    '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏓', '🏸', '🏒', '🏑', '🥊', '🥋', '🎳', '⛸️', '🎿', '🛷', '⛷️', '🏂', '🤺', '🏇',
    '🌈', '🌟', '💫', '✨', '🌠', '🎇', '🎆', '💥', '🔥', '🌪️', '🌊', '💨', '🌫️', '🌋', '🌌', '🌍', '🌎', '🌏', '🌐', '🌑',
    '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌙', '🌚', '🌛', '🌜', '🌝', '🌞', '⭐', '🌟', '🌠', '🌥️', '🌦️', '🌧️', '🌨️', '🌩️',
    '🌪️', '🌫️', '🌬️', '🌀', '🌈', '🌂', '☔', '⚡', '❄️', '☃️', '⛄', '☄️', '🔥', '💧', '🌊', '🎈', '🎉', '🎊', '🎋', '🎁',
    '🎄', '🎍', '🎅', '🎄', '🎁', '🎋', '🎈', '🎉', '🎊', '🎍', '🎅', '🎆', '🎇', '🎐', '🎑', '🎀', '🎗️', '🎫', '🏷️', '🎖️',
    '🏅', '🥇', '🥈', '🥉', '🏆', '🏵️', '🎖️', '🎖️', '🏵️', '🎗️', '🎫', '🏷️', '🏅', '🥇', '🥈', '🥉', '🏆', '🏵️', '🎖️', '🎖️',
    '🏵️', '🎗️', '🎫', '🏷️', '🎟️', '🎭', '🎨', '🖼️', '🎪', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', '🎻', '🎬', '🎮',
    '👾', '🎯', '🎲', '♟️', '🎰', '🧩', '🎳', '🎮', '🎱', '🏓', '🏸', '🥅', '🎿', '⛷️', '🛷', '🥌', '🎽', '🛹', '🛼', '🎣',
  ];


  const [isUploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [fileSelectKey, setFileSelectKey] = useState(null);
  const [filePopoverAnchorEl, setFilePopoverAnchorEl] = useState(null);


  const [isFilePopoverOpen, setFilePopoverOpen] = useState(false);
  const filePopoverId = isFilePopoverOpen ? 'file-popover' : undefined;

  const handleSelectFile = (event) => {
    fileInputRef.current.click();
    if (!filePopoverAnchorEl) setFilePopoverAnchorEl(event.currentTarget);
  }

  const [selectedFile, setSelectedFile] = useState();

  const handleFileSelect = (event) => {
    if (event.target.files[0]) {
      setSelectedFile(event.target.files[0])
      setFileSelectKey(Date.now().toString())
      setFilePopoverOpen(true);
    }
  };

  const getFileType = (mime) => {
    if (mime.startsWith('audio/')) return 'audio';
    if (mime.startsWith('video/')) return 'video';
    if (mime.startsWith('image/')) return 'image';
    return 'file';
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    setUploading(true);
    try {
      const response = await axios.post('https://api.grapsee.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const chat = {
        message: selectedFile.name,
        type: getFileType(selectedFile.type),
        url: response.data.publicUrl,
        senderId: user._id,
        receiverId: reciver._id
      };
      sendMessage('ON_CHAT', chat);
    } catch (error) {
      throw error;
    } finally {
      setUploading(false)
      setFilePopoverOpen(false)
    }
  };

  useEffect(() => {
    if (isMobile) {
      navigate('../chating_mobile', { replace: true, state: { reciver } })
    }
  }, [])

  //let user = JSON.parse(localStorage.getItem('user') || '{}');

  const ws = useWebSocket();
  const sendMessage = useSendMessage();

  useEffect(() => {
    sendMessage('CHATS', {
      senderId: user._id,
      receiverId: reciver._id
    })
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  const handleMessageChange = (event) => {
    const lines = event.target.value.split('\n');
    setMessageLine(lines.length <= 3 ? lines.length : 3);
    setMessage(event.target.value);
  };

  const handleMessageSubmit = () => {
    if (message) {
      const chat = {
        message,
        senderId: user._id,
        receiverId: reciver._id
      };
      sendMessage('ON_CHAT', chat);
      setMessage('')
    } else {

    }
  };

  return (<>
    <div className={styles.wrapper}>
      <div className={styles.container}>

        <div style={{ width: '100%', display: 'flex', alignItems: 'center', borderBottom: '1px solid #CCCCCC', padding: '4px', paddingBottom: '8px' }}>
          <IconButton onClick={() => navigate(-1)} color='primary'>
            <ArrowBackIosIcon />
          </IconButton>
          <ProfilePic isActive={reciver.isActive} src={reciver.profile} alt='Profile' sx={{ width: '50px', height: '50px', borderRadius: '50%', marginLeft: isMobile ? '-20px' : '0px', marginRight: '4px' }} />
          <div style={{ flex: 'auto', display: 'flex', flexDirection: 'column' }}>
            <b style={{ fontSize: isMobile ? '14px' : '18px' }}>{reciver.name}</b>
            <span style={{ color: 'gray', fontSize: isMobile ? '13px' : '18px', marginTop: '1px' }}>{reciver.isActive ? 'active' : ''}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color='primary' sx={!isMobile ? { marginRight: '5px' } : {}}>
              <Video />
            </IconButton>
            <IconButton color='primary' sx={!isMobile ? { marginRight: '5px' } : {}}>
              <CallIcon />
            </IconButton>
            <IconButton color='primary' sx={!isMobile ? { marginRight: '5px' } : { marginLeft: '-5px', marginRight: '-4px' }}>
              <MoreVertical />
            </IconButton>
          </div>
        </div>

        <div ref={chatContainerRef} style={{ flex: 'auto', padding: '12px', overflow: 'hidden', overflowY: 'scroll' }}>
          {
            chats.map((chat) => {
              const isSender = chat.senderId === user._id;

              const isText = chat.type === 'text';
              const isImage = chat.type === 'image';
              const isVideo = chat.type === 'video';
              const isAudio = chat.type === 'audio';

              return (<div key={chat._id} className={isSender ? styles.sendMsg : styles.incommingMsg}>
                <div style={{ borderRadius: '16px', borderTopLeftRadius: isSender ? '16px' : '0px', borderTopRightRadius: !isSender ? '16px' : '0px', display: 'flex', flexDirection: 'column', maxWidth: '55%', padding: '12px', background: isText && isSender ? '#1868C1' : isText && !isSender ? '#DDDDDD' : 'transparent' }}>
                  {isText && <pre style={{ display: 'flex', fontSize: '16px' }}>
                    {chat.message}
                  </pre>}
                  {isImage &&
                    <div style={{ display: 'flex' }}>
                      <a href={chat.url} download="image">
                        <img src={chat.url} style={{ maxHeight: '150px' }} alt='Loading...' />
                      </a>
                    </div>
                  }
                  {isAudio && <div style={{ display: 'flex', }} >
                    <audio src={chat.url} style={{ maxHeight: '150px' }} alt='Loading...' controls loop></audio>
                  </div>}
                  {isVideo && <div style={{ display: 'flex', }} >
                    <video src={chat.url} style={{ maxHeight: '100px', height: '100px' }} alt='Loading...' controls loop></video>
                  </div>}
                </div>
              </div>)
            })
          }
        </div>


        <div style={{ height: '44px', display: 'flex', alignItems: 'center' }}>


          <input
            type="file"
            ref={fileInputRef}
            key={fileSelectKey}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />

          <IconButton color='primary' sx={{ marginRight: '5px' }} onClick={handleSelectFile}>
            <Paperclip />
          </IconButton>

          <Popover
            id={filePopoverId}
            open={isFilePopoverOpen}
            anchorEl={filePopoverAnchorEl}
            onClose={() => setFilePopoverOpen(false)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            sx={{ marginTop: isMobile ? '-90px' : '-50px', marginLeft: '30px' }}
          >
            <div style={{ padding: '8px', width: '200px', maxWidth: '200px', height: '200px', maxHeight: '200px', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>

              {
                selectedFile && getFileType(selectedFile.type) === 'file' && <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <img onClick={handleSelectFile} src={fileIcon} alt='Loading' style={{ width: '100%', height: '100px' }} />
                  <span style={{ marginTop: '8px' }}>{selectedFile.name}</span>
                </div>
              }
              {
                selectedFile && getFileType(selectedFile.type) === 'video' &&
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <video src={URL.createObjectURL(selectedFile)} alt='Loading' style={{ width: '100%', height: '100px' }} autoPlay controls loop></video>
                  <span style={{ marginTop: '8px' }}>{selectedFile.name}</span>
                </div>
              }
              {
                selectedFile && getFileType(selectedFile.type) === 'audio' &&
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <img src={audioIcon} alt='Loading' style={{ width: '180px', height: '80px' }} />
                  <audio src={URL.createObjectURL(selectedFile)} alt='Loading' style={{ width: '100%', height: '50px' }} autoPlay controls loop></audio>
                  <span style={{ marginTop: '8px' }}>{selectedFile.name}</span>
                </div>
              }
              {
                selectedFile && getFileType(selectedFile.type) === 'image' && <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <img src={URL.createObjectURL(selectedFile)} alt='Loading' style={{ width: '100%', height: '120px' }} />
                  <span style={{ marginTop: '8px' }}>{selectedFile.name}</span>
                </div>
              }
              <div style={{ width: '100%', textAlign: 'right' }}>
                {
                  isUploading ? <LinearProgress sx={{ width: '100%', margin: '10px 4px' }} /> :
                    <Button onClick={() => uploadFile()} variant='outlined' size='small' endIcon={<SendOutlined />}>Send</Button>
                }
              </div>
            </div>
          </Popover>


          <IconButton onClick={handleIconButtonClick} color='primary' sx={{ marginRight: '8px' }}>
            <Smile />
          </IconButton>

          <Popover
            id={emojiPopoverId}
            open={isEmojiPopoverOpen}
            anchorEl={emojiPopoverAnchorEl}
            onClose={() => handleCloseEmojiPopover(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            sx={{ marginTop: isMobile ? '-90px' : '-50px', marginLeft: '30px' }}
          >
            <Grid container spacing={1} sx={{ padding: '8px', maxWidth: '200px', maxHeight: '200px', overflow: 'auto' }}>
              {emojiList.map((emoji, index) => (
                <Grid key={index} item xs={3}>
                  <span
                    role="img"
                    aria-label={`Emoji ${index + 1}`}
                    onClick={() => handleCloseEmojiPopover(emoji)}
                    style={{ cursor: 'pointer', fontSize: '24px' }}
                  >
                    {emoji}
                  </span>
                </Grid>
              ))}
            </Grid>
          </Popover>

          <Card elevation={isMobile ? 0 : 3} sx={{ flex: 'auto', display: 'flex', alignItems: 'center', border: '1px solid #CCCCCC', borderRadius: '20px', padding: '8px' }}>
            <textarea
              onChange={handleMessageChange}
              value={message}
              style={{
                flex: 'auto', background: 'transparent', border: 'none', outline: 'none', marginLeft: '5px', fontSize: isMobile ? '12px' : '16px', padding: '3px', overflow: 'hidden',
                resize: 'none',
                //height: `${messageLine * 24}px`,
              }}
              placeholder='Type a message'
              rows={messageLine}
            />
          </Card>
          <IconButton onClick={() => handleMessageSubmit()} color='primary' sx={{ marginLeft: '5px', marginRight: '5px' }}>
            {message ? <Send /> : <Mic />}
          </IconButton>
        </div>
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

export default Chating;