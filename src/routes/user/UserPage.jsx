import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ChatApi from "../../api";
import { getTokenFromLocalStorage } from "../../helpers/localStorage";
import { useSelector, useDispatch } from "react-redux";
import IndividualChat from "../../components/IndividualChat";
import FavouriteBtn from "../../components/FavouriteBtn";
import "./UserPage.css";
import UserProfileBtn from "../../components/UserProfileBtn";
import ProfileDetails from "../../components/ProfileDetails";

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
        <div className="UserPage-delete-mess-div">
          <p className="UserPage-delete-mess">
            Are you sure you want to delete your account?
          </p>
          <UserProfileBtn
            title={"Yes"}
            className={"UserPage-delete-mess-yes"}
            onClickFunction={handleDelete}
          />
          <UserProfileBtn
            title={"No"}
            className={"UserPage-delete-mess-no"}
            onClickFunction={handleDeleteWarningCancel}
          />
        </div>
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
      <ProfileDetails
        firstName={userInfo.firstName}
        lastName={userInfo.lastName}
        username={userInfo.username}
        gmailAddress={userInfo.gmailAddress}
        bio={userInfo.bio}
        role={role}
      />
      {showBtn && (
        <div className="UserPage-edit-delete-div">
          <UserProfileBtn
            title={"Edit"}
            className={"UserPage-edit-btn"}
            onClickFunction={handleEditBtn}
          />
          <UserProfileBtn
            title={"Delete Profile"}
            className={"UserPage-delete-btn"}
            onClickFunction={handleDeleteWarning}
          />
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
