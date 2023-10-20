document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.body.style.overflow = "unset";
    document.querySelector("nav").style.display = "block";
    init();
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

let canvasImgs = [];
function loadCanvasImage(callback = () => {}) {
  let imgElem;
  let numLoading = 89;
  const onload = () => --numLoading === 0 && callback();
  for (let i = 0; i < numLoading; i += 1) {
    imgElem = new Image();
    imgElem.src = `../images/takeover/canvas/TakeOver_canvas_${100 + i}.webp`;
    canvasImgs.push(imgElem);
    imgElem.onload = onload;
  }
}

function canvasImageAnimation(percentage) {
  let calcedIndex = Math.floor(canvasImgs.length * percentage);
  if (!calcedIndex || calcedIndex < 0) {
    calcedIndex = 0;
  } else if (calcedIndex >= canvasImgs.length) {
    calcedIndex = canvasImgs.length - 1;
  }

  const currentImg = canvasImgs[calcedIndex];
  renderImg(currentImg);
}

function renderText(percentage) {
  // ctx.clearRect(0, 0, sizes.width, sizes.height);

  const word = "TAKE OVER";

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  if (percentage <= 0.5) {
    let wordIndex = Math.ceil(word.length * (percentage / 0.5));
    const currentText = word.slice(0, wordIndex);
    strokeText(currentText, "300px", "#FCEB57", true);
  } else {
    let calcedPercentage = Math.ceil(percentage * 20);

    if (calcedPercentage % 2 == 0) {
      fillText(word, `${300 + 300 * (calcedPercentage / 100)}px`);
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
  let barWidth = Math.floor(sizes.width * percentage);

  let rightBarXPos = sizes.width - barWidth;

  let barHeight = Math.floor(sizes.height / 2);

  // left
  ctx.fillRect(0, 0, barWidth, barHeight);

  // right
  ctx.fillRect(rightBarXPos, barHeight, barWidth, sizes.height - barHeight);
}

// this needs to be changed to another path not #outline.
const paths = [...document.querySelectorAll("#outline path")];

function svgPathAnimation(percentage) {
  for (let i = 0; i < paths.length; i += 1) {
    let path = paths[i];

    let value = 50 * percentage;
    let reverseValue = 50 - value;
    let strokeDasharray = `${reverseValue}% ${value}%`;

    path.style.strokeDasharray = strokeDasharray;
  }
}

/*  diamond animation */
class Shape {
  constructor(x, y, w, h, fill) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.fill = fill;
  }
}

let diamond = [];

function getReadyDiamond() {
  const originalSize = sizes.width;
  const scaledSize = originalSize * 1.4;
  const targetBoxSize = Math.floor(scaledSize / 5);

  let translatedValue = (scaledSize - originalSize) / 2;

  for (let i = 0; i < 25; i += 1) {
    let mok = Math.floor(i / 5);
    let posX = targetBoxSize * (i % 5) - translatedValue;
    let posY = targetBoxSize * mok - translatedValue;
    diamond.push(
      new Shape(posX, posY, targetBoxSize, targetBoxSize, "#ABE9F9")
    );
  }
}

function renderDiamond(percentage) {
  diamond.forEach((cur) => {
    ctx.fillStyle = cur.fill;

    const targetWidth = cur.w * percentage;
    const difference = cur.w - targetWidth;
    const targetX = cur.x + difference / 2;
    const targetY = cur.y + difference / 2;

    ctx.fillRect(targetX, targetY, targetWidth, targetWidth);
  });
}

const xLetter = {
  width: 538,
  height: 347,
  ratio: 0.645,
  img: "",
};

function xLetterAnimation(img, percentage) {
  ctx.clearRect(0, 0, sizes.width, sizes.height);
  let imgWidth = sizes.width * percentage * 8;
  let imgHeight = imgWidth * xLetter.ratio;

  imgWidth = Math.floor(imgWidth);
  imgHeight = Math.floor(imgHeight);

  const startXPoint = Math.floor(sizes.width / 2 - imgWidth / 2);
  const startYPoint = Math.floor(sizes.height / 2 - imgHeight / 2);

  // ctx.beginPath();
  ctx.fillStyle = "#ABE9F9";
  ctx.rect(0, 0, sizes.width, startYPoint);
  ctx.rect(0, startYPoint - 1, startXPoint + 1, imgHeight + 1);
  ctx.rect(
    sizes.width - startXPoint - 1,
    startYPoint - 1,
    startXPoint + 1,
    imgHeight + 1
  );
  ctx.rect(0, sizes.height - startYPoint, sizes.width, sizes.height);
  ctx.fill();
  ctx.clearRect(startXPoint + 8, startYPoint + 8, imgWidth - 8, imgHeight - 8);

  ctx.drawImage(img, startXPoint, startYPoint, imgWidth, imgHeight);
}

function init() {
  resize();

  // black rect bar
  // renderRect();

  // load font
  // show Take Over sequentially
  const myFont = new FontFace(
    "DharmaGothicC-HeavyItalic",
    "url('../fonts/DharmaGothicC-HeavyItalic.ttf')"
  );

  // get ready
  myFont.load().then((font) => {
    document.fonts.add(font);

    getReadyDiamond();

    xLetter.img = new Image();
    xLetter.img.src = `../images/takeover/letter_X_colored.svg`;
    xLetter.img.onload = () => {
      loadCanvasImage(totalAnimation);
      // tick();
    };

    // tick();
  });

  // const canvas = document.createElement("canvas");
  // const offscreen = canvas.transferControlToOffscreen();
  // const worker = new Worker("/script/worker.js");
  // worker.postMessage({ canvas: offscreen }, [offscreen]);
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

let process = ["bar", "text", "diamond", "canvas"];
let processStatus = "bar";

function totalAnimation(fps) {
  if (requestAnimationTimer == null) {
    requestAnimationTimer = fps;
  }

  requestAnimationCurrent = (fps - requestAnimationTimer) / 1000;

  // controll timer

  // renderRect
  if (!fps || requestAnimationCurrent <= 11) {
    if (processStatus != "bar") {
      processStatus = "bar";
      console.log("bar animation start");
    }

    renderRect(requestAnimationCurrent / 10);
    window.requestAnimationFrame(totalAnimation);
  } else if (requestAnimationCurrent <= 11 + 11) {
    if (processStatus != "text") {
      processStatus = "text";

      canvas.style.background = "black";
      console.log("text animation start");
    }

    renderText((requestAnimationCurrent - 11) / 10);
    window.requestAnimationFrame(totalAnimation);
  } else if (requestAnimationCurrent <= 11 + 11 + 11) {
    if (processStatus != "diamond") {
      processStatus = "diamond";

      ctx.translate(sizes.width / 2, -sizes.height / 2);
      ctx.rotate(Math.PI / 4);
      console.log("diamond animation start");
    }

    renderDiamond((requestAnimationCurrent - 11 - 11) / 10);
    window.requestAnimationFrame(totalAnimation);
  } else if (requestAnimationCurrent <= 11 + 11 + 11 + 11) {
    if (processStatus != "xLetter") {
      processStatus = "xLetter";

      ctx.rotate(-Math.PI / 4);
      ctx.translate(-sizes.width / 2, sizes.height / 2);

      canvas.style.background = "unset";
      const outlineSVG = document.querySelector("g#outline");
      const coloredSVG = document.querySelector("g#colored");
      coloredSVG.style.display = "none";
      outlineSVG.style.setProperty("opacity", "1", "important");
      console.log("xLetter animation start");
    }

    xLetterAnimation(
      xLetter.img,
      (requestAnimationCurrent - 11 - 11 - 11) / 10
    );
    window.requestAnimationFrame(totalAnimation);
  } else if (requestAnimationCurrent <= 11 + 11 + 11 + 11 + 5) {
    if (processStatus != "svgPath") {
      processStatus = "svgPath";
      console.log("svgPath animation start");
    }

    svgPathAnimation((requestAnimationCurrent - 11 - 11 - 11 - 11) / 5);
    window.requestAnimationFrame(totalAnimation);
  } else if (requestAnimationCurrent <= 11 + 11 + 11 + 11 + 5 + 11) {
    if (processStatus != "canvas") {
      processStatus = "canvas";

      console.log("canvas animation start");
    }

    canvasImageAnimation(
      (requestAnimationCurrent - 11 - 11 - 11 - 11 - 5) / 10
    );
    window.requestAnimationFrame(totalAnimation);
  }
}

function tick(fps) {
  if (requestAnimationTimer == null) {
    requestAnimationTimer = fps;
  }

  requestAnimationCurrent = (fps - requestAnimationTimer) / 1000;

  // controll timer

  // renderRect
  // if (!fps || requestAnimationCurrent <= 11) {
  //   renderRect(requestAnimationCurrent / 10);
  //   window.requestAnimationFrame(tick);
  // }

  // renderText
  // if (!fps || requestAnimationCurrent <= 20) {
  //   renderText(requestAnimationCurrent / 20);
  //   window.requestAnimationFrame(tick);
  // }

  // svgAnimation
  // if (!fps || requestAnimationCurrent <= 6) {
  //   svgPathAnimation(requestAnimationCurrent / 5);
  //   window.requestAnimationFrame(tick);
  // }

  // canvasImageAnimation
  // if (!fps || requestAnimationCurrent <= 11) {
  //   canvasImageAnimation(requestAnimationCurrent / 10);
  //   window.requestAnimationFrame(tick);
  // }

  // diamondAnimation
  // if (!fps || requestAnimationCurrent <= 11) {
  //   renderDiamond(requestAnimationCurrent / 10);
  //   window.requestAnimationFrame(tick);
  // }

  // xLetter animation
  if (!fps || requestAnimationCurrent <= 11) {
    xLetterAnimation(xLetter.img, requestAnimationCurrent / 10);
    window.requestAnimationFrame(tick);
  }
}

// document.addEventListener("DOMContentLoaded", init);
