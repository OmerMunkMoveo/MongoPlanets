const express = require("express");
const app = express();
const appRouting = require("./appRouting");
const bodyParser = require("body-parser");

module.exports = { express, app };

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", appRouting.router);
app.listen(process.env.port || 3000);
console.log("Web Server is listening at port" + (process.env.port || 3000));
