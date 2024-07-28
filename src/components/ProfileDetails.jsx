import "./ProfileDetails.css";
function ProfileDetails({
  firstName,
  lastName,
  username,
  gmailAddress,
  bio,
  role,
}) {
  return (
    <div className="ProfileDetails-personal-info-div">
      <p className="ProfileDetails-info">
        <span className="ProfileDetails-info-span">Name:</span> {firstName}{" "}
        {lastName}
      </p>
      <p className="ProfileDetails-info">
        <span className="ProfileDetails-info-span">Username:</span> {username}
      </p>
      <p className="ProfileDetails-info">
        <span className="ProfileDetails-info-span">Gmail Address:</span>{" "}
        {gmailAddress}
      </p>
      <p className="ProfileDetails-info">
        <span className="ProfileDetails-info-span">Bio:</span> {bio}
      </p>
      <p className="ProfileDetails-info">
        <span className="ProfileDetails-info-span">User's role:</span> {role}
      </p>
    </div>
  );
}
export default ProfileDetails;
