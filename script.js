/* =====================================================
   SCRIPT.js - Portfólio de Alexandre Santana Farias
   JavaScript puro (Vanilla): manipula o DOM para
   tema, menu, digitação, voltar ao topo e animações.
   ===================================================== */

/* ---------- 1. SELEÇÃO DOS ELEMENTOS ---------- */
const elementoRaiz = document.documentElement;                 // a tag <html>
const botaoTema = document.getElementById("botao-tema");
const iconeTema = document.getElementById("icone-tema");
const botaoMenu = document.getElementById("botao-menu");
const iconeMenu = document.getElementById("icone-menu");
const menu = document.getElementById("menu");
const textoDigitado = document.getElementById("texto-digitado");
const botaoTopo = document.getElementById("botao-topo");
const anoAtual = document.getElementById("ano-atual");

/* ---------- 2. DARK MODE / LIGHT MODE ---------- */
// Aplica o tema na página e ajusta o ícone do botão
function aplicarTema(tema) {
  elementoRaiz.setAttribute("data-tema", tema);
  // No tema escuro mostramos o sol (para voltar ao claro) e vice-versa
  iconeTema.className = tema === "escuro" ? "bi bi-sun-fill" : "bi bi-moon-stars-fill";
  localStorage.setItem("tema-portfolio", tema);                // lembra a escolha
}

// Troca entre claro e escuro a cada clique
function alternarTema() {
  const temaAtual = elementoRaiz.getAttribute("data-tema");
  aplicarTema(temaAtual === "escuro" ? "claro" : "escuro");
}

// Ao abrir o site: usa o tema salvo; se não houver, usa a preferência do sistema
function iniciarTema() {
  const temaSalvo = localStorage.getItem("tema-portfolio");
  const sistemaPrefereEscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
  aplicarTema(temaSalvo || (sistemaPrefereEscuro ? "escuro" : "claro"));
}

botaoTema.addEventListener("click", alternarTema);
iniciarTema();

/* ---------- 3. MENU HAMBÚRGUER (MOBILE) ---------- */
function abrirFecharMenu(forcarFechar = false) {
  const vaiAbrir = forcarFechar ? false : !menu.classList.contains("aberto");
  menu.classList.toggle("aberto", vaiAbrir);
  botaoMenu.setAttribute("aria-expanded", String(vaiAbrir));
  iconeMenu.className = vaiAbrir ? "bi bi-x-lg" : "bi bi-list";
}

botaoMenu.addEventListener("click", () => abrirFecharMenu());

// Fecha o menu ao clicar em um link
menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => abrirFecharMenu(true));
});

// Fecha o menu com a tecla Esc
document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") abrirFecharMenu(true);
});

/* ---------- 4. EFEITO MÁQUINA DE ESCREVER ---------- */
const frases = [
  "Estudante de Desenvolvimento Full Stack",
  "Apaixonado por Front-end",
  "Criando interfaces interativas",
  "Em busca da primeira oportunidade"
];
let indiceFrase = 0;     // qual frase está sendo escrita
let indiceLetra = 0;     // quantas letras já aparecem
let apagando = false;    // true quando está apagando

function digitar() {
  const fraseAtual = frases[indiceFrase];
  let atraso = apagando ? 40 : 85;

  if (!apagando) {
    indiceLetra++;
    if (indiceLetra === fraseAtual.length) {   // terminou de escrever: espera e começa a apagar
      apagando = true;
      atraso = 1600;
    }
  } else {
    indiceLetra--;
    if (indiceLetra === 0) {                   // terminou de apagar: vai para a próxima frase
      apagando = false;
      indiceFrase = (indiceFrase + 1) % frases.length;
      atraso = 400;
    }
  }

  textoDigitado.textContent = fraseAtual.substring(0, indiceLetra);
  setTimeout(digitar, atraso);
}

// Quem prefere menos movimento vê a primeira frase completa, sem animação
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  textoDigitado.textContent = frases[0];
} else {
  digitar();
}

/* ---------- 5. BOTÃO VOLTAR AO TOPO ---------- */
function controlarBotaoTopo() {
  // Só aparece depois de rolar 400px
  botaoTopo.classList.toggle("visivel", window.scrollY > 400);
}

function voltarAoTopo() {
  window.scrollTo({ top: 0, behavior: "smooth" });   // rolagem suave
}

window.addEventListener("scroll", controlarBotaoTopo, { passive: true });
botaoTopo.addEventListener("click", voltarAoTopo);
controlarBotaoTopo();

/* ---------- 6. ANO DINÂMICO NO RODAPÉ ---------- */
anoAtual.textContent = new Date().getFullYear();

/* ---------- 7. ANIMAÇÃO DE ENTRADA AO ROLAR (fade-in-up) ---------- */
// O IntersectionObserver avisa quando um elemento entra na área visível da tela
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add("visivel");
      observador.unobserve(entrada.target);          // anima só uma vez
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".revelar").forEach((elemento) => observador.observe(elemento));
