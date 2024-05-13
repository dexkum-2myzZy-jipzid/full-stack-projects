import { MESSAGES, SERVER } from "./constants";

const state = {
  messages: {},
  isLoggedIn: false,
  username: "",
  error: "",
  users: [],
  onlyUpdateMessageAndUserList: false,
  isActionPending: false,
};

export function startLoading() {
  state.isActionPending = true;
}

export function login(username) {
  state.isLoggedIn = true;
  state.username = username;
  state.error = "";
  state.isActionPending = false;
}

export function logout() {
  state.isLoggedIn = false;
  state.messages = {};
  state.username = "";
  state.error = "";
  state.onlyUpdateMessageAndUserList = false;
  state.isActionPending = false;
}

export function setMessages(message) {
  state.messages = message;
  state.error = "";
  state.isActionPending = false;
}

export function setUsers(users) {
  state.users = users;
  state.error = "";
  state.isActionPending = false;
}

export function setError(error) {
  state.isActionPending = false;
  if (!error) {
    state.error = "";
    return;
  }
  //sid is missing and login again
  if (error === SERVER.AUTH_MISSING) {
    state.isLoggedIn = false;
  }
  state.error = MESSAGES[error] || MESSAGES.default;
}

export function startUpdatingMessageAndUserList() {
  state.onlyUpdateMessageAndUserList = true;
}

export function stopUpdatingMessageAndUserList() {
  state.onlyUpdateMessageAndUserList = false;
}

export default state;
