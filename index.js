// Função para calcular raiz quadrada
function calcularRaizQuadrada(numero) {
  if (numero < 0) {
    throw new Error("Não é possível ccom 0");
  }
  return Math.sqrt(numero);
}

// Usando a função
const valores = [4, 9, 16, 25, 144];

console.log("Calculando raízes quadradas abaixo:");
valores.forEach((valor) => {
  const raiz = calcularRaizQuadrada(valor);
  console.log(`valor: √${valor} = ${raiz}`);
});

// Exemplos adicionais
console.log("\nExemplos individuais:");
console.log(`√100 = ${calcularRaizQuadrada(100)}`);
console.log(`√2 = ${calcularRaizQuadrada(2)}`);
console.log(`√0.25 = ${calcularRaizQuadrada(0.25)}`);
