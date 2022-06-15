import {createClient} from "redis";
import User, {IUser} from "../schemas/user";
const client = createClient();
// tslint:disable:no-console
// tslint:disable-next-line:no-console
client.on('error', (err) => console.log('Redis Client Error in Middleware', err));
async function initRedis() {
    // tslint:disable-next-line:no-console
    console.log("initRedis Middleware");
    await client.connect();
}

initRedis();

export class Middleware{
    async getUser(req: any, res: any, next: any){
        try{

            const token = req.cookies.jwt;
            if (!token) {
                console.log("No token");
                req.user = null;
                next();
            }
            const user = await client.get(token);
            if (user) {
                console.log("User found");
                req.user = user;
                next();
            }else{
                console.log("User not found");
                req.user = null;
                next();
            }
        }catch(e){
            req.user = null;
            next();
        }
    }
    async userRoute(req: any, res: any, next: any){
        if (req.user) {
            console.log("User is logged in");
            next();
        }else{
            console.log("User is not logged in, cancled");
            res.status(401).json({ success: false, message: "Unauthorized" }).end();
            return;
        }
    }
    async adminRoute(req: any, res: any, next: any){
        try{
        const userInRequest = req.user;

        if (userInRequest) {
            console.log("User is logged in");
            const user = await User.findOne({ username: userInRequest });
            if (user.role === "admin") {
                console.log("User is admin");
                next();
            }
            else {
                console.log("User is not admin, cancled");
                res.status(401).json({ success: false, message: "Unauthorized" }).end();
                return;
            }
        }else{
            console.log("User is not logged in, cancled");
            res.status(401).json({ success: false, message: "Unauthorized" }).end();
            return;
        }
        }catch(e){
            res.status(401).json({ success: false, message: "Unauthorized" }).end();
            return;
        }
    }

}