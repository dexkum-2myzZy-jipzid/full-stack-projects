const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3000;

const sessions = require("./sessions");
const users = require("./users");
const tweets = require("./tweets");

app.use(cookieParser());
app.use(express.static("./dist"));
app.use(express.json());

//#region sessions
// sessions
app.get("/api/v1/session", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  if (!sid || !username) {
    res.status(401).json({ error: "auth-missing" });
    return;
  }

  const user = users.getUserData(username);
  if (!user) {
    res.status(404).json({ error: "user-not-exist" });
    return;
  }

  res.json({ user });
});

app.post("/api/v1/session", (req, res) => {
  const { username } = req.body;

  if (!users.isValid(username)) {
    res.status(400).json({ error: "required-username" });
    return;
  }

  if (username === "dog") {
    res.status(401).json({ error: "auth-insufficient" });
    return;
  }

  const sid = sessions.addSession(username);
  res.cookie("sid", sid);

  let user = users.getUserData(username);
  if (user == null) {
    // create user basic info and store in users
    user = users.createUserInfo(username);
  }

  res.json({ user });
});

app.delete("/api/v1/session", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";

  if (sid) {
    res.clearCookie("sid");
  }

  if (username) {
    sessions.deleteSession(username);
  }

  res.json({ wasLoggedIn: !!username });
});
//#endregion

//#region tweets
// tweets
app.get("/api/v1/tweets", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  if (!sid || !username) {
    res.status(401).json({ error: "auth-missing" });
    return;
  }

  //get tweets feed
  const list = tweets.getTweets();

  res.json({ tweets: list });
});

app.post("/api/v1/tweets", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  if (!sid || !username) {
    res.status(401).json({ error: "auth-missing" });
    return;
  }

  const { tweet } = req.body;
  if (!tweet) {
    res.status(400).json({ error: "required-content" });
    return;
  }

  const user = users.getUserData(username);
  const tweetId = tweets.addTweet(tweet, user);
  users.addPost(username, tweetId);
  const list = tweets.getTweets();

  res.json({ tweets: list });
});
//#endregion

//#region user interation
//  like tweet
app.post("/api/v1/tweets/:id/likes", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  if (!sid || !username) {
    res.status(401).json({ error: "auth-missing" });
    return;
  }

  const { id } = req.params;

  const foundTweet = tweets.findTweet(id);

  if (!foundTweet) {
    res
      .status(404)
      .json({ error: "tweet-not-found", message: `No todo with id ${id}` });
    return;
  }

  // if user has like this, then recall like
  // if not, add like to user and tweet list
  if (users.hasLiked(username, id)) {
    users.removeLike(username, id);
    tweets.recallLikeTweet(id);
  } else {
    users.addLike(username, id);
    tweets.likeTweet(id);
  }

  const user = users.getUserData(username);

  res.json({ user, tweets: tweets.getTweets() });
});

// repost tweet
app.post("/api/v1/tweets/:id/reposts", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  if (!sid || !username) {
    res.status(401).json({ error: "auth-missing" });
    return;
  }

  const { id } = req.params;
  const foundTweet = tweets.findTweet(id);

  if (!foundTweet) {
    res
      .status(404)
      .json({ error: "tweet-not-found", message: `No tweet with id ${id}` });
    return;
  }

  // If the user has already reposted the tweet, then undo the repost.
  // If the user hasn't reposted the tweet, then repost it.
  if (users.hasRepostedTweet(username, id)) {
    const repostedTweetId = users.removeRepost(username, id);
    tweets.recallRepostedTweet(repostedTweetId);
  } else {
    const repostedTweetId = tweets.repostTweet(id, username);
    users.addRepost(username, id, repostedTweetId);
  }

  const user = users.getUserData(username);

  res.json({ user, tweets: tweets.getTweets() });
});

// comment on tweet
app.post("/api/v1/tweets/:id/comments", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  if (!sid || !username) {
    res.status(401).json({ error: "auth-missing" });
    return;
  }

  const { id } = req.params;
  const foundTweet = tweets.findTweet(id);

  if (!foundTweet) {
    res
      .status(404)
      .json({ error: "tweet-not-found", message: `No tweet with id ${id}` });
    return;
  }

  const { content } = req.body;

  if (content && content.trim() !== "") {
    const commentId = tweets.addComment(id, username, content);
    users.addComment(username, id, commentId);
  }

  const user = users.getUserData(username);

  res.json({ user, tweets: tweets.getTweets() });
});

//#endregion

//#region post & comments & likes & repost

// get tweet's comments
app.get("/api/v1/tweets/:id/comments", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  if (!sid || !username) {
    res.status(401).json({ error: "auth-missing" });
    return;
  }

  const { id } = req.params;
  const foundTweet = tweets.findTweet(id);

  if (!foundTweet) {
    res
      .status(404)
      .json({ error: "tweet-not-found", message: `No tweet with id ${id}` });
    return;
  }

  const comments = tweets.getComments(foundTweet);

  res.json({ comments });
});

// get user's post
app.get("/api/v1/posts", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  if (!sid || !username) {
    res.status(401).json({ error: "auth-missing" });
    return;
  }

  const postsIds = users.getPosts(username);
  const posts = tweets.getTweetsByIds(postsIds);

  res.json(posts);
});

// get user's likes
app.get("/api/v1/likes", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  if (!sid || !username) {
    res.status(401).json({ error: "auth-missing" });
    return;
  }

  const likesIds = users.getLikes(username);
  const likes = tweets.getTweetsByIds(likesIds);

  res.json(likes);
});

// get user' comment
app.get("/api/v1/comments", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  if (!sid || !username) {
    res.status(401).json({ error: "auth-missing" });
    return;
  }

  const commentsIds = users.getComments(username);
  const comments = tweets.getTweetsByIds(commentsIds);

  res.json(comments);
});

//#endregion

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
