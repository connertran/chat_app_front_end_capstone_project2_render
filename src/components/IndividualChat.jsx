import ChatBox from "./ChatBox";
import ChatApi from "../api";
import { getTokenFromLocalStorage } from "../helpers/localStorage";
import { useState, useEffect } from "react";

function IndividualChat({ username, chatInProfilePage = false }) {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;

    async function fetchConversation() {
      const userLocal = getTokenFromLocalStorage();
      try {
        const getCurrentUserId = await ChatApi.getUser(userLocal.username);
        setCurrentUserId(getCurrentUserId.id);
        const conversationData = await ChatApi.getConversation(
          userLocal.username,
          username
        );
        setConversation(conversationData);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    }

    fetchConversation();
  }, [username]);

  if (!username) {
    return null;
  }

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ChatBox
          username={username}
          currentUserId={currentUserId}
          conversation={conversation}
          chatInProfilePage={chatInProfilePage}
        />
      )}
    </div>
  );
}

export default IndividualChat;
