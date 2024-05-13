import { useState } from "react";
import { getColorFromUsername } from "../utils/utils";

function Modal({ dialogRef, user, tweet, onFetchCommentTweet }) {
  const [content, setContent] = useState("");

  function closeDialog() {
    dialogRef.current.close();
  }

  function handleSubmit(event) {
    event.preventDefault();
    onFetchCommentTweet(tweet.id, content);
    closeDialog();
  }

  return (
    <dialog className="dialog" ref={dialogRef}>
      <div className="dialog-details">
        <button className="dialog-close" onClick={closeDialog}>
          Close
        </button>
        <form
          className="dialog-form"
          action="#/commentTweet"
          onSubmit={handleSubmit}>
          <div className="dialog-user-info">
            <div
              className="user-avatar"
              style={{ backgroundColor: getColorFromUsername(user.username) }}>
              {user.username.charAt(0).toUpperCase()}
            </div>
            <textarea
              className="dialog-textarea"
              placeholder="Add Comment"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <button className="dialog-submit" type="submit">
            Post
          </button>
        </form>
      </div>
    </dialog>
  );
}

export default Modal;
