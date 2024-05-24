const Notification = require('../models/notification');
const { verifyToken } = require('../utils/auth');

const createNotification = async (activeConnections, ws, payload) => {
    try {
        const { senderId, receiverId, postId, message } = payload;
        const newNotification = new Notification({ senderId, receiverId, postId, message });

        const notification = await newNotification.save();

        activeConnections.forEach((active, connection) => {
            if (active && connection.userId === receiverId) {
                connection.send(JSON.stringify({ type: 'NOTIFICATION_RECEIVED', payload: notification }));
            }
        });

        ws.send(JSON.stringify({ type: 'NOTIFICATION_CREATED', payload: notification }));

    } catch (error) {
        ws.send(JSON.stringify({ type: 'ERROR', payload: error.message }));
    }
};

const getNotificationById = async (activeConnections, ws, payload) => {
    try {
        const { notificationId } = payload;
        const notification = await Notification.findById(notificationId).exec();

        if (!notification) {
            throw new Error('Notification not found');
        }

        ws.send(JSON.stringify({ type: 'NOTIFICATION', payload: notification }));
    } catch (error) {
        ws.send(JSON.stringify({ type: 'ERROR', payload: error.message }));
    }
};

const updateNotificationById = async (activeConnections, ws, payload) => {
    try {
        const { notificationId, updatedData } = payload;
        const notification = await Notification.findByIdAndUpdate(notificationId, updatedData, { new: true }).exec();

        ws.send(JSON.stringify({ type: 'UPDATED_NOTIFICATION', payload: notification }));
    } catch (error) {
        ws.send(JSON.stringify({ type: 'ERROR', payload: error.message }));
    }
};

const deleteNotificationById = async (ws, payload) => {
    try {
        const { notificationId } = payload;
        await Notification.findByIdAndDelete(notificationId).exec();

        ws.send(JSON.stringify({ type: 'DELETED_NOTIFICATION', payload: { notificationId } }));
    } catch (error) {
        ws.send(JSON.stringify({ type: 'ERROR', payload: error.message }));
    }
};

const getAllNotifications = async (ws, payload) => {
    try {
        const { token, receiverId } = payload;
        verifyToken(token);

        const query = { receiverId };

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .populate({
                path: 'senderId',
                model: 'User'
            })
            .populate({
                path: 'receiverId',
                model: 'User'
            })
            .exec();

        ws.send(JSON.stringify({ type: 'NOTIFICATIONS', payload: { notifications } }));
    } catch (error) {
        ws.send(JSON.stringify({ type: 'ERROR', payload: error.message }));
    }
};

module.exports = { createNotification, getNotificationById, updateNotificationById, deleteNotificationById, getAllNotifications };
