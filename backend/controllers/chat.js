const Chat = require('../models/chat');

const getAllLastChats = async (ws) => {
    try {
        const latestChats = await Chat.aggregate([
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: { senderId: "$senderId", receiverId: "$receiverId" },
                    lastMessage: { $first: "$message" },
                    updatedAt: { $first: "$updatedAt" },
                    receiverInfo: { $first: "$$ROOT.receiverId" }
                }
            }
        ]);

        ws.send(JSON.stringify({ type: 'LAST_CHATS', payload: latestChats }));
    } catch (error) {
        ws.send(JSON.stringify({ type: 'ERROR', payload: error.message }));
    }
}


const getChats = async (ws, payload) => {
    try {
        const { senderId, receiverId } = payload;
        const chats = await Chat.find({ $or: [{ senderId, receiverId }, { senderId: receiverId, receiverId: senderId }] })
            .sort({ createdAt: 1 })
            .exec();
        ws.send(JSON.stringify({ type: 'CHATS', payload: chats }));
    } catch (error) {
        ws.send(JSON.stringify({ type: 'ERROR', payload: error.message }));
    }
}

const onChat = async (activeConnections, ws, payload) => {
    try {
        const { senderId, receiverId, message, type = 'text', url = '' } = payload;

        const newChat = new Chat({ senderId, receiverId, message, type, url });
        const savedChat = await newChat.save();

        ws.send(JSON.stringify({ type: 'CHAT_SAVED', payload: savedChat }));

        activeConnections.forEach((active, connection) => {
            if (active && connection.userId === receiverId) {
                connection.send(JSON.stringify({ type: 'NEW_CHAT', payload: savedChat }));

                Chat.updateOne({ _id: savedChat._id }, { receiverStatus: 'delivered' })
                    .then(() => { })
                    .catch(error => connection.send(JSON.stringify({ type: 'ERROR', payload: error.message })));
            }
        });
    } catch (error) {
        ws.send(JSON.stringify({ type: 'ERROR', payload: error.message }));
    }
}

const onChatConfirm = async (activeConnections, ws, payload) => {
    const { chatId, userId } = payload;
    try {
        await Chat.updateOne({ _id: chatId, receiverId: userId }, { receiverStatus: 'delivered' });
        activeConnections.forEach((active, connection) => {
            if (active && connection.userId === userId) {
                connection.send(JSON.stringify({ type: 'CHAT_CONFIRM', payload: { chatId } }));
            }
        });
        ws.send(JSON.stringify({ type: 'CHAT_CONFIRM_SUCCESS' }));
    } catch (error) {
        ws.send(JSON.stringify({ type: 'ERROR', payload: error.message }));
    }
}

const onChatSeen = async (activeConnections, ws, payload) => {
    const { chatId, userId } = payload;
    try {
        await Chat.updateOne({ _id: chatId, receiverId: userId }, { receiverStatus: 'seen' });
        activeConnections.forEach((active, connection) => {
            if (active && connection.userId === userId) {
                connection.send(JSON.stringify({ type: 'CHAT_SEEN', payload: { chatId } }));
            }
        });

        ws.send(JSON.stringify({ type: 'CHAT_SEEN_SUCCESS' }));
    } catch (error) {
        ws.send(JSON.stringify({ type: 'ERROR', payload: error.message }));
    }
}

module.exports = { getAllLastChats, getChats, onChat, onChatConfirm, onChatSeen };