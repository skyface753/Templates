import { UserService } from "../services/user_service";
import express from "express";
const router = express.Router();

 const userService = new UserService();
router.post("/login", userService.login);



// router.post("/login", (req, res) => {
//     res.send("Login");
// });

// router.get("/register", (req, res) => {
//     res.send("Register");
// });

export default router;