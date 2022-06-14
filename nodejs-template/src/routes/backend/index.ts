import Express from "express";
import { UserService } from "../../services/user_service";
const router = Express.Router();


const userService = new UserService();
router.post("/login", userService.login);