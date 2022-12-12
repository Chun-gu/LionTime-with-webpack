const currentTime = document.querySelector('.current-time');

export default function StatusBar() {
  paintCurrentTime();
  setInterval(paintCurrentTime, 60000);
}

function paintCurrentTime() {
  const date = new Date();
  let hour = date.getHours();
  let min = date.getMinutes();

  if (hour < 10) {
    hour = '0' + hour;
  }
  if (min < 10) {
    min = '0' + min;
  }
  if (hour > 12) {
    currentTime.textContent = `${hour - 12}:${min} PM`;
  } else {
    currentTime.textContent = `${hour}:${min} AM`;
  }
}
