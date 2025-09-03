const startBtn = document.getElementById('start-btn');
const startPage = document.getElementById('start-page');
const blinkPage = document.getElementById('blink-page');
const flash = document.querySelector('.flash');

let running = false;
let escHandler = null;

async function blinkOnce(rateHz, flashColor, bgColor) {
  return new Promise(resolve => {
    const r = Math.max(0.01, Number(rateHz));
    const halfMs = 1000 / (r * 2);

    // set transition speed for fade
    flash.style.transition = `opacity ${halfMs / 1000}s linear`;

    // set colors
    flash.style.background = flashColor;
    document.body.style.background = bgColor;

    // fade in
    flash.style.opacity = 1;
    setTimeout(() => {
      // fade out
      flash.style.opacity = 0;
      setTimeout(resolve, halfMs); // wait for fade out
    }, halfMs);
  });
}

async function startBlinking(freq1, freq2, flashColor, bgColor, totalRuntimeMs) {
  running = true;
  let useFirstFreq = true;

  escHandler = e => { if (e.key === 'Escape') stopBlinking(); };
  document.addEventListener('keydown', escHandler);

  const stopAt = Date.now() + totalRuntimeMs;

  while (running && Date.now() < stopAt) {
    const rate = useFirstFreq ? freq1 : freq2;
    await blinkOnce(rate, flashColor, bgColor);
    useFirstFreq = !useFirstFreq;
  }

  stopBlinking();
}

function stopBlinking() {
  if (!running) return;
  running = false;
  document.removeEventListener('keydown', escHandler);
  escHandler = null;

  flash.style.opacity = 0;
  blinkPage.style.display = 'none';
  startPage.style.display = 'flex';
}

startBtn.addEventListener('click', () => {
  const freq1 = parseFloat(document.getElementById('freq1').value) || 4.5;
  const freq2 = parseFloat(document.getElementById('freq2').value) || 12;
  const flashColor = document.getElementById('flashColor').value || '#ff0000';
  const bgColor = document.getElementById('bgColor').value || '#000000';
  const runtimeMinutes = parseFloat(document.getElementById('runtime').value);
  const runtimeMs = Math.max(0, isNaN(runtimeMinutes) ? 5 : runtimeMinutes) * 60 * 1000;

  if (freq1 <= 0 || freq2 <= 0) { alert('Frequencies must be positive numbers.'); return; }

  startPage.style.display = 'none';
  blinkPage.style.display = 'block';

  startBlinking(freq1, freq2, flashColor, bgColor, runtimeMs);
});
