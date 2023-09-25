class BannerHighlight extends HTMLElement {
  constructor() {
    super();

    this.init();
  }

  init() {
    this.stickyElement = this.querySelector("[data-banner-sticky]");
    this.contrastElement = this.querySelector("[data-banner-contrast]");

    this.getStartingPoint();
    this.setAnimationValue();

    window.addEventListener("scroll", this.scrollHandler.bind(this));
  }

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

window.customElements.define("banner-highlight", BannerHighlight);
