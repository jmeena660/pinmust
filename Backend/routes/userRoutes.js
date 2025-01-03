import express from "express";
import {
    followAndUnfolloUser,
    logOutUser,
    loginUser,
    myProfile,
    registerUser,
    userProfile,
} from "../controllers/userController.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout",isAuth,logOutUser)
router.get("/me", isAuth, myProfile);
router.get("/:id",isAuth,userProfile)
router.post("/follow/:id",isAuth,followAndUnfolloUser)

export default router;
