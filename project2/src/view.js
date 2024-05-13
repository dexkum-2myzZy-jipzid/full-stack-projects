function render(state, appEl) {
  // loading
  if (state.isActionPending) {
    const spinner = spinnerLoading();
    appEl.innerHTML = spinner;
    return;
  }

  if (!state.isLoggedIn) {
    const loginPage = `
      ${generateTitleHtml(state)}
      ${generateLoginHtml(state)}
    `;
    appEl.innerHTML = loginPage;
  } else {
    //chat room
    if (state.onlyUpdateMessageAndUserList) {
      renderMessagesAndUserHtml(state);
    } else {
      renderChatView(state, appEl);
    }
  }
}

function spinnerLoading() {
  return `
  <div class="spinner">
    <div class="gg-spinner-alt"></div>
    <h2 class="spinner-title">Loading .... </h2>
  </div>`;
}

function renderMessagesAndUserHtml(state) {
  const messagesHtml = generateMessageListHtml(state);
  const usersHtml = generateUserListHtml(state);

  document.querySelector(".messages-list").innerHTML = messagesHtml;
  document.querySelector(".user-list-container").innerHTML = usersHtml;
}

function renderChatView(state, appEl) {
  const generateChatViewHtml = generateChatHtml(state);
  appEl.innerHTML = generateChatViewHtml;
  setTimeout(() => {
    appEl = document.querySelector("#app");
    scrollToBottom();
  }, 0);
}

function scrollToBottom() {
  window.scrollTo({ top: document.body.scrollHeight });
}

function generateTitleHtml(state) {
  let titleName = "Login";
  if (state.isLoggedIn) {
    titleName = "Chat Room";
  }
  return `
  <header>
    <h1 class="title">${titleName}</h1>
  </header>`;
}

function generateLoginHtml(state) {
  const errorMessage =
    state.error.trim() === ""
      ? ""
      : `<div class="error-message">${state.error}</div>`;
  return `
  <main>
    <form action="" class="login-form">
      <div class="form-group">
        <label for="username">Enter your name: </label>
        <input type="text" class="username" name="username" id="username" placeholder="username"/>
      </div>
      ${errorMessage}
      <button class="form-button" type="submit">Login</button>
    </form>
  </main>`;
}

function generateChatHtml(state) {
  return `
    ${generateTitleHtml(state)}
    <main class="main-container">
      <div class="user-list-container">
        ${generateUserListHtml(state)}
      </div>
      <div class="message-container">
        <div class="messages-list">
          ${generateMessageListHtml(state)}
        </div>
        ${generateAddMessageHtml(state)}
        ${generateLogoutHtml()}
      </div>
    </main>`;
}

function generateUserListHtml(state) {
  return (
    `<ul class="users">` +
    state.users
      .map(
        (username) => `
      <li class="user-info">
          ${generateAvatarHtml(username)}
          <span class="username">${username}${
          state.username === username ? " (Current User) " : ""
        }</span>
      </li>`
      )
      .join("") +
    `</ul>`
  );
}

function generateMessageListHtml(state) {
  return (
    `<ol class="messages">` +
    Object.values(state.messages)
      .map(
        (message) => `
      <li class="message" data-id="${message.id}">
          <div class="sender-info">
            ${generateAvatarHtml(message.sender)}
            <span class="username">${message.sender}</span>
          </div>
          <p class="message-text">${message.content}</p>
      </li>`
      )
      .join("") +
    `</ol>`
  );
}

function generateAvatarHtml(username) {
  return `
  <div class="avatar" style="background-color: ${getColorFromUsername(
    username
  )}">
    ${username.charAt(0).toUpperCase()}
  </div>`;
}

function getColorFromUsername(username) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
}

function generateAddMessageHtml(state) {
  const errorMessage =
    state.error.trim() === ""
      ? ""
      : `<div class="error-message">${state.error}</div>`;
  return `
  <form class="addMessage-form">
    <input name="text" class="addMessage-input" placeholder="Enter message to send" />
    <button class="addMessage-send" type="submit">Send</button>
  </form>
  ${errorMessage}`;
}

function generateLogoutHtml() {
  return `
  <form class="logout-form">
    <button type="submit" class="logout-button">Logout</button>
  </form>`;
}

export default render;
