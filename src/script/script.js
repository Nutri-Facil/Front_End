
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

const dietaEscolhida = sessionStorage.getItem("dietaEscolhida");

direcionaPreferencias(dietaEscolhida)

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

function calculaTMB(peso,altura,idade,sexo){

  if (sexo == 'masculino' ){

    const TBM = (10 * peso) + (6.25 * altura) - (5 * idade) + 5;
    //return TBM 
    console.log("sexo:", sexo);
    console.log("calculaTMB:", TBM);
    document.getElementById('tmb').value = Math.floor(TBM);

  }
   else if (sexo == 'masculino'){

    const TBM = (10 * peso) + (6.25 * altura) - (5 * idade) - 161
    //return TBM 
    console.log("sexo:", sexo);
    console.log("calculaTMB:", TBM);
    document.getElementById('tmb').value = Math.floor(TBM);

  }
  else{

    return false 

  }

}

function calculaIMC(peso,altura){

const imc =  peso / ((altura / 100) ** 2);

if (imc < 18.5) {
    classificacao = "Abaixo do peso";
  } else if (imc >= 18.5 && imc <= 24.9) {
    classificacao = "Peso normal";
  } else if (imc >= 25 && imc <= 29.9) {
    classificacao = "Sobrepeso";
  } else if (imc >= 30) {
    classificacao = "Obesidade";
  } else {
    classificacao = "Valor inválido";
}

document.getElementById('imc').value = Math.floor(imc)
document.getElementById("categoria").textContent = classificacao;
console.log("calculaIMC:", imc);

}

function calculaAGUA(peso){

  const agua = 35*peso
  console.log("calculaAGUA:", agua);
  document.getElementById('agua').value = agua

}

function meta(objetivo){

if (objetivo == 'perder'){

  document.getElementById("meta").value = 'Emagrecer';

  }
  else {
  document.getElementById("meta").value = 'Hipertrofia';
  }

}

function dieta(dietaEscolhida){

  var descDieta 

  if (dietaEscolhida == 'M') {
    dietaEscolhida = "Mediterrânea";
    descDieta = 'Saúde cardiovascular e manutenção de peso'
  } else if (dietaEscolhida == 'L') {
    dietaEscolhida = "Low Carb";
    descDieta = 'Emagrecimento e controle glicêmico'
  } else if (dietaEscolhida == 'C') {
    dietaEscolhida = "Cetogênica";
    descDieta = 'Perda de gordura rápida e aumento de foco'
  } else if (dietaEscolhida == 'v') {
    dietaEscolhida = "Vegetariana";
    descDieta = 'Alimentação plant-based com proteínas completas'
  } else {
    dietaEscolhida = "Valor inválido";
  }

  document.getElementById("dieta").textContent = dietaEscolhida;
  document.getElementById("descricao").textContent = descDieta;
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

calculaTMB(peso,altura,idade,sexo)
calculaIMC(peso,altura)
calculaAGUA(peso)
meta(objetivo)
dieta(dietaEscolhida)

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

function direcionaPreferencias(dietaEscolhida){


if (dietaEscolhida === 'C') {
    window.location.href = "preferencias-Cetogênica.html";
  } else if (dietaEscolhida === 'M') {
    window.location.href = "preferencias-Mediterrânea.html";
  } else if (dietaEscolhida === 'L') {
    window.location.href = "preferencias-LowCarb.html";
  } else if (dietaEscolhida === 'V') {
    window.location.href = "preferencias-Vegetariana.html";
  } else {
    alert("Dieta inválida. Por favor, selecione uma opção.");
  }
}
    
