import { getColorFromUsername } from "../utils/utils";

const TweetType = {
  Basic: "basic",
  RepostOnly: "repostOnly",
  RepostWithComment: "repostWithComment",
};

function getTweetType(tweet) {
  if (tweet.reposted != null && tweet.content.trim() === "") {
    return TweetType.RepostOnly;
  } else if (tweet.reposted != null) {
    return TweetType.RepostWithComment;
  } else {
    return TweetType.Basic;
  }
}

function Tweet({
  tweet,
  onTweetClick,
  onFetchUpdateTweetLike,
  onFetchRepostTweet,
  onPresentCommentDialog,
  isLiked,
  isReposted,
  isCommented,
}) {
  function handleHeartClick(id) {
    onFetchUpdateTweetLike(id);
  }

  function handleRepostClick(id) {
    onFetchRepostTweet(id);
  }

  function handleCommentClick(tweet) {
    onPresentCommentDialog(tweet);
  }

  const type = getTweetType(tweet);

  if (type === TweetType.Basic) {
    return (
      <BasicTweet
        tweet={tweet}
        onTweetClick={onTweetClick}
        handleHeartClick={handleHeartClick}
        handleRepostClick={handleRepostClick}
        handleCommentClick={handleCommentClick}
        isLiked={isLiked}
        isReposted={isReposted}
        isCommented={isCommented}
      />
    );
  } else if (type === TweetType.RepostOnly) {
    return (
      <RepostTweet
        tweet={tweet}
        onTweetClick={onTweetClick}
        handleHeartClick={handleHeartClick}
        handleRepostClick={handleRepostClick}
        handleCommentClick={handleCommentClick}
        isLiked={isLiked}
        isReposted={isReposted}
        isCommented={isCommented}
      />
    );
  } else if (type === TweetType.RepostWithComment) {
    return (
      <RepostWithCommentTweet
        tweet={tweet}
        onTweetClick={onTweetClick}
        handleHeartClick={handleHeartClick}
        handleRepostClick={handleRepostClick}
        handleCommentClick={handleCommentClick}
        isLiked={isLiked}
        isReposted={isReposted}
        isCommented={isCommented}
      />
    );
  }

  return null;
}

// Render a basic tweet
function BasicTweet({
  tweet,
  onTweetClick,
  handleHeartClick,
  handleRepostClick,
  handleCommentClick,
  isLiked,
  isReposted,
  isCommented,
}) {
  function handleTweetItemClick() {
    onTweetClick(tweet);
  }

  const user = tweet.user;

  return (
    <li key={tweet.id} className="tweet-item">
      <div
        className="user-avatar"
        style={{ backgroundColor: getColorFromUsername(user.username) }}>
        {user.username.charAt(0).toUpperCase()}
      </div>
      <div className="tweet-info">
        <b className="tweet-username">{tweet.user.username}</b>
        <p className="tweet-content" onClick={handleTweetItemClick}>
          {tweet.content}
        </p>
        <div className="tweet-user-interact">
          <div className="tweet-user-interact-unit">
            <div
              className={`tweet-heart gg-heart ${
                isLiked ? "tweet-heart-active" : ""
              }`}
              onClick={() => handleHeartClick(tweet.id)}></div>
            <b
              className={`tweet-likes-number ${
                isLiked ? "tweet-heart-active" : ""
              }`}>
              {tweet.engagement.likes}
            </b>
          </div>
          <div className="tweet-user-interact-unit">
            <div
              className={`tweet-repeat gg-repeat ${
                isReposted ? "tweet-repeat-active" : ""
              }`}
              onClick={() => handleRepostClick(tweet.id)}></div>
            <b
              className={`tweet-retweets-number ${
                isReposted ? "tweet-repeat-active" : ""
              }`}>
              {tweet.engagement.retweets}
            </b>
          </div>
          <div className="tweet-user-interact-unit">
            <div
              className={`tweet-comment gg-comment ${
                isCommented ? "tweet-comment-active" : ""
              }`}
              onClick={() => handleCommentClick(tweet)}></div>
            <b
              className={`tweet-comment-number ${
                isCommented ? "tweet-comment-active" : ""
              }`}>
              {tweet.engagement.replies}
            </b>
          </div>
        </div>
      </div>
    </li>
  );
}

