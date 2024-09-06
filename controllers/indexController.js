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
            res.redirect("/sign-up")
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

        await db.signUp(req.body);

        //const user = await db.getUserByUsername(req.body.username);

        //Authenticate the user immdeiately after sign up
        passport.authenticate('local', { session: false}, (err, user, info) => {
            if (err) {
                return next(err); // Handle errors from passport.
            }
            if (!user) {
                //Authentication failed
                return res.status(401).json({ message: info.message });
            }

            // Log the user in
            const token = jwt(
                { id: user.id, username: user.username, type: user.type },
                process.env.JWT_SECRET,
                { expiresIn: '2 days'}
            );
            return res.json({ token: token });
        })(req, res, next);
    },
];

const logOutGet = async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
};




module.exports = {
    createNewUserPost,
    loginPost,
    logOutGet
};

