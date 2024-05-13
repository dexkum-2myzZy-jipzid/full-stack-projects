import UserContentItem from "./UserContentItem";

function UserContentList({ items }) {
  if (!Array.isArray(items)) {
    return <div>No items to display</div>;
  }

  return (
    <ul className="user-content-list">
      {items.map((item) => (
        <UserContentItem key={item.id} item={item} />
      ))}
    </ul>
  );
}

export default UserContentList;
