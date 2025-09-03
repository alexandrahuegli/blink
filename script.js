const startBtn = document.getElementById('start-btn');
const startPage = document.getElementById('start-page');
const blinkPage = document.getElementById('blink-page');
const flash = document.querySelector('.flash');

let running = false;
let useFirst = true;
let currentInterval = null;
let escHandler = null;

function blinkOnce(rateHz) {
  return new Promise((resolve) => {
    // safety: minimum positive rate
    const r = Math.max(0.01, Number(rateHz));
    const halfMs = 1000 / (r * 2); // time for half-cycle
    let halfCount = 0;
    // ensure starting from off (black) so each blink is on->off
    flash.style.background = 'black';
    currentInterval = setInterval(() => {
      if (!running) {
        clearInterval(currentInterval);
        currentInterval = null;
        resolve();
        return;
      }
      // toggle
      flash.style.background = (flash.style.background === 'red') ? 'black' : 'red';
      halfCount++;
      if (halfCount >= 2) { // completed one full blink (on+off)
        clearInterval(currentInterval);
        currentInterval = null;
        resolve();
      }
    }, halfMs);
  });
}

async function startBlinking(freq1, freq2, totalRuntimeMs) {
  // reset / initialize
  running = true;
  useFirst = true;
  flash.style.background = 'black';

  // ESC to stop
  escHandler = (e) => { if (e.key === 'Escape') stopBlinking(); };
  document.addEventListener('keydown', escHandler);

  const stopAt = Date.now() + totalRuntimeMs;

  while (running && Date.now() < stopAt) {
    const rate = useFirst ? freq1 : freq2;
    useFirst = !useFirst;
    // await one blink cycle at the selected frequency
    await blinkOnce(rate);
    // loop continues until time up or ESC pressed
  }

  // end cleanly
  stopBlinking();
}

function stopBlinking() {
  // prevent re-entrancy
  if (!running) return;
  running = false;

  if (currentInterval) {
    clearInterval(currentInterval);
    currentInterval = null;
  }
  if (escHandler) {
    document.removeEventListener('keydown', escHandler);
    escHandler = null;
  }

  // UI reset
  flash.style.background = 'black';
  blinkPage.style.display = 'none';
  startPage.style.display = 'flex';
}

startBtn.addEventListener('click', () => {
  const freq1 = parseFloat(document.getElementById('freq1').value) || 4.5;
  const freq2 = parseFloat(document.getElementById('freq2').value) || 12;
  const runtimeMinutes = parseFloat(document.getElementById('runtime').value);
  const runtimeMs = Math.max(0, isNaN(runtimeMinutes) ? 5.5 : runtimeMinutes) * 60 * 1000;

  // quick validation
  if (freq1 <= 0 || freq2 <= 0) {
    alert('Frequencies must be positive numbers.');
    return;
  }

  startPage.style.display = 'none';
  blinkPage.style.display = 'block';

  // start (async)
  startBlinking(freq1, freq2, runtimeMs);
});
