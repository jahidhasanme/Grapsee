const path = require('path');
const fs = require('fs');

const Post = require('../models/post');
const Comment = require('../models/comment');

const { verifyToken } = require('../utils/auth');
const { isUserActive } = require('../utils/user');

const createPost = async (activeConnections, ws, payload) => {
    const { content, author, url, type } = payload;
    const newPost = new Post({ content, author, url, type });

    const post = await newPost.save();

    post.author = author
    post.author.isActive = isUserActive(activeConnections, post.author._id.toString());
    post.comments = [];

    ws.send(JSON.stringify({ type: 'POST_CREATED', payload: post }));
}

const getPostById = async (activeConnections, ws, payload) => {
    try {
        const { postId } = payload;
        const post = await Post.findById(postId)
            .populate('author')
            .exec();

        if (!post) {
            throw new Error('Post not found');
        }
        post.author.isActive = isUserActive(activeConnections, post.author._id.toString());

        const comments = await Comment.find({ postId }).populate('author').exec();
        post.comments = comments.map(comment => {
            comment.author.isActive = isUserActive(activeConnections, comment.author._id.toString());
            return comment;
        });

        ws.send(JSON.stringify({ type: 'POST', payload: post }));
    } catch (error) {
        ws.send(JSON.stringify({ type: 'ERROR', payload: error.message }));
    }
};

const updatePostById = async (activeConnections, ws, payload) => {
    try {
        const { postId, updatedData } = payload;
        const post = await Post.findByIdAndUpdate(postId, updatedData, { new: true });

        post.author.isActive = isUserActive(activeConnections, post.author._id.toString());

        const comments = await Comment.find({ postId }).populate('author').exec();
        post.comments = comments.map(comment => {
            comment.author.isActive = isUserActive(activeConnections, comment.author._id.toString());
            return comment;
        });

        ws.send(JSON.stringify({ type: 'UPDATED_POST', payload: post }));
    } catch (error) {
        ws.send(JSON.stringify({ type: 'ERROR', payload: error.message }));
    }
};

const deletePostById = async (ws, payload) => {
    try {
        const { postId } = payload;
        const post = await Post.findByIdAndDelete(postId);
        if (post.type != 'text') {
            const filePath = path.join(__dirname, '../uploads', post.type + 's', post.url.substring(post.url.lastIndexOf('/')));
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (e) => { });
            }
        }
        ws.send(JSON.stringify({ type: 'DELETED_POST', payload: { postId } }));
    } catch (error) {
        console.error("Error deleting post:", error);
        ws.send(JSON.stringify({ type: 'ERROR', payload: error.message }));
    }
};

const getPosts = async (activeConnections, ws, payload) => {
    try {
        const { token, startPosition = 0, endPosition = 30 } = payload;
        verifyToken(token);

        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip(startPosition)
            .limit(endPosition)
            .populate({
                path: 'author',
                model: 'User'
            })
            .exec();

        for (const post of posts) {
            post.author.isActive = isUserActive(activeConnections, post.author._id.toString());
            const comments = await Comment.find({ postId: post._id }).populate('author').exec();
            post.comments = comments.map(comment => {
                comment.author.isActive = isUserActive(activeConnections, comment.author._id.toString());
                return comment;
            });
            post.comments = post.comments.reverse();
        }

        ws.send(JSON.stringify({ type: 'POSTS', payload: posts }));
    } catch (error) {
        ws.send(JSON.stringify({ type: 'ERROR', payload: error.message }));
    }
};

module.exports = { createPost, getPostById, updatePostById, deletePostById, getPosts };