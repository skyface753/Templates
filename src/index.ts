import dotenv from "dotenv";
import express from "express";
import path from "path";
import mongoose from "mongoose";
import User from "./schemas/user";
import Blogs from "./schemas/blogs";
// tslint:disable:no-console
// initialize configuration
dotenv.config();

// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.SERVER_PORT;

const app = express();
const uri = "mongodb://" + process.env.MONGODB_HOST + ":27017/skyfacedb";

mongoose.connect(uri);

const connection = mongoose.connection;

connection.once("open",  () => {
  // tslint:disable-next-line:no-console
  console.log("MongoDB database connection established successfully");
});
// Configure Express to use EJS
app.set( "views", path.join( __dirname, "views/pages" ) );
app.set( "view engine", "ejs" );

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    // render the index template
    // res.render( "index" );
    User.find({}, (err: any, users: any) => {
       // tslint:disable-next-line:no-console
      if (err) return console.error(err);
      // res.render("index", { users });
      console.log(users);
    })
    Blogs.find({}, (err: any, blogs: any) => {
      if (err) return console.error(err);
      console.log(blogs);
    }).populate("posted_by");
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
} );

app.use(express.static(path.join(__dirname, "scripts")));

// start the express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );