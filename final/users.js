const uuid = require("uuid").v4;

// {
//   id,
//   username,
//   createdAt,
//   post:[]
//   likes:[]
//   repost:[]
//   comments: [],
// };
const users = {};

function isValid(username) {
  let isValid = true;
  isValid = !!username && username.trim();
  isValid = isValid && username.match(/^[A-Za-z0-9_]+$/);
  return isValid;
}

function getUserData(username) {
  return users[username];
}

function addUserData(username, userData) {
  users[username] = userData;
}

function createUserInfo(username) {
  const id = uuid();
  const createdAt = new Date().toISOString();

  const user = {
    id,
    username,
    createdAt,
    post: [],
    likes: [],
    reposted: [],
    comments: [],
  };

  users[username] = user;
  return user;
}

function addPost(username, tweetId) {
  const user = getUserData(username);
  if (!user.posts) {
    user.posts = [];
  }
  user.posts.push(tweetId);
}

function getPosts(username) {
  const user = getUserData(username);
  if (!user.posts) {
    return [];
  } else {
    return user.posts;
  }
}

function hasLiked(username, tweetId) {
  const user = getUserData(username);
  return user.likes.includes(tweetId);
}

function addLike(username, tweetId) {
  const user = getUserData(username);
  user.likes.push(tweetId);
}

function removeLike(username, tweetId) {
  const user = getUserData(username);
  user.likes = user.likes.filter((id) => id !== tweetId);
}

function getLikes(username) {
  const user = getUserData(username);
  return user.likes;
}

// Checks if a user has reposted a specific tweet
function hasRepostedTweet(username, tweetId) {
  const user = getUserData(username);
  return user.reposted.some((repostData) => repostData[0] === tweetId);
}

// Adds a reposted tweet to a user's reposted array
function addRepost(username, tweetId, repostedTweetId) {
  const user = getUserData(username);
  const repostData = [tweetId, repostedTweetId];
  user.reposted.push(repostData);
}

// Removes a reposted tweet from a user's reposted array
function removeRepost(username, tweetId) {
  const user = getUserData(username);
  const repostData = user.reposted.find(
    (repostData) => repostData[0] === tweetId
  );
  user.reposted = user.reposted.filter(
    (repostData) => repostData[0] !== tweetId
  );
  // return repostedTweetId
  return repostData[1];
}

// add comment
function addComment(username, tweetId, commentId) {
  const user = getUserData(username);
  const commentData = [tweetId, commentId];
  user.comments.push(commentData);
}

// get user's comment
function getComments(username) {
  const user = getUserData(username);
  return user.comments.map((commentData) => commentData[1]);
}

module.exports = {
  isValid,
  getUserData,
  addUserData,
  createUserInfo,
  addPost,
  getPosts,
  hasLiked,
  addLike,
  removeLike,
  getLikes,
  hasRepostedTweet,
  addRepost,
  removeRepost,
  addComment,
  getComments,
};
