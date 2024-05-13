function Loading({ children = "Loading..." }) {
  return (
    <div className="loading">
      <div className="gg-spinner"></div>
      <h2 className="loading-title">{children}</h2>
    </div>
  );
}

export default Loading;
