import interReg from "./fonts/Inter-Bold.otf";
import metroExtraBold from "./fonts/Metropolis-ExtraBold.otf";

export default function sketch(s) {
  s.state = {};
  s.dispatch = () => {};

  let size = 0;
  let metro_font, inter_font;
  let parentsLifeColor,
    parentsLifeColorSaf,
    yourLifeColor,
    yourLifeColorSaf,
    nextGenLifeColor,
    nextGenLifeColorSaf,
    treesLifeColor,
    forestLifeColor;
  let blueGradientColor,
    greenGradientColor,
    darkGreenGradientColor,
    white,
    black;
  let brandRectangle, brandButton, btnColor, btnHover;
  const parentsRadius = 100;
  const yourRadius = 200;
  const nextGenRadius = 300;
  const treesRadius = 600;
  const forestRadius = 1200;

  let sUsrAg, sBrowser;

  function drawTimeline(s) {
    s.stroke(black);
    s.fill(black);
    s.circle(size / 2, s.height / 2, 5);

    s.drawingContext.setLineDash([5, 10]);
    s.line(0, s.height / 2, size / 2, s.height / 2);
    s.drawingContext.setLineDash([]);
  }

  function drawButton(s) {
    s.noStroke();
    s.fill(btnColor);
    s.rect(s.width / 2 - 60, s.height / 2 + 80, 134, 52, 100);
    s.textFont(inter_font);
    s.textSize(18);
    s.noStroke();
    s.fill(white);
    s.text("Next", s.width / 2 - 16, s.height / 2 + 113);
  }

  function setGradient(s, x, y, w, h, c1, c2, axis) {
    s.noFill();
    if (axis === s.Y_AXIS) {
      for (let i = y; i <= y + h; i++) {
        let inter = s.map(i, y, y + h, 0, 1);
        let c = s.lerpColor(c1, c2, inter);
        s.stroke(c);
        s.line(x, i, x + w, i);
      }
    } else if (axis === s.X_AXIS) {
      for (let i = x; i <= x + w; i++) {
        let inter = s.map(i, x, x + w, 0, 1);
        let c = s.lerpColor(c1, c2, inter);
        s.stroke(c);
        s.line(i, y, i, y + h);
      }
    }
  }

  function drawRadialGradient(s, to, from, unit) {
    const radius = s.width + unit * 10 + 200;
    for (let x = radius; x > 0; x -= unit) {
      let inter = s.map(x, 0, radius, 0, 1.0);
      let colorHue = s.lerpColor(from, to, inter);
      s.fill(colorHue);
      s.arc(0, s.height / 2, x, x, -s.HALF_PI, s.HALF_PI, s.OPEN);
    }
  }

  function drawRadialGradientAnimate(s, to, from, unit) {
    const radius = s.width + unit * 10 + size;
    for (let x = radius; x > 0; x -= unit) {
      let inter = s.map(x, 0, radius, 0, 1.0);
      let colorHue = s.lerpColor(from, to, inter);
      s.fill(colorHue);
      s.arc(0, s.height / 2, x, x, -s.HALF_PI, s.HALF_PI, s.OPEN);
    }
  }

  s.preload = () => {
    inter_font = s.loadFont(interReg);
    metro_font = s.loadFont(metroExtraBold);
  };

  s.setup = () => {
    s.disableFriendlyErrors = true;
    s.frameRate(30);
    s.createCanvas(s.windowWidth, s.windowHeight); //👀 edit here to change size of the canvas

    parentsLifeColorSaf = s.color(94, 157, 255, 255);
    yourLifeColorSaf = s.color(117, 173, 253, 150);
    nextGenLifeColorSaf = s.color(136, 184, 251, 100);
    parentsLifeColor = s.color(255, 255, 255, 200);
    yourLifeColor = s.color(255, 255, 255, 150);
    nextGenLifeColor = s.color(255, 255, 255, 100);
    treesLifeColor = s.color(164, 214, 222, 200);
    forestLifeColor = s.color(165, 196, 195, 200);
    blueGradientColor = s.color(92, 158, 255);
    greenGradientColor = s.color(165, 196, 195);
    darkGreenGradientColor = s.color(164, 214, 222);
    brandRectangle = s.color(181, 243, 216);
    brandButton = s.color(44, 128, 252);
    white = s.color(255);
    black = s.color(0);
    btnHover = s.color(60, 106, 197);

    btnColor = brandButton;

    s.noLoop();
    sUsrAg = navigator.userAgent;
    if (sUsrAg.indexOf("Firefox") > -1) {
      sBrowser = "Mozilla Firefox";
      // "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
    } else if (sUsrAg.indexOf("SamsungBrowser") > -1) {
      sBrowser = "Samsung Internet";
      // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36
    } else if (sUsrAg.indexOf("Opera") > -1 || sUsrAg.indexOf("OPR") > -1) {
      sBrowser = "Opera";
      // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
    } else if (sUsrAg.indexOf("Trident") > -1) {
      sBrowser = "Microsoft Internet Explorer";
      // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
    } else if (sUsrAg.indexOf("Edge") > -1) {
      sBrowser = "Microsoft Edge";
      // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
    } else if (sUsrAg.indexOf("Chrome") > -1) {
      sBrowser = "Google Chrome or Chromium";
      // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
    } else if (sUsrAg.indexOf("Safari") > -1) {
      sBrowser = "Apple Safari";
      // "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
    } else {
      sBrowser = "unknown";
    }
  };
  s.draw = () => {
    if (
      sBrowser === "Apple Safari" ||
      sBrowser === "Microsoft Internet Explorer"
    ) {
      if (s.state.animationState === 0) {
        setGradient(
          s,
          0,
          0,
          s.width,
          s.height,
          white,
          blueGradientColor,
          s.Y_AXIS
        );
        drawRadialGradient(s, blueGradientColor, white, 40);

        s.fill(brandRectangle);
        s.noStroke();
        s.rect(s.width / 2 - 122, s.height / 2 - 12, 265, 20);
        s.rect(s.width / 2 - 128, s.height / 2 + 23, 265, 20);
        s.fill(black);
        s.textFont(metro_font);
        s.textSize(30);
        s.text(
          "We are a gift from the past, and we",
          s.width / 2 - 260,
          s.height / 2
        );
        s.text("will gift the future. ", s.width / 2 - 130, s.height / 2 + 35);
      } else if (s.state.animationState === 1) {
        if (size === 0) {
          drawRadialGradient(s, blueGradientColor, white, 40);
          s.fill(brandRectangle);
          s.rect(s.width / 2 + 15, s.height / 2 - 12, 120, 20);
          s.rect(s.width / 2 - 70, s.height / 2 + 23, 190, 20);
          s.fill(black);
          s.textFont(metro_font);
          s.textSize(30);
          s.text("This is the lifetime of", s.width / 2 - 140, s.height / 2);
          s.text("your parents.", s.width / 2 - 70, s.height / 2 + 35);
          size += 5;
        } else if (size < parentsRadius) {
          s.fill(parentsLifeColorSaf);
          s.arc(0, s.height / 2, size, size, -s.HALF_PI, s.HALF_PI, s.OPEN);
          drawTimeline(s);
          size += 5;
        } else {
          s.noLoop();
        }
      } else if (s.state.animationState === 2) {
        if (size === parentsRadius) {
          s.noStroke();
          drawRadialGradient(s, blueGradientColor, white, 40);
          s.fill(brandRectangle);
          s.noStroke();
          s.rect(s.width / 2 - 40, s.height / 2 - 12, 190, 20);
          s.fill(black);
          s.textFont(metro_font);
          s.textSize(30);
          s.text("This is your lifetime.", s.width / 2 - 140, s.height / 2);
          size += 5;
        } else if (size < yourRadius) {
          s.fill(parentsLifeColorSaf);
          s.arc(
            0,
            s.height / 2,
            parentsRadius,
            parentsRadius,
            -s.HALF_PI,
            s.HALF_PI,
            s.OPEN
          );
          s.fill(yourLifeColorSaf);
          s.arc(0, s.height / 2, size, size, -s.HALF_PI, s.HALF_PI, s.OPEN);
          drawTimeline(s);
          size += 5;
        } else {
          s.noLoop();
        }
      } else if (s.state.animationState === 3) {
        if (size === yourRadius) {
          s.noStroke();
          drawRadialGradient(s, blueGradientColor, white, 40);
          s.fill(brandRectangle);
          s.noStroke();
          s.rect(s.width / 2 - 70, s.height / 2 - 12, 270, 20);
          s.rect(s.width / 2 - 40, s.height / 2 + 23, 245, 20);
          s.fill(black);
          s.textFont(metro_font);
          s.textSize(30);
          s.text("This will be the lifetime", s.width / 2 - 140, s.height / 2);
          s.text(
            "of the next generation.",
            s.width / 2 - 130,
            s.height / 2 + 35
          );
          size += 5;
        } else if (size < nextGenRadius) {
          s.fill(nextGenLifeColorSaf);
          s.arc(0, s.height / 2, size, size, -s.HALF_PI, s.HALF_PI, s.OPEN);
          s.fill(yourLifeColorSaf);
          s.arc(
            0,
            s.height / 2,
            yourRadius,
            yourRadius,
            -s.HALF_PI,
            s.HALF_PI,
            s.OPEN
          );
          s.fill(parentsLifeColorSaf);
          s.arc(
            0,
            s.height / 2,
            parentsRadius,
            parentsRadius,
            -s.HALF_PI,
            s.HALF_PI,
            s.OPEN
          );
          size += 5;
        } else {
          s.noLoop();
        }
        drawTimeline(s);
      } else if (s.state.animationState === 4) {
        if (size === nextGenRadius) {
          s.noStroke();
          drawRadialGradient(s, white, greenGradientColor, 40);
          s.noStroke();
          s.fill(brandRectangle);
          s.rect(s.width / 2 - 40, s.height / 2 - 12, 170, 20);
          s.rect(s.width / 2 - 60, s.height / 2 + 23, 130, 20);
          s.fill(black);
          s.textFont(metro_font);
          s.textSize(30);
          s.text("This is the lifetime", s.width / 2 - 140, s.height / 2);
          s.text("of a tree.", s.width / 2 - 60, s.height / 2 + 35);
          size += 5;
        } else if (size < treesRadius) {
          s.fill(treesLifeColor);
          s.arc(0, s.height / 2, size, size, -s.HALF_PI, s.HALF_PI, s.OPEN);
          s.fill(nextGenLifeColorSaf);
          s.arc(
            0,
            s.height / 2,
            nextGenRadius,
            nextGenRadius,
            -s.HALF_PI,
            s.HALF_PI,
            s.OPEN
          );
          s.fill(yourLifeColorSaf);
          s.arc(
            0,
            s.height / 2,
            yourRadius,
            yourRadius,
            -s.HALF_PI,
            s.HALF_PI,
            s.OPEN
          );
          s.fill(parentsLifeColorSaf);
          s.arc(
            0,
            s.height / 2,
            parentsRadius,
            parentsRadius,
            -s.HALF_PI,
            s.HALF_PI,
            s.OPEN
          );

          drawTimeline(s);
          size += 5;
        } else {
          s.noLoop();
        }
      } else if (s.state.animationState === 5) {
        if (size === treesRadius) {
          s.noStroke();
          drawRadialGradient(s, white, greenGradientColor, 40);
          s.fill(brandRectangle);
          s.rect(s.width / 2 + 20, s.height / 2 - 12, 180, 20);
          s.rect(s.width / 2 - 55, s.height / 2 + 23, 245, 20);
          s.fill(black);
          s.textFont(metro_font);
          s.textSize(30);
          s.text("And this is the lifetime", s.width / 2 - 140, s.height / 2);
          s.text(
            "of the forest it belongs to.",
            s.width / 2 - 150,
            s.height / 2 + 35
          );

          size += 5;
        } else if (size < forestRadius) {
          s.fill(forestLifeColor);
          s.arc(0, s.height / 2, size, size, -s.HALF_PI, s.HALF_PI, s.OPEN);
          s.fill(treesLifeColor);
          s.arc(
            0,
            s.height / 2,
            treesRadius,
            treesRadius,
            -s.HALF_PI,
            s.HALF_PI,
            s.OPEN
          );
          s.fill(nextGenLifeColorSaf);
          s.arc(
            0,
            s.height / 2,
            nextGenRadius,
            nextGenRadius,
            -s.HALF_PI,
            s.HALF_PI,
            s.OPEN
          );
          s.fill(yourLifeColorSaf);
          s.arc(
            0,
            s.height / 2,
            yourRadius,
            yourRadius,
            -s.HALF_PI,
            s.HALF_PI,
            s.OPEN
          );
          s.fill(parentsLifeColorSaf);
          s.arc(
            0,
            s.height / 2,
            parentsRadius,
            parentsRadius,
            -s.HALF_PI,
            s.HALF_PI,
            s.OPEN
          );
          drawTimeline(s);
          size += 5;
        } else {
          s.noLoop();
        }
      } else if (s.state.animationState === 6) {
        if (size > 1300) {
          s.noLoop();
        }
        s.noStroke();

        s.fill(forestLifeColor);
        s.arc(
          0,
          s.height / 2,
          forestRadius,
          forestRadius,
          -s.HALF_PI,
          s.HALF_PI,
          s.OPEN
        );
        s.fill(treesLifeColor);
        s.arc(
          0,
          s.height / 2,
          treesRadius,
          treesRadius,
          -s.HALF_PI,
          s.HALF_PI,
          s.OPEN
        );
        setGradient(
          s,
          0,
          0,
          s.width,
          s.height,
          blueGradientColor,
          darkGreenGradientColor,
          s.X_AXIS
        );
        drawRadialGradientAnimate(s, white, darkGreenGradientColor, 100);
        s.fill(nextGenLifeColorSaf);
        s.arc(
          0,
          s.height / 2,
          nextGenRadius,
          nextGenRadius,
          -s.HALF_PI,
          s.HALF_PI,
          s.OPEN
        );
        s.fill(yourLifeColorSaf);
        s.arc(
          0,
          s.height / 2,
          yourRadius,
          yourRadius,
          -s.HALF_PI,
          s.HALF_PI,
          s.OPEN
        );
        s.fill(parentsLifeColorSaf);
        s.arc(
          0,
          s.height / 2,
          parentsRadius,
          parentsRadius,
          -s.HALF_PI,
          s.HALF_PI,
          s.OPEN
        );

        s.noStroke();
        s.fill(black);
        s.textFont(metro_font);
        s.textSize(30);
        s.text(
          "Persistent Selv will help you take care",
          s.width / 2 - 240,
          s.height / 2 - 20
        );
        s.text("of future generations", s.width / 2 - 110, s.height / 2 + 10);
        s.text(
          "by protecting their environment.",
          s.width / 2 - 200,
          s.height / 2 + 40
        );

        s.textFont(inter_font);
        s.textSize(18);

        size += 2;
      }

      drawButton(s);
    } else {
      if (s.state.animationState === 0) {
        setGradient(
          s,
          0,
          0,
          s.width,
          s.height,
          white,
          blueGradientColor,
          s.Y_AXIS
        );
        drawRadialGradient(s, blueGradientColor, white, 40);

        s.fill(brandRectangle);
        s.noStroke();
        s.rect(s.width / 2 - 122, s.height / 2 - 12, 265, 20);
        s.rect(s.width / 2 - 128, s.height / 2 + 23, 265, 20);
        s.fill(black);
        s.textFont(metro_font);
        s.textSize(30);
        s.text(
          "We are a gift from the past, and we",
          s.width / 2 - 260,
          s.height / 2
        );
        s.text("will gift the future. ", s.width / 2 - 130, s.height / 2 + 35);
      } else if (s.state.animationState === 1) {
        s.clear();
        if (size < parentsRadius) {
          size += 5;
        } else {
          s.noLoop();
        }

        drawRadialGradientAnimate(s, white, blueGradientColor, 40);

        s.fill(parentsLifeColor);
        s.arc(0, s.height / 2, size, size, -s.HALF_PI, s.HALF_PI, s.OPEN);

        drawTimeline(s);

        s.fill(brandRectangle);
        s.noStroke();
        s.rect(s.width / 2 + 15, s.height / 2 - 12, 120, 20);
        s.rect(s.width / 2 - 70, s.height / 2 + 23, 190, 20);
        s.fill(black);
        s.textFont(metro_font);
        s.textSize(30);
        s.text("This is the lifetime of", s.width / 2 - 140, s.height / 2);
        s.text("your parents.", s.width / 2 - 70, s.height / 2 + 35);
      } else if (s.state.animationState === 2) {
        if (size < yourRadius) {
          size += 5;
        } else {
          s.noLoop();
        }
        s.noStroke();

        drawRadialGradientAnimate(s, white, blueGradientColor, 40);

        s.fill(yourLifeColor);
        s.arc(0, s.height / 2, size, size, -s.HALF_PI, s.HALF_PI, s.OPEN);
        s.fill(parentsLifeColor);
        s.arc(
          0,
          s.height / 2,
          parentsRadius,
          parentsRadius,
          -s.HALF_PI,
          s.HALF_PI,
          s.OPEN
        );

        drawTimeline(s);

        s.fill(brandRectangle);
        s.noStroke();
        s.rect(s.width / 2 - 40, s.height / 2 - 12, 190, 20);
        s.fill(black);
        s.textFont(metro_font);
        s.textSize(30);
        s.text("This is your lifetime.", s.width / 2 - 140, s.height / 2);
      } else if (s.state.animationState === 3) {
        if (size < nextGenRadius) {
          size += 5;
        } else {
          s.noLoop();
        }
        s.noStroke();

        drawRadialGradientAnimate(s, white, blueGradientColor, 40);

        s.fill(nextGenLifeColor);
        s.arc(0, s.height / 2, size, size, -s.HALF_PI, s.HALF_PI, s.OPEN);
        s.fill(yourLifeColor);
        s.arc(
          0,
          s.height / 2,
          yourRadius,
          yourRadius,
          -s.HALF_PI,
          s.HALF_PI,
          s.OPEN
        );
        s.fill(parentsLifeColor);
        s.arc(
          0,
          s.height / 2,
          parentsRadius,
          parentsRadius,
          -s.HALF_PI,
          s.HALF_PI,
          s.OPEN
        );

        drawTimeline(s);

        s.fill(brandRectangle);
        s.noStroke();
        s.rect(s.width / 2 - 70, s.height / 2 - 12, 270, 20);
        s.rect(s.width / 2 - 40, s.height / 2 + 23, 245, 20);
        s.fill(black);
        s.textFont(metro_font);
        s.textSize(30);
        s.text("This will be the lifetime", s.width / 2 - 140, s.height / 2);
        s.text("of the next generation.", s.width / 2 - 130, s.height / 2 + 35);
      } else if (s.state.animationState === 4) {
        if (size === nextGenRadius) {
          drawRadialGradient(s, white, greenGradientColor, 40);
          size += 5;
        } else if (size < treesRadius) {
          size += 5;
        } else {
          s.noLoop();
        }
        s.noStroke();

        s.fill(treesLifeColor);
        s.arc(0, s.height / 2, size, size, -s.HALF_PI, s.HALF_PI, s.OPEN);
        s.fill(nextGenLifeColor);
        s.arc(
          0,
          s.height / 2,
          nextGenRadius,
          nextGenRadius,
          -s.HALF_PI,
          s.HALF_PI,
          s.OPEN
        );
        s.fill(yourLifeColor);
        s.arc(
          0,
          s.height / 2,
          yourRadius,
          yourRadius,
          -s.HALF_PI,
          s.HALF_PI,
          s.OPEN
        );
        s.fill(parentsLifeColor);
        s.arc(
          0,
          s.height / 2,
          parentsRadius,
          parentsRadius,
          -s.HALF_PI,
          s.HALF_PI,
          s.OPEN
        );

        drawTimeline(s);

        s.noStroke();
        s.fill(brandRectangle);
        s.rect(s.width / 2 - 40, s.height / 2 - 12, 170, 20);
        s.rect(s.width / 2 - 60, s.height / 2 + 23, 130, 20);
        s.fill(black);
        s.textFont(metro_font);
        s.textSize(30);
        s.text("This is the lifetime", s.width / 2 - 140, s.height / 2);
        s.text("of a tree.", s.width / 2 - 60, s.height / 2 + 35);
      } else if (s.state.animationState === 5) {
        if (size === treesRadius) {
          drawRadialGradient(s, white, greenGradientColor, 40);
          size += 5;
        } else if (size < forestRadius) {
          size += 5;
        } else {
          s.noLoop();
        }
        s.noStroke();

        s.fill(forestLifeColor);
        s.arc(0, s.height / 2, size, size, -s.HALF_PI, s.HALF_PI, s.OPEN);
        s.fill(treesLifeColor);
        s.arc(
          0,
          s.height / 2,
          treesRadius,
          treesRadius,
          -s.HALF_PI,
          s.HALF_PI,
          s.OPEN
        );
        s.fill(nextGenLifeColor);
        s.arc(
          0,
          s.height / 2,
          nextGenRadius,
          nextGenRadius,
          -s.HALF_PI,
          s.HALF_PI,
          s.OPEN
        );
        s.fill(yourLifeColor);
        s.arc(
          0,
          s.height / 2,
          yourRadius,
          yourRadius,
          -s.HALF_PI,
          s.HALF_PI,
          s.OPEN
        );
        s.fill(parentsLifeColor);
        s.arc(
          0,
          s.height / 2,
          parentsRadius,
          parentsRadius,
          -s.HALF_PI,
          s.HALF_PI,
          s.OPEN
        );

        drawTimeline(s);
        s.strokeWeight(0.5);
        s.textSize(16);
        s.textFont(inter_font);

        s.noStroke();
        s.fill(brandRectangle);
        s.rect(s.width / 2 + 20, s.height / 2 - 12, 180, 20);
        s.rect(s.width / 2 - 55, s.height / 2 + 23, 245, 20);
        s.fill(black);
        s.textFont(metro_font);
        s.textSize(30);
        s.text("And this is the lifetime", s.width / 2 - 140, s.height / 2);
        s.text(
          "of the forest it belongs to.",
          s.width / 2 - 150,
          s.height / 2 + 35
        );
      } else if (s.state.animationState === 6) {
        if (size > 1400) {
          s.noLoop();
        }
        s.noStroke();

        s.fill(forestLifeColor);
        s.arc(
          0,
          s.height / 2,
          forestRadius,
          forestRadius,
          -s.HALF_PI,
          s.HALF_PI,
          s.OPEN
        );
        s.fill(treesLifeColor);
        s.arc(
          0,
          s.height / 2,
          treesRadius,
          treesRadius,
          -s.HALF_PI,
          s.HALF_PI,
          s.OPEN
        );
        setGradient(
          s,
          0,
          0,
          s.width,
          s.height,
          blueGradientColor,
          darkGreenGradientColor,
          s.X_AXIS
        );
        drawRadialGradientAnimate(s, white, darkGreenGradientColor, 100);
        s.fill(nextGenLifeColor);
        s.arc(
          0,
          s.height / 2,
          nextGenRadius,
          nextGenRadius,
          -s.HALF_PI,
          s.HALF_PI,
          s.OPEN
        );
        s.fill(yourLifeColor);
        s.arc(
          0,
          s.height / 2,
          yourRadius,
          yourRadius,
          -s.HALF_PI,
          s.HALF_PI,
          s.OPEN
        );
        s.fill(parentsLifeColor);
        s.arc(
          0,
          s.height / 2,
          parentsRadius,
          parentsRadius,
          -s.HALF_PI,
          s.HALF_PI,
          s.OPEN
        );

        s.noStroke();
        s.fill(black);
        s.textFont(metro_font);
        s.textSize(30);
        s.text(
          "Persistent Selv will help you take care",
          s.width / 2 - 240,
          s.height / 2 - 20
        );
        s.text("of future generations", s.width / 2 - 110, s.height / 2 + 10);
        s.text(
          "by protecting their environment.",
          s.width / 2 - 200,
          s.height / 2 + 40
        );

        s.textFont(inter_font);
        s.textSize(18);

        size += 2;
      }

      drawButton(s);
    }
  };

  s.mouseClicked = () => {
    s.clear();
    if (s.state.animationState < 6) {
      s.state.animationState++;
      s.dispatch({
        type: "SET_ANIMATION_STATE",
        payload: s.state.animationState,
      });
      s.loop();
    } else {
      window.location = '/demo/todos';
      s.noLoop();
      s.clear();
    }
  };

  s.mouseMoved = () => {
    if (
      s.width / 2 - 40 < s.mouseX &&
      s.width / 2 - 40 + 109 > s.mouseX &&
      s.height / 2 + 80 < s.mouseY &&
      s.height / 2 + 80 + 52 > s.mouseY
    ) {
      btnColor = btnHover;
    } else {
      btnColor = brandButton;
    }
    drawButton(s);
  };
}