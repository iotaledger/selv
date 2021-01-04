import interReg from "./fonts/Inter-Bold.otf";
import metroExtraBold from "./fonts/Metropolis-ExtraBold.otf";
import openSansSemiBold from "./fonts/OpenSans-SemiBold.ttf";

export default function sketch(s) {
  s.state = {};
  s.dispatch = () => {};

  let size = 0;
  let fade = 0;
  let metro_font, inter_font, open_font;
  let parentsLifeColor,
    yourLifeColor,
    nextGenLifeColor,
    treesLifeColor,
    forestLifeColor;
  let blueGradientColor, greenGradientColor, white, black;
  let brandRectangle, brandButton, btnColor, btnHover, fadeBtnColor;
  const parentsRadius = 50;
  const yourRadius = 100;
  const nextGenRadius = 150;
  const treesRadius = 300;
  const forestRadius = 550;

  function drawTimeline(s) {
    s.stroke(black);
    s.fill(black);
    s.circle(size / 2, s.height / 2, 5);

    s.drawingContext.setLineDash([5, 10]);
    s.line(0, s.height / 2, size / 2, s.height / 2);
    s.drawingContext.setLineDash([]);
  }

  function drawButton(s) {
    try {
      s.noStroke();
      s.fill(btnColor);
      s.rect(s.width / 2 - 40, s.height / 2 + 80, 134, 52, 100);
      s.textFont(inter_font);
      s.textSize(18);
      s.noStroke();
      s.fill(white);
      s.text("Commit", s.width / 2 - 10, s.height / 2 + 113);
    } catch {}
  }

  function drawFinalText(s) {
    try {
      s.fill(brandRectangle);
      s.noStroke();
      s.rect(s.width / 2 + 2, s.height / 2 - 12, 235, 20);
      s.fill(black);
      s.textFont(metro_font);
      s.textSize(30);
      s.text("This is your Persistent Selv", s.width / 2 - 170, s.height / 2);
      s.fill(0, 0, 0, fade);
      s.textFont(open_font);
      s.textSize(20);
      s.text(
        "Your pledges are now taking care of future",
        s.width / 2 - 160,
        s.height / 2 + 40
      );
      s.text(
        "generations by protecting their environment",
        s.width / 2 - 170,
        s.height / 2 + 60
      );

      s.fill(fadeBtnColor);

      s.noStroke();
      s.rect(s.width / 2 - 40, s.height / 2 + 80, 134, 52, 100);
      s.textFont(inter_font);
      s.textSize(18);
      s.noStroke();
      s.fill(255, 255, 255, fade);
      s.text("Finish", s.width / 2, s.height / 2 + 113);
    } catch {}
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
    const radius = s.width + unit * 10;
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
    open_font = s.loadFont(openSansSemiBold);
  };

  s.setup = () => {
    s.disableFriendlyErrors = true;
    s.frameRate(30);
    s.createCanvas(window.innerWidth, window.innerHeight); //👀 edit here to change size of the canvas

    parentsLifeColor = s.color(255, 255, 255, 200);
    yourLifeColor = s.color(255, 255, 255, 150);
    nextGenLifeColor = s.color(255, 255, 255, 100);
    treesLifeColor = s.color(164, 214, 222, 200);
    forestLifeColor = s.color(165, 196, 195, 200);
    blueGradientColor = s.color(92, 158, 255);
    greenGradientColor = s.color(165, 196, 195);
    brandRectangle = s.color(181, 243, 216);
    brandButton = s.color(44, 128, 252);
    white = s.color(255);
    black = s.color(0);
    btnHover = s.color(60, 106, 197);

    btnColor = brandButton;
    s.noLoop();
  };

  s.draw = () => {
    fadeBtnColor = s.color(44, 128, 252, fade);
    if (s.state.endAnimationState === 0) {
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
      s.rect(s.width / 2 - 172, s.height / 2 - 12, 412, 20);
      s.fill(black);
      s.textFont(metro_font);
      s.textSize(30);
      s.text("Your pledges are complete", s.width / 2 - 170, s.height / 2);
      s.fill(white);
      s.textFont(open_font);
      s.textSize(20);
      s.text(
        "You can now commit your pledges",
        s.width / 2 - 140,
        s.height / 2 + 40
      );
      s.text("to generations", s.width / 2 - 42, s.height / 2 + 60);
      drawButton(s);
    } else if (s.state.endAnimationState === 1) {
      if (size === 0) {
        drawRadialGradient(s, white, greenGradientColor, 40);
        size += 5;
      } else if (size < parentsRadius) {
        size += 5;
      } else {
        s.state.endAnimationState++;
      }
      s.noStroke();

      s.fill(parentsLifeColor);
      s.arc(0, s.height / 2, size, size, -s.HALF_PI, s.HALF_PI, s.OPEN);

      drawTimeline(s);
      drawFinalText(s);
    } else if (s.state.endAnimationState === 2) {
      if (size < yourRadius) {
        size += 5;
      } else {
        s.state.endAnimationState++;
      }
      s.noStroke();

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
      drawFinalText(s);
    } else if (s.state.endAnimationState === 3) {
      if (size < nextGenRadius) {
        size += 5;
        fade += 2;
      } else {
        s.state.endAnimationState++;
      }
      s.noStroke();

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
      drawFinalText(s);
    } else if (s.state.endAnimationState === 4) {
      if (size < treesRadius) {
        size += 5;
        fade += 2;
      } else {
        s.state.endAnimationState++;
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
      drawFinalText(s);
    } else if (s.state.endAnimationState === 5) {
      if (size < forestRadius) {
        size += 5;
        fade += 10;
      } else {
        s.state.endAnimationState++;
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
      drawFinalText(s);
    }
  };

  s.mouseClicked = () => {
    s.clear();
    if (s.state.endAnimationState < 2) {
      s.state.endAnimationState++;
      s.dispatch({
        type: "SET_END_ANIMATION_STATE",
        payload: s.state.endAnimationState,
      });
      s.loop();
    } else {
      window.location = '/demo/thankyou';
      s.noLoop();
      s.clear();
    }
  };

  s.mouseMoved = () => {
    try {
      if (
        s.width / 2 - 40 < s.mouseX &&
        s.width / 2 - 40 + 109 > s.mouseX &&
        s.height / 2 + 80 < s.mouseY &&
        s.height / 2 + 80 + 52 > s.mouseY
      ) {
        btnColor = btnHover;
        fadeBtnColor = s.color(60, 106, 197, fade);
      } else {
        btnColor = brandButton;
        fadeBtnColor = s.color(44, 128, 252, fade);
      }

      if (s.state.endAnimationState === 0) {
        drawButton(s);
      } else {
        drawFinalText(s);
      }
    } catch {}
  };
}