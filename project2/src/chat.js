import { SERVER, CLIENT } from "./constants";
import {
  addAbilityToAddMessage,
  addAbilityToLgout,
  addAbilityToLogin,
  pollMessageAndUser,
} from "./listeners";
import { fetchMessage, fetchSession, fetchUsers } from "./services";
import state, { login, logout, setError, setMessages, setUsers } from "./state";
import render from "./view";

const appEl = document.querySelector("#app");
render(state, appEl);
addAbilityToLogin(state, appEl);
addAbilityToAddMessage(state, appEl);
addAbilityToLgout(state, appEl);
checkForSession();

function checkForSession() {
  fetchSession()
    .then((session) => {
      // The returned object from the service call
      login(session.username); // We do not have todos yet!
      render(state, appEl); // Show we are logged in but don't have todos
      return Promise.all([fetchMessage(), fetchUsers()]);
    })
    .catch((err) => {
      if (err?.error === SERVER.AUTH_MISSING) {
        return Promise.reject({ error: CLIENT.NO_SESSION }); // Expected, not a problem
      }
      return Promise.reject(err); // Pass any other error unchanged
    })
    .then(([messages, users]) => {
      setMessages(messages);
      setUsers(users);
      render(state, appEl);

      // poll for new messages and users every 5 seonds
      setTimeout(() => pollMessageAndUser(state, appEl), 5000); // AFTER previous call
    })
    .catch((err) => {
      if (err?.error == CLIENT.NO_SESSION) {
        // expected "error"
        logout(); // No longer waiting, set to logged out case
        render(state, appEl);
        return;
      }
      // For unexpected errors, report them
      setError(err?.error || "ERROR"); // Ensure that the error ends up truthy
      render(state, appEl);
    });
}
