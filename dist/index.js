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
// tslint:disable:no-console
// initialize configuration
dotenv_1.default.config();
// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.SERVER_PORT;
const app = (0, express_1.default)();
const uri = "mongodb://" + process.env.MONGODB_HOST + ":27017/skyfacedb";
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
app.use(express_1.default.static(path_1.default.join(__dirname, "scripts")));
// start the express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map