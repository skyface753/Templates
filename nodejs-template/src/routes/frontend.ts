import express from "express";
import { UserService } from "../services/user_service";
import { Middleware } from "..//middleware";
const userService = new UserService();
const middleware = new Middleware();
const router = express.Router();

router.get("/login", (req, res) => {
    res.render("login");
});
router.get("/register", (req, res) => {
    res.render("register");
});
router.get("/logout", userService.logout);
router.get("/checkLogin", userService.checkLogin);

router.use(async (req, res, next) => {
    await middleware.adminRoute(req, res, next);
})
router.get("/admin", (req, res) => {
    res.send("Admin page");
})

export default router;