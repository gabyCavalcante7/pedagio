// Constantes
const DISTANCIA = 100; // distância em km
const VALORPED = 20; // valor base do pedágio em reais

// Variáveis de controle
let registros = [];
let caixaFechado = false;
let inicioProcesso = "";
let finalProcesso = "";

// Função para calcular tempo em horas
function calcularTempo(horaEntrada, horaSaida) {
  const [hEntrada, mEntrada] = horaEntrada.split(":").map(Number);
  const [hSaida, mSaida] = horaSaida.split(":").map(Number);

  const entradaMin = hEntrada * 60 + mEntrada;
  const saidaMin = hSaida * 60 + mSaida;

  const diferencaMin = saidaMin - entradaMin;

  if (diferencaMin <= 0) {
    alert("Hora de saída deve ser maior que a de entrada.");
    throw new Error("Horário inválido");
  }

  return diferencaMin / 60; // retorna em horas
}

// Função para calcular desconto baseado na velocidade
function calcularDes(velocidade) {
  if (velocidade >= 80) {
    return 0.1; // 10% de desconto
  } else if (velocidade >= 60) {
    return 0.05; // 5% de desconto
  } else {
    return 0; // sem desconto
  }
}

// Função principal de registro
function controlePe() {
  if (caixaFechado) {
    alert("O caixa está fechado. Não é possível registrar novos veículos.");
    return;
  }

  const placa = document.getElementById("placa").value.trim().toUpperCase();
  const horaEntrada = document.getElementById("horaA").value;
  const horaSaida = document.getElementById("horaB").value;

  if (!placa || !horaEntrada || !horaSaida) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  const tempo = calcularTempo(horaEntrada, horaSaida);
  const velocidade = DISTANCIA / tempo;
  const desconto = calcularDes(velocidade);
  const valorPago = VALORPED * (1 - desconto);

  if (!inicioProcesso) inicioProcesso = horaEntrada;
  finalProcesso = horaSaida;

  const registro = {
    placa,
    horaEntrada,
    horaSaida,
    tempo,
    velocidade,
    valorPago,
  };

  registros.push(registro);

  document.getElementById("registroForm").reset();
  document.getElementById("saida").textContent = 
    `Veículo registrado com sucesso! Total de veículos registrados: ${registros.length}`;
}

// Função de fechamento do caixa
function FecharCaixa() {
  if (caixaFechado) {
    alert("O caixa já está fechado.");
    return;
  }

  if (registros.length === 0) {
    alert("Nenhum registro para mostrar.");
    return;
  }

  caixaFechado = true;

  const saida = document.getElementById("saida");
  let texto = "";

  registros.forEach((r, i) => {
    texto += `🧾 Ticket ${i + 1}\n`;
    texto += `Placa: ${r.placa}\n`;
    texto += `Entrada: ${r.horaEntrada} - Saída: ${r.horaSaida}\n`;
    texto += `Tempo: ${r.tempo.toFixed(2)} h\n`;
    texto += `Velocidade: ${r.velocidade.toFixed(2)} km/h\n`;
    texto += `Valor Pago: R$ ${r.valorPago.toFixed(2)}\n\n`;
  });

  const velocidades = registros.map(r => r.velocidade);
  const menorVelocidade = Math.min(...velocidades);
  const maiorVelocidade = Math.max(...velocidades);
  const mediaVelocidade = velocidades.reduce((a, b) => a + b, 0) / velocidades.length;
  const totalValores = registros.reduce((a, b) => a + b.valorPago, 0);

  texto += `📊 RELATÓRIO FINAL\n`;
  texto += `Menor Velocidade: ${menorVelocidade.toFixed(2)} km/h\n`;
  texto += `Maior Velocidade: ${maiorVelocidade.toFixed(2)} km/h\n`;
  texto += `Velocidade Média: ${mediaVelocidade.toFixed(2)} km/h\n`;
  texto += `Total Arrecadado: R$ ${totalValores.toFixed(2)}\n`;
  texto += `Início do Turno: ${inicioProcesso}\n`;
  texto += `Fim do Turno: ${finalProcesso}\n`;

  saida.textContent = texto;

  alert("Caixa fechado com sucesso! 💰");

  document.getElementById("placa").disabled = true;
  document.getElementById("horaA").disabled = true;
  document.getElementById("horaB").disabled = true;
  document.querySelector("#registroForm button[type='submit']").disabled = true;
  document.getElementById("fecharBtn").disabled = true;
}

// Eventos
document.getElementById("registroForm").addEventListener("submit", function(e) {
  e.preventDefault();
  controlePe();
});

document.getElementById("fecharBtn").addEventListener("click", FecharCaixa);

