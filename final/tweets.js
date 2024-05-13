const { getUserData } = require("./users");

const uuid = require("uuid").v4;

const firstTweet = {
  id: uuid(),
  content:
    "🚨 BREAKING NEWS 🚨: 📢 Y has acquired Company X! We're about to reshape Twitter. 🚀 New features, fresh updates – it's all coming your way! Stay tuned for the ultimate Twitter glow-up! ✨ #YXTwitterRevamp",
  user: {
    id: uuid(),
    username: "Y.com",
    createdAt: new Date().toISOString(),
  },
  createdAt: new Date().toISOString(),
  engagement: {
    likes: 9999,
    retweets: 9999,
    replies: 9999,
  },
  reposted: null,
  comments: [],
};

let tweets = [firstTweet];

function getTweets() {
  return [...tweets];
}

// {
//     "id": "123456789",
//     "content": "This is a sample tweet.",
//     "createdAt": "2023-04-12T12:34:56Z",
//     "user": {
//       "userId": "abcd1234",
//       "username": "johndoe",
//     },
//     "engagement": {
//       "likes": 100,
//       "retweets": 50,
//       "replies": 20
//     },
//     "isDeleted": false
//   }

function addTweet(content, user) {
  if (typeof content !== "string" || typeof user !== "object") {
    throw new Error("Invalid input");
  }
  const tweetId = uuid();
  const tweet = {
    id: tweetId,
    content: content,
    createdAt: new Date().toISOString(),
    user: user,
    engagement: {
      likes: 0,
      retweets: 0,
      replies: 0,
    },
    reposted: null,
  };
  tweets = [tweet, ...tweets];
  return tweetId;
}

function likeTweet(id) {
  const tweet = findTweet(id);
  if (tweet) {
    tweet.engagement.likes += 1;
  }
}

function recallLikeTweet(id) {
  const tweet = findTweet(id);
  if (tweet && tweet.engagement.likes > 0) {
    tweet.engagement.likes -= 1;
  }
}

function findTweet(id) {
  return tweets.find((tweet) => tweet.id === id);
}

function repostTweet(id, username) {
  const tweet = findTweet(id);
  if (tweet) {
    tweet.engagement.retweets += 1;
  }
  const user = getUserData(username);

  if (!tweet || !user) {
    throw new Error("Invalid input");
  }

  const repostedTweetId = uuid();

  const repostTweet = {
    id: repostedTweetId,
    content: "",
    createdAt: new Date().toISOString(),
    user: user,
    engagement: {
      likes: 0,
      retweets: 0,
      replies: 0,
    },
    reposted: tweet,
    comments: [],
  };
  tweets = [repostTweet, ...tweets];
  return repostedTweetId;
}

function recallRepostedTweet(id) {
  const tweet = findTweet(id);

  if (!tweet) {
    throw new Error("Invalid input");
  }

  // decrease count of reposted tweet
  if (tweet && tweet.reposted && tweet.reposted.retweets) {
    tweet.reposted.retweets -= 1;
  }

  // remove repostedTweet
  tweets = tweets.filter((t) => t.id !== id);
}

function addComment(id, username, content) {
  const tweet = findTweet(id);
  if (tweet) {
    tweet.engagement.replies += 1;
  }
  const user = getUserData(username);

  if (!tweet || !user) {
    throw new Error("Invalid input");
  }

  const commentTweetId = uuid();
  const commentTweet = {
    id: commentTweetId,
    content: content,
    createdAt: new Date().toISOString(),
    user: user,
    engagement: {
      likes: 0,
      retweets: 0,
      replies: 0,
    },
    reposted: tweet,
  };
  if (!tweet.comments) {
    tweet.comments = [];
  }
  tweet.comments.push(commentTweetId);
  tweets = [commentTweet, ...tweets];
  return commentTweetId;
}

function getComments(tweet) {
  if (!tweet.comments) {
    return [];
  }

  const comments = tweets.filter((t) => tweet.comments.includes(t.id));
  return comments;
}

function getTweetsByIds(ids) {
  return tweets.filter((tweet) => ids.includes(tweet.id));
}

module.exports = {
  getTweets,
  addTweet,
  findTweet,
  likeTweet,
  recallLikeTweet,
  repostTweet,
  recallRepostedTweet,
  addComment,
  getComments,
  getTweetsByIds,
};
