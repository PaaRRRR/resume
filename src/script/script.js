class BannerHighlight extends HTMLElement {
  constructor() {
    super();

    this.init();
  }

  init() {
    this.stickyElement = this.querySelector("[data-banner-sticky]");
    this.contrastElement = this.querySelector("[data-banner-contrast]");
    this.canvas = this.querySelector(".canvas-animation-01");
    this.canvas2 = this.querySelector(".canvas-animation-02");
    this.canvas3 = this.querySelector(".canvas-animation-03");
    this.canvas4 = this.querySelector(".canvas-animation-04");
    this.canvas5 = this.querySelector(".canvas-animation-05");
    this.ctx = this.canvas.getContext("2d");
    this.ctx2 = this.canvas2.getContext("2d");
    this.ctx3 = this.canvas3.getContext("2d");
    this.ctx4 = this.canvas4.getContext("2d");
    this.ctx5 = this.canvas5.getContext("2d");

    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.getVariables();

    this.getStartingPoint();
    this.setAnimationValue();
    this.loadAsset();

    window.addEventListener("scroll", this.scrollHandler.bind(this));
    window.addEventListener("resize", this.resizeHandler.bind(this));

    this.resizeHandler();
  }

  resizeHandler() {
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;

    this.highResolution(this.canvas, this.ctx);
    this.highResolution(this.canvas2, this.ctx2);
    this.highResolution(this.canvas3, this.ctx3);
    this.highResolution(this.canvas4, this.ctx4);
    this.highResolution(this.canvas5, this.ctx5);
  }

  highResolution(canvas, ctx) {
    // Get the DPR and size of the canvas
    const dpr = window.devicePixelRatio;
    const rect = this.canvas.getBoundingClientRect();

    // Set the "actual" size of the canvas
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Scale the context to ensure correct drawing operations
    ctx.scale(dpr, dpr);

    // Set the "drawn" size of the canvas
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
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
    this.paths = [...document.querySelectorAll(".svg-path-animation path")];
    this.animation_status = "bar";

    this.svgPathIntro = document.querySelector(".svg-path-intro");
    this.svgPathAnimationEl = document.querySelector(".svg-path-animation");

    this.requestAnimationTimer = null;
    this.requestAnimationCurrent;
  }

  loadAsset() {
    this.loadDiamond();
    let loadCount = 3;
    const onload = () => --loadCount === 0 && this.loadHandler();
    this.loadCanvasImage(onload);
    this.loadFont(onload);
    this.loadXLetter(onload);
  }

  loadHandler() {
    this.svgPathIntro.classList.add("intro");

    setTimeout(() => {
      document.body.style.overflow = "unset";
      document.querySelector("nav").style.display = "block";

      // this.ctx3.translate(this.sizes.width / 2, -this.sizes.height / 2);
      // this.ctx3.rotate(Math.PI / 4);
    }, 3000);
  }

  loadCanvasImage(callback = () => {}) {
    let imgElem;
    let numLoading = 86;
    const onload = () => --numLoading === 0 && callback();
    for (let i = 0; i < numLoading; i += 1) {
      imgElem = new Image();
      imgElem.src = `../images/takeover/canvas/TakeOver_canvas_${103 + i}.webp`;
      this.canvasImages.push(imgElem);
      imgElem.onload = onload;
    }
  }

  loadDiamond() {
    let row_num = 8;
    const originalSize = Math.max(this.sizes.width, this.sizes.height);
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

  canvasImageAnimation(ctx, percentage) {
    const canvasImages = this.canvasImages;
    let calcedIndex = Math.floor(canvasImages.length * percentage);
    if (!calcedIndex || calcedIndex < 0) {
      calcedIndex = 0;
    } else if (calcedIndex >= canvasImages.length) {
      calcedIndex = canvasImages.length - 1;
    }

    const currentImg = canvasImages[calcedIndex];

    ctx.clearRect(0, 0, this.sizes.width, this.sizes.height);
    ctx.drawImage(currentImg, 0, 0, this.sizes.width, this.sizes.height);
  }

  renderText(ctx, percentage) {
    const word = "TAKE OVER";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (percentage <= 0.5) {
      let wordIndex = Math.ceil(word.length * (percentage / 0.5));
      const currentText = word.slice(0, wordIndex);
      this.strokeText(ctx, currentText, "300px", "#FCEB57", true);
    } else {
      let calcedPercentage = Math.ceil(percentage * 20);

      if (calcedPercentage % 2 == 0) {
        this.fillText(ctx, word, `${300 + 300 * (calcedPercentage / 20)}px`);
      } else {
        ctx.clearRect(0, 0, this.sizes.width, this.sizes.height);
      }
    }
  }

  renderStrokeText(ctx, percentage) {
    const word = "TAKE OVER";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    let wordIndex = Math.ceil(word.length * percentage);
    const currentText = word.slice(0, wordIndex);
    this.strokeText(ctx, currentText, "300px", "#FCEB57", true);
  }

  renderFillText(ctx, percentage) {
    const word = "TAKE OVER";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    let calcedPercentage = Math.ceil(percentage * 10);

    if (calcedPercentage % 2 == 0) {
      this.fillText(ctx, word, `${300 + 300 * (calcedPercentage / 10)}px`);
    } else {
      ctx.clearRect(0, 0, this.sizes.width, this.sizes.height);
    }
  }

  fillText(
    ctx,
    text = "TAKE OVER",
    size = "300px",
    color = "#FCEB57",
    reverse = false
  ) {
    ctx.clearRect(0, 0, this.sizes.width, this.sizes.height);
    ctx.font = `${size} DharmaGothicC-HeavyItalic`;
    ctx.fillStyle = color;
    let xPos = this.sizes.width / 2;
    let yPos = this.sizes.height / 2;

    if (reverse) {
      ctx.translate(0, 0);
      ctx.rotate(Math.PI);

      xPos = 0 - this.sizes.width / 2;
      yPos = 0 - this.sizes.height / 2;
    }

    ctx.fillText(text, xPos, yPos);
  }

  strokeText(
    ctx,
    text = "TAKE OVER",
    size = "300px",
    color = "#FCEB57",
    reverse = false
  ) {
    ctx.clearRect(0, 0, this.sizes.width, this.sizes.height);
    ctx.font = `${size} DharmaGothicC-HeavyItalic`;
    ctx.strokeStyle = color;
    let xPos = this.sizes.width / 2;
    let yPos = this.sizes.height / 2;

    if (reverse) {
      ctx.translate(0, 0);
      ctx.rotate(Math.PI);

      xPos = 0 - this.sizes.width / 2;
      yPos = 0 - this.sizes.height / 2;
    }

    ctx.strokeText(text, xPos, yPos);
  }

  renderRect(ctx, percentage) {
    let barWidth = Math.floor(this.sizes.width * percentage);

    let rightBarXPos = this.sizes.width - barWidth;

    let barHeight = Math.floor(this.sizes.height / 2);

    ctx.fillStyle = "#000000";

    ctx.clearRect(0, 0, this.sizes.width, this.sizes.height);

    // left
    ctx.fillRect(0, 0, barWidth, barHeight);

    // right
    ctx.fillRect(
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

  renderDiamond(ctx, percentage) {
    const maxSide = Math.max(this.sizes.width, this.sizes.height);
    ctx.clearRect(0, 0, maxSide * 1.4, maxSide * 1.4);

    this.diamond.forEach((cur) => {
      ctx.fillStyle = cur.fill;

      const targetWidth = cur.w * percentage;
      const difference = cur.w - targetWidth;
      const targetX = cur.x + difference / 2;
      const targetY = cur.y + difference / 2;

      ctx.fillRect(targetX, targetY, targetWidth, targetWidth);
    });
  }

  xLetterAnimation(ctx, img, percentage) {
    ctx.clearRect(0, 0, this.sizes.width, this.sizes.height);
    let imgWidth = this.sizes.width * percentage * 10; // 539 : 50 = x : this.sizes.width
    let imgHeight = imgWidth * this.xLetter.ratio;

    imgWidth = Math.floor(imgWidth);
    imgHeight = Math.floor(imgHeight);

    const startXPoint = Math.floor(this.sizes.width / 2 - imgWidth / 2);
    const startYPoint = Math.floor(this.sizes.height / 2 - imgHeight / 2);

    // ctx.beginPath();
    ctx.fillStyle = "#ABE9F9";
    ctx.rect(0, 0, this.sizes.width, startYPoint);
    ctx.rect(0, startYPoint - 1, startXPoint + 1, imgHeight + 1);
    ctx.rect(
      this.sizes.width - startXPoint - 1,
      startYPoint - 1,
      startXPoint + 1,
      imgHeight + 1
    );
    ctx.rect(
      0,
      this.sizes.height - startYPoint,
      this.sizes.width,
      this.sizes.height
    );
    ctx.fill();
    ctx.clearRect(
      startXPoint + 8,
      startYPoint + 8,
      imgWidth - 8,
      imgHeight - 8
    );

    ctx.drawImage(img, startXPoint, startYPoint, imgWidth, imgHeight);
  }

  /* end of animation part */

  getStartingPoint() {
    let { top, height } = this.getBoundingClientRect();
    this.startingYOffset = top + scrollY;

    this.screenHeight = innerHeight;
    this.height = height;
  }

  setAnimationValue() {
    let rectAnimation = [0, 1, { start: 0, end: 0 }],
      strokeTextAnimation = [0, 1, { start: 0, end: 0 }],
      fillTextAnimation = [0, 1, { start: 0, end: 0 }],
      diamondAnimation = [0, 1, { start: 0, end: 0 }],
      xLetterAnimation = [0, 1, { start: 0, end: 0 }],
      svgPathAnimation = [0, 1, { start: 0, end: 0 }],
      canvasImageAnimation = [0, 1, { start: 0, end: 0 }],
      canvasOpacityOut = [1, 0, { start: 0, end: 0 }],
      opacityOut = [1, 0, { start: 0, end: 0 }],
      contrastIn = [255, 0, { start: 0, end: 0 }];

    let { top, height } = this.contrastElement.getBoundingClientRect();
    let contrastElementStartingYOffset = top + scrollY;

    // contrastElement찾고,
    // 거기서 +150px까지 opacity 0으로
    // 거기서 +150px부터 startAt
    // 페이지 절반왔을 때 endsAt

    let oneStepAmount = 100;
    let halfHeight = this.screenHeight / 2;
    halfHeight = Math.max(500, halfHeight);
    let contrastStartAt =
      contrastElementStartingYOffset - this.startingYOffset - this.screenHeight; // normalize

    let contrastEndAt = contrastStartAt + halfHeight;
    let opacityOutEndAt = contrastStartAt + 4.5 * oneStepAmount;

    contrastIn[2].start = (contrastStartAt + 1.5 * oneStepAmount) / this.height;
    contrastIn[2].end = contrastEndAt / this.height;
    opacityOut[2].end = opacityOutEndAt / this.height;

    const stickyElementLong = contrastIn[2].start;
    // 10, 5, 5, 10, 10, 5, 10, 5
    // rect, strokeText,fillText, diamond, xLetter, svgPath, canvasImage, canvasOut
    const stickyElementStep = stickyElementLong / 60;
    rectAnimation[2].start = 0;
    rectAnimation[2].end = rectAnimation[2].start + 10 * stickyElementStep;
    strokeTextAnimation[2].start = rectAnimation[2].end;
    strokeTextAnimation[2].end =
      strokeTextAnimation[2].start + 5 * stickyElementStep;
    fillTextAnimation[2].start = strokeTextAnimation[2].end;
    fillTextAnimation[2].end =
      fillTextAnimation[2].start + 5 * stickyElementStep;
    diamondAnimation[2].start = fillTextAnimation[2].end;
    diamondAnimation[2].end =
      diamondAnimation[2].start + 10 * stickyElementStep;
    xLetterAnimation[2].start = diamondAnimation[2].end;
    xLetterAnimation[2].end =
      xLetterAnimation[2].start + 10 * stickyElementStep;
    svgPathAnimation[2].start = xLetterAnimation[2].end;
    svgPathAnimation[2].end = svgPathAnimation[2].start + 5 * stickyElementStep;
    canvasImageAnimation[2].start = svgPathAnimation[2].end;
    canvasImageAnimation[2].end =
      canvasImageAnimation[2].start + 10 * stickyElementStep;
    canvasOpacityOut[2].start = canvasImageAnimation[2].end;
    canvasOpacityOut[2].end = canvasOpacityOut[2].start + 5 * stickyElementStep;
    opacityOut[2].start = canvasOpacityOut[2].end;

    this.animateValue = {
      rectAnimation,
      strokeTextAnimation,
      fillTextAnimation,
      diamondAnimation,
      xLetterAnimation,
      svgPathAnimation,
      canvasImageAnimation,
      canvasOpacityOut,

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

      let {
        rectAnimation,
        strokeTextAnimation,
        fillTextAnimation,
        diamondAnimation,
        xLetterAnimation,
        svgPathAnimation,
        canvasImageAnimation,
        canvasOpacityOut,
        opacityOut,
        contrastIn,
      } = this.animateValue;

      // sticky element animation
      if (
        scrollRatio >= rectAnimation[2].start &&
        scrollRatio < rectAnimation[2].end
      ) {
        if (this.animation_status != "rect") {
          this.animation_status = "rect";

          this.canvas.style.display = "block";
          this.canvas2.style.display = "none";
          this.canvas3.style.display = "none";
          this.canvas4.style.display = "none";
          this.canvas5.style.display = "none";
        }

        const value = this.calcAnimatedValue(
          rectAnimation,
          this.currentScrollY,
          this.height
        );

        this.renderRect(this.ctx, value);
      } else if (
        scrollRatio >= strokeTextAnimation[2].start &&
        scrollRatio < strokeTextAnimation[2].end
      ) {
        if (this.animation_status != "strokeText") {
          this.animation_status = "strokeText";

          this.canvas.style.display = "none";
          this.canvas2.style.display = "block";
          this.canvas3.style.display = "none";
          this.canvas4.style.display = "none";
          this.canvas5.style.display = "none";
        }

        const value = this.calcAnimatedValue(
          strokeTextAnimation,
          this.currentScrollY,
          this.height
        );

        this.renderStrokeText(this.ctx2, value);
      } else if (
        scrollRatio >= fillTextAnimation[2].start &&
        scrollRatio < fillTextAnimation[2].end
      ) {
        if (this.animation_status != "fillText") {
          this.animation_status = "fillText";

          this.canvas.style.display = "none";
          this.canvas2.style.display = "block";
          this.canvas3.style.display = "block";
          this.canvas4.style.display = "none";
          this.canvas5.style.display = "none";
        }

        const value = this.calcAnimatedValue(
          fillTextAnimation,
          this.currentScrollY,
          this.height
        );

        this.renderFillText(this.ctx3, value);
      } else if (
        scrollRatio >= diamondAnimation[2].start &&
        scrollRatio < diamondAnimation[2].end
      ) {
        if (this.animation_status != "diamond") {
          this.animation_status = "diamond";

          this.canvas.style.display = "none";
          this.canvas2.style.display = "block";
          this.canvas3.style.display = "block";
          this.canvas4.style.display = "block";
          this.canvas5.style.display = "none";

          this.svgPathIntro.style.opacity = "1";
          this.svgPathAnimationEl.style.opacity = "0";
        }

        const value = this.calcAnimatedValue(
          diamondAnimation,
          this.currentScrollY,
          this.height
        );

        this.renderDiamond(this.ctx4, value);
      } else if (
        scrollRatio >= xLetterAnimation[2].start &&
        scrollRatio < xLetterAnimation[2].end
      ) {
        if (this.animation_status != "xLetter") {
          this.animation_status = "xLetter";

          this.canvas.style.display = "none";
          this.canvas2.style.display = "none";
          this.canvas3.style.display = "none";
          this.canvas4.style.display = "none";
          this.canvas5.style.display = "block";

          this.svgPathIntro.style.opacity = "0";
          this.svgPathAnimationEl.style.opacity = "1";

          this.svgPathAnimation(0);
        }

        const value = this.calcAnimatedValue(
          xLetterAnimation,
          this.currentScrollY,
          this.height
        );

        this.xLetterAnimation(this.ctx5, this.xLetter.img, value);
      } else if (
        scrollRatio >= svgPathAnimation[2].start &&
        scrollRatio < svgPathAnimation[2].end
      ) {
        if (this.animation_status != "svgPath") {
          this.animation_status = "svgPath";

          this.ctx5.clearRect(0, 0, this.sizes.width, this.sizes.height);
        }

        const value = this.calcAnimatedValue(
          svgPathAnimation,
          this.currentScrollY,
          this.height
        );

        this.svgPathAnimation(value);
      } else if (
        scrollRatio >= canvasImageAnimation[2].start &&
        scrollRatio < canvasImageAnimation[2].end
      ) {
        if (this.animation_status != "canvas") {
          this.animation_status = "canvas";
          this.svgPathAnimation(1);
          this.canvas5.style.opacity = 1;
        }

        const value = this.calcAnimatedValue(
          canvasImageAnimation,
          this.currentScrollY,
          this.height
        );

        this.canvasImageAnimation(this.ctx5, value);
      } else if (
        scrollRatio >= canvasOpacityOut[2].start &&
        scrollRatio < canvasOpacityOut[2].end
      ) {
        if (this.animation_status != "canvasOpacityOut") {
          this.animation_status = "canvasOpacityOut";
        }

        const value = this.calcAnimatedValue(
          canvasOpacityOut,
          this.currentScrollY,
          this.height
        );

        this.canvas5.style.opacity = value;
      }

      // start contrast effect,,
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
