let timerNotificationSound = new Howl({
  src: ["assets/sounds/timer-notification.mp3"],
  volume: 0.3,
});

let breakNotificationSound = new Howl({
  src: ["assets/sounds/break-notification.mp3"],
  volume: 0.3,
});


export {
  timerNotificationSound, breakNotificationSound
};