import dotenv from "dotenv";
import express from "express";
import path from "path";
import mongoose from "mongoose";
import User from "./schemas/user";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
const saltRounds = 10;
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
  // render the index template
  // res.render( "index" );
  User.find({}, (err: any, users: any) => {
    // tslint:disable-next-line:no-console
    if (err) return console.error(err);
    // res.render("index", { users });
    console.log(users);
  })
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

app.get("/login", (req, res) => {
  res.render("login");
})

app.post("/login", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username }, (userError: any, user: any) => {
    if (userError) return console.error(userError);
    if (user) {
      bcrypt.compare(password, user.password, (bcryptError: any, result: any) => {
        if (bcryptError) return console.error(bcryptError);
        if (result) {
          const token = jwt.sign({ username }, process.env.JWT_SECRET);
          res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: "strict" });
          res.json({
            success: true,
            message: "Login successful",
            user,
          });
        } else {
          console.log("Password incorrect");
          res.json({
            success: false,
            message: "Password incorrect",
          });
        }
      }
      )
    } else {
      console.log("User not found");
      res.json({
        success: false,
        message: "User not found",
      });
    }
  })
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
  const userExists = User.findOne({ username }, (errEx: any, userEx: any) => {
    if (errEx) return console.error(errEx);
    if (userEx) {
      console.log("User already exists");
      res.redirect("/register");
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
        res.redirect("/");
      }
      );
    }
  })
});

app.get("/checkLogin", (req, res) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        res.send("Not logged in");
      } else {
        res.send("Logged in as " + decoded.username);
      }
    }
    )
  } else {
    res.send("No token");
  }
})

app.get("/logout", (req, res) => {
  logoutUser(res);
})
app.post("/logout", (req, res) => {
  logoutUser(res);
})
function logoutUser(res: Response<any, Record<string, any>, number>) {
  res.clearCookie("jwt");
  res.json({
    success: true,
    message: "Logout successful",
  });
}


app.use(express.static(path.join(__dirname, "scripts")));

// start the express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});