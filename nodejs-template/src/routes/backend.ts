import { UserService } from "../services/user_service";
import express from "express";
const router = express.Router();

 const userService = new UserService();
router.post("/login", userService.login);
router.post("/register", userService.register);
router.post("/logout", userService.logout);
router.post("/checkLogin", userService.checkLogin);
export default router;