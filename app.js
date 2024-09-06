require("dotenv").config();
const express = require('express');
const app = express();

const bcrypt = require('bcryptjs');
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const cors = require('cors');

app.use(passport.initialize());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const path = require("node:path");

// serving static assets (for the css in this case)
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));


//app.set("views", path.join(__dirname,"./views"));
app.set("views", path.join(__dirname,"/views"));
app.set("view engine", "ejs");


const db = require('./db/queries');

const indexRouter = require("./routes/indexRouter");
const postsRouter = require("./routes/postsRouter");
const commentsRouter = require("./routes/commentsRouter");



// setting up the LocalStartegy. Authenticating setup
passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await db.findUser("username", username);
        
  
        if (!user) {
          return done(null, false, { message: "Username not found" });
        }

       const match = await bcrypt.compare(password, user.password);
       if (!match){
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" })
       }
        return done(null, user);
      } catch(err) {
        return done(err);
      }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});
  
passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.findUser("id", id); 
        done(null, user);
    } catch(err) {
        done(err);
    }
});


// Middleware to set locals
app.use( (req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});


app.use("/", indexRouter);
app.use("/api/posts", postsRouter);
app.use("/api/comments", commentsRouter);

app.get('*', (req, res) => {
    res.sendStatus(404);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT);
