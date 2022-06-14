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
const user_1 = __importDefault(require("../schemas/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserService {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
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
            return res.status(200).json({ success: true, message: "Login successful", user });
        });
    }
}
exports.UserService = UserService;
// const UserService = {
//     login: async (req: { body: { username: any; password: any; }; }, res: { cookie: (arg0: string, arg1: string, arg2: { httpOnly: boolean; maxAge: number; sameSite: string; }) => void; json: (arg0: { success: boolean; message: string; user?: any; }) => void; }) => {
//         const username = req.body.username;
//         const password = req.body.password;
//         User.findOne({ username }, (userError: any, user: any) => {
//             if (userError) return console.error(userError);
//             if (user) {
//                 bcrypt.compare(password, user.password, (bcryptError: any, result: any) => {
//                     if (bcryptError) return console.error(bcryptError);
//                     if (result) {
//                         const token = jwt.sign({ username }, process.env.JWT_SECRET);
//                         res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: "strict" });
//                         res.json({
//                             success: true,
//                             message: "Login successful",
//                             user,
//                         });
//                     } else {
//                         console.log("Password incorrect");
//                         res.json({
//                             success: false,
//                             message: "Password incorrect",
//                         });
//                     }
//                 }
//                 )
//             } else {
//                 console.log("User not found");
//                 res.json({
//                     success: false,
//                     message: "User not found",
//                 });
//             }
//         })
//     }
//     ,
// }
// export default UserService;
//# sourceMappingURL=user_service.js.map