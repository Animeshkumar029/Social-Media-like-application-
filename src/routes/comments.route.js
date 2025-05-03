import { Router } from "express";
import {makeComment,getCommentOnParticularPost,getAllComments,updateComment,deleteComment} from "../controller/comments.controller.js";
import { isLoggedin } from "../middlewares/authMiddleware.js";


const router=Router();

router.post("/posts/:postId/comments",isLoggedin,makeComment);
router.get("/posts/:postId/comments",isLoggedin,getCommentOnParticularPost);
router.get("/comments",isLoggedin,getAllComments);
router.patch("/comments/:commentId",isLoggedin,updateComment);
router.delete("/comments/:commentId",isLoggedin,deleteComment);

export default router;