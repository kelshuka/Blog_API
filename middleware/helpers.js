require("dotenv").config();
const Joi  = require('joi');
const jwt = require('jsonwebtoken');



const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const validateSignUp = (req, res, next) => {
    const { error } = signupSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};


function verifyToken(req, res, next) {

    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader === 'undefined'){
        res.sendStatus(403);      
    }

    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];

    jwt.verify(bearerToken, process.env.JWT_SECRET, (err, authData) => {
        if(err){
            res.sendStatus(403);
        }

        req.token = authData;
        next();
    });  
}

function verifyAdmin(req, res, next){
    if(req.token.type !== "Admin"){
        return res.sendStatus(403);
    }
    next();
}

const validatePost = (req, res, next) => {
    const { error } = postSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const validateUpdatePost = (req, res, next) => {
    const { error } = updatePostSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const validateUpdateComment = (req, res, next) => {
    const { error } = updateCommentSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};


// Joi functions
const loginSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required()
});

const signupSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required()
});

const postSchema = Joi.object({
    title: Joi.string().min(3).max(80).required(),
    text: Joi.string().min(3).required(),
    isPublished: Joi.boolean().optional()
});

const updatePostSchema = Joi.object({
    title: Joi.string().min(3).max(80).required(),
    text: Joi.string().min(3).required(),
    isPublished: Joi.boolean().optional()
});

const commentSchema = Joi.object({
    text: Joi.string().min(1).max(3000).required(),
    parentId: Joi.string().required()
});

const updateCommentSchema = Joi.object({
    text: Joi.string().min(1).max(3000).required()
});


module.exports = {
    validateLogin,
    validateSignUp,
    verifyToken,
    verifyAdmin,
    validatePost,
    validateUpdatePost,
    validateComment,
    validateUpdateComment
};
