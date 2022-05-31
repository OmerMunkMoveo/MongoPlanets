const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");

let massages = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const unallowed_words = ["hello", "123", "Goodbye"];

const validator = (msg_section, content, type, min_len, max_len) => {
  let massage_error = "";
  if (msg_section === "msg_name" || msg_section === "msg_content") {
    if (type === "string") {
      content = String(content);
      if (!max_len) {
        if (content.length < min_len) {
          massage_error += `Validation error - length of ${msg_section} is invalid, must be at least ${min_len}\n`;
        }
      } else if (content.length > max_len || content.length < min_len) {
        massage_error += `Validation error - length of ${msg_section} is invalid, must be between ${min_len} and ${max_len}\n`;
      }
      if (msg_section === "msg_name") {
        if (content[0] === " " || content[content.length - 1] === " ") {
          massage_error +=
            "Validation error - msg_name needs to be without any leading or trailing spaces\n";
        }
      } else {
        if (unallowed_words.some((str) => content.includes(str))) {
          massage_error +=
            "Validation error - msg_content cant contain hello, 123, or Goodbye";
        }
      }
    } else {
      massage_error +=
        "Validation error - type is invalid, only string can be used\n";
    }
  } else if (msg_section === "msg_date") {
    if (type === "date") {
      try {
        content = Date.parse(content);
        if (content < Date.now()) {
          massage_error += "Validation error - date is earlier then now\n";
        }
      } catch (err) {
        massage_error += err.massage;
      }
    } else {
      massage_error +=
        "Validation error - type is invalid, only date can be used\n";
    }
  } else {
    massage_error += "Validation error - msg_section invalid\n";
  }
  return { content: content, massage_error: massage_error };
};

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
    msg_name_validation = validator(
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
    msg_date_validation = validator("msg_date", req.body.msg_date, "date");
  }
  if (!req.body.msg_content) {
    errors += "Validation error - 'msg_content' is required\n";
  } else {
    msg_content_validation = validator(
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
    massages.push(msg);
    res.writeHead(200, { "Content-type": "text/plain" });
    res.end("massage added successfully!");
    console.log(massages);
  } else {
    res.writeHead(422, { "Content-type": "text/plain" });
    res.end(errors);
  }
});

router.get("/chatroom", (req, res) => {});

app.use("/", router);
app.listen(process.env.port || 3000);
console.log("Web Server is listening at port" + (process.env.port || 3000));
