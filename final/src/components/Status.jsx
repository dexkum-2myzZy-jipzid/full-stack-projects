import { MESSAGES } from "../utils/constants";

function Status({ error }) {
  if (!error) {
    return null;
  }
  const message = MESSAGES[error] || MESSAGES.default;
  return <div className="status">{error && message}</div>;
}

export default Status;
