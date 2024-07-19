// function that transform default postgreSQL time format into the this time format: hh:mm mm/dd/yy
function formatDateTime(isoString) {
  const date = new Date(isoString);

  // Use UTC methods to get UTC hours and minutes
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  // Use UTC methods to get UTC month, day, and year
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  const year = date.getUTCFullYear().toString().slice(2);

  return `${hours}:${minutes} ${month}/${day}/${year}`;
}

export { formatDateTime };
