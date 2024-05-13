import { useCallback, useEffect, useReducer, useRef } from "react";
import "./App.css";
import "./styles/Home.css";
import LoginForm from "./pages/LoginForm";
import {
  checkSession,
  fetchLogin,
  fetchLogout,
  fetchTweets,
  fetchAddTweet,
  fetchCommentTweet,
  fetchRepostTweet,
  fetchUpdateTweetLike,
} from "./utils/services";
import {
  ACTIONS,
  CLIENT,
  LOGIN_STATUS,
  PAGES,
  POLLING_DELAY,
  SERVER,
} from "./utils/constants";
import Sidebar from "./components/Sidebar";
import TweetInputHeader from "./components/TweetInputHeader";
import TweetsFeed from "./components/TweetsFeed";
import Modal from "./components/Modal";
import TweetPost from "./pages/TweetPost";
import Profile from "./pages/Profile";
import Loading from "./components/Loading";
import Status from "./components/Status";
import reducer, { initialState } from "./utils/reducer";

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  // user input tweet's comment dialog
  const dialogRef = useRef(null);
  const pollingRef = useRef();

  // Handles user login
  function onLogin(username) {
    dispatch({ type: ACTIONS.START_LOADING });
    fetchLogin(username)
      .then(({ user }) => {
        dispatch({ type: ACTIONS.LOG_IN, user });
        return fetchTweets();
      })
      .catch((err) => {
        dispatch({ type: ACTIONS.LOG_OUT });
        return Promise.reject(err); // Pass any other error unchanged
      })
      .then(({ tweets }) => {
        dispatch({ type: ACTIONS.FETCH_TWEETS, tweets });
        dispatch({ type: ACTIONS.NAVIGATE_TO_PAGE, page: PAGES.TWEET_FEED });
        window.history.pushState(null, "", PAGES.TWEET_FEED);
      })
      .catch(({ error }) => {
        onReportError(error);
      });
  }

  // Handles user logout
  function onFetchLogout() {
    fetchLogout()
      .then(({ wasLoggedIn }) => {
        if (wasLoggedIn) {
          dispatch({ type: ACTIONS.LOG_OUT });
          dispatch({ type: ACTIONS.NAVIGATE_TO_PAGE, page: PAGES.LOGIN });
          window.history.pushState(null, "", PAGES.LOGIN);
        }
      })
      .catch(({ error }) => {
        onReportError(error);
      });
  }

  // Checks if a user session exists
  function checkForSession() {
    dispatch({ type: ACTIONS.START_LOADING });
    checkSession()
      .then(({ user }) => {
        dispatch({ type: ACTIONS.LOG_IN, user });
        return fetchTweets();
      })
      .catch((err) => {
        if (err?.error === SERVER.AUTH_MISSING) {
          return Promise.reject({ error: CLIENT.NO_SESSION }); // Expected, not a problem
        }
        return Promise.reject(err); // Pass any other error unchanged
      })
      .then(({ tweets }) => {
        dispatch({ type: ACTIONS.FETCH_TWEETS, tweets });
        dispatch({ type: ACTIONS.NAVIGATE_TO_PAGE, page: PAGES.TWEET_FEED });
        window.history.pushState(null, "", PAGES.TWEET_FEED);
      })
      .catch(({ error }) => {
        if (error === CLIENT.NO_SESSION) {
          dispatch({ type: ACTIONS.LOG_OUT });
          // Not yet logged in isn't a reported error
          return;
        }
        onReportError(error);
      });
  }

  useEffect(() => {
    checkForSession();
  }, []);

  // Opens a comment dialog
  function openDialog() {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  }

  // Sets the page to the current URL
  useEffect(() => {
    function setPageToCurrentURL() {
      dispatch({
        type: ACTIONS.NAVIGATE_TO_PAGE,
        page: document.location.pathname,
      });
    }

    setPageToCurrentURL();

    window.addEventListener("popstate", setPageToCurrentURL);

    return () => {
      window.removeEventListener("popstate", setPageToCurrentURL);
    };
  }, []);

  // Polls for new tweets
  const pollTweets = useCallback(() => {
    fetchTweets()
      .then(({ tweets }) => {
        dispatch({ type: ACTIONS.FETCH_TWEETS, tweets });
      })
      .then(() => {
        pollingRef.current = setTimeout(pollTweets, POLLING_DELAY);
      })
      .catch(() => {
        if (
          state.loginStatus === LOGIN_STATUS.IS_LOGGED_IN &&
          state.page === PAGES.TWEET_FEED
        ) {
          onReportError(CLIENT.POLLING_ERROR);
        }
      });
  }, []);

  useEffect(
    () => {
      // Poll tweets when user is logged in and on the tweet feed page
      if (
        state.loginStatus === LOGIN_STATUS.IS_LOGGED_IN &&
        state.page === PAGES.TWEET_FEED
      ) {
        // We store in a ref because the value is constantly changing
        // We use a ref instead of state because we don't want to rerender when it changes
        pollingRef.current = setTimeout(pollTweets, POLLING_DELAY);
      }
      return () => {
        clearTimeout(pollingRef.current); // Causes no errors if there is no such timeout
      };
    },
    [state.loginStatus, state.page, pollTweets] // pollTodos will not change because it is memoized with useCallback
  );

  // Adds a new tweet
  function onFetchAddTweet(tweet) {
    fetchAddTweet(tweet)
      .then(({ tweets }) => {
        dispatch({ type: ACTIONS.FETCH_TWEETS, tweets });
      })
      .catch(({ error }) => {
        onReportError(error);
      });
  }

  // Updates the like status of a tweet
  function onFetchUpdateTweetLike(id) {
    fetchUpdateTweetLike(id)
      .then(({ user, tweets }) => {
        dispatch({ type: ACTIONS.FETCH_TWEETS, tweets });
        dispatch({ type: ACTIONS.FETCH_USER, user });
      })
      .catch(({ error }) => {
        onReportError(error);
      });
  }

  // Reposts a tweet
  function onFetchRepostTweet(id) {
    fetchRepostTweet(id)
      .then(({ user, tweets }) => {
        dispatch({ type: ACTIONS.FETCH_TWEETS, tweets });
        dispatch({ type: ACTIONS.FETCH_USER, user });
      })
      .catch(({ error }) => {
        onReportError(error);
      });
  }

  // Opens the input comment dialog for a tweet
  function onPresentCommentDialog(tweet) {
    dispatch({ type: ACTIONS.COMMENT_TWEET, tweet });
    openDialog();
  }

  // Adds a comment to a tweet
  function onFetchCommentTweet(id, content) {
    fetchCommentTweet(id, content)
      .then(({ user, tweets }) => {
        dispatch({ type: ACTIONS.FETCH_TWEETS, tweets });
        dispatch({ type: ACTIONS.FETCH_USER, user });
      })
      .catch(({ error }) => {
        onReportError(error);
      });
  }

  // Navigates to the home page
  function onHomeClick() {
    navigateToPage(PAGES.TWEET_FEED);
  }

  // Handles a tweet click
  function onTweetClick(tweet) {
    dispatch({ type: ACTIONS.CLICK_TWEET, tweet });
    window.history.pushState(null, "", PAGES.TWEET_POST);
  }

  // Navigates to a specific page
  function navigateToPage(page) {
    dispatch({ type: ACTIONS.NAVIGATE_TO_PAGE, page });
    window.history.pushState(null, "", page);
  }

  // Reports an error
  function onReportError(error) {
    // sid is missing, app should logout
    if (error === SERVER.AUTH_MISSING) {
      dispatch({ type: ACTIONS.LOG_OUT });
    }
    dispatch({ type: ACTIONS.REPORT_ERROR, error });
  }

  return (
    <>
      {state.error && <Status error={state.error} />}
      {state.loginStatus === LOGIN_STATUS.PENDING && (
        <Loading>Loading...</Loading>
      )}
      {state.loginStatus === LOGIN_STATUS.NOT_LOGGED_IN && (
        <LoginForm onLogin={onLogin} />
      )}
      {state.loginStatus === LOGIN_STATUS.IS_LOGGED_IN && (
        <div className="home-container">
          <Sidebar
            page={state.page}
            setPage={navigateToPage}
            onLogout={onFetchLogout}
          />
          <div className="panel">
            {state.page === PAGES.TWEET_FEED && (
              <div className="tweets-feed-container">
                <TweetInputHeader
                  user={state.user}
                  onFetchAddTweet={onFetchAddTweet}
                />
                <TweetsFeed
                  user={state.user}
                  tweets={state.tweets}
                  onTweetClick={onTweetClick}
                  onFetchUpdateTweetLike={onFetchUpdateTweetLike}
                  onFetchRepostTweet={onFetchRepostTweet}
                  onPresentCommentDialog={onPresentCommentDialog}
                />
                <Modal
                  dialogRef={dialogRef}
                  user={state.user}
                  tweet={state.currentTweet}
                  onFetchCommentTweet={onFetchCommentTweet}></Modal>
              </div>
            )}
            {state.page === PAGES.TWEET_POST && (
              <TweetPost
                user={state.user}
                tweet={state.currentTweet}
                onGoBack={onHomeClick}
                onFetchCommentTweet={onFetchCommentTweet}
                onReportError={onReportError}
              />
            )}
            {state.page === PAGES.PROFILE && (
              <Profile user={state.user} onReportError={onReportError} />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
