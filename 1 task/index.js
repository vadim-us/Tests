const inputEl = document.querySelector('input');
const buttonEl = document.querySelector('button');
const timerEl = document.querySelector('span');

// Напишите реализацию createTimerAnimator
// который будет анимировать timerEl
const createTimerAnimator = () => {
  let timer;
  let date = new Date();

  return (seconds) => {    
    clearTimeout(timer);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(seconds);

    let formatHours = date.getHours();
    let formatMinutes = date.getMinutes();
    let formatSeconds = date.getSeconds();

    if (formatHours < 10) formatHours = `0${formatHours}`;
    if (formatMinutes < 10) formatMinutes = `0${formatMinutes}`;
    if (formatSeconds < 10) formatSeconds = `0${formatSeconds}`;

    timerEl.innerHTML = `${formatHours}:${formatMinutes}:${formatSeconds}`;

    if (--seconds >= 0) {
      timer = setTimeout(() => {
        animateTimer(seconds);
      }, 1000);
    }
  };
};

const animateTimer = createTimerAnimator();

inputEl.addEventListener('input', () => {
  // Очистите input так, чтобы в значении
  // оставались только числа
  let value = inputEl.value;
  inputEl.value = value.replace(RegExp(/\D/), '');
});

buttonEl.addEventListener('click', () => {
  const seconds = Number(inputEl.value);

  animateTimer(seconds);

  inputEl.value = '';
});