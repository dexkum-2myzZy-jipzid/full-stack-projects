import { getColorFromUsername } from "../utils/utils";

function PostTweetForm({ user, content, setContent, handleSubmit }) {
  return (
    <form
      className="post-tweet-form"
      action="#/commentTweet"
      onSubmit={handleSubmit}
    >
      <div className="tweet-form-user-info">
        <div
          className="user-avatar"
          style={{ backgroundColor: getColorFromUsername(user.username) }}
        >
          {user.username.charAt(0).toUpperCase()}
        </div>
        <textarea
          className="tweet-form-textarea"
          placeholder="Add Comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <button className="tweet-form-submit-button" type="submit">
        Post
      </button>
    </form>
  );
}

export default PostTweetForm;
