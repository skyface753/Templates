"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_service_1 = require("../../services/user_service");
const router = express_1.default.Router();
const userService = new user_service_1.UserService();
router.post("/login", userService.login);
//# sourceMappingURL=index.js.map