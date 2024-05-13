//#region account related
export function checkSession() {
  return (
    fetch("/api/v1/session", {
      method: "GET",
      headers: {
        "content-type": "application/json", // set this header when sending JSON in the body of request
      },
    })
      // fetch() rejects on network error
      // So we convert that to a formatted error object
      // so our caller can handle all "errors" in a similar way
      .catch(() => Promise.reject({ error: "network-error" }))
      .then((response) => {
        if (!response.ok) {
          // response.ok checks the status code from the service
          // This service returns JSON on errors,
          // so we use that as the error object and reject
          return response.json().then((err) => Promise.reject(err));
        }
        return response.json(); // happy status code means resolve with data from service
      })
  );
}

export function fetchLogin(username) {
  return (
    fetch("/api/v1/session", {
      method: "POST",
      headers: {
        "content-type": "application/json", // set this header when sending JSON in the body of request
      },
      body: JSON.stringify({ username }),
    })
      // fetch() rejects on network error
      // So we convert that to a formatted error object
      // so our caller can handle all "errors" in a similar way
      .catch(() => Promise.reject({ error: "network-error" }))
      .then((response) => {
        if (!response.ok) {
          // response.ok checks the status code from the service
          // This service returns JSON on errors,
          // so we use that as the error object and reject
          return response.json().then((err) => Promise.reject(err));
        }
        return response.json(); // happy status code means resolve with data from service
      })
  );
}

export function fetchLogout() {
  return fetch("/api/v1/session", {
    method: "DELETE",
  })
    .catch(() => Promise.reject({ error: "networkError" }))
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return response
        .json()
        .catch((error) => Promise.reject({ error }))
        .then((err) => Promise.reject(err));
    });
}
//#endregion

//#region tweet
export function fetchTweets() {
  return fetch("/api/v1/tweets")
    .catch(() => Promise.reject({ error: "network-error" }))
    .then((response) => {
      if (!response.ok) {
        // response.ok checks the status code from the service
        // This service returns JSON on errors,
        // so we use that as the error object and reject
        return response.json().then((err) => Promise.reject(err));
      }
      return response.json(); // happy status code means resolve with data from service
    });
}

export function fetchAddTweet(tweet) {
  return fetch("/api/v1/tweets", {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
    }),
    body: JSON.stringify({ tweet }),
  })
    .catch(() => Promise.reject({ error: "networkError" }))
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return response
        .json()
        .catch((error) => Promise.reject({ error }))
        .then((err) => Promise.reject(err));
    });
}
//#endregion

//#region user interaction
// increase the number of like
export function fetchUpdateTweetLike(id) {
  return fetch(`/api/v1/tweets/${id}/likes`, {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
    }),
  })
    .catch(() => Promise.reject({ error: "networkError" }))
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return response
        .json()
        .catch((error) => Promise.reject({ error }))
        .then((err) => Promise.reject(err));
    });
}

// repost tweet
export function fetchRepostTweet(id) {
  return fetch(`/api/v1/tweets/${id}/reposts`, {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
    }),
  })
    .catch(() => Promise.reject({ error: "networkError" }))
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return response
        .json()
        .catch((error) => Promise.reject({ error }))
        .then((err) => Promise.reject(err));
    });
}

// comment tweet
export function fetchCommentTweet(id, content) {
  return fetch(`/api/v1/tweets/${id}/comments`, {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
    }),
    body: JSON.stringify({ content }),
  })
    .catch(() => Promise.reject({ error: "networkError" }))
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return response
        .json()
        .catch((error) => Promise.reject({ error }))
        .then((err) => Promise.reject(err));
    });
}
//#endregion

//#region post & comments & likes & repost

export function fetchGetTweetComments(id) {
  return fetch(`/api/v1/tweets/${id}/comments`, {
    method: "GET",
    headers: new Headers({
      "content-type": "application/json",
    }),
  })
    .catch(() => Promise.reject({ error: "networkError" }))
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return response
        .json()
        .catch((error) => Promise.reject({ error }))
        .then((err) => Promise.reject(err));
    });
}

export function fetchUserPosts() {
  return fetch("/api/v1/posts", {
    method: "GET",
    headers: new Headers({
      "content-type": "application/json",
    }),
  })
    .catch(() => Promise.reject({ error: "networkError" }))
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return response
        .json()
        .catch((error) => Promise.reject({ error }))
        .then((err) => Promise.reject(err));
    });
}

export function fetchUserLikes() {
  return fetch("/api/v1/likes", {
    method: "GET",
    headers: new Headers({
      "content-type": "application/json",
    }),
  })
    .catch(() => Promise.reject({ error: "networkError" }))
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return response
        .json()
        .catch((error) => Promise.reject({ error }))
        .then((err) => Promise.reject(err));
    });
}

export function fetchUserComments() {
  return fetch("/api/v1/comments", {
    method: "GET",
    headers: new Headers({
      "content-type": "application/json",
    }),
  })
    .catch(() => Promise.reject({ error: "networkError" }))
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return response
        .json()
        .catch((error) => Promise.reject({ error }))
        .then((err) => Promise.reject(err));
    });
}

//#endregion
