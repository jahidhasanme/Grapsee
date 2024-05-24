const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    nickname: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    profession: String,
    gender: { type: String, enum: ['Male', 'Female', 'Trans', 'Others'] },
    dateOfBirth: String,
    address: String,
    profile: String,
    cover: String,
    bio: String,
    education: String,
    relationStatus: String,
    info: String,
    type: String,
    password: String,
    isActive: { type: Boolean, default: false },
});

userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
