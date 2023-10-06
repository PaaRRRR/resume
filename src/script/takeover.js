document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.body.style.overflow = "unset";
    document.querySelector("nav").style.display = "block";
  }, 3000);
});

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// this is for data gui test
let settings = {};

window.addEventListener("resize", resize);

function resize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  canvas.width = sizes.width;
  canvas.height = sizes.height;

  highResolution();
  console.log("hello? resize");
}

function render() {
  console.log("rerender!!");

  ctx.clearRect(0, 0, sizes.width, sizes.height);
}

function renderText() {
  ctx.clearRect(0, 0, sizes.width, sizes.height);

  ctx.fillStyle = "#FCEB57";
  ctx.strokeStyle = "white";
  ctx.font = "300px DharmaGothicC-HeavyItalic";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText("TAKE OVER", sizes.width / 2, sizes.height / 2);
}

function renderRect(percentage) {
  let barWidth = Math.floor((sizes.width * percentage) / 100);

  let rightBarXPos = sizes.width - barWidth;

  let barHeight = Math.floor(sizes.height / 2);

  // left
  ctx.fillRect(0, 0, barWidth, barHeight);

  // right
  ctx.fillRect(rightBarXPos, barHeight, barWidth, sizes.height - barHeight);
}

function init() {
  resize();

  // const canvas = document.createElement("canvas");
  // const offscreen = canvas.transferControlToOffscreen();
  // const worker = new Worker("/script/worker.js");
  // worker.postMessage({ canvas: offscreen }, [offscreen]);

  tick();
}

function highResolution() {
  // Get the DPR and size of the canvas
  const dpr = window.devicePixelRatio;
  const rect = canvas.getBoundingClientRect();

  // Set the "actual" size of the canvas
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  // Scale the context to ensure correct drawing operations
  ctx.scale(dpr, dpr);

  // Set the "drawn" size of the canvas
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
}

let requestAnimationTimer = null;
let requestAnimationCurrent;
function tick(fps) {
  if (requestAnimationTimer == null) {
    requestAnimationTimer = fps;
  }

  requestAnimationCurrent = (fps - requestAnimationTimer) / 1000;

  // controll timer
  if (!fps || requestAnimationCurrent * 10 <= 110) {
    renderRect(requestAnimationCurrent * 10);
    window.requestAnimationFrame(tick);
  }
}

document.addEventListener("DOMContentLoaded", init);
