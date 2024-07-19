import { formatDateTime } from "../helpers/formatDateTime";
import "./TextBubble.css";
import { getTokenFromLocalStorage } from "../helpers/localStorage";
function TextBubble({ text, sender, seenByReceiver, time }) {
  let textDivDesign;
  let senderUsernameDesign;
  if (sender === getTokenFromLocalStorage().username) {
    textDivDesign = "TextBubble-text-div-current";
    senderUsernameDesign = "TextBubble-sender-current";
  } else {
    textDivDesign = "TextBubble-text-div-not-current";
    senderUsernameDesign = "TextBubble-sender-not-current";
  }
  return (
    <div className="TextBubble-div">
      <p className={senderUsernameDesign}>
        {sender} {formatDateTime(time)}
      </p>

      <div className={textDivDesign}>
        <p className="TextBubble-text">{text}</p>
        <p className="TextBubble-seen">
          {seenByReceiver ? (
            <span style={{ color: "blue" }}>&#10003;&#10003;</span>
          ) : (
            <span style={{ color: "white" }}>&#10003;</span>
          )}
        </p>
      </div>
    </div>
  );
}

export default TextBubble;
