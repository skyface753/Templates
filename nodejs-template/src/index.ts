import dotenv from "dotenv";
import express from "express";
import path from "path";
import mongoose from "mongoose";
import User from "./schemas/user";
import bodyParser from "body-parser";

import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";

// tslint:disable:no-console
// initialize configuration
dotenv.config();

// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.SERVER_PORT;

const app = express();
const uri = "mongodb://" + process.env.MONGODB_HOST + ":27017/skyfacedb";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true
}));

mongoose.connect(uri);

const connection = mongoose.connection;

connection.once("open", () => {
  // tslint:disable-next-line:no-console
  console.log("MongoDB database connection established successfully");
});
// Configure Express to use EJS
app.set("views", path.join(__dirname, "views/pages"));
app.set("view engine", "ejs");

// define a route handler for the default home page
app.get("/", (req, res) => {
  const mascots = [
    { name: "Sammy", organization: "DigitalOcean", birth_year: 2012 },
    { name: "Tux", organization: "Linux", birth_year: 1996 },
    { name: "Moby Dock", organization: "Docker", birth_year: 2013 },
  ];
  const tagline: string =
    "No programming concept is complete without a cute animal mascot.";
  res.render("index", {
    mascots,
    tagline,
  });
});

app.use(express.static(path.join(__dirname, "scripts")));
import { Middleware } from "./middleware";
const middleware = new Middleware();
app.use(async (req: Request, res: Response, next: any) => {
  await middleware.getUser(req, res, next);
});
app.use(async (req: Request, res: Response, next: any) => {
  await middleware.userRoute(req, res, next);
});
import backend from "./routes/backend";
app.use("/api", backend);
import frontend from "./routes/frontend";
app.use("/", frontend);

// start the express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});