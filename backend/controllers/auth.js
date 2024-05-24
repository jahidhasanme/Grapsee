const bcrypt = require('bcrypt');
const User = require('../models/user');
const { generateToken } = require('../utils/auth');

const register = async (activeConnections, ws, payload) => {
    try {
        const { password, confirmPassword, ...userData } = payload;
        if (password !== confirmPassword) {
            ws.send(JSON.stringify({ type: 'ERROR', payload: 'Passwords do not match' }));
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            ...userData,
            password: hashedPassword,
            username: '@' + userData.email.split('@')[0],
            type: 'normal',
        });
        const savedUser = await newUser.save();
        ws.userId = savedUser._id;
        activeConnections.set(ws, true);
        savedUser.isActive = true;
        const token = generateToken(savedUser._id);
        ws.send(JSON.stringify({ type: 'REGISTER_SUCCESS', payload: { user: savedUser, token } }));
    } catch (error) {
        ws.send(JSON.stringify({ type: 'ERROR', payload: error.message }));
    }
};

const login = async (activeConnections, ws, payload) => {
    try {
        const { email, password } = payload;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            ws.send(JSON.stringify({ type: 'ERROR', payload: 'Invalid email or password' }));
            return;
        }
        ws.userId = user._id;
        activeConnections.set(ws, true);
        user.isActive = true;
        const token = generateToken(user._id);
        ws.send(JSON.stringify({ type: 'LOGIN_SUCCESS', payload: { user, token } }));
    } catch (error) {
        ws.send(JSON.stringify({ type: 'ERROR', payload: error.message }));
    }
};

const loginByUsername = async (activeConnections, ws, payload) => {
    try {
        const { username, password } = payload;
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            ws.send(JSON.stringify({ type: 'ERROR', payload: 'Invalid username or password' }));
            return;
        }
        ws.userId = user._id;
        activeConnections.set(ws, true);
        user.isActive = true;
        const token = generateToken(user._id);
        ws.send(JSON.stringify({ type: 'LOGIN_SUCCESS', payload: { user, token } }));
    } catch (error) {
        ws.send(JSON.stringify({ type: 'ERROR', payload: error.message }));
    }
};

const logout = async (activeConnections, ws, payload) => {
    try {
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
        ws.send(JSON.stringify({ type: 'LOGOUT_SUCCESS', payload: {} }));
    } catch (error) {
        ws.send(JSON.stringify({ type: 'ERROR', payload: error.message }));
    }
};

module.exports = { register, login, loginByUsername, logout }