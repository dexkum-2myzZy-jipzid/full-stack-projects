import UserInfo from "./UserInfo";

function UserContentItem({ item }) {
  if (!item || !item.user || !item.content) {
    return <div>No item information</div>;
  }

  return (
    <li key={item.id} className="comment-item">
      <UserInfo user={item.user} />
      <p className="tweet-content">{item.content}</p>
    </li>
  );
}

export default UserContentItem;
