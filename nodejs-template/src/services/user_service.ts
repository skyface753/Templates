// tslint:disable:no-console
import User, { IUser } from "../schemas/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createClient } from "redis";

const saltRounds = 10;



const client = createClient();
// tslint:disable-next-line:no-console
client.on('error', (err) => console.log('Redis Client Error', err));
async function initRedis() {
    // tslint:disable-next-line:no-console
    console.log("initRedis");
    await client.connect();
    await client.set('key', 'value');
    const value = await client.get('key');
    // tslint:disable-next-line:no-console
    console.log(value);
}

initRedis();


const failures = {} as any;

function onLoginFail(remoteIp: string) {
    const f = failures[remoteIp] = failures[remoteIp] || { count: 0, nextTry: new Date() };
    ++f.count;
    f.nextTry.setTime(Date.now() + 2000 * f.count); // Wait another two seconds for every failed attempt
}

function onLoginSuccess(
    remoteIp: string,
) { delete failures[remoteIp]; }

const MINS10 = 600000
const MINS30 = 3 * MINS10;
setInterval(() => {
    for (const ip in failures) {
        if (Date.now() - failures[ip].nextTry > MINS10) {
            delete failures[ip];
        }
    }
}, MINS30);

export class UserService {
    async login(req: any, res: any) {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Please provide username and password" });
        }
        const f = failures[req.ip];
        if (f && Date.now() < f.nextTry) {
            return res.status(400).json({ success: false, message: "Too many failed login attempts. Please try again in " + (f.nextTry - Date.now()) / 1000 + " seconds" });

        }

        // tslint:disable-next-line:no-console
        console.log(username, password);
        const user = await User.findOne({ username });
        if (!user) {
            onLoginFail(req.ip);
            return res.status(401).json({ success: false, message: "User not found" });
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            onLoginFail(req.ip);
            return res.status(401).json({ success: false, message: "Invalid password" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: "strict" });
        client.set(token, user.username);
        onLoginSuccess(req.ip);
        return res.status(200).json({ success: true, message: "Login successful", user });
    }
    async register(req: any, res: any) {
        const username = req.body.username;
        const password = req.body.password;
        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Username and password are required" });
        }
        User.findOne({ username }, (errEx: any, userEx: any) => {
            if (errEx) return console.error(errEx);
            if (userEx) {
                console.log("User already exists");
                return res.status(400).json({ success: false, message: "User already exists" });
            } else {

                const hashedPassword = bcrypt.hashSync(password, saltRounds);
                console.log(hashedPassword);
                const user = new User({
                    username,
                    password: hashedPassword,
                });
                user.save((err: any) => {
                    if (err) return console.error(err);
                    const token = jwt.sign({ username }, process.env.JWT_SECRET);
                    res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: "strict" });
                    client.set(token, username);
                    return res.status(200).json({ success: true, message: "User created", user });
                }
                );
            }
        })
    }
    logout(req: any, res: any) {
        res.clearCookie("jwt");
        res.json({
            success: true,
            message: "Logout successful",
        });
    }
    async checkLogin(req: any, res: any) {
        const token = req.cookies.jwt;
        if (token) {
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            if (verified) {
                const username = await client.get(token);
                if (username) {
                    return res.status(200).json({ success: true, message: "Logged in as " + username });
                } else {
                    return res.status(401).json({ success: false, message: "Not in Redis" });
                }
            } else {
                return res.status(401).json({ success: false, message: "Invalid token" });
            }

        } else {
            res.send("No token");
        }
    }
}
