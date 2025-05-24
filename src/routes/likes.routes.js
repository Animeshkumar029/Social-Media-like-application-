import { Router } from "express";
import { likePost,unlikePost,totalLikes } from "../controller/likes.controller.js";
import { isLoggedin } from "../middlewares/authMiddleware.js";

const router=Router();

router.get("/posts/:postId/likes",isLoggedin,totalLikes);
router.get("/posts/:postId/likes/likePost",isLoggedin,likePost);
router.get("/posts/:postId/likes/unlikePost",isLoggedin,unlikePost);

export default router;

