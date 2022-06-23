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
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = require("express-rate-limit");
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
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 1 * 60 * 1000,
    max: 20
});
// apply rate limiter to all requests
app.use(limiter);
// CORS
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true
}));
mongoose_1.default.connect(uri);
const connection = mongoose_1.default.connection;
connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
});
// Configure Express to use EJS
app.set("views", path_1.default.join(__dirname, "views/pages"));
app.set("view engine", "ejs");
// define a route handler for the default home page
app.get("/", (req, res) => {
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
const middleware_1 = require("./middleware");
const middleware = new middleware_1.Middleware();
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield middleware.getUser(req, res, next);
    next();
}));
const backend_1 = __importDefault(require("./routes/backend"));
app.use("/api", backend_1.default);
const frontend_1 = __importDefault(require("./routes/frontend"));
app.use("/", frontend_1.default);
// start the express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map