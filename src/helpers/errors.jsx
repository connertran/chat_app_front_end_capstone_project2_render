function errorStringEdit(str) {
  const messArr = str.split(" ");
  const specificError = messArr[0].slice(9);
  messArr.shift();
  return specificError + " " + messArr.join(" ");
}
const formatError = (mess) => {
  if (mess.startsWith("instance")) {
    const errorMess = errorStringEdit(mess);
    return `Your ${errorMess}.`;
  } else if (mess.startsWith("Duplicated username")) {
    return `The username is already taken.`;
  } else {
    return "Please use valid data!";
  }
};

export { formatError };
