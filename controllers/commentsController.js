require("dotenv").config();
const db = require("../db/queries");
const validations = require('../middleware/helpers');




const getComments = [
    validations.verifyToken,

    async (req, res) => {
        try {
            const comments = await db.getAllComments();
            res.json({ comments });
        } catch (error){
            console.error("Error fetching comments", error);
            return res.status(500).json({ error: 'Error fetching comments'});
        }    
    },
];

const postComments = [
    validations.verifyToken,
    validations.validateComment,

    async (req, res) => {
        const postId = req.params.postId;
        const userId = req.token.id;
        try {
            const comment = await db.createComment(userId, req.body.text, postId);
            res.json({ message: 'Comment created in db', comment: comment });
        } catch (error){
            console.error("Error creating comment", error);
            return res.status(500).json({ error: 'Error creating comment'});
        }    
    },
];


const getAPostComments = [
    validations.verifyToken,

    async (req, res) => {
        const postId = req.params.postId;
        try {
            const comments = await db.getCommentsOfPost(postId);
            res.json({ comments });
        } catch (error){
            console.error("Error fetching comments", error);
            return res.status(500).json({ error: 'Error fetching comments'});
        }    
    },
];


const updateAComment = [
    validations.verifyToken,
    validations.verifyAdmin,
    validations.validateUpdateComment,

    async (req, res) => {
        const commentId = req.params.commentId;
        try {
            const updatedComment = await db.updateComment(commentId, req.body.text);
            res.json({  message: 'Post updated in db' , comment: updatedComment});
        } catch (error){
            console.error("Error updating comment", error);
            return res.status(500).json({ error: 'Error updating comment.'});
        }    
    },
];

const deleteAComment = [
    validations.verifyToken,
    validations.verifyAdmin,

    async (req, res) => {
        const commentId = req.params.commentId;
        try {
            const comment = await db.deleteComment(commentId);
            res.json({ message: 'Comment deleted from db', comment });
        } catch (error){
            console.error("Error deleting comment", error);
            return res.status(500).json({ error: 'Error deleting comment.'});
        }    
    },
];




module.exports = {
    getComments,
    postComments,
    getAPostComments,
    updateAComment,
    deleteAComment
};

