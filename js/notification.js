let timerNotificationSound = new Howl({
  src: ["assets/sounds/timer-notification.mp3"],
  volume: 0.3,
});

let breakNotificationSound = new Howl({
  src: ["assets/sounds/break-notification.mp3"],
  volume: 0.3,
});

// Desktop notification when timer ends
function notifyMe() {
  if (!window.Notification) {
    console.log('Browser does not support notifications.');
  } else {
    // check if permission is already granted
    if (Notification.permission === 'granted') {
      // show notification here
      let notify = new Notification('Break Ended!', {
        body: 'Please continue your work',
        icon: 'https://img.icons8.com/ios/50/ffffff/timer.png',
      });
    } else {
      // request permission from user
      Notification.requestPermission().then(function (p) {
        if (p === 'granted') {
          // show notification here
          let notify = new Notification('Break Ended!', {
            body: 'Please continue your work?',
            icon: 'https://img.icons8.com/ios/50/ffffff/timer.png',
          });
        } else {
          console.log('User blocked notifications.');
        }
      }).catch(function (err) {
        console.error(err);
      });
    }
  }
}

export {
  timerNotificationSound,
  breakNotificationSound,
  notifyMe
};