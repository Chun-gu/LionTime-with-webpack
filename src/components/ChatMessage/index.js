import styles from './style.module.css';

export default function ChatMessage(message) {
  const myMessage = document.createElement('div');
  myMessage.classList.add(styles['my-message']);

  const messageType = typeof message;
  if (messageType === 'string') {
    const content = document.createElement('p');
    content.classList.add('my', styles['message-content']);
    content.textContent = message;

    myMessage.append(content);
  }
  if (messageType === 'object') {
    const img = document.createElement('img');
    img.classList.add(styles['attached-image']);

    const reader = new FileReader();
    reader.readAsDataURL(message);
    reader.onload = (e) => {
      img.src = e.target.result;
    };

    myMessage.append(img);
  }

  const time = document.createElement('small');
  time.classList.add(styles['time-sended']);
  time.textContent = getCurrentTime();

  myMessage.append(time);

  return myMessage;
}

function getCurrentTime() {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}
