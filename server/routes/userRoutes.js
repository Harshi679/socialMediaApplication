import express from 'express';
import { discoverUsers, followUser, getUserData, unfollowUser } from '../controllers/userController.js';
import {protect} from '../middlewares/auth.js'
import { upload } from '../configs/multer.js';
import { updateUserData } from '../controllers/userController.js';
import { sendConnectionRequest } from '../controllers/userController.js';
import { acceptConnectionRequest } from '../controllers/userController.js';
import { getUserConnections } from '../controllers/userController.js';
const userRouter = express.Router();

userRouter.get('/data', protect,getUserData)
userRouter.post('/update',upload.fields([{name:'profile',maxcount:1},{name:'cover',maxcount:1}]), protect,updateUserData)
userRouter.post('/discover', protect,discoverUsers)
userRouter.post('/follow', protect,followUser)
userRouter.post('/unfolloww', protect,unfollowUser)
userRouter.post('/connect',protect,sendConnectionRequest)
userRouter.post('/accept',protect,acceptConnectionRequest)
userRouter.get('/connections',protect,getUserConnections)
export default userRouter;