import "../setupTests";
import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import ChatBox from "./ChatBox";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import rootReducer from "../../Redux/rootReducer";
import { Provider } from "react-redux";
import { createStore } from "redux";
import ChatApi from "../api";
import { act } from "react";
// websocket: socket.io testing
import { Server } from "socket.io";
import { io as Client } from "socket.io-client";

let store;

const setupStore = () => {
  store = createStore(rootReducer);
};

beforeAll((done) => {
  ioServer = new Server(8000);
  ioServer.on("connection", (socket) => {
    socket.on("join room", (username) => {
      socket.join(username);
    });

    socket.on("chat message", (message) => {
      const parsedMessage = JSON.parse(message);
      ioServer
        .to(parsedMessage.sender)
        .emit("receive message", JSON.stringify(parsedMessage));
      ioServer
        .to(parsedMessage.receiver)
        .emit("receive message", JSON.stringify(parsedMessage));
    });

    socket.on("read messages", ({ receiver, sender }) => {
      ioServer.to(sender).emit("read messages update", {
        sender,
        receiver,
        newSeenMessages: [1, 2, 3],
      });
    });
  });

  clientSocket = new Client("http://localhost:8000");
  clientSocket.on("connect", done);
});

afterAll(() => {
  ioServer.close();
  clientSocket.close();
});

beforeEach(() => {
  ChatApi.token = undefined;
  localStorage.removeItem("authToken");

  setupStore();
});

afterEach(() => {
  ChatApi.token = undefined;
  localStorage.removeItem("authToken");
});

// Test form submission and API call
jest.mock("../api", () => ({
  getUser: jest.fn(),
  sendMessages: jest.fn(),
}));

// Mock the scrollIntoView function
window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock Socket Server and Client
let ioServer, clientSocket;

test("Chat box sends and receives messages via socket.io", async () => {
  const user = {
    username: "testuser",
  };
  const otherUser = "otheruser";
  const message = "Hello, World!";
  const message2 = "Test2";

  // Dispatch login action and set up initial state
  store.dispatch({
    type: "LOGIN",
    payload: user,
  });

  // Mock API call to retrieve user info
  ChatApi.getUser.mockResolvedValueOnce({
    ...user,
    firstName: "Test",
    lastName: "User",
    gmailAddress: "testuser@gmail.com",
    bio: "I am a test user",
  });

  // Mock localStorage token
  localStorage.setItem(
    "authToken",
    JSON.stringify({ username: "testuser", token: "fakeToken" })
  );

  let getByPlaceholderText, getByText;

  // Render ChatBox component with mocked data and providers
  await act(async () => {
    ({ getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <Router>
          <ChatBox
            username={otherUser}
            currentUserId={1}
            conversation={{ conversation: [] }}
            chatInProfilePage={false}
          />
        </Router>
      </Provider>
    ));
  });

  // Spy on clientSocket.emit to monitor socket emits
  jest.spyOn(clientSocket, "emit");

  // Simulate user input and message send action
  const input = getByPlaceholderText("Send Message");
  fireEvent.change(input, { target: { value: message } });

  const sendButton = getByText("Send");
  fireEvent.click(sendButton);

  // Wait for the message to be emitted via socket
  await waitFor(() => {
    expect(getByText(message)).toBeInTheDocument();
  });

  // Simulate receiving a message from otherUser
  act(() => {
    ioServer.emit(
      "receive message",
      JSON.stringify({
        id: 1,
        text: message2,
        sender: otherUser,
        receiver: user.username,
        time: "12:00 02/29/20",
      })
    );
  });

  // Wait for the message to appear in the UI
  await waitFor(() => {
    expect(getByText(message2)).toBeInTheDocument();
  });
});
