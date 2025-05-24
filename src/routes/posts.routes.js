import { Router } from "express";
import { isLoggedin } from "../middlewares/authMiddleware.js";
import { localFileUpload } from "../middlewares/multer.middleware.js";
import { makePost,deletePost,updatePost,addNewFiles,getAllPosts } from "../controller/post.controller.js";

const router=Router();

router.post("/makepost",isLoggedin,localFileUpload.array('files',10),makePost);
router.delete('/deletepost/:postId',isLoggedin,deletePost);
router.patch('/updatepost/:postId',isLoggedin,localFileUpload.array('files',10),updatePost);
router.patch('/addnewfiles/:postId',isLoggedin,localFileUpload.array('files',10),addNewFiles);
router.get('/getall',isLoggedin,getAllPosts);

export default router;