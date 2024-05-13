import { ACTIONS, CLIENT, LOGIN_STATUS, PAGES } from "./constants";

export const initialState = {
  page: PAGES.LOGIN,
  loginStatus: LOGIN_STATUS.PENDING,
  user: null,
  error: "",
  tweets: [],
  currentTweet: null,
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOG_IN:
      return {
        ...state,
        page: PAGES.TWEET_FEED,
        loginStatus: LOGIN_STATUS.IS_LOGGED_IN,
        user: action.user,
        error: "",
      };
    case ACTIONS.LOG_OUT:
      return {
        ...state,
        page: PAGES.LOGIN,
        loginStatus: LOGIN_STATUS.NOT_LOGGED_IN,
        user: null,
        error: "",
        tweets: [],
        currentTweet: null,
      };
    case ACTIONS.START_LOADING:
      return {
        ...state,
        error: "",
        loginStatus: LOGIN_STATUS.PENDING,
      };
    case ACTIONS.REPORT_ERROR:
      return {
        ...state,
        error: action.error || "ERROR",
      };
    case ACTIONS.FETCH_USER:
      return {
        ...state,
        user: action.user,
        error: "",
      };
    case ACTIONS.FETCH_TWEETS:
      return {
        ...state,
        tweets: action.tweets,
      };
    case ACTIONS.NAVIGATE_TO_PAGE:
      return {
        ...state,
        page: action.page,
      };
    case ACTIONS.CLICK_TWEET:
      return {
        ...state,
        page: PAGES.TWEET_POST,
        currentTweet: action.tweet,
      };
    case ACTIONS.COMMENT_TWEET:
      return {
        ...state,
        currentTweet: action.tweet,
      };

    default:
      throw new Error({ error: CLIENT.UNKNOWN_ACTION, detail: action });
  }
}

export default reducer;
