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
exports.UserService = void 0;
// tslint:disable:no-console
const user_1 = __importDefault(require("../schemas/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = require("redis");
const saltRounds = 10;
const client = (0, redis_1.createClient)();
// tslint:disable-next-line:no-console
client.on('error', (err) => console.log('Redis Client Error', err));
function initRedis() {
    return __awaiter(this, void 0, void 0, function* () {
        // tslint:disable-next-line:no-console
        console.log("initRedis");
        yield client.connect();
        yield client.set('key', 'value');
        const value = yield client.get('key');
        // tslint:disable-next-line:no-console
        console.log(value);
    });
}
initRedis();
class UserService {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            // tslint:disable-next-line:no-console
            console.log(username, password);
            const user = yield user_1.default.findOne({ username });
            if (!user) {
                return res.status(401).json({ success: false, message: "User not found" });
            }
            const isValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isValid) {
                return res.status(401).json({ success: false, message: "Invalid password" });
            }
            const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET);
            res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: "strict" });
            client.set(token, user.username);
            return res.status(200).json({ success: true, message: "Login successful", user });
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const username = req.body.username;
            const password = req.body.password;
            if (!username || !password) {
                return res.status(400).json({ success: false, message: "Username and password are required" });
            }
            user_1.default.findOne({ username }, (errEx, userEx) => {
                if (errEx)
                    return console.error(errEx);
                if (userEx) {
                    console.log("User already exists");
                    return res.status(400).json({ success: false, message: "User already exists" });
                }
                else {
                    const hashedPassword = bcrypt_1.default.hashSync(password, saltRounds);
                    console.log(hashedPassword);
                    const user = new user_1.default({
                        username,
                        password: hashedPassword,
                    });
                    user.save((err) => {
                        if (err)
                            return console.error(err);
                        const token = jsonwebtoken_1.default.sign({ username }, process.env.JWT_SECRET);
                        res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: "strict" });
                        client.set(token, username);
                        return res.status(200).json({ success: true, message: "User created", user });
                    });
                }
            });
        });
    }
    logout(req, res) {
        res.clearCookie("jwt");
        res.json({
            success: true,
            message: "Logout successful",
        });
    }
    checkLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.cookies.jwt;
            if (token) {
                const verified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                if (verified) {
                    const username = yield client.get(token);
                    if (username) {
                        return res.status(200).json({ success: true, message: "Logged in as " + username });
                    }
                    else {
                        return res.status(401).json({ success: false, message: "Not in Redis" });
                    }
                }
                else {
                    return res.status(401).json({ success: false, message: "Invalid token" });
                }
            }
            else {
                res.send("No token");
            }
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user_service.js.map