// the shader variable
let videoFeedback, frameDiff, mosaic;
let displacement, delay, sine;
let simetria, delayFinal;
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
let numLayers = 39;

// an array where we will store the past camera frames
let layers = [];
let index1 = 0;
let index2 = numLayers / 3; // 13
let index3 = (numLayers / 3) * 2; // 26

// Variáveis de carregamento das shaders
let contadorShaders = 0;
let shadersCarregadas = false;
let shaderAtiva = 0;

let medulaOne;

let musica;
let tempoMusica = 0;
let deuPlay = false;

let ampSine = 0.01;

function preload() {
  // load the shader
  videoFeedback = loadShader(
    "shaders/shaders.vert",
    "shaders/feedback.frag",
    carregando
  );
  frameDiff = loadShader(
    "shaders/shaders.vert",
    "shaders/frameDiff.frag",
    carregando
  );
  mosaic = loadShader(
    "shaders/shaders.vert",
    "shaders/mosaic.frag",
    carregando
  );
  displacement = loadShader(
    "shaders/shaders.vert",
    "shaders/displacement.frag",
    carregando
  );
  delay = loadShader("shaders/shaders.vert", "shaders/delay.frag", carregando);
  sine = loadShader("shaders/shaders.vert", "shaders/sine.frag", carregando);
  simetria = loadShader(
    "shaders/shaders.vert",
    "shaders/simetria.frag",
    carregando
  );
  delayFinal = loadShader(
    "shaders/shaders.vert",
    "shaders/delayFinal.frag",
    carregando
  );

  shaders = [
    delay,
    displacement,
    videoFeedback,
    mosaic,
    frameDiff,
    sine,
    simetria,
    delayFinal,
  ];
  medulaOne = loadFont("fontes/MedulaOne-Regular.ttf");
}

function carregando() {
  contadorShaders++;
  if (contadorShaders === shaders.length) {
    shadersCarregadas = true;
  }
}
let telaClipe;
function setup() {
  const canvasSize = {
    w: windowWidth / 2,
  };

  telaClipe = createCanvas(windowWidth, windowHeight);
  telaClipe.hide();
  noStroke();

  musica = document.createElement("AUDIO");
  musica.src = "midia/musica.wav";
  musica.id = "musica";
  musica.addEventListener("timeupdate", (e) => {
    tempoMusica = musica.currentTime;
  });
  musica.addEventListener("ended", () => {
    fecharClipe();
    document.querySelector("#creditos").classList.remove("escondida");
    // creditoVisivel =
  });

  document.body.appendChild(musica);
  musica.load();

  videoFundo = createVideo("midia/fundo.mp4");
  videoFundo.size(width, height);
  videoFundo.hide();

  camadaShader = createGraphics(windowWidth / 2, windowHeight / 2, WEBGL);
  camadaCopia = createGraphics(windowWidth, windowHeight);

  // let proxima = createButton("⠀");
  // proxima.position(20, 20);
  // proxima.mousePressed(iniciar);

  // graphics para o efeito de delay
  for (let i = 0; i < numLayers; i++) {
    let l = createGraphics(windowWidth, windowHeight);
    layers.push(l);
  }

  angleMode(DEGREES);
}

function pedirCamera() {
  cam = createCapture(VIDEO);
  cam.size(windowWidth / 2, windowHeight / 2);
  cam.hide();
  telaClipe.show();
  // deuPlay = true;
}

function playPause() {
  if (musica.paused) {
    musica.play();
    document.querySelector("#play-menu").classList.add("escondida");
    document.querySelector("#pause-menu").classList.remove("escondida");
  } else {
    musica.pause();
    document.querySelector("#play-menu").classList.remove("escondida");
    document.querySelector("#pause-menu").classList.add("escondida");
    // deuPlay = false;
  }
}

function reiniciar() {
  deuPlay = false;
  ampSine = 0.01;
}

function fecharClipe() {
  document.querySelector("#inicial").classList.remove("escondida");
  document.querySelector("#menu").classList.add("escondida");
  musica.paused ? "" : musica.pause();
  reiniciar();
  telaClipe.hide();
}

