// --- Navegação entre páginas ---
function direcionaPreferencias(dietaEscolhida) {
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

function voltarDadosPessoais() {
  window.location.href = "dados-pessoais.html";
}

function limparSessionStorage() {
  sessionStorage.clear();
  window.location.href = "index.html";
}

// --- Salvamento de dados ---
function save_dieta(tipo) {
  sessionStorage.setItem("dietaEscolhida", tipo);
}

function save_dados_pessoais() {
  const peso = document.getElementById("peso").value;
  const altura = document.getElementById("altura").value;
  const idade = document.getElementById("idade").value;
  const sexo = document.getElementById("sexo").value;
  const objetivo = document.getElementById("objetivo").value;

  const erro = validaDadosPessoais(peso, altura, idade, sexo, objetivo);
  if (erro) {
    alert(erro);
    return;
  }

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
  direcionaPreferencias(dietaEscolhida);
}

function validaDadosPessoais(peso, altura, idade, sexo, objetivo) {
  if (peso === '' || peso <= 0) {
    return 'O campo "peso" deve ser preenchido com um número válido.';
  }

  if (altura === '' || altura <= 0) {
    return 'O campo "altura" deve ser preenchido com um número válido.';
  }

  if (idade === '' || idade <= 0) {
    return 'O campo "idade" deve ser preenchido com uma idade válida.';
  }

  if (sexo === '' || (sexo !== 'masculino' && sexo !== 'feminino')) {
    return 'O campo "sexo" deve ser selecionado corretamente.';
  }

  if (objetivo === '' || (objetivo !== 'perder' && objetivo !== 'ganhar')) {
    return 'O campo "objetivo" deve ser selecionado corretamente.';
  }

  const checkboxes = document.getElementsByName("restricao");
  const selecionadas = Array.from(checkboxes).filter(cb => cb.checked);

  if (selecionadas.length === 0) {
    return 'Você deve selecionar pelo menos uma restrição alimentar.';
  }

  const marcouNenhuma = selecionadas.some(cb => cb.value === "Nenhuma");

  if (marcouNenhuma && selecionadas.length > 1) {
    return 'Se você selecionar "Nenhuma", não pode marcar outras restrições.';
  }

  return null; 
}
module.exports = {validaDadosPessoais};

function salvarPreferencias() {
  if (!validarRestricoesComAlimentos()) {
    return;
  }

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

function validarRestricoesComAlimentos() {
  const normalizar = str => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const restricoes = Array.from(document.querySelectorAll('input[name="restricao"]:checked'))
    .map(el => normalizar(el.value));

  if (restricoes.includes("nenhuma") && restricoes.length > 1) {
    alert('Você não pode selecionar "Nenhuma" junto com outras restrições.');
    return false;
  }

  const alimentosSelecionados = [
    ...document.querySelectorAll('input[name="proteina"]:checked'),
    ...document.querySelectorAll('input[name="legumes"]:checked'),
    ...document.querySelectorAll('input[name="verduras"]:checked'),
    ...document.querySelectorAll('input[name="carboidratos"]:checked')
  ].map(el => normalizar(el.value));

  const mapaRestricoes = {
    "lactose": ["iogurte", "iogurte grego", "queijos", "leite", "manteiga", "whey protein"],
    "gluten": ["pao", "pao integral", "massas", "aveia", "trigo", "cevada", "centeio"],
    "proteina do leite": ["queijos", "leite", "iogurte", "whey protein"],
    "ovo": ["ovo", "ovos"],
    "frutos do mar": ["frutos do mar", "peixes", "camarao", "lagosta"]
  };

  for (const restricao of restricoes) {
    const proibidos = mapaRestricoes[restricao] || [];
    const conflito = proibidos.find(proibido =>
      alimentosSelecionados.some(alimento => alimento.includes(proibido))
    );

    if (conflito) {
      alert(`Você selecionou um alimento que contém a restrição: "${restricao.toUpperCase()}". Alimento conflitante: "${conflito}".`);
      return false;
    }
  }

  return true;
}


function calculaTMB(peso, altura, idade, sexo) {
  let TBM;

  if (sexo === 'masculino') {
    TBM = (10 * peso) + (6.25 * altura) - (5 * idade) + 5;
  } else if (sexo === 'feminino') {
    TBM = (10 * peso) + (6.25 * altura) - (5 * idade) - 161;
  } else {
    return false;
  }

  document.getElementById('tmb').value = Math.floor(TBM);
}

function calculaIMC(peso, altura) {
  const imc = peso / ((altura / 100) ** 2);
  let classificacao;

  if (imc < 18.5) {
    classificacao = "Abaixo do peso";
  } else if (imc <= 24.9) {
    classificacao = "Peso normal";
  } else if (imc <= 29.9) {
    classificacao = "Sobrepeso";
  } else if (imc >= 30) {
    classificacao = "Obesidade";
  } else {
    classificacao = "Valor inválido";
  }

  document.getElementById('imc').value = Math.floor(imc);
  document.getElementById("categoria").textContent = classificacao;
  console.log("calculaIMC:", imc);
}

function calculaAGUA(peso) {
  const agua = 35 * peso;
  document.getElementById('agua').value = agua;
  console.log("calculaAGUA:", agua);
}

function meta(objetivo) {
  if (objetivo === 'perder') {
    document.getElementById("meta").value = 'Emagrecer';
  } else {
    document.getElementById("meta").value = 'Hipertrofia';
  }
}

function dieta(dietaEscolhida) {
  let descDieta;

  switch (dietaEscolhida) {
    case 'M':
      dietaEscolhida = "Mediterrânea";
      descDieta = 'Saúde cardiovascular e manutenção de peso';
      break;
    case 'L':
      dietaEscolhida = "Low Carb";
      descDieta = 'Emagrecimento e controle glicêmico';
      break;
    case 'C':
      dietaEscolhida = "Cetogênica";
      descDieta = 'Perda de gordura rápida e aumento de foco';
      break;
    case 'V':
      dietaEscolhida = "Vegetariana";
      descDieta = 'Alimentação plant-based com proteínas completas';
      break;
    default:
      dietaEscolhida = "Valor inválido";
      descDieta = '';
  }

  document.getElementById("dieta").textContent = dietaEscolhida;
  document.getElementById("descricao").textContent = descDieta;
}

function preencherAlimentos(proteinas, legumes, verduras, carboidratos) {
  function preencherLista(classe, itens) {
    const ul = document.querySelector(`.categoria.${classe} ul`);
    ul.innerHTML = "";

    itens.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      ul.appendChild(li);
    });
  }

  preencherLista("proteina", proteinas);
  preencherLista("legumes", legumes);
  preencherLista("verduras", verduras);
  preencherLista("carboidrato", carboidratos);
}

