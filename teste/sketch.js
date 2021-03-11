// this sketch creates a "multix" or texture delay effect.

// the shader variable
let camShader;

function preload() {
  // load the shader
  camShader = loadShader("effect.vert", "effect.frag");
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // this layer will use webgl with our shader
  shaderLayer = createGraphics(windowWidth, windowHeight, WEBGL);
}

function draw() {
  // shader() sets the active shader with our shader
  shaderLayer.shader(camShader);

  // send the camera and the two other past frames into the camera feed
  camShader.setUniform("iResolution", [width, height]);
  camShader.setUniform("iTime", frameCount * 0.01);

  // rect gives us some geometry on the screen
  shaderLayer.rect(0, 0, width, height);

  // render the shaderlayer to the screen
  image(shaderLayer, 0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
