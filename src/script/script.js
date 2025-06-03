

function save_dieta(tipo) {
  sessionStorage.setItem("dietaEscolhida", tipo);
}


function save_dados_pessoais() {

  
const peso = document.getElementById("peso").value;
const altura = document.getElementById("altura").value;
const idade = document.getElementById("idade").value;
const sexo = document.getElementById("sexo").value;
const objetivo = document.getElementById("objetivo").value;

const restricoes = document.getElementsByName("restricao");
  let restricoesSelecionadas = [];
  for (let i = 0; i < restricoes.length; i++) {
    if (restricoes[i].checked) {
      restricoesSelecionadas.push(restricoes[i].value);
    }
}

sessionStorage.setItem("peso", peso);
sessionStorage.setItem("altura", altura);
sessionStorage.setItem("idade", idade);
sessionStorage.setItem("sexo", sexo);
sessionStorage.setItem("objetivo", objetivo);
sessionStorage.setItem("restricoes", JSON.stringify(restricoesSelecionadas));

}

function salvarPreferencias() {

  function getValoresSelecionados(nome) {
    const checkboxes = document.getElementsByName(nome);
    const selecionados = [];
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        selecionados.push(checkboxes[i].value);
      }
    }
    return selecionados;
  }

  const proteinas = getValoresSelecionados("proteina");
  const legumes = getValoresSelecionados("legumes");
  const verduras = getValoresSelecionados("verduras");
  const carboidratos = getValoresSelecionados("carboidratos");

  sessionStorage.setItem("proteinas", JSON.stringify(proteinas));
  sessionStorage.setItem("legumes", JSON.stringify(legumes));
  sessionStorage.setItem("verduras", JSON.stringify(verduras));
  sessionStorage.setItem("carboidratos", JSON.stringify(carboidratos));

}


function onload(){
const dietaEscolhida = sessionStorage.getItem("dietaEscolhida");
const peso = sessionStorage.getItem("peso");
const altura = sessionStorage.getItem("altura");
const idade = sessionStorage.getItem("idade");
const sexo = sessionStorage.getItem("sexo");
const objetivo = sessionStorage.getItem("objetivo");
const restricoes = JSON.parse(sessionStorage.getItem("restricoes"));
const proteinas = JSON.parse(sessionStorage.getItem("proteinas") || "[]");
const legumes = JSON.parse(sessionStorage.getItem("legumes") || "[]");
const verduras = JSON.parse(sessionStorage.getItem("verduras") || "[]");
const carboidratos = JSON.parse(sessionStorage.getItem("carboidratos") || "[]");


console.log("Dieta escolhida foi:", dietaEscolhida);
console.log("Peso:", peso);
console.log("Altura:", altura);
console.log("Idade:", idade);
console.log("Sexo:", sexo);
console.log("Objetivo:", objetivo);
console.log("Restrições:", restricoes);
console.log("Proteínas:", proteinas);
console.log("Legumes:", legumes);
console.log("Verduras:", verduras);
console.log("Carboidratos:", carboidratos);
 
}


    
