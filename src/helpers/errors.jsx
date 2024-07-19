const formatError = (mess) => {
  if (mess.startsWith("instance.")) {
    const messArr = mess.split(" ");
    const errMess = messArr[0].slice(9);
    return `Your ${errMess} is invalid`;
  } else if (mess.startsWith("Duplicated username")) {
    return `The username is already taken.`;
  } else {
    return "Please use valid data!";
  }
};

export { formatError };
