import { useEffect, useState } from "react";
import "../styles/TweetPost.css";
import UserInfo from "../components/UserInfo";
import UserContentList from "../components/UserContentList";
import { fetchGetTweetComments } from "../utils/services";
import PostTweetForm from "../components/PostTweetForm";

function TweetPost({
  user,
  tweet,
  onGoBack,
  onFetchCommentTweet,
  onReportError,
}) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  if (!tweet) {
    return (
      <div className="tweet-not-found">
        <p>Tweet not found. It may have been deleted.</p>
        <button onClick={onGoBack}>Go to Tweet Feed</button>
      </div>
    );
  }

  useEffect(() => {
    fetchGetTweetComments(tweet.id)
      .then(({ comments }) => {
        setComments(comments);
      })
      .catch(({error}) => {
        onReportError(error);
      });
  }, [user]);

  function handleSubmit(event) {
    event.preventDefault();
    onFetchCommentTweet(tweet.id, content);
    setContent("");
  }

  return (
    <div className="tweet-post">
      <button className="go-back-button" onClick={onGoBack}>
        back
      </button>
      <div className="tweet-post-header">
        <UserInfo user={tweet.user} />
        <p className="tweet-content">{tweet.content}</p>
      </div>
      <PostTweetForm
        user={user}
        content={content}
        setContent={setContent}
        handleSubmit={handleSubmit}
      />
      <b className="comments-header">Comments</b>
      <UserContentList items={comments} />
    </div>
  );
}

export default TweetPost;
