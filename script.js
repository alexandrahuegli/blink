const flash = document.querySelector('.flash');
let state = false;

function blink(rateHz, durationMs) {
  const interval = 1000 / (rateHz*2); // Calculate interval for half cycle
  let elapsed = 0;
  const timer = setInterval(() => {
    state = !state;
    flash.style.opacity = state ? '1' : '0 ';
    elapsed += interval;
    if (elapsed >= durationMs) clearInterval(timer);
  }, interval);
}

function loop() {
  blink(4.5, 1000); // Blink at 4.5 Hz for 1 second
  setTimeout(() => {
    blink(12, 1000); // Blink at 12 Hz for 1 second
  }, 1000); // Start after 1 second
  setTimeout(loop, 2000); // Repeat every 2 seconds
}

// function loop() {
//   const blink4_5Duration = 1000 / 4.5; // One complete cycle at 4.5 Hz
//   const blink12Duration = 1000 / 12; // One complete cycle at 12 Hz

//   blink(4.5, blink4_5Duration); // One blink at 4.5 Hz
//   setTimeout(() => {
//     blink(12, blink12Duration); // One blink at 12 Hz
//   }, blink4_5Duration);

//   setTimeout(loop, blink4_5Duration + blink12Duration); // Wait for both blinks to complete
// }

loop(); // Start the loop
