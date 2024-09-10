require("dotenv").config();
const passport = require("passport");
const jwt = require('jsonwebtoken');


const db = require("../db/queries");
const validations = require('../middleware/helpers');



// Create New Users
const createNewUserPost = [
    validations.validateSignUp,

    async (req, res, next) => {
        try {
            await db.signUp(req.body);
            //res.redirect("/sign-up")
        } catch (error){
            console.error("Error creating an account", error);
            return res.status(500).json({ errorMsg: 'Error creating account.', error });
        }    
    },
];


// Log in members
const loginPost = [
    validations.validateLogin,
    
    async (req, res, next) => {
        passport.authenticate('local', { session: false}, (err, user, info) => {
            if (err) {
                return next(err); // Handle errors from passport.
            }
            if (!user) {
                //Authentication failed
                return res.status(401).json({ message: info.message });
            }

            // Log the user in
            const token = jwt.sign(
                { id: user.id, username: user.username, type: user.type },
                process.env.JWT_SECRET,
                { expiresIn: '2 days'}
            );
            return res.json({ 
                token, 
                user: {id: user.id, type: user.type }
            });
        })(req, res, next);
    },
];

const logOutGet = async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        //res.redirect("/");
    });
};


// Make an Admin
const makeAdmin = async (req, res) => {
    const { username } = req.body;
    try {
        await db.makeAdmin(username);
        res.json({ message: `${username} is now an Admin` });
    } catch (error){
        console.error('Error updating user role:', error);
        res.status(500).json({ error: 'Error updating user role' });
    } 
}




module.exports = {
    createNewUserPost,
    loginPost,
    logOutGet,
    makeAdmin
};

