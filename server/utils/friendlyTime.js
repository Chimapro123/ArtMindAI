const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function friendlyTime(date) {
  const then = new Date(date).getTime();
  const now = Date.now();
  const minutes = Math.floor((now - then) / 60000);
  if (minutes < 1) {
    return "Just now";
  }
  if (minutes < 60) {
    return minutes === 1 ? "1 minute ago" : minutes + " minutes ago";
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return hours === 1 ? "1 hour ago" : hours + " hours ago";
  }
  const days = Math.floor(hours / 24);
  if (days === 1) {
    return "Yesterday";
  }
  if (days < 7) {
    return dayNames[new Date(date).getDay()];
  }
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? "Last week" : weeks + " weeks ago";
  }
  const when = new Date(date);
  return monthNames[when.getMonth()] + " " + when.getFullYear();
}

function dayKey(date) {
  const when = new Date(date);
  const month = String(when.getMonth() + 1).padStart(2, "0");
  const day = String(when.getDate()).padStart(2, "0");
  return when.getFullYear() + "-" + month + "-" + day;
}

function shortDay(date) {
  const when = new Date(date);
  return dayNames[when.getDay()].slice(0, 3) + " " + when.getDate();
}

module.exports = { friendlyTime, dayKey, shortDay, monthNames };
