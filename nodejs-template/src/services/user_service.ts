import User, { IUser } from "../schemas/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Document, Types } from "mongoose";

export class UserService {
    async login(req: any, res: any) {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: "strict" });
        return res.status(200).json({ success: true, message: "Login successful", user });
    }
}


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