import { getColorFromUsername } from "../utils/utils";

function UserInfo({ user }) {
  if (!user || !user.username) {
    return <div>No user information</div>;
  }
  return (
    <div className="tweet-user-info">
      <div
        className="user-avatar"
        style={{
          backgroundColor: getColorFromUsername(user.username),
        }}>
        {user.username.charAt(0).toUpperCase()}
      </div>
      <b className="tweet-username">{user.username}</b>
    </div>
  );
}

export default UserInfo;