function escolherShader() {
  // if (!musica.paused) {
  if (tempoMusica < 35) {
    // Delay áudio
    shaderAtiva = 0;
  } else if (tempoMusica < 58) {
    // Onda
    shaderAtiva = 5;
  } else if (tempoMusica < 85.5) {
    // Lama
    shaderAtiva = 1;
  } else if (tempoMusica < 119) {
    // Refrão
    shaderAtiva = 2;
  } else if (tempoMusica < 135) {
    // frameDiff
    shaderAtiva = 4;
  } else if (tempoMusica < 160) {
    // lótus
    iniciarLotus();
    shaderAtiva = 3;
  } else if (tempoMusica < 202.5) {
    // simetria
    shaderAtiva = 6;
  } else {
    //--------------------- delay 2
    shaderAtiva = 7;
  }
  // }
}

function draw() {
  if (shadersCarregadas) {
    if (!deuPlay) {
      background(0);
      noFill();
      stroke(255);
      ellipse(width / 2, height / 2, mouseX, mouseY);
    } else {
      escolherShader();

      // shader() sets the active shader with our shader
      camadaShader.shader(shaders[shaderAtiva]);

      if (shaders[shaderAtiva] === mosaic) {
        shaders[shaderAtiva].setUniform("tex0", camadaCopia);
      } else if (![delay, delayFinal].includes(shaders[shaderAtiva])) {
        shaders[shaderAtiva].setUniform("tex0", cam);
      }

      shaders[shaderAtiva] === displacement
        ? videoFundo.loop()
        : videoFundo.pause();

      switch (shaders[shaderAtiva]) {
        case videoFeedback:
          // send the copy layer to the shader as a uniform
          shaders[shaderAtiva].setUniform("tex1", camadaCopia);

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
          camadaCopia.image(cam, 0, 0, width, height);
          break;

        case simetria:
          // enviar frame anterior à camada de cópia
          shaders[shaderAtiva].setUniform("tex1", camadaCopia);

          // also send the mouseX value but convert it to a number between 0 and 1
          shaders[shaderAtiva].setUniform("mouseX", mouseX / width);

          // rect gives us some geometry on the screen
          camadaShader.rect(0, 0, width, height);

          // draw the cam into the createGraphics layer at the very end of the draw loop
          // because this happens at the end, if we use it earlier in the loop it will still be referencing an older frame
          camadaCopia.image(cam, 0, 0, width, height);
          break;

        case mosaic:
          shaders[shaderAtiva].setUniform("tex0", camadaCopia);

          // send the resolution to the shader
          shaders[shaderAtiva].setUniform("resolution", [width, height]);

          lotus();

          // mandar tempo da música para shader
          // shaders[shaderAtiva].setUniform("time", 20.0);
          break;

        case displacement:
          // lets just send the cam to our shader as a uniform
          shaders[shaderAtiva].setUniform("tex1", videoFundo);

          shaders[shaderAtiva].setUniform(
            "amt",
            map(tempoMusica, 60, 85.5, -1.0, 1.0)
          );
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

        case delayFinal:
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

        case sine:
          shaders[shaderAtiva].setUniform("time", frameCount * 0.01);

          if (tempoMusica < 56) {
            ampSine += 0.0001;
          } else {
            ampSine -= 0.017;
          }

          let amp = map(mouseY, height, 0, 0, 0.1) + ampSine;

          shaders[shaderAtiva].setUniform("amplitude", amp);
          break;

        default:
      }

      // criar geometria ao fim, exceto para frameDiff, que precisa que seja antes
      [frameDiff, simetria].includes(shaders[shaderAtiva])
        ? ""
        : camadaShader.rect(0, 0, width, height);

      // draw the cam into the copy layer
      if (shaders[shaderAtiva] === simetria) {
        camadaCopia.image(camadaShader, 0, 0, width, height);
      } else if (shaders[shaderAtiva] !== mosaic) {
        camadaCopia.image(cam, 0, 0, width, height);
      }

      // render the camadaShader to the screen
      image(camadaShader, 0, 0, width, height);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
