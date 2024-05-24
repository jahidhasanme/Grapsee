const Comment = require('../models/comment');
const User = require('../models/user');
const Post = require('../models/post');

const createComment = async (ws, payload) => {
    try {
        const { author, postId, content } = payload;
        const comment = await Comment.create({ author, postId, content });
        const authorDetails = await User.findById(author);

        const payloadWithAuthor = { 
             _id: comment._id,
            postId: comment.postId,
            content: comment.content,
            createdAt: comment.createdAt,
            author: authorDetails
        };

        ws.send(JSON.stringify({ type: 'COMMENT_CREATED', payload: payloadWithAuthor }));
    } catch (error) {
        ws.send(JSON.stringify({ type: 'ERROR', payload: error.message }));
    }
}

const updateCommentById = async (ws, payload) => {
    try {
        const { id, content } = payload;
        const comment = await Comment.findByIdAndUpdate(id, { content }, { new: true });
        if (!comment) {
            throw new Error('Comment not found');
        }
        ws.send(JSON.stringify({ type: 'COMMENT_UPDATED', payload: comment }));
    } catch (error) {
        ws.send(JSON.stringify({ type: 'ERROR', payload: error.message }));
    }
}

const deleteCommentById = async (ws, payload) => {
    try {
        const { id } = payload;
        const deletedComment = await Comment.findByIdAndDelete(id);
        if (!deletedComment) {
            throw new Error('Comment not found');
        }
        ws.send(JSON.stringify({ type: 'COMMENT_DELETED', payload: id }));
    } catch (error) {
        ws.send(JSON.stringify({ type: 'ERROR', payload: error.message }));
    }
}

const getCommentsByPostId = async (activeConnections, ws, payload) => {
    try {
        const { postId } = payload;
        const comments = await Comment.find({ postId }).populate('author').exec();
        const post = await Post.find(postId);
        post.comments = comments.map(comment => {
            comment.author.isActive = isUserActive(activeConnections, comment.author._id.toString());
            return comment;
        });
        ws.send(JSON.stringify({ type: 'COMMENTS_FETCHED_BY_POST_ID', payload: comments.reverse() }));
    } catch (error) {
        ws.send(JSON.stringify({ type: 'ERROR', payload: error.message }));
    }
}

module.exports = {
    createComment,
    updateCommentById,
    deleteCommentById,
    getCommentsByPostId
};
