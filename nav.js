function iniciar() {
  const botaoPlay = document.querySelector("#play-inicial");
  const botaoSair = document.querySelector("#sair-menu");
  const playPause = document.querySelector("#play-pause");
  const botaoComecar = document.querySelector("#comecar-inicial");
  const botaoCreditos = Array.from(
    document.querySelectorAll(".botao-creditos")
  );
  const botaoYoutube = document.querySelector("#youtube-inicial");
  const botaoInsta = document.querySelector("#instagram-inicial");
  const botaoSpotify = document.querySelector("#spotify-inicial");
  const simbolosInicial = Array.from(
    document.querySelectorAll(".simbolo-inicial")
  );
  const simbolosMenu = Array.from(document.querySelectorAll(".simbolo-menu"));

  const tempoSimbolos = {
    delay1: 0,
    onda: 37,
    lama: 60,
    feedback: 87,
    preto: 121,
    lotus: 137,
    simetria: 162,
    delay2: 205,
  };

  for (let simbolo of simbolosInicial) {
    const tempo = tempoSimbolos[simbolo.id.split("-")[0]];
    simbolo.addEventListener("click", () => {
      musica.currentTime = tempo;
      clipeTodo = false;
      mostrarPopup();
    });
  }

  for (let simbolo of simbolosMenu) {
    const tempo = tempoSimbolos[simbolo.id.split("-")[0]];
    simbolo.addEventListener("click", () => {
      musica.currentTime = tempo;
      ampSine = 0.01;
      musica.pause();
      document.querySelector("#play-menu").classList.remove("escondida");
      document.querySelector("#pause-menu").classList.add("escondida");
    });
  }

  botaoPlay.addEventListener("click", () => {
    musica.currentTime = 0;
    clipeTodo = true;
    mostrarPopup();
  });

  botaoSair.addEventListener("click", fecharClipe);

  botaoComecar.addEventListener("click", () => {
    pedirCamera();
    checarCamera();
    document.querySelector("#popup").classList.add("escondida");
    document.querySelector("#creditos").classList.add("escondida");
  });

  const creditos = document.querySelector("#creditos");
  for (let botao of botaoCreditos) {
    botao.addEventListener("mouseover", () => {
      creditos.classList.remove("escondida");
    });
    botao.addEventListener("mouseout", () => {
      if (!creditoVisivel) {
        creditos.classList.add("escondida");
      }
    });
    botao.addEventListener("click", () => {
      creditoVisivel
        ? creditos.classList.add("escondida")
        : creditos.classList.remove("escondida");
      creditoVisivel = !creditoVisivel;
    });
  }

  playPause.addEventListener("click", () => {
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
  });
}

let creditoVisivel = false;
let clipeTodo = true;

function mostrarPopup() {
  const popup = document.querySelector("#popup");
  popup.classList.remove("escondida");
}

function checarCamera() {
  navigator.getMedia =
    navigator.getUserMedia || // use the proper vendor prefix
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  navigator.getMedia(
    { video: true },
    () => {
      document.querySelector("#inicial").classList.add("escondida");

      if (clipeTodo) {
        musica.play();
        document.querySelector("#play-menu").classList.add("escondida");
        document.querySelector("#pause-menu").classList.remove("escondida");
        clipeTodo = false;
      }

      deuPlay = true;
      telaClipe.show();
      document.querySelector("#menu").classList.remove("escondida");
    },
    () => {
      window.setTimeOut(checarCamera, 1000);
    }
  );
}
