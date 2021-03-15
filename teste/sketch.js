// the shader variable
let camShader;

// the camera variable
let cam;

function preload() {
  // load the shader
  camShader = loadShader("effect.vert", "effect.frag");
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  // initialize the webcam at the window size
  cam = createCapture(VIDEO);
  cam.size(windowWidth, windowHeight);

  // hide the html element that createCapture adds to the screen
  cam.hide();
}
let tempoInicial = 10000;
let ampTempo = 0.01;

function draw() {
  // shader() sets the active shader with our shader
  shader(camShader);

  // lets just send the cam to our shader as a uniform
  camShader.setUniform("tex0", cam);

  let tempoMusica = (millis() - tempoInicial) / 1000;
  if (tempoMusica > 10 && tempoMusica < 30) {
    ampTempo += 0.0001;
  } else {
    ampTempo -= 0.0001;
  }

  // send a slow frameCount to the shader as a time variable
  camShader.setUniform("time", frameCount * 0.01);

  let amp = map(mouseY, height, 0, 0, 0.1) + ampTempo;

  camShader.setUniform("amplitude", amp);

  // rect gives us some geometry on the screen
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
