import EachUserInChatList from "./EachUserInChatList";
import { useState, useEffect } from "react";
import ChatApi from "../api";
import { getTokenFromLocalStorage } from "../helpers/localStorage";
import "./UserChatList.css";
function UserChatList({ setPerson }) {
  const [contactedUsersList, setContactedUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPastConversations(username) {
      try {
        const allConversations = await ChatApi.getAllContactedUsers(username);
        const currentUserObj = await ChatApi.getUser(username);
        const currentUserId = currentUserObj.id;

        const contactedUsers = await Promise.all(
          allConversations.map(async (eachConversation) => {
            const contactedUserId =
              eachConversation.userOne !== currentUserId
                ? eachConversation.userOne
                : eachConversation.userTwo;
            const contactedUserObj = await ChatApi.getUserById(contactedUserId);
            return {
              username: contactedUserObj.username,
            };
          })
        );

        setContactedUsersList(contactedUsers);
      } catch (error) {
        console.error("Failed to fetch past conversations", error);
      } finally {
        setLoading(false);
      }
    }

    const localStorageObj = getTokenFromLocalStorage();
    if (localStorageObj) {
      ChatApi.token = localStorageObj.token;
      fetchPastConversations(localStorageObj.username);
    } else {
      setLoading(false);
    }
  }, []);

  function handleClick(username) {
    setPerson((person) => ({
      ...person,
      username: username,
    }));
  }

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="UserChatList-div">
      <h2>Your contacts:</h2>
      {contactedUsersList.length > 0 ? (
        contactedUsersList.map((user, index) => (
          <EachUserInChatList
            key={index}
            onClick={() => handleClick(user.username)}
            username={user.username}
          />
        ))
      ) : (
        <div>No contacts found.</div>
      )}
    </div>
  );
}

export default UserChatList;
