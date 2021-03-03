// the shader variable
let videoFeedback, frameDiff, mosaic;
let displacement, delay;
let shaders;

// the camera variable
let cam;

// we will need at least two layers for this effect
let camadaShader;
let camadaCopia;

// we need one extra createGraphics layer for the previous video frame
let pastFrame;

function preload() {
  // load the shader
  videoFeedback = loadShader("shaders/feedback.vert", "shaders/feedback.frag");
  frameDiff = loadShader("shaders/frameDiff.vert", "shaders/frameDiff.frag");
  mosaic = loadShader("shaders/mosaic.vert", "shaders/mosaic.frag");
  displacement = loadShader(
    "shaders/displacement.vert",
    "shaders/displacement.frag"
  );
  delay = loadShader("shaders/delay.vert", "shaders/delay.frag");
  shaders = [videoFeedback, frameDiff, mosaic, displacement, delay];
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // initialize the webcam at the window size
  cam = createCapture(VIDEO);
  cam.size(windowWidth, windowHeight);

  // hide the html element that createCapture adds to the screen
  cam.hide();

  // this layer will use webgl with our shader
  camadaShader = createGraphics(windowWidth, windowHeight, WEBGL);

  // this layer will just be a copy of what we just did with the shader
  camadaCopia = createGraphics(windowWidth, windowHeight);

  // the pastFrame layer doesn't need to be WEBGL
  pastFrame = createGraphics(windowWidth, windowHeight);

  let anterior = createButton("<<");
  anterior.position(20, 20);
  anterior.mousePressed(() => {
    shaderAtiva === 0 ? "" : shaderAtiva--;
  });

  let proxima = createButton(">>");
  proxima.position(60, 20);
  proxima.mousePressed(() => {
    shaderAtiva === shaders.length - 1 ? "" : shaderAtiva++;
  });
}

let shaderAtiva = 0;

function draw() {
  switch (shaderAtiva) {
    case 0:
      // shader() sets the active shader with our shader
      camadaShader.shader(shaders[shaderAtiva]);

      // lets just send the cam to our shader as a uniform
      shaders[shaderAtiva].setUniform("tex0", cam);

      // also send the copy layer to the shader as a uniform
      shaders[shaderAtiva].setUniform("tex1", camadaCopia);

      // send mouseIsPressed to the shader as a int (either 0 or 1)
      shaders[shaderAtiva].setUniform("mouseDown", int(mouseIsPressed));

      shaders[shaderAtiva].setUniform("time", frameCount * 0.01);

      // rect gives us some geometry on the screen
      camadaShader.rect(0, 0, width, height);

      // draw the camadaShader into the copy layer
      camadaCopia.image(camadaShader, 0, 0, width, height);

      break;
    case 1:
      // shader() sets the active shader with our shader
      camadaShader.shader(shaders[shaderAtiva]);

      // lets just send the cam to our shader as a uniform
      shaders[shaderAtiva].setUniform("tex0", cam);

      // send the pastframe layer to the shader
      shaders[shaderAtiva].setUniform("tex1", pastFrame);

      // also send the mouseX value but convert it to a number between 0 and 1
      shaders[shaderAtiva].setUniform("mouseX", mouseX / width);

      // rect gives us some geometry on the screen
      camadaShader.rect(0, 0, width, height);

      // draw the cam into the createGraphics layer at the very end of the draw loop
      // because this happens at the end, if we use it earlier in the loop it will still be referencing an older frame
      pastFrame.image(cam, 0, 0, windowWidth, windowHeight);
      break;

    case 2:
      // shader() sets the active shader with our shader
      camadaShader.shader(shaders[shaderAtiva]);

      // send the camera and the resolution to the shader
      shaders[shaderAtiva].setUniform("tex0", cam);
      shaders[shaderAtiva].setUniform("resolution", [width, height]);

      // rect gives us some geometry on the screen
      camadaShader.rect(0, 0, width, height);
      break;

    default:
  }

  // render the camadaShader to the screen
  image(camadaShader, 0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
