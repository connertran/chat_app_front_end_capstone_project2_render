import "./EachUserInChatList.css";
function EachUserInChatList({ username, onClick }) {
  return (
    <>
      <div className="EachUserInChatList-div" onClick={onClick}>
        <p className="EachUserInChatList-username">{username}</p>
      </div>
    </>
  );
}

export default EachUserInChatList;
