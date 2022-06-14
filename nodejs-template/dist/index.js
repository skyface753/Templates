"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./schemas/user"));
const blogs_1 = __importDefault(require("./schemas/blogs"));
const body_parser_1 = __importDefault(require("body-parser"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const saltRounds = 10;
// tslint:disable:no-console
// initialize configuration
dotenv_1.default.config();
// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.SERVER_PORT;
const app = (0, express_1.default)();
const uri = "mongodb://" + process.env.MONGODB_HOST + ":27017/skyfacedb";
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
mongoose_1.default.connect(uri);
const connection = mongoose_1.default.connection;
connection.once("open", () => {
    // tslint:disable-next-line:no-console
    console.log("MongoDB database connection established successfully");
});
// Configure Express to use EJS
app.set("views", path_1.default.join(__dirname, "views/pages"));
app.set("view engine", "ejs");
// define a route handler for the default home page
app.get("/", (req, res) => {
    // render the index template
    // res.render( "index" );
    user_1.default.find({}, (err, users) => {
        // tslint:disable-next-line:no-console
        if (err)
            return console.error(err);
        // res.render("index", { users });
        console.log(users);
    });
    blogs_1.default.find({}, (err, blogs) => {
        if (err)
            return console.error(err);
        console.log(blogs);
    }).populate("posted_by");
    const mascots = [
        { name: "Sammy", organization: "DigitalOcean", birth_year: 2012 },
        { name: "Tux", organization: "Linux", birth_year: 1996 },
        { name: "Moby Dock", organization: "Docker", birth_year: 2013 },
    ];
    const tagline = "No programming concept is complete without a cute animal mascot.";
    res.render("index", {
        mascots,
        tagline,
    });
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    user_1.default.findOne({ username }, (userError, user) => {
        if (userError)
            return console.error(userError);
        if (user) {
            bcrypt_1.default.compare(password, user.password, (bcryptError, result) => {
                if (bcryptError)
                    return console.error(bcryptError);
                if (result) {
                    const token = jsonwebtoken_1.default.sign({ username }, process.env.JWT_SECRET);
                    res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: "strict" });
                    res.redirect("/");
                }
                else {
                    console.log("Password incorrect");
                    res.redirect("/login");
                }
            });
        }
        else {
            console.log("User not found");
            res.redirect("/login");
        }
    });
});
app.get("/register", (req, res) => {
    res.render("register");
});
app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        res.redirect("/register");
    }
    const userExists = user_1.default.findOne({ username }, (errEx, userEx) => {
        if (errEx)
            return console.error(errEx);
        if (userEx) {
            console.log("User already exists");
            res.redirect("/register");
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
                res.redirect("/");
            });
        }
    });
});
app.get("/checkLogin", (req, res) => {
    const token = req.cookies.jwt;
    if (token) {
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.send("Not logged in");
            }
            else {
                res.send("Logged in as " + decoded.username);
            }
        });
    }
    else {
        res.send("No token");
    }
});
app.use(express_1.default.static(path_1.default.join(__dirname, "scripts")));
// start the express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map