const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const dotenv = require('dotenv');
const cors = require('cors');

const { login, loginByUsername, register, logout } = require('./controllers/auth');
const { getUserById, updateUserById, deleteUserById, getActiveUserIds, getUsers } = require('./controllers/user');
const { updatePostById, createPost, deletePostById, getPostById, getPosts } = require('./controllers/post');
const { createComment, updateCommentById, deleteCommentById, getCommentsByPostId } = require('./controllers/comment');
const { getChats, onChat, onChatSeen, onChatConfirm, getAllLastChats } = require('./controllers/chat');
const { createNotification, getNotificationById, updateNotificationById, deleteNotificationById, getAllNotifications } = require('./controllers/notification');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grapsee';
const PORT = process.env.PORT || 4000;

const BASE_URL = 'http://localhost:4000';

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(MONGODB_URI);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('connected', () => {
    console.log('MongoDB connected successfully');
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = '';
        if (file.mimetype.includes('video')) {
            uploadPath = './uploads/videos/';
        } else if (file.mimetype.includes('image')) {
            uploadPath = './uploads/images/';
        } else {
            //return cb(new Error('Invalid file type'));
            uploadPath = './uploads/files/';
        }
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const randomPrefix = Math.random().toString(36).substring(2, 6);
        const timestamp = Date.now();
        const fileExtension = path.extname(file.originalname);
        cb(null, `${randomPrefix}_${timestamp}${fileExtension}`);
    }
});

const uploadLimits = {
    fileSize: {
        video: 20 * 1024 * 1024,
        image: 2 * 1024 * 1024,
        default: 20 * 1024 * 1024
    }
};

const upload = multer({
    storage: storage,
    limits: (req, file, cb) => {
        let limit;
        if (file.mimetype.includes('video')) {
            limit = uploadLimits.fileSize.video;
        } else if (file.mimetype.includes('image')) {
            limit = uploadLimits.fileSize.image;
        } else {
            limit = uploadLimits.fileSize.default;
        }
        cb(null, limit);
    }
});


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path.replace(/\\/g, '/');
    const publicUrl = `${BASE_URL}/${filePath}`;

    res.status(200).json({ message: 'File uploaded successfully', publicUrl });
});


app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        res.status(400).json({ error: 'File size too large or invalid file type' });
    } else {
        res.status(500).json({ error: err.message });
    }
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const wss = new WebSocket.Server({ noServer: true });

const activeConnections = new Map();


wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
        const data = JSON.parse(message)
        try {
            switch (data.type) {

                case 'ADD_TO_ACTIVE_USER':
                    ws.userId = data.payload.userId;
                    activeConnections.set(ws, true);
                    break;

                case 'ACTIVE_USER_IDS':
                    getActiveUserIds(activeConnections, ws, data.payload);
                    break;

                case 'REGISTER':
                    await register(activeConnections, ws, data.payload);
                    break;

                case 'LOGIN':
                    await login(activeConnections, ws, data.payload);
                    break;

                case 'LOGOUT':
                    await logout(activeConnections, ws, data.payload);
                    break;

                case 'LOGIN_BY_USERNAME':
                    await loginByUsername(activeConnections, ws, data.payload);
                    break;

                case 'USERS':
                    await getUsers(activeConnections, ws, data.payload);
                    break;

                case 'USER_BY_ID':
                    await getUserById(activeConnections, ws, data.payload);
                    break;

                case 'UPDATE_USER_BY_ID':
                    await updateUserById(activeConnections, ws, data.payload);
                    break;

                case 'DELETE_USER_BY_ID':
                    await deleteUserById(ws, data.payload);
                    break;

                case 'POSTS':
                    await getPosts(activeConnections, ws, data.payload);
                    break;

                case 'CREATE_POST':
                    await createPost(activeConnections, ws, data.payload);
                    break;

                case 'POST_BY_ID':
                    await getPostById(activeConnections, ws, data.payload);
                    break;

                case 'UPDATE_POST_BY_ID':
                    await updatePostById(activeConnections, ws, data.payload);
                    break;

                case 'DELETE_POST_BY_ID':
                    await deletePostById(ws, data.payload);
                    break;

                case 'CREATE_COMMENT':
                    await createComment(ws, data.payload);
                    break;

                case 'UPDATE_COMMENT':
                    await updateCommentById(ws, data.payload);
                    break;

                case 'DELETE_COMMENT':
                    await deleteCommentById(ws, data.payload);
                    break;

                case 'COMMENTS_BY_POST_ID':
                    await getCommentsByPostId(activeConnections, ws, data.payload);
                    break;

                case 'ALL_CHATS':
                    await getAllLastChats(ws, data.payload);
                    break;

                case 'CHATS':
                    await getChats(ws, data.payload);
                    break;

                case 'ON_CHAT':
                    await onChat(activeConnections, ws, data.payload);
                    break;

                case 'ON_CHAT_CONFIRM':
                    await onChatConfirm(activeConnections, ws, data.payload);
                    break;

                case 'ON_CHAT_SEEN':
                    await onChatSeen(activeConnections, ws, data.payload);
                    break;

                case 'CREATE_NOTIFICATION':
                    await createNotification(activeConnections, ws, data.payload);
                    break;

                case 'NOTIFICATION_BY_ID':
                    await getNotificationById(activeConnections, ws, data.payload);
                    break;

                case 'UPDATE_NOTIFICATION_BY_ID':
                    await updateNotificationById(activeConnections, ws, data.payload);
                    break;

                case 'DELETE_NOTIFICATION_BY_ID':
                    await deleteNotificationById(ws, data.payload);
                    break;

                case 'NOTIFICATIONS':
                    await getAllNotifications(ws, data.payload);
                    break;

                default:
                    ws.send(JSON.stringify({ type: 'ERROR', payload: 'Invalid action type' }));
            }
        } catch (error) {
            ws.send(JSON.stringify({ type: 'ERROR', payload: error.message }));
        }
    });

    ws.on('close', function close() {
        activeConnections.delete(ws);

        activeConnections.forEach((value, key) => {
            try {
                if (key != ws) {
                    key.send(JSON.stringify({ type: 'USER_DEACTIVATED', payload: { userId: ws.userId } }));
                }
            } catch (error) {
                console.error('Error notifying active user:', error);
            }
        });

    });

});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});