function preencherRestricoes(restricoes) {
  const box = document.getElementById("alergia-box");
  const texto = document.getElementById("alergia-texto");

  if (!restricoes || restricoes.length === 0) {
    box.style.display = "none";
    return;
  }

  const formatadas = restricoes.map(r => `<strong>${r}</strong>`);
  const lista = formatadas.length > 1
    ? formatadas.slice(0, -1).join(", ") + " e " + formatadas.slice(-1)
    : formatadas[0];

  texto.innerHTML = `Alimentos foram filtrados considerando suas alergias: ${lista}`;
  box.style.display = "block";
}


function onload() {
  const dietaEscolhida = sessionStorage.getItem("dietaEscolhida");
  const peso = sessionStorage.getItem("peso");
  const altura = sessionStorage.getItem("altura");
  const idade = sessionStorage.getItem("idade");
  const sexo = sessionStorage.getItem("sexo");
  const objetivo = sessionStorage.getItem("objetivo");

  const restricoes = JSON.parse(sessionStorage.getItem("restricoes") || "[]");
  const proteinas = JSON.parse(sessionStorage.getItem("proteinas") || "[]");
  const legumes = JSON.parse(sessionStorage.getItem("legumes") || "[]");
  const verduras = JSON.parse(sessionStorage.getItem("verduras") || "[]");
  const carboidratos = JSON.parse(sessionStorage.getItem("carboidratos") || "[]");

  calculaTMB(peso, altura, idade, sexo);
  calculaIMC(peso, altura);
  calculaAGUA(peso);
  meta(objetivo);
  dieta(dietaEscolhida);
  preencherAlimentos(proteinas, legumes, verduras, carboidratos);
  preencherRestricoes(restricoes);
}
