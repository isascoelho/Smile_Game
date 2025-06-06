let desempenho = 0;
let tentativas = 0;
let acertos = 0;
let jogar = true;

const btnReiniciar = document.getElementById('reiniciar');
const btnJogarNovamente = document.getElementById('joganovamente');

function reiniciar() {
  desempenho = 0;
  tentativas = 0;
  acertos = 0;
  jogar = true;
  jogarNovamente();
  atualizaPlacar(0, 0);
  btnJogarNovamente.className = 'visivel';
  btnReiniciar.className = 'invisivel';
}

function jogarNovamente() {
  jogar = true;

  // Resetar cartas
  const cartas = document.querySelectorAll("div");
  cartas.forEach(div => {
    if (!isNaN(parseInt(div.id))) div.className = "inicial";
  });

  // Remover elementos visuais extras
  ["imagem", "emojiErro", "resultadoFinal"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
}

function atualizaPlacar(acertos, tentativas) {
  desempenho = (acertos / tentativas) * 100;
  document.getElementById("resposta").innerHTML =
    `Placar - Acertos: ${acertos} Tentativas: ${tentativas} Desempenho: ${Math.round(desempenho)}%`;
}

function acertou(obj) {
  obj.className = "acertou";

  const img = new Image(100);
  img.id = "imagem";
  img.src = "https://upload.wikimedia.org/wikipedia/commons/2/2e/Oxygen480-emotes-face-smile-big.svg";
  obj.appendChild(img);

  const som = document.getElementById("somAcerto");
  if (som) {
    som.currentTime = 0;
    som.play().catch(e => console.warn("Som de acerto bloqueado:", e));
  }

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

function mostrarEmojiErro(obj) {
  obj.className = "errou";
  obj.style.position = "relative";

  const emoji = document.createElement("div");
  emoji.id = "emojiErro";
  emoji.innerText = "😢";
  Object.assign(emoji.style, {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "80px",
    zIndex: "999"
  });

  obj.appendChild(emoji);
}

function verifica(obj) {
  if (!jogar) {
    alert('Clique em "Jogar novamente"');
    return;
  }

  jogar = false;
  tentativas++;

  if (tentativas === 6) {
    btnJogarNovamente.className = 'invisivel';
    btnReiniciar.className = 'visivel';
    mostrarResultadoFinal();
  }

  const sorteado = Math.floor(Math.random() * 6);

  if (obj.id === sorteado.toString()) {
    acertos++;
    acertou(obj);
  } else {
    mostrarEmojiErro(obj);

    // Tremor nas cartas
    const cartas = document.querySelectorAll("div");
    cartas.forEach(div => {
      if (!isNaN(parseInt(div.id))) div.classList.add("tremor");
    });
    setTimeout(() => {
      cartas.forEach(div => div.classList.remove("tremor"));
    }, 500);

    const somErro = document.getElementById("somErro");
    if (somErro) {
      somErro.currentTime = 0;
      somErro.play().catch(e => console.warn("Som de erro bloqueado:", e));
    }

    // Mostra sorriso na carta correta
    const cartaCorreta = document.getElementById(sorteado);
    acertou(cartaCorreta);
  }

  atualizaPlacar(acertos, tentativas);
}

function mostrarResultadoFinal() {
  const container = document.createElement("div");
  container.id = "resultadoFinal";
  Object.assign(container.style, {
    position: "fixed",
    top: "80%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: "10000",
    textAlign: "center"
  });

  const imagem = document.createElement("img");
  imagem.style.width = "150px";
  imagem.style.transition = "transform 1s ease-in-out";

  const texto = document.createElement("div");
  texto.style.cssText = "font-size: 32px; margin-top: 50px; color: #333;";

  if (desempenho === 100) {
    imagem.src = "imagens/trofeu.png";
    texto.innerText = "Você arrasou!";
  } else {
    imagem.src = "trevo1.jpg";
    texto.innerText = "Tente a sorte novamente!";
  }

  container.appendChild(imagem);
  container.appendChild(texto);
  document.body.appendChild(container);

  setTimeout(() => {
    imagem.style.transform = "rotate(20deg)";
  }, 100);
}

btnJogarNovamente.addEventListener('click', jogarNovamente);
btnReiniciar.addEventListener('click', reiniciar);