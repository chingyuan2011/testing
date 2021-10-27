//p5.js shader basic structure ref from https://www.openprocessing.org/sketch/920144

let theShader;
let imageTitle;
let webGLCanvas;
let images = [];

//根據第幾張的index取得預設的物件大小
let imageSizes = [0.8, 0.7, 1, 1.6, 1, 1, 1, 1];

function preload() {
  theShader = new p5.Shader(this.renderer, vert, frag);
  console.log('theShader', theShader)
  imageTitle = loadImage("標準字.png");
  noiseSeed(random(50000));

  //載入並指定影像大小
  for (var i = 1; i <= 8; i++) {
    let img = loadImage(`items/素材0${i}.png`);
    img.defaultScale = imageSizes[i-1];
    images.push(img);
  }
  for (var i = 3; i <= 8; i++) {
    if (random() < 0.8) {
      let img = loadImage(`items/素材0${i}.png`);
      img.defaultScale = imageSizes[i-1];
      images.push(img);
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  webGLCanvas = createGraphics(width, height, WEBGL);
  webGLCanvas.shader(theShader);
  noStroke();

  pixelDensity(1);
}

function draw() {
  webGLCanvas.clear(0, 0, width, height);

  //設定shader用的參數
  theShader.setUniform("u_resolution", [
    windowWidth / 1000,
    windowHeight / 1000,
  ]);
  theShader.setUniform("u_time", millis() / 1000);
  theShader.setUniform("u_mouse", [mouseX / width, mouseY / height]);
  theShader.setUniform("u_tex_title", imageTitle);
  theShader.setUniform("tex_size", [imageTitle.width, imageTitle.height]);
  theShader.setUniform("mouseIsPressed", mouseIsPressed);

  clear(0, 0, width, height);

  //繪製漂浮的物件
  // rotateY(frameCount/100)

  let timeFactor = 1000;
  for (let i = 0; i < images.length; i++) {
    let defaultImageScale = images[i].defaultScale;
    let scaleRatio = 1
    if (width < 800) {
      scaleRatio = 0.3 * defaultImageScale;
    } else {
      scaleRatio = 0.5 * defaultImageScale;
    }
    const spacing = {
      x: images[i].width/6 *  scaleRatio, 
      y: images[i].height *  scaleRatio, 
    }

    let x =
        noise((i+3)*700, frameCount / timeFactor) * ( width + spacing.x ) - spacing.x,
      y =
        noise((i+1)*400, frameCount / timeFactor, (i+7) * 5000 + frameCount / timeFactor / 100) * ( height + spacing.y ) - spacing.y,
      ang = noise(i, frameCount / timeFactor, 10);

    if (dist(x, y, mouseX, mouseY) < 100) {
      x += noise(frameCount / 5, 5000) * 20;
      y += noise(frameCount / 5) * 20;
    }
    
    push();
      translate(x, y);
      scale(scaleRatio);
      // push();
        // translate(images[i].width/2, images[i].height/2)
        rotate(ang);
      // pop();
      image(images[i], 0,  0);
    pop();
  }

  //繪製shader的大小（標題層）
  webGLCanvas.rect(-width / 2, -height / 2, width, height);
  webGLCanvas.noStroke();
  image(webGLCanvas, 0, 0);

  //外層的白框
  // stroke(255);
  // noFill(0);
  // strokeWeight(50);

  // rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  webGLCanvas.resizeCanvas(windowWidth, windowHeight);
  // webGLCanvas = createGraphics(windowWidth, windowHeight, WEBGL);
  // webGLCanvas.shader(theShader);
}
