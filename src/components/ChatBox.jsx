import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./ChatBox.css";
import ChatApi from "../api";
import TextBubble from "./TextBubble";
import { getTokenFromLocalStorage } from "../helpers/localStorage";
import { useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faFaceSmile,
  faFaceRollingEyes,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
library.add(faFaceSmile, faFaceRollingEyes, faUser);

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000";
let socket = io(BASE_URL);

function ChatBox({ username, currentUserId, conversation, chatInProfilePage }) {
  const navigate = useNavigate();
  const initialState = {
    mess: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chatInputFocus, setChatInputFocus] = useState(false);

  const messagesEndRef = useRef(null); // Reference to the end of messages

  useEffect(() => {
    async function fetchMessages() {
      if (conversation && conversation.conversation.length > 0) {
        setLoadingMessages(true);
        const messagePromises = conversation.conversation.map(
          async (eachMess) => {
            const res = await ChatApi.getMessageById(eachMess.messageId);
            let sender;
            eachMess.sender === currentUserId
              ? (sender = getTokenFromLocalStorage().username)
              : (sender = username);
            if (eachMess.receiver === currentUserId) {
              await ChatApi.readMessage(eachMess.messageId);
              res.seen = true;
            }
            return {
              id: res.id,
              text: res.text,
              sender,
              time: res.time,
              seenByReceiver: res.seen,
            };
          }
        );
        const messageData = await Promise.all(messagePromises);
        setMessages(messageData);
        setLoadingMessages(false);
      }
    }
    fetchMessages();

    const userLocal = getTokenFromLocalStorage();
    socket.emit("join room", userLocal.username);

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("receive message", (message) => {
      // console.log("Received message:", message);
      const parsedMessage = JSON.parse(message);

      if (
        (parsedMessage.sender === userLocal.username &&
          parsedMessage.receiver === username) ||
        (parsedMessage.sender === username &&
          parsedMessage.receiver === userLocal.username)
      ) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: parsedMessage.id,
            text: parsedMessage.text,
            time: parsedMessage.time,
            sender: parsedMessage.sender,
            seenByReceiver: false,
          },
        ]);
      }
    });

    return () => {
      socket.off("receive message");
    };
  }, [conversation, currentUserId, username]);

  useEffect(() => {
    // Scroll to the bottom of the messages list when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.on(
      "read messages update",
      ({ sender, receiver, newSeenMessages }) => {
        if (
          (sender === getTokenFromLocalStorage().username &&
            receiver === username) ||
          (sender === username &&
            receiver === getTokenFromLocalStorage().username)
        ) {
          setMessages((prevMessages) =>
            prevMessages.map((message) => ({
              ...message,
              id: message.id,
              seenByReceiver: newSeenMessages.includes(message.id)
                ? true
                : message.seenByReceiver,
            }))
          );
        }
      }
    );
    setChatInputFocus(false);
    return () => {
      socket.off("read messages update");
    };
  }, [username, chatInputFocus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };

  const handleFocus = () => {
    socket.emit("read messages", {
      receiver: getTokenFromLocalStorage().username,
      sender: username,
    });
    setChatInputFocus(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSend(true);
    try {
      const res = await ChatApi.sendMessages(username, formData.mess);

      setFormData(initialState);
      const newMessage = {
        text: formData.mess,
        sender: getTokenFromLocalStorage().username,
      };

      socket.emit("chat message", JSON.stringify(newMessage));

      setLoadingSend(false);
    } catch (e) {
      console.log(`The error is: ${e}`);
      setError("User doesn't exist");
      setLoadingSend(false);
    }
  };

  const handleEmojiClick = (event) => {
    setFormData((formData) => ({
      ...formData,
      mess: formData.mess + event.emoji,
    }));
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  function handleInfo() {
    navigate(`/users/${username}`);
  }

  let chatMessages = [];
  if (messages.length > 0) {
    chatMessages = messages.map(
      (message, index) =>
        message &&
        message.text &&
        message.sender && (
          <TextBubble
            key={index}
            text={message.text}
            sender={message.sender}
            time={message.time}
            seenByReceiver={message.seenByReceiver}
          />
        )
    );
  }

  return (
    <div className="ChatBox-chat-box">
      <div className="ChatBox-receiver-name">
        <p>{username}</p>
      </div>

      <div className="ChatBox-all-messages">
        {loadingMessages ? <p>Loading messages...</p> : chatMessages}
        <div ref={messagesEndRef} />
      </div>
      <form className="ChatBox-form" onSubmit={handleSubmit}>
        <textarea
          className="ChatBox-form-textarea"
          id="mess"
          type="text"
          name="mess"
          placeholder="Send Message"
          value={formData.mess}
          onChange={handleChange}
          onFocus={handleFocus}
          required
        />
        <button
          className="ChatBox-send-btn"
          type="submit"
          disabled={loadingSend}
        >
          {loadingSend ? "..." : "Send"}
        </button>
        <div className="ChatBox-emoji-picker-container">
          <button
            className="ChatBox-emoji-btn"
            type="button"
            onClick={toggleEmojiPicker}
          >
            {showEmojiPicker ? (
              <FontAwesomeIcon
                icon={["fa", "face-rolling-eyes"]}
                style={{ color: "#FFD43B" }}
                className="ChatBox-emoji"
              />
            ) : (
              <FontAwesomeIcon
                icon={["fa", "face-smile"]}
                style={{ color: "#FFD43B" }}
                className="ChatBox-emoji"
              />
            )}
          </button>
          {showEmojiPicker && (
            <EmojiPicker
              className="ChatBox-emoji-picker"
              onEmojiClick={handleEmojiClick}
            />
          )}
        </div>
        {!chatInProfilePage && (
          <button className="ChatBox-info-btn" onClick={handleInfo}>
            {
              <FontAwesomeIcon
                icon={["fa-solid", "fa-user"]}
                style={{ color: "#63E6BE" }}
                className="ChatBox-info"
              />
            }
          </button>
        )}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default ChatBox;
