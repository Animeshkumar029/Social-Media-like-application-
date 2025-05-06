import { Router } from "express";
import { startFollowing,unfollow, totalFollowers,totalFollowing,followersList,followingList } from "../controller/follow.controller.js";
import { isLoggedin } from "../middlewares/authMiddleware.js";

const router=Router();


router.post('/follow/:toFollowId',isLoggedin,startFollowing);
router.delete('/follow/:toFollowId',isLoggedin,unfollow);
router.get('/followers/count',isLoggedin,totalFollowers);
router.get('/following/count',isLoggedin,totalFollowing);
router.get('/followersList',isLoggedin,followersList);
router.get('/followingList',isLoggedin,followingList);

export default router;
