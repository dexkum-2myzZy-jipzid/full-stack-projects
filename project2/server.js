const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;

const sessions = require("./sessions");
const users = require("./users");
const messages = require("./messages");

app.use(cookieParser());
app.use(express.static("./public"));
app.use(express.json());

// Sessions
app.get("/api/v1/session", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: "auth-missing" });
    return;
  }
  res.json({ username });
});

app.post("/api/v1/session", (req, res) => {
  const { username } = req.body;

  if (!users.isValid(username)) {
    res.status(400).json({ error: "required-username" });
    return;
  }

  if (username === "dog") {
    res.status(403).json({ error: "auth-insufficient" });
    return;
  }

  const sid = sessions.addSession(username);
  users.addUser(username, sid);

  res.cookie("sid", sid);
  res.json({
    users: users.getAllUsers(),
    messages: messages.getMessages(),
  });
});

app.delete("/api/v1/session", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  if (sid) {
    res.clearCookie("sid");
  }
  if (username) {
    sessions.deleteSession(sid);
    users.removeUser(sid);
  }
  res.json({ username });
});

// messages
app.get("/api/v1/messages", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: "auth-missing" });
    return;
  }
  res.json(messages.getMessages());
});

app.post("/api/v1/messages", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: "auth-missing" });
    return;
  }
  const { content } = req.body;
  if (!content) {
    res.status(400).json({ error: "required-message" });
    return;
  }
  const id = messages.addMessage({ sender: username, content });
  res.json(messages.getMessages(id));
});

//user
app.get("/api/v1/users", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: "auth-missing" });
    return;
  }

  res.json(users.getAllUsers());
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
