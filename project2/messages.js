const uuid = require("uuid").v4;

const id1 = uuid();
const id2 = uuid();

const messages = {
  [id1]: {
    id: id1,
    sender: "Tom",
    content:
      "You know, Jerry, chasing you around is like a full-time job for me.",
  },
  [id2]: {
    id: id2,
    sender: "Jerry",
    content:
      "Well, I hope it's not too tiring, because I've got plenty more tricks up my sleeve!",
  },
};

function getMessages() {
  return messages;
}

function addMessage({ sender, content }) {
  const id = uuid();
  messages[id] = {
    id,
    sender,
    content,
  };
  return id;
}

module.exports = {
  getMessages,
  addMessage,
};
