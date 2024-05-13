import { useState } from "react";
import { getColorFromUsername } from "../utils/utils";

function TweetInputHeader({ user, onFetchAddTweet }) {
  const [tweet, setTweet] = useState("");

  if (!user || !user.username) {
    return <div>No user information</div>;
  }

  function handleTweetSubmit(event) {
    event.preventDefault();
    onFetchAddTweet(tweet);
    setTweet("");
  }

  function handleTweetChange(event) {
    setTweet(event.target.value);
  }

  return (
    <div className="tweet-feed-header">
      <div
        className="user-avatar"
        style={{ backgroundColor: getColorFromUsername(user.username) }}>
        {user.username.charAt(0).toUpperCase()}
      </div>
      <form
        action="#/posttweet"
        onSubmit={handleTweetSubmit}
        className="tweet-form">
        <textarea
          className="tweet-textarea"
          placeholder="What is happening?!"
          value={tweet}
          onChange={handleTweetChange}
        />
        <button type="submit" className="submit-button">
          Post
        </button>
      </form>
    </div>
  );
}

export default TweetInputHeader;
