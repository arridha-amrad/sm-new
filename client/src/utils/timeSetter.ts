const timeSetter = (date: Date) => {
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const fromDate = new Date();
  const toDate = date;
  const diff = fromDate.getTime() - toDate.getTime();
  let result = "";
  if (diff >= 0 && diff < 60 * 1000) {
    result = "just now";
  } else if (diff > 60 * 1000 && diff < 60 * 1000 * 60) {
    const minsDiff = Math.floor(diff / 1000 / 60);
    result = `${minsDiff.toString()} minutes ago`;
  } else if (diff > 60 * 60 * 1000 && diff < 60 * 1000 * 60 * 24) {
    const hourDiff = Math.floor(diff / 1000 / 60 / 60);
    result = `${hourDiff.toString()} hours ago`;
  } else {
    const date = toDate.getDate();
    const m = month[toDate.getMonth()];
    const year = toDate.getFullYear();
    result = `${date} ${m} ${year}`;
  }
  return result;
};

export default timeSetter;
