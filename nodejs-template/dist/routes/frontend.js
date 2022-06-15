"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_service_1 = require("../services/user_service");
const middleware_1 = require("..//middleware");
const userService = new user_service_1.UserService();
const middleware = new middleware_1.Middleware();
const router = express_1.default.Router();
router.get("/login", (req, res) => {
    res.render("login");
});
router.get("/register", (req, res) => {
    res.render("register");
});
router.get("/logout", userService.logout);
router.get("/checkLogin", userService.checkLogin);
router.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield middleware.adminRoute(req, res, next);
}));
router.get("/admin", (req, res) => {
    res.send("Admin page");
});
exports.default = router;
//# sourceMappingURL=frontend.js.map