import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ChatApi from "../../api";
import { getTokenFromLocalStorage } from "../../helpers/localStorage";
import { useSelector, useDispatch } from "react-redux";
import IndividualChat from "../../components/IndividualChat";
import FavouriteBtn from "../../components/FavouriteBtn";
import "./UserPage.css";

function UserPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedInStatus = useSelector((store) => store.loggedIn);
  const { username } = useParams();

  const initialState = {
    username: "",
    firstName: "",
    lastName: "",
    gmailAddress: "",
    bio: "",
    isAdmin: "",
  };

  const [userInfo, setUserInfo] = useState(initialState);
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [chatUsername, setChatUsername] = useState("");
  const [communicated, setCommunicated] = useState(false);

  const token = getTokenFromLocalStorage();

  useEffect(() => {
    if (!loggedInStatus) {
      navigate("/");
      return;
    }

    if (!token || !token.username) {
      navigate("/");
      return;
    }
    async function fetchData(userUsername) {
      try {
        const userObj = await ChatApi.getUser(userUsername);
        const { username, firstName, lastName, gmailAddress, bio, isAdmin } =
          userObj;
        setUserInfo({
          ...initialState,
          username,
          firstName,
          lastName,
          gmailAddress,
          bio,
          isAdmin,
        });

        const newUserCheck = await ChatApi.getConversation(
          token.username,
          username
        );

        if (newUserCheck.conversation.length > 0) {
          setCommunicated(true);
        } else if ((newUserCheck.conversation.length = 0)) {
          setCommunicated(false);
        }
      } catch (e) {
        console.error(e);

        navigate("/");
      }
    }
    fetchData(username);
    return () => {
      setCommunicated(false);
    };
  }, [username, loggedInStatus, navigate]);

  let role;
  userInfo.isAdmin ? (role = "Admin") : (role = "App User");

  let showBtn = token && token.username === username;

  const handleEditBtn = () => {
    navigate(`/edit`);
  };

  const handleDeleteWarning = async () => {
    setDeleteMessage(true);
  };

  const handleDeleteWarningCancel = async () => {
    setDeleteMessage(false);
  };

  const handleLogout = () => {
    ChatApi.token = "";
    localStorage.removeItem("authToken");
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  const handleDelete = async () => {
    try {
      const deleteUser = userInfo.username;
      await ChatApi.deleteAccount(deleteUser);
      handleLogout();
    } catch (e) {
      console.error(e);
    }
  };

  const handleChat = () => {
    setChatUsername(userInfo.username);
  };

  return (
    <>
      {deleteMessage && (
        <>
          <p>Are you sure you want to delete your account?</p>
          <button onClick={handleDelete}>Yes</button>
          <button onClick={handleDeleteWarningCancel}>No</button>
        </>
      )}
      <h1 className="UserPage-h1">User Profile</h1>
      {communicated && (
        <>
          <FavouriteBtn
            currentUser={token.username}
            addUser={userInfo.username}
            communicated={communicated}
          />
        </>
      )}
      <div className="UserPage-personal-info-div">
        <p className="UserPage-info">
          <span className="UserPage-info-span">Name:</span> {userInfo.firstName}{" "}
          {userInfo.lastName}
        </p>
        <p className="UserPage-info">
          <span className="UserPage-info-span">Username:</span>{" "}
          {userInfo.username}
        </p>
        <p className="UserPage-info">
          <span className="UserPage-info-span">Gmail Address:</span>{" "}
          {userInfo.gmailAddress}
        </p>
        <p className="UserPage-info">
          <span className="UserPage-info-span">Bio:</span> {userInfo.bio}
        </p>
        <p className="UserPage-info">
          <span className="UserPage-info-span">User's role:</span> {role}
        </p>
      </div>
      {showBtn && (
        <div className="UserPage-edit-delete-div">
          <button className="UserPage-edit-btn" onClick={handleEditBtn}>
            Edit
          </button>
          <button className="UserPage-delete-btn" onClick={handleDeleteWarning}>
            Delete Profile
          </button>
        </div>
      )}

      {!showBtn && (
        <>
          <button className="UserPage-chat-btn" onClick={handleChat}>
            Chat
          </button>
          <IndividualChat username={chatUsername} chatInProfilePage={true} />
        </>
      )}
    </>
  );
}

export default UserPage;
