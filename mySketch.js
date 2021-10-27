//p5.js shader basic structure ref from https://www.openprocessing.org/sketch/920144
let isMobile = null;
let theShader = null;
let imageTitle;
let webGLCanvas = null;
let images = [];
let noiseSeedVal = 50000;
let shaderResolution = [2000, 1000];
let picWidth = [1038, 600, 300];
let mouseDetectVal = [100, 200];

//根據第幾張的index取得預設的物件大小
let imageSizes = [0.8, 0.7, 1, 1.6, 1, 1, 1, 1];

function preload() {
  isMobile = false;

  if (!isMobile) {
    theShader = new p5.Shader(this.renderer, vert, frag);
    imageTitle = loadImage("標準字.png");
  }

  noiseSeed(random(noiseSeedVal));

  //載入並指定影像大小
  for (var i = 1; i <= 8; i++) {
    let img = loadImage(`items/素材0${i}.png`);
    img.defaultScale = imageSizes[i - 1];
    images.push(img);
  }
  // 隨機加入圖片，手機版不執行這段
  if (!isMobile) {
    for (var i = 3; i <= 8; i++) {
      if (random() < 0.8) {
        let img = loadImage(`items/素材0${i}.png`);
        img.defaultScale = imageSizes[i - 1];
        images.push(img);
      }
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  if (!isMobile) {
    webGLCanvas = createGraphics(width, height, WEBGL);
    webGLCanvas.shader(theShader);
  }

  noStroke();
  pixelDensity(1);
}

function draw() {
  clear(0, 0, width, height);

  let scaleRatio = 1
  let mouseDetectDistance = mouseDetectVal[0]
  if (width < 900) {
    mouseDetectDistance = mouseDetectVal[0]
  } else {
    mouseDetectDistance = mouseDetectVal[1]
  }

  //繪製漂浮的物件
  let timeFactor = 1000;
  for (let i = 0; i < images.length; i++) {
    let defaultImageScale = images[i].defaultScale;
    if (width < 900) {
      scaleRatio = 0.3 * defaultImageScale;
    } else {
      scaleRatio = 0.5 * defaultImageScale;
      mouseDetectDistance = mouseDetectVal[1]
    }
    const spacing = {
      x: images[i].width / 6 * scaleRatio,
      y: images[i].height * scaleRatio,
    }

    let x =
      noise((i + 3) * 700, frameCount / timeFactor) * (width + spacing.x) - spacing.x,
      y =
        noise((i + 1) * 400, frameCount / timeFactor, (i + 7) * 5000 + frameCount / timeFactor / 100) * (height + spacing.y) - spacing.y,
      ang = noise(i, frameCount / timeFactor, 10);


    if (dist(x, y, mouseX, mouseY) < mouseDetectDistance) {
      x += noise(frameCount / 5, 5000) * 20;
      y += noise(frameCount / 5) * 20;
    }

    push();
    translate(x, y);
    scale(scaleRatio);
    rotate(ang);
    image(images[i], 0, 0);
    pop();
  }

  if (!isMobile) {
    drawShader();
  }


  //外層的白框
  stroke(255);
  noFill(0);
  strokeWeight(50);
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (!isMobile) {
    webGLCanvas.resizeCanvas(windowWidth, windowHeight);
  }
}

function detectDevice() {
  if (navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)
  ) {
    document.querySelector('body').classList.add('isMobile')
    return true;
  }
  else {
    return false;
  }
}

function drawShader() {
  if (!theShader || !webGLCanvas) { return; }
  webGLCanvas.clear(0, 0, width, height);

  //設定shader用的參數

  theShader.setUniform("u_resolution", [
    windowWidth / 1000,
    windowHeight / 1000
  ]);
  theShader.setUniform("u_time", millis() / 1000);
  theShader.setUniform("u_mouse", [mouseX / width, mouseY / height]);
  theShader.setUniform("u_tex_title", imageTitle);
  // pic size 1038*1880
  theShader.setUniform("tex_size", [imageTitle.width, imageTitle.height]);
  theShader.setUniform("mouseIsPressed", mouseIsPressed);

  //繪製shader的大小（標題層）
  webGLCanvas.rect(-width / 2, -height / 2, width, height);
  webGLCanvas.noStroke();
  image(webGLCanvas, 0, 0);
}

// 補 shader 變版