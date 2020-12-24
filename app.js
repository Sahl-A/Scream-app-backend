require("dotenv").config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

const screamsRoutes = require("./routes/screams");
const authRoutes = require("./routes/user");

/* const onDBCommentChange = require("./middlewares/dbChangeStreams/commentChange");
const onDBLikeChange = require("./middlewares/dbChangeStreams/likeChange"); */

const app = express();
const port = process.env.PORT || 8080;
const dbPass = process.env.DB_PASS;

///////////////// Disk Storage /////////////////
/* const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const currData = new Date().toISOString().split(":").join("-");
    cb(null, currData + "-" + file.originalname.replace(/ /g, "-"));
  },
}); */

// Filter uploaded files based on its type
/* const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}; */

///// Parse the body //////
////////////////////////////
// When we get data from <form>. It uses x-www-form-urlencoded format
// app.use(bodyParser.urlencoded())  // x-www-form-urlencoded  <form>
// When we get data as json. It uses application/json format
app.use(bodyParser.json()); // application/json

// Serve images statically
app.use("/images", express.static(path.join(__dirname, "images")));

// Use multer to upload files
app.use(
  // To save images to the server
  // multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
  // To save images in memory, so we can upload it to any external api
  multer().single("image")
);

// By default, all the clients are restricted to access the server/REST api endpoints
// This is because of CORS, we solve this by allowing using headers in the response
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // We could specify certain websites, however, * for all
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Change Streams for the db
////////////////////////////
/* app.use(onDBCommentChange);
app.use(onDBLikeChange); */

///// Routes /////
//////////////////
app.use("/api", screamsRoutes);
app.use("/api", authRoutes);

// Error
app.use((error, req, res, next) => {
  console.error(error);
  const status = error.statusCode || 500;
  res.status(status).json({
    message: error.message,
  });
});

///// Add Mongoose /////
////////////////////////
mongoose
  // mongodb://localhost:27017/screams-app
  .connect(
    `mongodb+srv://SocialNetwork-classed:${dbPass}@cluster0.jrht3.mongodb.net/screams-app?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      poolSize: 100,
    }
  )
  .then((res) => {
    app.listen(port);
  })
  .catch((err) => console.error(err));
