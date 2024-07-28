import UserChatList from "../../components/UserChatList";
import SearchBox from "../../components/SearchBox";
import IndividualChat from "../../components/IndividualChat";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getTokenFromLocalStorage } from "../../helpers/localStorage";
import "./ChatHomePage.css";

function ChatHomePage() {
  const navigate = useNavigate();
  const loggedInStatus = useSelector((store) => store.loggedIn);
  useEffect(() => {
    const token = getTokenFromLocalStorage();
    if (!loggedInStatus || !token || !token.username) {
      navigate("/");
      return;
    }
  }, [loggedInStatus, navigate]);
  const initialState = {
    username: "",
  };
  const [person, setPerson] = useState(initialState);
  return (
    <div className="ChatHomePage-div">
      <h1 className="ChatHomePage-h1">General List</h1>

      <SearchBox setPerson={setPerson} />
      <div className="ChatHomePage-contact-chat-div">
        <UserChatList setPerson={setPerson} />
        {person.username === "" ? (
          <div className="ChatHomePage-empty"></div>
        ) : null}
        <IndividualChat username={person.username} />
      </div>
    </div>
  );
}
export default ChatHomePage;
