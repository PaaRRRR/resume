class BannerHighlight extends HTMLElement {
  constructor() {
    super();

    this.init();
  }

  init() {
    this.stickyElement = this.querySelector("[data-banner-sticky]");
    this.contrastElement = this.querySelector("[data-banner-contrast]");
    this.canvas = this.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.getVariables();

    this.getStartingPoint();
    this.setAnimationValue();

    window.addEventListener("scroll", this.scrollHandler.bind(this));
    window.addEventListener("resize", this.resizeHandler.bind(this));

    this.resizeHandler();
  }

  resizeHandler() {
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;

    this.highResolution();
  }

  highResolution() {
    // Get the DPR and size of the canvas
    const dpr = window.devicePixelRatio;
    const rect = this.canvas.getBoundingClientRect();

    // Set the "actual" size of the canvas
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    // Scale the context to ensure correct drawing operations
    this.ctx.scale(dpr, dpr);

    // Set the "drawn" size of the canvas
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
  }

  loadHandler() {
    const svgWrapper = document.querySelector(".svg-wrapper");
    svgWrapper.classList.add("intro");

    setTimeout(() => {
      document.body.style.overflow = "unset";
      document.querySelector("nav").style.display = "block";
      this.totalAnimation();
    }, 3000);
  }

  getVariables() {
    this.canvasImages = [];
    this.xLetter = {
      width: 538,
      height: 347,
      ratio: 0.645,
      img: "",
    };
    this.diamond = [];
    this.paths = [...document.querySelectorAll("#outline path")];
    this.animation_status = "bar";

    this.requestAnimationTimer = null;
    this.requestAnimationCurrent;

    this.loadDiamond();
    let loadCount = 3;
    const onload = () => --loadCount === 0 && this.loadHandler();
    this.loadCanvasImage(onload);
    this.loadFont(onload);
    this.loadXLetter(onload);
  }

  loadCanvasImage(callback = () => {}) {
    let imgElem;
    let numLoading = 89;
    const onload = () => --numLoading === 0 && callback();
    for (let i = 0; i < numLoading; i += 1) {
      imgElem = new Image();
      imgElem.src = `../images/takeover/canvas/TakeOver_canvas_${100 + i}.webp`;
      this.canvasImages.push(imgElem);
      imgElem.onload = onload;
    }
  }

  loadDiamond() {
    let row_num = 8;
    const originalSize = this.sizes.width;
    const scaledSize = originalSize * 1.4;
    const targetBoxSize = Math.floor(scaledSize / row_num);

    let translatedValue = (scaledSize - originalSize) / 2;

    for (let i = 0; i < row_num * row_num; i += 1) {
      let mok = Math.floor(i / row_num);
      let posX = targetBoxSize * (i % row_num) - translatedValue;
      let posY = targetBoxSize * mok - translatedValue;
      this.diamond.push(
        new Shape(posX, posY, targetBoxSize, targetBoxSize, "#ABE9F9")
      );
    }
  }

  loadFont(callback = () => {}) {
    const myFont = new FontFace(
      "DharmaGothicC-HeavyItalic",
      "url('../fonts/DharmaGothicC-HeavyItalic.ttf')"
    );

    myFont.load().then((font) => {
      document.fonts.add(font);
      callback();
    });
  }

  loadXLetter(callback = () => {}) {
    this.xLetter.img = new Image();
    this.xLetter.img.src = `../images/takeover/letter_X_colored.svg`;
    this.xLetter.img.onload = callback;
  }

  /* sticky element animation part */

  canvasImageAnimation(percentage) {
    const canvasImages = this.canvasImages;
    let calcedIndex = Math.floor(canvasImages.length * percentage);
    if (!calcedIndex || calcedIndex < 0) {
      calcedIndex = 0;
    } else if (calcedIndex >= canvasImages.length) {
      calcedIndex = canvasImages.length - 1;
    }

    const currentImg = canvasImages[calcedIndex];

    this.ctx.clearRect(0, 0, this.sizes.width, this.sizes.height);
    this.ctx.drawImage(currentImg, 0, 0, this.sizes.width, this.sizes.height);
  }

  renderText(percentage) {
    // ctx.clearRect(0, 0, sizes.width, sizes.height);

    const word = "TAKE OVER";

    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    if (percentage <= 0.5) {
      let wordIndex = Math.ceil(word.length * (percentage / 0.5));
      const currentText = word.slice(0, wordIndex);
      this.strokeText(currentText, "300px", "#FCEB57", true);
    } else {
      let calcedPercentage = Math.ceil(percentage * 20);

      if (calcedPercentage % 2 == 0) {
        this.fillText(word, `${300 + 300 * (calcedPercentage / 20)}px`);
      } else {
        this.ctx.clearRect(0, 0, this.sizes.width, this.sizes.height);
      }
    }
  }

  fillText(
    text = "TAKE OVER",
    size = "300px",
    color = "#FCEB57",
    reverse = false
  ) {
    this.ctx.clearRect(0, 0, this.sizes.width, this.sizes.height);
    this.ctx.font = `${size} DharmaGothicC-HeavyItalic`;
    this.ctx.fillStyle = color;
    let xPos = this.sizes.width / 2;
    let yPos = this.sizes.height / 2;

    if (reverse) {
      this.ctx.translate(0, 0);
      this.ctx.rotate(Math.PI);

      xPos = 0 - this.sizes.width / 2;
      yPos = 0 - this.sizes.height / 2;
    }

    this.ctx.fillText(text, xPos, yPos);
  }

  strokeText(
    text = "TAKE OVER",
    size = "300px",
    color = "#FCEB57",
    reverse = false
  ) {
    this.ctx.clearRect(0, 0, this.sizes.width, this.sizes.height);
    this.ctx.font = `${size} DharmaGothicC-HeavyItalic`;
    this.ctx.strokeStyle = color;
    let xPos = this.sizes.width / 2;
    let yPos = this.sizes.height / 2;

    if (reverse) {
      this.ctx.translate(0, 0);
      this.ctx.rotate(Math.PI);

      xPos = 0 - this.sizes.width / 2;
      yPos = 0 - this.sizes.height / 2;
    }

    this.ctx.strokeText(text, xPos, yPos);
  }

  renderRect(percentage) {
    let barWidth = Math.floor(this.sizes.width * percentage);

    let rightBarXPos = this.sizes.width - barWidth;

    let barHeight = Math.floor(this.sizes.height / 2);

    // left
    this.ctx.fillRect(0, 0, barWidth, barHeight);

    // right
    this.ctx.fillRect(
      rightBarXPos,
      barHeight,
      barWidth,
      this.sizes.height - barHeight
    );
  }

  // this needs to be changed to another path not #outline.
  svgPathAnimation(percentage) {
    for (let i = 0; i < this.paths.length; i += 1) {
      let path = this.paths[i];

      let value = 50 * percentage;
      let reverseValue = 50 - value;
      let strokeDasharray = `${reverseValue}% ${value}%`;

      path.style.strokeDasharray = strokeDasharray;
    }
  }

  renderDiamond(percentage) {
    this.diamond.forEach((cur) => {
      this.ctx.fillStyle = cur.fill;

      const targetWidth = cur.w * percentage;
      const difference = cur.w - targetWidth;
      const targetX = cur.x + difference / 2;
      const targetY = cur.y + difference / 2;

      this.ctx.fillRect(targetX, targetY, targetWidth, targetWidth);
    });
  }

  xLetterAnimation(img, percentage) {
    this.ctx.clearRect(0, 0, this.sizes.width, this.sizes.height);
    let imgWidth = this.sizes.width * percentage * 8;
    let imgHeight = imgWidth * this.xLetter.ratio;

    imgWidth = Math.floor(imgWidth);
    imgHeight = Math.floor(imgHeight);

    const startXPoint = Math.floor(this.sizes.width / 2 - imgWidth / 2);
    const startYPoint = Math.floor(this.sizes.height / 2 - imgHeight / 2);

    // ctx.beginPath();
    this.ctx.fillStyle = "#ABE9F9";
    this.ctx.rect(0, 0, this.sizes.width, startYPoint);
    this.ctx.rect(0, startYPoint - 1, startXPoint + 1, imgHeight + 1);
    this.ctx.rect(
      this.sizes.width - startXPoint - 1,
      startYPoint - 1,
      startXPoint + 1,
      imgHeight + 1
    );
    this.ctx.rect(
      0,
      this.sizes.height - startYPoint,
      this.sizes.width,
      this.sizes.height
    );
    this.ctx.fill();
    this.ctx.clearRect(
      startXPoint + 8,
      startYPoint + 8,
      imgWidth - 8,
      imgHeight - 8
    );

    this.ctx.drawImage(img, startXPoint, startYPoint, imgWidth, imgHeight);
  }

  totalAnimation(fps) {
    if (this.requestAnimationTimer == null) {
      this.requestAnimationTimer = fps;
    }

    this.requestAnimationCurrent = (fps - this.requestAnimationTimer) / 1000;

    // controll timer

    // renderRect
    if (!fps || this.requestAnimationCurrent <= 11) {
      if (this.animation_status != "bar") {
        this.animation_status = "bar";
        console.log("bar animation start");
      }

      this.renderRect(this.requestAnimationCurrent / 10);
      window.requestAnimationFrame(this.totalAnimation.bind(this));
    } else if (this.requestAnimationCurrent <= 11 + 11) {
      if (this.animation_status != "text") {
        this.animation_status = "text";

        this.canvas.style.background = "black";
        console.log("text animation start");
      }

      this.renderText((this.requestAnimationCurrent - 11) / 10);
      window.requestAnimationFrame(this.totalAnimation.bind(this));
    } else if (this.requestAnimationCurrent <= 11 + 11 + 11) {
      if (this.animation_status != "diamond") {
        this.animation_status = "diamond";

        this.ctx.translate(this.sizes.width / 2, -this.sizes.height / 2);
        this.ctx.rotate(Math.PI / 4);
        console.log("diamond animation start");
      }

      this.renderDiamond((this.requestAnimationCurrent - 11 - 11) / 10);
      window.requestAnimationFrame(this.totalAnimation.bind(this));
    } else if (this.requestAnimationCurrent <= 11 + 11 + 11 + 11) {
      if (this.animation_status != "xLetter") {
        this.animation_status = "xLetter";

        this.ctx.rotate(-Math.PI / 4);
        this.ctx.translate(-this.sizes.width / 2, this.sizes.height / 2);

        this.canvas.style.background = "unset";
        const outlineSVG = document.querySelector("g#outline");
        const coloredSVG = document.querySelector("g#colored");
        coloredSVG.style.display = "none";
        outlineSVG.style.setProperty("opacity", "1", "important");
        console.log("xLetter animation start");
      }

      this.xLetterAnimation(
        this.xLetter.img,
        (this.requestAnimationCurrent - 11 - 11 - 11) / 10
      );
      window.requestAnimationFrame(this.totalAnimation.bind(this));
    } else if (this.requestAnimationCurrent <= 11 + 11 + 11 + 11 + 5) {
      if (this.animation_status != "svgPath") {
        this.animation_status = "svgPath";
        console.log("svgPath animation start");
      }

      this.svgPathAnimation(
        (this.requestAnimationCurrent - 11 - 11 - 11 - 11) / 5
      );
      window.requestAnimationFrame(this.totalAnimation.bind(this));
    } else if (this.requestAnimationCurrent <= 11 + 11 + 11 + 11 + 5 + 11) {
      if (this.animation_status != "canvas") {
        this.animation_status = "canvas";

        console.log("canvas animation start");
      }

      this.canvasImageAnimation(
        (this.requestAnimationCurrent - 11 - 11 - 11 - 11 - 5) / 10
      );
      window.requestAnimationFrame(this.totalAnimation.bind(this));
    }
  }

  /* end of animation part */

  getStartingPoint() {
    let { top, height } = this.getBoundingClientRect();
    this.startingYOffset = top + scrollY;

    this.screenHeight = innerHeight;
    this.height = height;
  }

  setAnimationValue() {
    this.animateValue = {
      opacityOut: [1, 0, { start: 0.1, end: 0.33 }],
      contrastIn: [255, 0, { start: 0.36, end: 0.43 }],
    };

    let opacityOut = [1, 0, { start: 0.1, end: 0.33 }];
    let contrastIn = [255, 0, { start: 0.36, end: 0.43 }];

    let { top, height } = this.contrastElement.getBoundingClientRect();
    let contrastElementStartingYOffset = top + scrollY;

    // contrastElement찾고,
    // 거기서 +150px까지 opacity 0으로
    // 거기서 +150px부터 startAt
    // 페이지 절반왔을 때 endsAt

    let oneStepAmount = 100;
    let halfSceneAmount = this.screenHeight / 2;
    halfSceneAmount = halfSceneAmount < 500 ? 500 : halfSceneAmount;
    let contrastStartAt =
      contrastElementStartingYOffset - this.startingYOffset - this.screenHeight; // normalize

    let contrastEndAt = contrastStartAt + halfSceneAmount;
    let opacityOutEndAt = contrastStartAt + 4.5 * oneStepAmount;

    contrastIn[2].start = (contrastStartAt + 1.5 * oneStepAmount) / this.height;
    contrastIn[2].end = contrastEndAt / this.height;
    opacityOut[2].end = opacityOutEndAt / this.height;

    this.animateValue = {
      ...this.animateValue,
      opacityOut,
      contrastIn,
    };
  }

  calcAnimatedValue(values, currentScrollY, height) {
    let rv;

    const partScrollStart = values[2].start * height;
    const partScrollEnd = values[2].end * height;
    const partScrollHeight = partScrollEnd - partScrollStart;

    if (currentScrollY >= partScrollStart && currentScrollY <= partScrollEnd) {
      rv =
        ((currentScrollY - partScrollStart) / partScrollHeight) *
          (values[1] - values[0]) +
        values[0];
    } else if (currentScrollY < partScrollStart) {
      rv = values[0];
    } else if (currentScrollY > partScrollEnd) {
      rv = values[1];
    }

    return rv;
  }

  scrollHandler(e) {
    if (
      scrollY > this.startingYOffset &&
      scrollY < this.startingYOffset + this.height
    ) {
      this.currentScrollY = Math.abs(this.startingYOffset - scrollY);

      let scrollRatio = this.currentScrollY / this.height;

      let { opacityOut, contrastIn } = this.animateValue;

      // opacityIn, opacityOut, contrastIn

      // this is for background video
      if (scrollRatio < opacityOut[2].start) {
        this.stickyElement.style.opacity = 1;
      } else if (scrollRatio > opacityOut[2].end) {
        this.stickyElement.style.opacity = 0;
      } else {
        this.stickyElement.style.opacity = this.calcAnimatedValue(
          opacityOut,
          this.currentScrollY,
          this.height
        );
      }

      // this is for contrast effect
      if (scrollRatio < contrastIn[2].start) {
        let calcedValue = 255;
        let reversedValue = 255 - calcedValue;

        document.documentElement.style.setProperty(
          "--text-color-value",
          `${calcedValue}, ${calcedValue}, ${calcedValue}`
        );
        document.documentElement.style.setProperty(
          "--background-color-value",
          `${reversedValue}, ${reversedValue}, ${reversedValue}`
        );
      } else if (scrollRatio > contrastIn[2].end) {
        let calcedValue = 0;
        let reversedValue = 255 - calcedValue;

        document.documentElement.style.setProperty(
          "--text-color-value",
          `${calcedValue}, ${calcedValue}, ${calcedValue}`
        );
        document.documentElement.style.setProperty(
          "--background-color-value",
          `${reversedValue}, ${reversedValue}, ${reversedValue}`
        );
      } else {
        let calcedValue = this.calcAnimatedValue(
          contrastIn,
          this.currentScrollY,
          this.height
        );
        let reversedValue = 255 - calcedValue;

        document.documentElement.style.setProperty(
          "--text-color-value",
          `${calcedValue}, ${calcedValue}, ${calcedValue}`
        );
        document.documentElement.style.setProperty(
          "--background-color-value",
          `${reversedValue}, ${reversedValue}, ${reversedValue}`
        );
      }
    } else if (scrollY <= 0 || scrollY < this.startingYOffset) {
      this.stickyElement.style.opacity = 1;
      document.documentElement.style.setProperty(
        "--text-color-value",
        `255, 255, 255`
      );
      document.documentElement.style.setProperty(
        "--background-color-value",
        `0, 0, 0`
      );
    } else {
      this.stickyElement.style.opacity = 0;
      document.documentElement.style.setProperty(
        "--text-color-value",
        `0, 0, 0`
      );
      document.documentElement.style.setProperty(
        "--background-color-value",
        `255, 255, 255`
      );
    }
  }
}

class Shape {
  constructor(x, y, w, h, fill) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.fill = fill;
  }
}

window.customElements.define("banner-highlight", BannerHighlight);
