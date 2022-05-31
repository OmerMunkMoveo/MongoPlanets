const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();

app.use(session({ secret: "ssshhhhh", saveUninitialized: true, resave: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let sess; // global session, NOT recommended, only for the demonstration

router.get("/", (req, res) => {
  sess = req.session;
  if (sess.email) {
    return res.redirect("/admin");
  }
  res.send("OK");
});

router.post("/login", (req, res) => {
  sess = req.session;
  sess.email = req.body.email;
  res.end("done");
});

router.get("/admin", (req, res) => {
  sess = req.session;
  if (sess.email) {
    res.writeHead(200, { "Content-type": "text/html" });
    res.write(`<h1> Hello ${sess.email}</h1><br/>`);
    res.end("<a href='http://localhost:3000/logout'>Logout</a>");
  } else {
    res.writeHead(200, { "Content-type": "text/html" });
    res.write("Please Login First");
    res.end(
      '<br/><form action="http://localhost:3000/login" method=post><button type = submit id="email" name="email" value="omer@omer.com" >Login</button></form>'
    );
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect("/");
  });
});

// router.get("/home", (req, res) => {
//   res.send("Home Router");
// });
// router.get("/profile", (req, res) => {
//   res.send("Profile Router");
// });
// router.get("/login", (req, res) => {
//   res.send("Login Router");
// });
// router.get("/logout", (req, res) => {
//   res.send("Logout Router");
// });

app.use("/", router);

app.listen(process.env.port || 3000);
console.log("Web Server is listening at port" + (process.env.port || 3000));
