const uuid = require("uuid").v4;

const sid1 = uuid();
const sid2 = uuid();

let users = [
  { username: "Tom", sids: [sid1] },
  { username: "Jerry", sids: [sid2] },
];

function isValid(username) {
  let isValid = true;
  isValid = !!username && username.trim();
  isValid = isValid && username.match(/^[A-Za-z0-9_]+$/);
  return isValid;
}

function addUser(username, sid) {
  let user = users.find((user) => user.username === username);

  if (user) {
    user.sids.push(sid);
  } else {
    users.push({ username, sids: [sid] });
  }
}

function removeUser(sid) {
  const user = users.find((user) => user.sids.includes(sid));

  if (user) {
    user.sids = user.sids.filter((userSid) => userSid !== sid);

    if (user.sids.length === 0) {
      users = users.filter((u) => u !== user);
    }
  }
}

function getAllUsers() {
  return users.map((user) => user.username);
}

module.exports = {
  isValid,
  addUser,
  removeUser,
  getAllUsers,
};
