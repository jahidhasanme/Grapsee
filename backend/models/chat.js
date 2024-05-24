const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    message: { type: String, required: true },
    url: { type: String },
    type: { type: String, enum: ['audio', 'video', 'image', 'file', 'text'], default: 'text' },
    senderStatus: { type: String, enum: ['delivered', 'seen', 'not_delivered'], default: 'not_delivered' },
    receiverStatus: { type: String, enum: ['delivered', 'seen', 'not_delivered'], default: 'not_delivered' },
    edited: { type: Boolean, default: false }
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
