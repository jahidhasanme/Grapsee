import { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { calculateTimeDifference, formatUserCount } from '../utils/calculations';
import { Avatar, Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import { Heart, MessageCircle, Repeat, Send, Share, Trash } from 'react-feather';
import { FavoriteOutlined, PublicOutlined } from '@mui/icons-material';
import { useSendMessage } from '../contexts/WebSocketContext';
import ProfilePic from './ProfilePic';
import { useNavigate } from 'react-router-dom';

const Post = ({ type, firstPostId, isOthersUser }) => {

    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width:600px)');
    const isTablet = useMediaQuery('(max-width:960px)');
    const isDesktop = useMediaQuery('(min-width:960px)');

    const sendMessage = useSendMessage();
    const { user, posts, setPosts, comments, setComments } = useAppContext();

    const [postsCommentSection, setPostsCommentSection] = useState({});
    const [postsComment, setPostsComment] = useState({});
    const [commentsMenu, setCommentsMenu] = useState({});
    const [deletePostId, setDeletePostId] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleDeletePost = () => {
        sendMessage('DELETE_POST_BY_ID', { postId: deletePostId })
        setOpenDeleteDialog(false);
    };

    useEffect(() => {
        if (firstPostId) {
            const index = posts.findIndex(post => post._id === firstPostId);
            if (index !== -1) {
                const post = posts.splice(index, 1)[0];
                posts.unshift(post);
                postsCommentSection[post._id] = true;
                setPosts([...posts]);
            } else {
                sendMessage('POST_BY_ID', { postId: firstPostId });
            }
        }
    }, [firstPostId, posts]);

    return (<>
        <div style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {
                posts.map((post, index) => {
                    if (type === 'video' && post.type !== 'video') {
                        return;
                    }

                    if (type === 'profile' && post.author._id !== user._id) {
                        return;
                    }

                    const toggleCommentSection = id => {
                        if (postsCommentSection[id]) {
                            setPostsCommentSection({ ...postsCommentSection, [id]: false });
                        } else {
                            setPostsCommentSection({ ...postsCommentSection, [id]: true });
                        }
                    }

                    const toggleCommentsMenu = (id, isDelete) => {
                        if (post.comments) {
                            if (isDelete) {
                                sendMessage('DELETE_COMMENT', { id })
                                setPosts((prePosts) => {
                                    const posts = prePosts.map(p => {
                                        p.comments = p.comments.filter(c => c._id != id)
                                        return p
                                    })
                                    return posts
                                })
                                return;
                            }
                        }
                        setCommentsMenu({
                            ...commentsMenu,
                            [id]: !commentsMenu[id]
                        });
                    };

                    const handleSendComment = id => {
                        if (postsComment[id]) {
                            sendMessage('CREATE_COMMENT', { author: user._id, postId: id, content: postsComment[id] })
                            setPostsComment({ ...postsComment, [id]: '' })
                            if (user._id !== post.author._id) {
                                sendMessage('CREATE_NOTIFICATION', { senderId: user._id, receiverId: post.author._id, postId: post._id, message: 'comment on your post' })
                            }
                        }
                    }

                    return (<div key={post._id}>
                        <div style={{
                            margin: '20px 10px',
                            padding: '0px 0px',
                            display: 'flex',
                            flexDirection: 'column',
                            overflowX: 'auto'
                        }} >
                            <div style={{ display: 'flex', alignItems: 'center' }}>

                                <ProfilePic onClick={()=> { if(user._id !== post.author._id) { navigate('../profile', { state: { user: post.author } }) }}} isActive={post.author.isActive} src={post.author.profile} alt='Profile' sx={{ width: '48px', height: '48px', background: '#CCCCCC' }} />
                                <div onClick={()=> { if(user._id !== post.author._id) { navigate('../profile', { state: { user: post.author } }) }}} style={{ display: 'flex', flexDirection: 'column', marginLeft: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ fontSize: '18px' }}>{post.author.name}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '2px' }}>
                                        <PublicOutlined sx={{ fontSize: '12px' }} />
                                        <span style={{ fontSize: '12px', marginLeft: '6px' }}>{calculateTimeDifference(post.createdAt)}</span>
                                    </div>
                                </div>
                                <div style={{ flex: 'auto', display: 'flex', justifyContent: 'end' }}>
                                    {/*
                                     post.author._id != user._id && <span style={{ color: theme.palette.primary.main, fontSize: '16px', marginRight: '12px', marginLeft: '8px', marginTop: '5px' }}>Follow</span>}
                                    <IconButton>
                      <MoreVertOutlinedIcon sx={{ fontSize: '32px' }} />
                    </IconButton> */}
                                </div>
                            </div>

                            <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', overflowX: 'auto' }}>
                                <div style={{ width: '100%' }}>
                                    <div style={{ fontSize: '17px' }}>{post.content}</div>
                                </div>
                                {
                                    (post.type === "image" && post.url) && <img src={post.url} style={{ width: '100%', maxHeight: '320px', marginTop: '10px', borderRadius: '15px' }} alt='Loading...' />
                                }
                                {
                                    (post.type === "video" && post.url) && <video controls src={post.url} poster={post.poster} style={{ width: '100%', maxHeight: '320px', marginTop: '10px', borderRadius: '15px' }} alt='Loading...' />
                                }
                            </div>

                            <div style={{ width: "100%", display: "flex", padding: '0px 12px' }} >
                                <div style={{ display: 'flex', alignItems: 'center' }} onClick={() => {
                                    let i = post.reactions.indexOf(user._id);
                                    if (i !== -1) {
                                        post.reactions.splice(i, 1);
                                        posts[index] = post;
                                    } else {
                                        post.reactions.push(user._id);
                                        posts[index] = post;
                                        if (user._id !== post.author._id) {
                                            sendMessage('CREATE_NOTIFICATION', { senderId: user._id, receiverId: post.author._id, postId: post._id, message: 'love react on your post' })
                                        }
                                    }
                                    sendMessage('UPDATE_POST_BY_ID', { postId: post._id, updatedData: post });
                                    setPosts([...posts]);
                                }}>
                                    <IconButton>
                                        {post.reactions.indexOf(user._id) >= 0 ? <FavoriteOutlined style={{ color: "red", fontSize: '30px' }} /> : <Heart size={isMobile ? 24 : 30} />}
                                    </IconButton>
                                    <span style={{ marginLeft: '-5px', marginTop: '4px', fontSize: '14px' }}>{formatUserCount(post.reactions.length || '')}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }} onClick={() => toggleCommentSection(post._id)}>
                                    <IconButton>
                                        <MessageCircle size={isMobile ? 24 : 30} />
                                    </IconButton>
                                    {<span style={{ marginLeft: '-5px', marginTop: '5px', fontSize: '14px' }}>{formatUserCount(post.comments.length || '')}</span>}
                                </div>
                                <div style={{ flex: 'auto' }}></div>
                                {/* <div style={{ display: 'flex', alignItems: 'center', marginRight: '8px' }}>
                                    <IconButton>
                                        <Repeat size={isMobile ? 24 : 30} />
                                    </IconButton>
                                </div> */}
                                <IconButton>
                                    <Share size={isMobile ? 24 : 30} />
                                </IconButton>
                                { (!isOthersUser && post.author._id === user._id) && <div onClick={() => { setDeletePostId(post._id); setOpenDeleteDialog(true) }} style={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton>
                                        <Trash size={isMobile ? 24 : 30} />
                                    </IconButton>
                                </div>}
                            </div>
                        </div>

                        {
                            postsCommentSection[post._id] &&

                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', padding: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', }}>
                                    <ProfilePic isActive={user.isActive} src={user.profile} alt='Profile' sx={{ width: '40px', height: '40px', background: '#CCCCCC' }} />
                                    <div style={{ display: 'flex', flexDirection: 'column', padding: '8px', marginLeft: '5px', borderRadius: '10px', background: '#EEEEEE' }}>
                                        <span style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '3px' }}>{user.name}</span>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <textarea onChange={(e) => setPostsComment({ ...postsComment, [post._id]: e.target.value })} value={postsComment[post._id]} rows='3' style={{ width: '80%', flex: 'auto', padding: '3px', fontSize: '16px', outline: 'none', border: 'none', borderRadius: '10px' }}></textarea>
                                            <IconButton onClick={() => handleSendComment(post._id)} color="primary" sx={{ ml: '5px' }}>
                                                <Send />
                                            </IconButton>
                                        </div>
                                    </div>
                                </div>

                                {
                                    post.comments.map((comment) => (
                                        <div key={comment._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }} onClick={() => { if (comment.author._id === user._id) toggleCommentsMenu(comment._id, false) }}>
                                            <ProfilePic isActive={comment.author.isActive} src={comment.author.profile} alt='Profile' sx={{ width: '40px', height: '40px', background: '#CCCCCC' }} />
                                            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '5px', padding: '12px', borderRadius: '10px', background: '#EEEEEE' }}>
                                                <span style={{ fontSize: '16px', fontWeight: 'bold', }}>{comment.author.name}</span>
                                                <span style={{ fontSize: '10px', marginTop: '2px', marginBottom: '5px', color: 'gray' }}>{calculateTimeDifference(comment.createdAt)}</span>
                                                <span style={{ fontSize: '14px' }}>{comment.content}</span>
                                            </div>
                                            {commentsMenu[comment._id] && <Card onClick={(e) => e.stopPropagation()}>
                                                <MenuItem onClick={() => toggleCommentsMenu(comment._id, true)}>Delete</MenuItem>
                                            </Card>}
                                        </div>
                                    ))
                                }

                            </div>
                        }
                        <hr />
                    </div>
                    )
                })
            }
        </div>
        <Dialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
        >
            <DialogTitle>Delete!</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Do you want to delete it?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenDeleteDialog(false)}>Close</Button>
                <Button onClick={() => handleDeletePost()} style={{ color: 'red' }}>Delete</Button>
            </DialogActions>
        </Dialog>
    </>)
}

export default Post;