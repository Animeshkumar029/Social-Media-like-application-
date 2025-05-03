import { Router } from "express";
import { likePost,unlikePost,totalLikes } from "../controller/likes.controller.js";
import { isLoggedin } from "../middlewares/authMiddleware.js";

const router=Router();

router.get("/posts/:postId/likes",isLoggedin,totalLikes);
router.post("/posts/:postId/likes/likePost",isLoggedin,likePost);
router.post("/posts/:postId/likes/unlikePost",isLoggedin,unlikePost);

export default router;

