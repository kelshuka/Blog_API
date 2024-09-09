require("dotenv").config();
const db = require("../db/queries");
const validations = require('../middleware/helpers');

const editPost = require('../middleware/editPost');


const getPosts = [
    validations.verifyToken,

    async (req, res) => {
        try {
            const posts = await db.getAllPosts();
            res.json({ posts });
        } catch (error){
            console.error("Error fetching posts", error);
            return res.status(500).json({ error: 'Error fetching posts'});
        }    
    },
];

const postPosts = [
    validations.verifyToken,
    validations.verifyAdmin,
    validations.validatePost,

    async (req, res) => {
        try {
            console.log("req.token.id:", req.token.id);
            await db.createPost(req.body.title, req.body.text, req.token.id);
            res.json({ message: 'Post created in db' });
        } catch (error){
            console.error("Error creating post", error);
            return res.status(500).json({ error: 'Error creating posts'});
        }    
    },
];

const getAPost = [
    validations.verifyToken,

    async (req, res) => {
        const postId = req.params.postId;
        try {
            const post = await db.getPostById(postId);
            res.json({ post: post });
        } catch (error){
            console.error("Error fetching post", error);
            return res.status(500).json({ error: 'Error fetching post.'});
        }    
    },
];

const updateAPost = [
    validations.verifyToken,
    validations.verifyAdmin,
    validations.validateUpdatePost,

    async (req, res) => {
        const postId = req.params.postId;
        const updateData = editPost.parseEditPost(req.body);
        try {
            await db.updatePost(postId, updateData);
            res.json({  message: 'Post updated in db' });
        } catch (error){
            console.error("Error updating post", error);
            return res.status(500).json({ error: 'Error updating post.'});
        }    
    },
];

const deleteAPost = [
    validations.verifyToken,
    validations.verifyAdmin,

    async (req, res) => {
        const postId = req.params.postId;
        try {
            const post = await db.deletePost(postId);
            res.json({ message: 'Post deleted from db' });
        } catch (error){
            console.error("Error deleting post", error);
            return res.status(500).json({ error: 'Error deleting post.'});
        }    
    },
];




module.exports = {
    getPosts,
    getAPost,
    postPosts,
    updateAPost,
    deleteAPost
};