// Render a repost tweet without comment
function RepostTweet({
  tweet,
  onTweetClick,
  handleHeartClick,
  handleRepostClick,
  handleCommentClick,
  isLiked,
  isReposted,
  isCommented,
}) {
  const repostedTweet = tweet.reposted;
  const user = repostedTweet.user;

  function handleTweetItemClick() {
    onTweetClick(repostedTweet);
  }

  return (
    <li key={repostedTweet.id} className="respoted-tweet-item">
      <div className="tweet-repost-header">
        <div className="tweet-repeat gg-repeat"></div>
        <div className="tweet-repost-username">
          {tweet.user.username} Reposted
        </div>
      </div>
      <div key={tweet.id} className="tweet-item">
        <div
          className="user-avatar"
          style={{ backgroundColor: getColorFromUsername(user.username) }}>
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className="tweet-info">
          <b className="tweet-username">{user.username}</b>
          <p className="tweet-content" onClick={handleTweetItemClick}>
            {repostedTweet.content}
          </p>
          <div className="tweet-user-interact">
            <div className="tweet-user-interact-unit">
              <div
                className={`tweet-heart gg-heart ${
                  isLiked ? "tweet-heart-active" : ""
                }`}
                onClick={() => handleHeartClick(tweet.id)}></div>
              <b
                className={`tweet-likes-number ${
                  isLiked ? "tweet-heart-active" : ""
                }`}>
                {tweet.engagement.likes}
              </b>
            </div>
            <div className="tweet-user-interact-unit">
              <div
                className={`tweet-repeat gg-repeat ${
                  isReposted ? "tweet-repeat-active" : ""
                }`}
                onClick={() => handleRepostClick(tweet.id)}></div>
              <b
                className={`tweet-retweets-number ${
                  isReposted ? "tweet-repeat-active" : ""
                }`}>
                {tweet.engagement.retweets}
              </b>
            </div>
            <div className="tweet-user-interact-unit">
              <div
                className={`tweet-comment gg-comment ${
                  isCommented ? "tweet-comment-active" : ""
                }`}
                onClick={() => handleCommentClick(tweet)}></div>
              <b
                className={`tweet-comment-number ${
                  isCommented ? "tweet-comment-active" : ""
                }`}>
                {tweet.engagement.replies}
              </b>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

// Render a repost tweet with comment
function RepostWithCommentTweet({
  tweet,
  onTweetClick,
  handleHeartClick,
  handleRepostClick,
  handleCommentClick,
  isLiked,
  isReposted,
  isCommented,
}) {
  const user = tweet.user;

  const repostedTweet = tweet.reposted;
  const repostedUser = repostedTweet.user;

  function handleTweetItemClick() {
    onTweetClick(tweet);
  }

  function handleRepostTweetClick() {
    onTweetClick(repostedTweet);
  }

  return (
    <li key={tweet.id} className="tweet-item">
      <div
        className="user-avatar"
        style={{ backgroundColor: getColorFromUsername(user.username) }}>
        {user.username.charAt(0).toUpperCase()}
      </div>
      <div className="tweet-info">
        <b className="tweet-username">{tweet.user.username}</b>
        <p className="tweet-content" onClick={handleTweetItemClick}>
          {tweet.content}
        </p>
        <div className="reposted-content" onClick={handleRepostTweetClick}>
          <div className="reposted-content-header">
            <div
              className="reposted-user-avatar"
              style={{
                backgroundColor: getColorFromUsername(repostedUser.username),
              }}>
              {repostedUser.username.charAt(0).toUpperCase()}
            </div>
            <b className="reposted-username">{repostedUser.username}</b>
          </div>
          <p className="reposted-tweet-content">{repostedTweet.content}</p>
        </div>
        <div className="tweet-user-interact">
          <div className="tweet-user-interact-unit">
            <div
              className={`tweet-heart gg-heart ${
                isLiked ? "tweet-heart-active" : ""
              }`}
              onClick={() => handleHeartClick(tweet.id)}></div>
            <b
              className={`tweet-likes-number ${
                isLiked ? "tweet-heart-active" : ""
              }`}>
              {tweet.engagement.likes}
            </b>
          </div>
          <div className="tweet-user-interact-unit">
            <div
              className={`tweet-repeat gg-repeat ${
                isReposted ? "tweet-repeat-active" : ""
              }`}
              onClick={() => handleRepostClick(tweet.id)}></div>
            <b
              className={`tweet-retweets-number ${
                isReposted ? "tweet-repeat-active" : ""
              }`}>
              {tweet.engagement.retweets}
            </b>
          </div>
          <div className="tweet-user-interact-unit">
            <div
              className={`tweet-comment gg-comment ${
                isCommented ? "tweet-comment-active" : ""
              }`}
              onClick={() => handleCommentClick(tweet)}></div>
            <b
              className={`tweet-comment-number ${
                isCommented ? "tweet-comment-active" : ""
              }`}>
              {tweet.engagement.replies}
            </b>
          </div>
        </div>
      </div>
    </li>
  );
}

export default Tweet;
