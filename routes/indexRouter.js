const { Router } = require("express");
const indexController = require("../controllers/indexController");
const indexRouter = Router();


/* indexRouter.get("/", (req, res) => {
    res.render("index", {title: "Home"});
}); */


indexRouter.post("/sign-up", indexController.createNewUserPost);


indexRouter.post("/log-in", indexController.loginPost);

indexRouter.get("/log-out", indexController.logOutGet);

indexRouter.post("/make-admin", indexController.makeAdmin);



module.exports = indexRouter;