function iniciar() {
  const botaoPlay = document.querySelector("#play-inicial");
  const botaoComecar = document.querySelector("#comecar-inicial");
  const botaoCreditos = Array.from(
    document.querySelectorAll(".botao-creditos")
  );
  const botaoYoutube = document.querySelector("#youtube-inicial");
  const botaoInsta = document.querySelector("#instagram-inicial");
  const botaoSpotify = document.querySelector("#spotify-inicial");
  const simbolos = Array.from(document.querySelectorAll(".simbolo-inicial"));

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

  for (let simbolo of simbolos) {
    const tempo = tempoSimbolos[simbolo.id.split("-")[0]];
    simbolo.addEventListener("click", () => {
      musica.currentTime = tempo;
      clipeTodo = false;
      mostrarPopup();
    });
  }

  botaoPlay.addEventListener("click", () => {
    musica.currentTime = 0;
    clipeTodo = true;
    mostrarPopup();
  });

  botaoComecar.addEventListener("click", () => {
    pedirCamera();
    checarCamera();
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
      creditoVisivel = !creditoVisivel;
      creditoVisivel
        ? creditos.classList.remove("escondida")
        : creditos.classList.add("escondida");
    });
  }
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
      document.querySelector("#popup").classList.add("escondida");
      document.querySelector("#creditos").classList.add("escondida");
      document.querySelector("#inicial").classList.add("escondida");
      if (clipeTodo) {
        musica.play();
      }
      deuPlay = true;
      telaClipe.show();
    },
    () => {
      setTimeOut(checarCamera, 1000);
    }
  );
}
