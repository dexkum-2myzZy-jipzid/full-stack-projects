import Tweet from "./Tweet";

function TweetsFeed({
  user,
  tweets,
  onTweetClick,
  onFetchUpdateTweetLike,
  onFetchRepostTweet,
  onPresentCommentDialog,
}) {
  if (!Array.isArray(tweets)) {
    return <div>No tweets to display</div>;
  }

  return (
    <ul className="tweet-list">
      {tweets.map((tweet) => {
        const isLiked = user.likes.includes(tweet.id);
        const isReposted = user.reposted.some((repostedData) => {
          return repostedData[0] === tweet.id;
        });
        const isCommented = user.comments.includes(tweet.id);

        return (
          <Tweet
            key={tweet.id}
            tweet={tweet}
            onTweetClick={onTweetClick}
            onFetchUpdateTweetLike={onFetchUpdateTweetLike}
            onFetchRepostTweet={onFetchRepostTweet}
            onPresentCommentDialog={onPresentCommentDialog}
            isLiked={isLiked}
            isReposted={isReposted}
            isCommented={isCommented}
          />
        );
      })}
    </ul>
  );
}

export default TweetsFeed;
