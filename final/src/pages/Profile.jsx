import { useEffect, useState } from "react";
import {
  fetchUserComments,
  fetchUserLikes,
  fetchUserPosts,
} from "../utils/services";
import "../styles/Profile.css";
import { getColorFromUsername } from "../utils/utils";
import UserContentList from "../components/UserContentList";

function Profile({ user }) {
  const [state, setState] = useState({
    activeTab: 0,
    contents: {
      posts: [],
      likes: [],
      comments: [],
    },
  });

  function handleTabClick(index) {
    setState((prevState) => ({
      ...prevState,
      activeTab: index,
    }));
  }

  useEffect(() => {
    // fetch user's posts & likes & comments
    Promise.all([fetchUserPosts(), fetchUserLikes(), fetchUserComments()])
      .then(([posts, likes, comments]) => {
        setState((prevState) => ({
          ...prevState,
          contents: { posts, likes, comments },
        }));
      })
      .catch(({ error }) => {
        onReportError(error);
      });
  }, []);

  return (
    <div className="profile">
      <ProfileHeader user={user} />
      <ProfileTabList
        activeTab={state.activeTab}
        handleTabClick={handleTabClick}
        contents={state.contents}
      />
    </div>
  );
}

function ProfileHeader({ user }) {
  return (
    <div className="profile-header">
      <div className="profile-header-background"></div>
      <div
        className="profile-user-avatar"
        style={{ backgroundColor: getColorFromUsername(user.username) }}>
        {user.username.charAt(0).toUpperCase()}
      </div>
      <div className="profile-user-info">
        <b className="profile-username">{user.username}</b>
        <div className="profile-user-date">
          {"Joined " +
            new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
        </div>
      </div>
    </div>
  );
}

function ProfileTabList({ activeTab, handleTabClick, contents }) {
  const tabs = ["Posts", "Likes", "Comments"];
  const tabsContents = [contents.posts, contents.likes, contents.comments];

  return (
    <div className="profile-tab-list">
      <div className="profile-tab-headers">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`profile-tab-header ${
              index === activeTab ? "active" : ""
            }`}
            onClick={() => handleTabClick(index)}>
            {tab}
          </div>
        ))}
      </div>
      <UserContentList items={tabsContents[activeTab]} />
    </div>
  );
}

export default Profile;
