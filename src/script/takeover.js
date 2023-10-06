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

function renderImg(img) {
  ctx.clearRect(0, 0, sizes.width, sizes.height);
  ctx.drawImage(img, 0, 0, sizes.width, sizes.height);
}

function renderText(percentage) {
  // ctx.clearRect(0, 0, sizes.width, sizes.height);

  const word = "TAKE OVER";
  const seconds = Math.ceil(percentage);

  console.log("hello?", percentage);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  if (percentage <= 9) {
    const currentText = word.slice(0, seconds);
    strokeText(currentText, "300px", "#FCEB57", true);
  } else {
    if (seconds % 2 == 0) {
      fillText(word, `${300 + 300 * (seconds / 20)}px`);
    } else {
      ctx.clearRect(0, 0, sizes.width, sizes.height);
    }
  }
}

function fillText(
  text = "TAKE OVER",
  size = "300px",
  color = "#FCEB57",
  reverse = false
) {
  ctx.clearRect(0, 0, sizes.width, sizes.height);
  ctx.font = `${size} DharmaGothicC-HeavyItalic`;
  ctx.fillStyle = color;
  let xPos = sizes.width / 2;
  let yPos = sizes.height / 2;

  if (reverse) {
    ctx.translate(0, 0);
    ctx.rotate(Math.PI);

    xPos = 0 - sizes.width / 2;
    yPos = 0 - sizes.height / 2;
  }

  ctx.fillText(text, xPos, yPos);
}

function strokeText(
  text = "TAKE OVER",
  size = "300px",
  color = "#FCEB57",
  reverse = false
) {
  ctx.clearRect(0, 0, sizes.width, sizes.height);
  ctx.font = `${size} DharmaGothicC-HeavyItalic`;
  ctx.strokeStyle = color;
  let xPos = sizes.width / 2;
  let yPos = sizes.height / 2;

  if (reverse) {
    ctx.translate(0, 0);
    ctx.rotate(Math.PI);

    xPos = 0 - sizes.width / 2;
    yPos = 0 - sizes.height / 2;
  }

  ctx.strokeText(text, xPos, yPos);
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

  // load Image
  // const img = new Image();
  // img.src = "../images/takeover/total_frame.jpg";
  // img.onload = () => renderImg(img);

  // black rect bar
  // renderRect();

  // load font
  // show Take Over sequentially
  const myFont = new FontFace(
    "DharmaGothicC-HeavyItalic",
    "url('../fonts/DharmaGothicC-HeavyItalic.ttf')"
  );

  myFont.load().then((font) => {
    document.fonts.add(font);

    console.log("Font loaded");

    // strokeText();

    // tick();
  });

  // const canvas = document.createElement("canvas");
  // const offscreen = canvas.transferControlToOffscreen();
  // const worker = new Worker("/script/worker.js");
  // worker.postMessage({ canvas: offscreen }, [offscreen]);

  // tick();
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

  // renderRect
  // if (!fps || requestAnimationCurrent * 10 <= 110) {
  //   renderRect(requestAnimationCurrent * 10);
  //   window.requestAnimationFrame(tick);
  // }

  // renderText
  if (!fps || requestAnimationCurrent <= 20) {
    renderText(requestAnimationCurrent);
    window.requestAnimationFrame(tick);
  }
}

document.addEventListener("DOMContentLoaded", init);
