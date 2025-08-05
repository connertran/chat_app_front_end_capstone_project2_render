import axios from "axios";

// const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000";

class ChatApi {
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;

    const headers = { Authorization: `Bearer ${ChatApi.token}` };

    const params = data;

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Erorr:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Signup for site
  static async signup(data) {
    let res = await this.request(`auth/register`, data, "post");
    return res.newUser;
  }

  // Login for site
  static async login(data) {
    let res = await this.request(`auth/login`, data, "post");
    return res.user;
  }

  // Get user from backend by username
  static async getUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  // Get user from backend by user id
  static async getUserById(id) {
    let res = await this.request(`users/id/${id}`);
    return res.user;
  }

  // Update user
  static async updateUser(data) {
    const { username, password, firstName, lastName, gmailAddress, bio } = data;
    let res = await this.request(
      `users/${username}`,
      { password, firstName, lastName, gmailAddress, bio },
      "patch"
    );
    return res.user;
  }

  // Delete user from db
  static async deleteAccount(username) {
    let res = await this.request(`users/${username}`, {}, "delete");
    return res;
  }

  // Send messages to app users
  static async sendMessages(username, text) {
    const data = {
      text: text,
    };
    let res = await this.request(`messages/send/${username}`, data, "post");
    return res;
  }

  // Get message from backend by its id
  static async getMessageById(id) {
    let res = await this.request(`messages/${id}`);
    return res.message;
  }

  // Read message
  static async readMessage(id) {
    let res = await this.request(`messages/seen/${id}`, {}, "patch");
    return res.seenMessage;
  }

  // get a conversation between two people
  static async getConversation(userOne, userTwo) {
    let res = await this.request(`messages/conversation/${userOne}/${userTwo}`);
    return res;
  }

  // get all past conversations
  static async getAllContactedUsers(username) {
    let res = await this.request(`chat-history/${username}`);
    return res.conversations;
  }

  // get all users from favourite list; given user's username
  static async getAllFavouriteUsers(username) {
    const currentUser = await ChatApi.getUser(username);
    const currentUserId = currentUser.id;
    let res = await this.request(`favourite/${currentUserId}`);
    return res.favourite;
  }

  // Helper method to get user IDs
  static async getUserIds(usernames) {
    const userIds = await Promise.all(
      usernames.map(async (username) => {
        const user = await ChatApi.getUser(username);
        return user.id;
      })
    );
    return userIds;
  }

  // add a user to the favourite list
  static async addUserToFavouriteList(user, addedUser) {
    const [currentUserId, addedUserId] = await ChatApi.getUserIds([
      user,
      addedUser,
    ]);
    let res = await this.request(
      `favourite/`,
      { sender: currentUserId, receiver: addedUserId },
      "post"
    );
    return res.favourite;
  }

  // remove a user from the favourite list
  static async removeUserFromFavouriteList(user, addedUser) {
    const [currentUserId, addedUserId] = await ChatApi.getUserIds([
      user,
      addedUser,
    ]);
    let res = await this.request(
      `favourite/`,
      { sender: currentUserId, receiver: addedUserId },
      "delete"
    );
    return res.favourite;
  }
}

export default ChatApi;
