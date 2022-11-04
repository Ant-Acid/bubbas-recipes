const express = require("express"); // https://expressjs.com/
const app = express(); // Create Express app
const mongoose = require("mongoose"); // https://mongoosejs.com/docs/api.html
const passport = require("passport"); // Passport is authentication middleware for Node.js
const session = require("express-session"); // https://www.npmjs.com/package/express-session
const MongoStore = require("connect-mongo")(session); // https://www.npmjs.com/package/connect-mongo
const methodOverride = require("method-override"); // https://www.npmjs.com/package/method-override
const flash = require("express-flash"); // https://www.npmjs.com/package/express-flash
const logger = require("morgan"); // https://www.npmjs.com/package/morgan
const connectDB = require("./config/database"); // Connect to database
const mainRoutes = require("./routes/main"); // Import main routes
const postRoutes = require("./routes/posts"); // Import posts routes
const commentRoutes = require("./routes/comments"); // Import comments routes
const userRoutes = require("./routes/users"); // Import users routes

//Use .env file in config folder for environment variables
require('dotenv').config({ path: './config/.env' });

// Passport config
require("./config/passport")(passport);

//Connect To Database
connectDB();

//Setting EJS for views
app.set("view engine", "ejs");

//Using /public as the Static Folder
app.use(express.static("public"));

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));

//Use forms for put / delete too
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);
app.use("/users", userRoutes);

//Server Running
app.listen(process.env.PORT || 2121, () => {
  console.log("Server is running, you better catch it!");
});
