function saveTokenToLocalStorage({ username, token }) {
  try {
    localStorage.setItem("authToken", JSON.stringify({ username, token }));
  } catch (error) {
    console.error("Failed to save token to local storage:", error);
  }
}

function getTokenFromLocalStorage() {
  try {
    const tokenString = localStorage.getItem("authToken");
    return tokenString ? JSON.parse(tokenString) : null;
  } catch (error) {
    console.error("Failed to retrieve token from local storage:", error);
    return null;
  }
}

export { saveTokenToLocalStorage, getTokenFromLocalStorage };
