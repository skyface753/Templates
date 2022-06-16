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
exports.Middleware = void 0;
const redis_1 = require("redis");
const user_1 = __importDefault(require("../schemas/user"));
const client = (0, redis_1.createClient)();
// tslint:disable:no-console
// tslint:disable-next-line:no-console
client.on('error', (err) => console.log('Redis Client Error in Middleware', err));
function initRedis() {
    return __awaiter(this, void 0, void 0, function* () {
        // tslint:disable-next-line:no-console
        console.log("initRedis Middleware");
        yield client.connect();
    });
}
initRedis();
class Middleware {
    getUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.jwt;
                if (!token) {
                    console.log("No token");
                    req.user = null;
                    // next();
                    return;
                }
                const user = yield client.get(token);
                if (user) {
                    console.log("User found");
                    req.user = user;
                    // next();
                    return;
                }
                else {
                    console.log("User not found");
                    req.user = null;
                    // next();
                    return;
                }
            }
            catch (e) {
                req.user = null;
                // next();
                return;
            }
        });
    }
    userRoute(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.user) {
                console.log("User is logged in");
                next();
            }
            else {
                console.log("User is not logged in, cancled");
                return next("Not logged in");
            }
        });
    }
    adminRoute(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userInRequest = req.user;
                if (userInRequest) {
                    console.log("User is logged in");
                    const user = yield user_1.default.findOne({ username: userInRequest });
                    if (user.role === "admin") {
                        console.log("User is admin");
                        next();
                    }
                    else {
                        console.log("User is not admin, cancled");
                        return next("Not admin");
                    }
                }
                else {
                    console.log("User is not logged in, cancled");
                    return next("Not logged in");
                }
            }
            catch (e) {
                return next("Not logged in");
            }
        });
    }
}
exports.Middleware = Middleware;
//# sourceMappingURL=index.js.map