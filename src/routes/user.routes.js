import {Router} from 'express';

const router = Router();

router.route("/register").post(regiterUser) 
// router.route("/login").post(loginUser)


export default router;