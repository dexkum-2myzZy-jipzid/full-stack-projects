export const POLLING_DELAY = 3000; // milliseconds

export const LOGIN_STATUS = {
  PENDING: "pending",
  NOT_LOGGED_IN: "notLoggedIn",
  IS_LOGGED_IN: "loggedIn",
};

export const PAGES = {
  LOGIN: "/",
  TWEET_FEED: "/tweet-feed",
  TWEET_POST: "/tweet-post",
  PROFILE: "/profile",
};

// Might be SERVER_CODES and CLIENT_CODES if we had more and different constants
export const SERVER = {
  AUTH_MISSING: "auth-missing",
  AUTH_INSUFFICIENT: "auth-insufficient",
  REQUIRED_USERNAME: "required-username",
  REQUIRED_TWEET: "required-tweet",
  TWEET_MISSING: "noSuchId", // Someone was inconsistent!
  USER_NOT_EXIST: "user-not-exist",
  REQUIRED_CONTENT: "required-content",
};

export const CLIENT = {
  NETWORK_ERROR: "networkError",
  NO_SESSION: "noSession",
  UNKNOWN_ACTION: "unknownAction",
  POLLING_ERROR: "pollingTweetError",
};

export const MESSAGES = {
  // The [] below uses the variable value as the key
  [CLIENT.NETWORK_ERROR]:
    "Trouble connecting to the network.  Please try again",
  // Here we use 'dog' to simulate a bad password
  [SERVER.AUTH_INSUFFICIENT]:
    "Your username/password combination does not match any records, please try again.",
  [SERVER.REQUIRED_USERNAME]:
    "Please enter a valid (letters and/or numbers) username",
  [SERVER.REQUIRED_TWEET]: "Please enter the tweet content",
  [CLIENT.POLLING_ERROR]: "An error occurred while polling for new tweets",
  [SERVER.AUTH_MISSING]:
    "Warning: Missing or invalid session ID. Please log in again.",
  [SERVER.REQUIRED_CONTENT]: "Please ensure your input is not empty.",
  default: "Something went wrong.  Please try again",
};

export const ACTIONS = {
  LOG_IN: "logIn",
  LOG_OUT: "logOut",
  START_LOADING: "startLoading",
  FETCH_TWEETS: "fetchTweets",
  FETCH_USER: "fetchUser",
  CLICK_TWEET: "click_tweet",
  COMMENT_TWEET: "commentTweet",
  REPORT_ERROR: "reportError",
  NAVIGATE_TO_PAGE: "navigateToPage",
};
