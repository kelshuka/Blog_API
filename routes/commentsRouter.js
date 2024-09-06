const { Router } = require("express");
const commentsController = require("../controllers/commentsController");
const commentsRouter = Router();



commentsRouter.get("/", commentsController.getComments);
commentsRouter.post("/", commentsController.postComments);

commentsRouter.get("/:postId/comments", commentsController.getAPostComments);

commentsRouter.patch("/:commentId", commentsController.updateAComment);
commentsRouter.delete("/:commentId", commentsController.deleteAComment);


module.exports = commentsRouter;