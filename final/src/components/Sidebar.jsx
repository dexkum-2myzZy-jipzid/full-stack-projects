import "../styles/Sidebar.css";

function Sidebar({ page, setPage, onLogout }) {
  function getActiveIndex(page) {
    if (page === "/tweet-feed") {
      return 0;
    } else if (page === "/profile") {
      return 1;
    } else {
      return -1;
    }
  }

  const activeIndex = getActiveIndex(page);

  const buttons = [
    { icon: "gg-home-alt", title: "Home", path: "/tweet-feed" },
    { icon: "gg-profile", title: "Profile", path: "/profile" },
    { icon: "gg-log-off", title: "Logout", path: "/" },
  ];

  function handlePageChange(e) {
    e.preventDefault();
    window.history.pushState(null, "", e.target.pathname);
    if (e.target.pathname === "/") {
      onLogout();
    }
    setPage(e.target.pathname);
  }

  return (
    <div className="sidebar">
      {buttons.map((button, index) => (
        <SidebarButton
          key={index}
          active={activeIndex === index}
          path={button.path}
          icon={button.icon}
          title={button.title}
          onClick={handlePageChange}
        />
      ))}
    </div>
  );
}

function SidebarButton({ active, path, icon, title, onClick }) {
  return (
    <a
      className={`sidebar-button ${active ? "active" : ""}`}
      href={path}
      onClick={onClick}>
      <div className={`icon ${icon}`}></div>
      {title}
    </a>
  );
}

export default Sidebar;
