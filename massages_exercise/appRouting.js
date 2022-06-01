const express = require("express");

const msgValidator = require("./msgValidator");
const msgController = require("./msgController");

const router = express.Router();

module.exports = { router };

router.get("/", (req, res) => {
  res.writeHead(200, { "Content-type": "text/html" });
  res.end("<h1>Welcome to the chat app</h1>");
});

router.post("/chatroom/new_msg", (req, res) => {
  let errors = "";
  let msg_name_validation, msg_date_validation, msg_content_validation;

  if (!req.body) {
    res.writeHead(422);
    return res.end("Validation error - there is not body to the request");
  }
  if (!req.body.msg_name) {
    errors += "Validation error - 'msg_name' is required\n";
  } else {
    msg_name_validation = msgValidator.validator(
      "msg_name",
      req.body.msg_name,
      "string",
      3,
      10
    );
  }
  if (!req.body.msg_date) {
    errors += "Validation error - 'msg_date' is required\n";
  } else {
    msg_date_validation = msgValidator.validator(
      "msg_date",
      req.body.msg_date,
      "date"
    );
  }
  if (!req.body.msg_content) {
    errors += "Validation error - 'msg_content' is required\n";
  } else {
    msg_content_validation = msgValidator.validator(
      "msg_content",
      req.body.msg_content,
      "string",
      15
    );
  }

  let msg_name;
  let msg_date;
  let msg_content;

  if (msg_name_validation) {
    if (msg_name_validation["massage_error"] === "") {
      msg_name = msg_name_validation["content"];
    } else {
      errors += msg_name_validation["massage_error"];
    }
  }

  if (msg_date_validation) {
    if (msg_date_validation["massage_error"] === "") {
      msg_date = msg_date_validation["content"];
    } else {
      errors += msg_date_validation["massage_error"];
    }
  }
  if (msg_content_validation) {
    if (msg_content_validation["massage_error"] === "") {
      msg_content = msg_content_validation["content"];
    } else {
      errors += msg_content_validation["massage_error"];
    }
  }
  if (errors === "") {
    const msg = {
      msg_name: msg_name,
      msg_date: msg_date,
      msg_content: msg_content,
    };
    msgController.addMassage(msg);
    res.writeHead(200, { "Content-type": "text/plain" });
    res.end("massage added successfully!");
  } else {
    res.writeHead(422, { "Content-type": "text/plain" });
    res.end(errors);
  }
});

router.get("/chatroom", (req, res) => {
  res.writeHead(200, { "Content-type": "text/plain" });
  res.end(String(msgController.getMassages()));
});
