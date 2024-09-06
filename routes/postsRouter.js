const { Router } = require("express");
const postsController = require("../controllers/postsController");
const postsRouter = Router();



postsRouter.get("/", postsController.getPosts);
postsRouter.post("/", postsController.postPosts);

postsRouter.get("/:postId", postsController.getAPost);
postsRouter.patch("/:postId", postsController.updateAPost);
postsRouter.delete("/:postId", postsController.deleteAPost);


module.exports = postsRouter;