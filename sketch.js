// the shader variable
let videoFeedback, frameDiff, mosaic;
let displacement, delay;
let shaders;

// the camera variable
let cam;

// we will need at least two layers for this effect
let camadaShader;
let camadaCopia;

// fundo pro displacement
let videoFundo;

/* MULTIX */
// how many past frames should we store at once
// the more you store, the further back in time you can go
// however it's pretty memory intensive so don't push it too hard
let numLayers = 60;

// an array where we will store the past camera frames
let layers = [];
let index1 = 0;
let index2 = numLayers / 3; // 20
let index3 = (numLayers / 3) * 2; // 40

// Variáveis de carregamento das shaders
let contadorShaders = 0;
let shadersCarregadas = false;
let shaderAtiva = 0;

let medulaOne, sixCaps, tekoLight, tekoRegular;

let musica;
let tempoMusica = 0;
let deuPlay = false;

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

  shaders = [delay, displacement, videoFeedback, mosaic, frameDiff];

  medulaOne = loadFont("fontes/MedulaOne-Regular.ttf");
}

// function carregando() {
//   console.log("rolou");
//   contadorShaders++;
//   if (contadorShaders === shaders.length) {
//     shadersCarregadas = true;
//   }
// }

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  musica = document.createElement("AUDIO");
  musica.src = "tronoDeLotus.wav";
  musica.addEventListener("timeupdate", (e) => {
    tempoMusica = musica.currentTime;
    // console.log(tempoMusica);
  });
  document.body.appendChild(musica);

  videoFundo = createVideo("fundo.mp4");
  videoFundo.size(width, height);

  cam = createCapture(VIDEO);
  cam.size(windowWidth, windowHeight);
  cam.hide();

  camadaShader = createGraphics(windowWidth, windowHeight, WEBGL);
  camadaCopia = createGraphics(windowWidth, windowHeight);

  // let anterior = createButton("<<");
  // anterior.position(20, 20);
  // anterior.mousePressed(() => {
  //   shaderAtiva === 0 ? "" : shaderAtiva--;
  // });

  // let proxima = createButton(">>");
  // proxima.position(60, 20);
  // proxima.mousePressed(() => {
  //   shaderAtiva === shaders.length - 1 ? "" : shaderAtiva++;
  // });

  let proxima = createButton("play");
  proxima.position(20, 20);
  proxima.mousePressed(iniciar);

  // graphics para o efeito de delay
  for (let i = 0; i < numLayers; i++) {
    let l = createGraphics(windowWidth, windowHeight);
    layers.push(l);
  }

  background(50, 40, 10);
}

function iniciar() {
  musica.play();
  deuPlay = true;
}

function escolherShader() {
  if (tempoMusica < 34) {
    shaderAtiva = 0;
  } else if (tempoMusica < 84) {
    shaderAtiva = 1;
  } else if (tempoMusica < 144) {
    shaderAtiva = 2;
  } else if (tempoMusica < 180) {
    shaderAtiva = 3;
  } else {
    shaderAtiva = 4;
  }
}

function draw() {
  if (deuPlay) {
    escolherShader();

    // shader() sets the active shader with our shader
    camadaShader.shader(shaders[shaderAtiva]);
    shaders[shaderAtiva] !== delay
      ? shaders[shaderAtiva].setUniform("tex0", cam)
      : "";

    shaders[shaderAtiva] === displacement
      ? videoFundo.loop()
      : videoFundo.pause();

    switch (shaders[shaderAtiva]) {
      case videoFeedback:
        // send the copy layer to the shader as a uniform
        shaders[shaderAtiva].setUniform("tex1", camadaCopia);

        // send mouseIsPressed to the shader as a int (either 0 or 1)
        shaders[shaderAtiva].setUniform("mouseDown", int(mouseIsPressed));

        shaders[shaderAtiva].setUniform("time", frameCount * 0.01);

        // draw the camadaShader into the copy layer
        camadaCopia.image(camadaShader, 0, 0, width, height);

        break;

      case frameDiff:
        // enviar frame anterior à camada de cópia
        shaders[shaderAtiva].setUniform("tex1", camadaCopia);

        // also send the mouseX value but convert it to a number between 0 and 1
        shaders[shaderAtiva].setUniform("mouseX", mouseX / width);

        // rect gives us some geometry on the screen
        camadaShader.rect(0, 0, width, height);

        // draw the cam into the createGraphics layer at the very end of the draw loop
        // because this happens at the end, if we use it earlier in the loop it will still be referencing an older frame
        camadaCopia.image(cam, 0, 0, windowWidth, windowHeight);
        break;

      case mosaic:
        // send the resolution to the shader
        shaders[shaderAtiva].setUniform("resolution", [width, height]);
        break;

      case displacement:
        // lets just send the cam to our shader as a uniform
        shaders[shaderAtiva].setUniform("tex1", videoFundo);

        shaders[shaderAtiva].setUniform("amt", map(mouseX, 0, width, 0, 0.2));
        break;

      case delay:
        // draw the camera on the current layer
        layers[index1].image(cam, 0, 0, width, height);

        // send the camera and the two other past frames into the camera feed
        shaders[shaderAtiva].setUniform("tex0", layers[index1]);
        shaders[shaderAtiva].setUniform("tex1", layers[index2]);
        shaders[shaderAtiva].setUniform("tex2", layers[index3]);

        // increase all indices by 1, resetting if it goes over layers.length
        // the index runs in a circle 0, 1, 2, ... 29, 30, 0, 1, 2, etc.
        // index1
        // index2 will be somewhere in the past
        // index3 will be even further into the past
        index1 = (index1 + 1) % layers.length;
        index2 = (index2 + 1) % layers.length;
        index3 = (index3 + 1) % layers.length;
        break;

      default:
    }

    // criar geometria ao fim, exceto para frameDiff, que precisa que seja antes
    shaders[shaderAtiva] === frameDiff
      ? ""
      : camadaShader.rect(0, 0, width, height);
  }
  // render the camadaShader to the screen
  image(camadaShader, 0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
