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
      content = Date.parse(content);
      if (isNaN(content)) {
        massage_error += "Validation error - date is invalid\n";
      } else if (content < Date.now()) {
        massage_error += "Validation error - date is earlier then now\n";
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

module.exports = { validator };
