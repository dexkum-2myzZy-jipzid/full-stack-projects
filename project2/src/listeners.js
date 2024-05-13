import {
  fetchAddMessage,
  fetchLogin,
  fetchLogout,
  fetchMessage,
  fetchUsers,
} from "./services";
import {
  login,
  logout,
  setError,
  setMessages,
  setUsers,
  startLoading,
  startUpdatingMessageAndUserList,
  stopUpdatingMessageAndUserList,
} from "./state";
import render from "./view";

export function addAbilityToLogin(state, appEl) {
  appEl.addEventListener("submit", (e) => {
    e.preventDefault();
    // login
    if (e.target.classList.contains("login-form")) {
      const username = document.querySelector(".username").value;
      startLoading();
      render(state, appEl);
      fetchLogin(username)
        .then(({ messages, users }) => {
          login(username);
          setMessages(messages);
          setUsers(users);
          render(state, appEl);
          // poll for new messages and users every 5 seonds
          setTimeout(() => pollMessageAndUser(state, appEl), 5000); // AFTER previous call
        })
        .catch((err) => {
          setError(err?.error || "ERROR"); // Ensure that the error ends up truthy
          render(state, appEl);
        });
      return;
    }
  });
}

function refreshMessageAndUser(state, appEl) {
  return Promise.all([fetchMessage(), fetchUsers()])
    .then(([messages, users]) => {
      setMessages(messages);
      setUsers(users);
      startUpdatingMessageAndUserList();
      render(state, appEl);
      stopUpdatingMessageAndUserList();
    })
    .catch((err) => {
      setError(err?.error || "ERROR");
      stopUpdatingMessageAndUserList();
      render(state, appEl);
    });
}

export function pollMessageAndUser(state, appEl) {
  // If the user is logged in, fetch new messages and users
  if (state.isLoggedIn) {
    refreshMessageAndUser(state, appEl).then(() => {
      setTimeout(() => pollMessageAndUser(state, appEl), 5000); // AFTER previous call
    });
  }
}

export function addAbilityToAddMessage(state, appEl) {
  appEl.addEventListener("submit", (e) => {
    e.preventDefault();

    //send message
    if (e.target.classList.contains("addMessage-form")) {
      const content = document.querySelector(".addMessage-input").value;
      document.querySelector(".addMessage-input").value = "";
      startLoading();
      render(state, appEl);
      fetchAddMessage(content)
        .then((messages) => {
          setMessages(messages);
          render(state, appEl);
        })
        .catch((err) => {
          setError(err?.error || "ERROR");
          render(state, appEl);
        });
      return;
    }
  });
}

export function addAbilityToLgout(state, appEl) {
  appEl.addEventListener("submit", (e) => {
    e.preventDefault();

    //logout
    if (e.target.classList.contains("logout-form")) {
      startLoading();
      render(state, appEl);
      fetchLogout()
        .then((response) => {
          logout();
          render(state, appEl);
        })
        .catch((err) => {
          setError(err?.error || "ERROR");
          render(state, appEl);
        });
      return;
    }
  });
}
