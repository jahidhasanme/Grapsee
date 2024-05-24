const User = require('../models/user');
const { verifyToken } = require('../utils/auth');
const { isUserActive } = require('../utils/user');

const getUsers = async (activeConnections, ws, payload) => {
    try {
        const { token, startPosition = 0, endPosition = 30 } = payload;
        verifyToken(token);

        const users = await User.find().skip(startPosition).limit(endPosition).exec();
        users.forEach(user => {
            user.isActive = isUserActive(activeConnections, user._id.toString());
        });

        ws.send(JSON.stringify({ type: 'USERS', payload: users }));
    } catch (error) {
        ws.send(JSON.stringify({ type: 'ERROR', payload: error.message }));
    }
};

const getUserById = async (activeConnections, ws, payload) => {
    try {
        const { userId } = payload;
        const user = await User.findById(userId);
        
        if (!user) {
            throw new Error('User not found');
        }
        
        user.isActive = isUserActive(activeConnections, user._id.toString());

        ws.send(JSON.stringify({ type: 'USER_FETCHED_BY_ID', payload: user }));
    } catch (error) {
        ws.send(JSON.stringify({ type: 'ERROR', payload: error.message }));
    }
}

const updateUserById = async (activeConnections, ws, payload) => {
    try {
        const { userId, updates } = payload;
        const user = await User.findByIdAndUpdate(userId, updates, { new: true });
        if (!user) {
            throw new Error('User not found');
        }

        user.isActive = isUserActive(activeConnections, user._id.toString());

        ws.send(JSON.stringify({ type: 'USER_UPDATED', payload: user }));
    } catch (error) {
        ws.send(JSON.stringify({ type: 'ERROR', payload: error.message }));
    }
}

const deleteUserById = async (ws, payload) => {
    try {
        const { userId } = payload;
        await User.findByIdAndDelete(userId);
        ws.send(JSON.stringify({ type: 'USER_DELETED', payload: { userId } }));
    } catch (error) {
        ws.send(JSON.stringify({ type: 'ERROR', payload: error.message }));
    }
}

const getActiveUserIds = (activeConnections, ws, payload) => {
    try {
        const activeUserIds = [];
        activeConnections.forEach((value, key) => {
            activeUserIds.push(key.userId);
        });
        ws.send(JSON.stringify({ type: 'ON_ACTIVE_USER_IDS', payload: activeUserIds }));
    } catch (error) {
        ws.send(JSON.stringify({ type: 'ERROR', payload: error.message }));
    }
};

module.exports = { getUsers, getActiveUserIds, getUserById, updateUserById, deleteUserById };