function UserProfileBtn({ title, className, onClickFunction }) {
  return (
    <>
      <button className={className} onClick={onClickFunction}>
        {title}
      </button>
    </>
  );
}
export default UserProfileBtn;
