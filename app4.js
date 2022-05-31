const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const app = express();
const path = require("path");

app.set("view engine", "ejs");

app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log("here");
    callback(null, "uploads");
  },
  filename: (req, file, callback) => {
    console.log(file);
    callback(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.post("/api/photo", upload.single("userPhoto"), (req, res) => {
  res.end("File is uploaded");
});

app.get("/", (req, res) => {
  // res.writeHead(200, { "Content-type": "text/html" });
  res.render("upload_page");
  // res.end(
  //   "<h1>Upload a photo</h1>" +
  //     "<form action='http://localhost:3000/api/photo' method='POST' enctype='multipart/form-data'>" +
  //     "<input type='file' name='userPhoto'/>" +
  //     "<input type='submit'>" +
  //     "Upload" +
  //     "</input>" +
  //     "</form>"
  // );
});

app.listen(3000, () => {
  console.log("Working on port 3000");
});
